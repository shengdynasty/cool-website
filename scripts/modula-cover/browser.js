// Runs inside Project Modula's dev server (render.mjs injects it into dev-reel.html, which only hosts Vite's module
// graph here: its own reel never starts). Builds the hand-built V8 on the app's own stage and recolours it for
// sheng-yan.com: every part neutral (white castings, near-black joints and rubber), the accent parts in the site's
// green, neutral lights, a black void with the studio floor and rings hidden. grade.py then locks the palette.
//   window.__loop.init(cfg) → {frames, fps, fixes}
//   window.__loop.frame(i, override?) → PNG data URL of loop frame i (a pure function of i)
//   window.__loop.bounds() → world bounds of the model as last posed (for framing)
/* global window, document, fetch */

const smoother = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (6 * x - 15) + 10));

let frameFn = null;

async function init(cfg) {
  // the very three.js module instance the app's modules use (same URL, same ?v= hash)
  const src = await (await fetch('/src/core/explode.ts')).text();
  const threeUrl = src.match(/from\s*["']([^"']*\/three\.js[^"']*)["']/)?.[1];
  if (!threeUrl) throw new Error('three.js import not found');
  const THREE = await import(threeUrl);
  const {getMachine} = await import('/src/machines/registry.ts');
  const {assemble} = await import('/src/app/assemble.ts');
  const {TIERS} = await import('/src/core/stage.types.ts');
  const {EXPLODE_SPREAD, explodeDolly} = await import('/src/core/explode.ts');
  const {STUDIO} = await import('/src/core/studio/palette.ts');

  // neutral studio: white key, rim and fill, neutral ink, so every non-accent pixel is a grey the grade maps to cream
  Object.assign(STUDIO, {
    exposure: cfg.exposure ?? STUDIO.exposure,
    key: {...STUDIO.key, color: '#ffffff', intensity: cfg.key ?? STUDIO.key.intensity},
    rim: {...STUDIO.rim, color: '#ffffff', intensity: cfg.rim ?? STUDIO.rim.intensity},
    hemi: {sky: '#ffffff', ground: '#1c1c1c', intensity: cfg.hemi ?? STUDIO.hemi.intensity},
    ink: '#0c0c0c',
    ringColor: '#000000',
  });

  const base = getMachine('v8');
  const spread = cfg.spread ?? 1.1;
  // a cover's exploded view travels further than the app's (as in src/dev/reel.ts widen())
  const def = {
    ...base,
    build: async () => {
      const m = await base.build();
      const r = new THREE.Box3().setFromObject(m.root).getSize(new THREE.Vector3()).length() / 2;
      m.root.traverse((o) => {
        if (typeof o.userData.explodeDist === 'number') o.userData.explodeDist *= spread;
      });
      for (const objs of Object.values(m.assemblies))
        for (const o of objs) if (typeof o.userData.explodeDist !== 'number') o.userData.explodeDist = 0.35 * r * spread;
      return m;
    },
  };

  const W = cfg.w;
  const H = cfg.h;
  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  const a = await assemble(canvas, def, {preserveDrawingBuffer: true, warm: false});
  a.stage.setQuality(TIERS[0]);
  a.stage.resize(W, H, cfg.pr ?? 2);

  // black void: scene background (encoded once by the post chain), studio decor and floor hidden
  a.stage.scene.background = new THREE.Color(0x000000);
  a.stage.renderer.setClearColor(0x000000, 1);
  a.stage.scene.traverse((o) => {
    if (o.userData.studio === true || o.userData.floor === true) o.visible = false;
  });

  // recolour by material kind (materials are named v8-<assembly>-<kind>)
  const GREEN = new THREE.Color('#2CA942');
  const looks = {
    shell: {color: 0xf4f4f4},
    white: {color: 0xeeeeee},
    ceramic: {color: 0xf6f6f6},
    header: {color: 0xdedede},
    alu: {color: 0xe2e2e2, metalness: 0.3, roughness: 0.45},
    steel: {color: 0x8c8c8c, metalness: 0.75, roughness: 0.4},
    graphite: {color: 0x2b2b2b, metalness: 0.5, roughness: 0.48},
    dark: {color: 0x171717},
    rubber: {color: 0x121212},
    glass: {color: 0xf2f2f2},
  };
  const seen = new Set();
  const unknown = new Set();
  a.model.root.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of [o.material].flat()) {
      if (!m || seen.has(m)) continue;
      seen.add(m);
      const kind = (m.name || '').split('-').pop();
      if (kind === 'accent') {
        m.color.copy(GREEN);
        if (m.emissive) {
          m.emissive.copy(GREEN);
          m.emissiveIntensity = cfg.accentGlow ?? 0.35;
        }
        continue;
      }
      const look = looks[kind];
      if (!look) {
        unknown.add(m.name || m.type);
        // anything else: keep its lightness, drop its hue
        if (m.color) {
          const hsl = {};
          m.color.getHSL(hsl);
          m.color.setHSL(0, 0, hsl.l);
        }
        if (m.emissive) m.emissive.setRGB(0, 0, 0);
        continue;
      }
      m.color.set(look.color);
      if (look.metalness !== undefined) m.metalness = look.metalness;
      if (look.roughness !== undefined) m.roughness = look.roughness;
      if (m.emissive) m.emissive.setRGB(0, 0, 0);
      m.needsUpdate = true;
    }
  });

  // Seamless loop: the crank, cams, valves and pistons repeat every 720 degrees, but the belt pulleys turn at their
  // diameter ratios (86/31, 86/40) and the timing chains advance a non-whole number of links per turn. Over one loop's
  // crank travel (cfg.phi) each gets the nearest ratio that comes back to where it started (within 1-2%, unseen).
  const {sprocketPitchR} = await import('/src/machines/v8/parts/crank.ts');
  const D2R = Math.PI / 180;
  const PHI = cfg.phi;
  const rc = sprocketPitchR(19);
  const chains = [];
  let altPulley = null;
  let pumpPulley = null;
  a.model.root.traverse((o) => {
    if (o.isInstancedMesh && /^chain-links-/.test(o.name)) chains.push(o);
    if (!o.isMesh && o.name === 'alternator-pulley') altPulley = o;
    if (!o.isMesh && o.name === 'pump-pulley') pumpPulley = o;
  });
  const fixes = {chains: [], alt: null, pump: null};
  for (const c of chains) {
    c.geometry.computeBoundingBox();
    const bb = c.geometry.boundingBox;
    const pitch = (bb.max.x - bb.min.x) * 1000 - 1.25 - 1.8 * Math.sin(Math.PI / 3); // plate: pitch + 2.5 mm; 6-sided pin of r 1.8 at +pitch/2
    const links = (PHI * D2R * rc) / pitch;
    c.userData.loopAdj = PHI ? Math.round(links) / links : 1;
    fixes.chains.push({name: c.name, pitch, links, adj: c.userData.loopAdj});
  }
  const fitRatio = (ratio) => (PHI ? (Math.round((PHI * ratio) / 360) * 360) / PHI : ratio);
  const altR = fitRatio(86 / 31);
  const pumpR = fitRatio(86 / 40);
  fixes.alt = [86 / 31, altR, !!altPulley];
  fixes.pump = [86 / 40, pumpR, !!pumpPulley];
  const pose0 = a.model.pose;
  a.model.pose = (s) => {
    if (cfg.loopFix === false) return pose0(s);
    for (const c of chains) {
      pose0({...s, phase: s.phase * c.userData.loopAdj});
      c.userData.loopSaved = c.instanceMatrix.array.slice();
    }
    pose0(s);
    for (const c of chains) {
      c.instanceMatrix.array.set(c.userData.loopSaved);
      c.instanceMatrix.needsUpdate = true;
    }
    if (altPulley) altPulley.rotation.z = -s.phase * D2R * altR;
    if (pumpPulley) pumpPulley.rotation.z = -s.phase * D2R * pumpR;
  };

  await a.stage.warm();

  const T = cfg.T;
  const FPS = cfg.fps;
  const frames = Math.round(T * FPS);
  // explode envelope on the film clock (seconds within the loop): together, apart, hold, together
  const [e0, e1, e2, e3] = cfg.explode; // start apart, fully apart, start back, fully together
  const explodeAt = (u) => {
    if (u < e0) return 0;
    if (u < e1) return smoother((u - e0) / (e1 - e0));
    if (u < e2) return 1;
    if (u < e3) return 1 - smoother((u - e2) / (e3 - e2));
    return 0;
  };
  const toggles = {labels: false, exploded: false, turntable: false, charge: false};
  const TAU = Math.PI * 2;

  frameFn = (i, override = {}) => {
    const t = i / FPS; // loop clock
    const u = (((t + cfg.offset) % T) + T) % T; // film clock: where in the together/apart cycle frame i sits
    const e = override.e ?? explodeAt(u);
    const az = override.az ?? cfg.az0 + cfg.orbit * (t / T) + cfg.azSway * Math.sin(TAU * (t / T) + cfg.swayPhase);
    const el = override.el ?? cfg.el0 + cfg.elAmp * Math.sin(TAU * (t / T) + cfg.elPhase);
    const dist = cfg.dist * (1 + cfg.dolly * e);
    const ta = cfg.targetApart ?? cfg.target;
    const target = cfg.target.map((v, k) => v + (ta[k] - v) * e);
    const pose = {target, az, el, dist: dist / explodeDolly(e), fov: cfg.fov ?? 30};
    const phase = override.phase ?? cfg.phase0 + cfg.phi * (t / T);
    const s = def.stateAt(4, {input: 700, phase, explode: e, apart: {}, isolate: null, cut: 'solid', toggles, camera: pose});
    a.stage.frame(s);
    return canvas.toDataURL('image/png');
  };
  boundsFn = () => {
    const b = new THREE.Box3();
    a.model.root.updateWorldMatrix(true, true);
    a.model.root.traverseVisible((o) => {
      if (o.isMesh && !o.userData.studio && !o.userData.floor) b.expandByObject(o, false);
    });
    const c = b.getCenter(new THREE.Vector3());
    const z = b.getSize(new THREE.Vector3());
    return {center: c.toArray(), size: z.toArray(), min: b.min.toArray(), max: b.max.toArray()};
  };
  return {frames, fps: FPS, unknown: [...unknown], spread: EXPLODE_SPREAD, fixes};
}

let boundsFn = () => null;

window.__loop = {init, frame: (i, o) => frameFn(i, o), bounds: () => boundsFn()};
