import{t as e}from"./rolldown-runtime-DK3Fl9T5.js";import{n as t,r as n,t as r}from"./three.module-CmYVUX1t.js";import{An as i,B as a,C as o,Cn as s,Ct as c,D as l,E as u,En as d,Jn as f,N as p,Nn as m,Nt as h,R as g,Rn as _,St as v,T as y,Tn as b,U as x,Un as S,Vn as C,X as w,Y as T,Zn as E,a as D,at as O,bt as ee,ct as k,dt as te,f as A,fn as ne,gn as j,gt as M,i as N,it as P,lt as F,o as I,p as re,pt as L,qn as R,r as z,rt as B,tt as ie,ut as V,vt as H,wt as U,xt as W,z as G,zn as ae}from"./three.core-Bk_P4n_K.js";import{J as oe,Y as se,q as ce}from"./main-B0KNWFcG.js";import{t as le}from"./stage.types-CMKKssDZ.js";import{t as K}from"./palette-DBwKAKLE.js";import{n as ue,t as de}from"./theme-CwLbJgUy.js";var q={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},J=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},fe=new H(-1,1,1,-1,0,1),Y=new class extends I{constructor(){super(),this.setAttribute(`position`,new p([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new p([0,2,0,0,2,0],2))}},X=class{constructor(e){this._mesh=new P(Y,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,fe)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},pe=class extends J{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof d?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=_.clone(e.uniforms),this.material=new d({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new X(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},me=class extends J{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Z=class extends J{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},he=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new R);this._width=n.width,this._height=n.height,t=new E(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:G}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new pe(q),this.copyPass.material.blending=0,this.timer=new m}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}me!==void 0&&(r instanceof me?n=!0:r instanceof Z&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new R);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},ge=class extends J{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new A}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},_e={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new A(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},ve=class e extends J{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new R(256,256):new R(e.x,e.y),this.clearColor=new A(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new E(i,a,{type:G,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new E(i,a,{type:G,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new E(i,a,{type:G,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=_e;this.highPassUniforms=_.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new d({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new R(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new f(1,1,1),new f(1,1,1),new f(1,1,1),new f(1,1,1),new f(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=_.clone(q.uniforms),this.blendMaterial=new d({uniforms:this.copyUniforms,vertexShader:q.vertexShader,fragmentShader:q.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new A,this._oldClearAlpha=1,this._basic=new O,this._fsQuad=new X(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new R(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new d({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new R(.5,.5)},direction:{value:new R(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new d({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};ve.BlurDirectionX=new R(1,0),ve.BlurDirectionY=new R(0,1);var ye={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},be=class extends J{constructor(){super(),this.isOutputPass=!0,this.uniforms=_.clone(ye.uniforms),this.material=new ne({name:ye.name,uniforms:this.uniforms,vertexShader:ye.vertexShader,fragmentShader:ye.fragmentShader}),this._fsQuad=new X(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},xe=class extends b{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new N;e.deleteAttribute(`uv`);let t=new te({side:1}),n=new te,r=new c(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new P(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new x(e,n,6),o=new M;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new P(e,Q(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let l=new P(e,Q(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let u=new P(e,Q(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let d=new P(e,Q(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let f=new P(e,Q(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let p=new P(e,Q(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Q(e){return new k({color:0,emissive:16777215,emissiveIntensity:e})}var Se=[16e5,45e5,1/0];function Ce(){if(typeof window>`u`)return null;let e=typeof window.matchMedia==`function`&&window.matchMedia(`(pointer: coarse)`).matches,t=window.screen;return{coarse:e,width:t?.width||window.innerWidth,height:t?.height||window.innerHeight,dpr:window.devicePixelRatio}}var we=(e,t)=>e.width*e.height*De(e.dpr??1,t)**2;function Te(e=Ce()){if(!e)return 0;let t=Math.min(e.width,e.height)<600||Math.max(e.width,e.height)<1e3;if(e.coarse||t)return le.length-1;let n=le.findIndex((t,n)=>we(e,t)<=(Se[n]??1/0));return n<0?le.length-1:n}var Ee=e=>Math.min(le.length-1,Math.max(0,e)+1);function De(e,t){return Math.min(Number.isFinite(e)&&e>0?e:1,t.pr)}var Oe=(e,t)=>Math.max(0,Math.min(e.msaa,t));function ke(e={}){let t=e.clock??(()=>performance.now()),n=e.threshold??40,r=(e.window??2)*1e3,i=(e.hold??3)*1e3,a=(e.gap??1)*1e3,o=[],s=0,c=-1,l=-1,u=0,d=()=>{o=[],s=0,c=-1,l=-1,u=0};return{frame:()=>{let e=t();for(e-(o.length>s?o[o.length-1]:-1/0)>a&&d(),c<0&&(c=e),o.push(e);o[s]<e-r;)s++;s>1024&&(o=o.slice(s),s=0);let f=o.length-s,p=e-o[s];return u=f>1&&p>0?(f-1)*1e3/p:0,e-c<r?!1:u>=n?(l=-1,!1):(l<0&&(l=e),e-l<i?!1:(d(),!0))},fps:()=>u,reset:d}}var Ae=()=>new Promise(e=>typeof requestAnimationFrame==`function`?requestAnimationFrame(()=>e()):setTimeout(e,0));async function je(e){let t=Math.max(1,e.states.length);if(e.onProgress?.(0),e.states.length===0)await e.renderer.compileAsync(e.scene,e.camera),e.render(),e.onProgress?.(1);else for(let n=0;n<e.states.length;n++)e.apply(e.states[n]),await e.renderer.compileAsync(e.scene,e.camera),e.render(),e.onProgress?.((n+1)/t),n%3==2&&await Ae()}function Me(e){let t=Object.keys(e.apart).filter(t=>(e.apart[t]??0)>0).sort(),n=Object.keys(e.toggles).filter(t=>e.toggles[t]).sort();return[e.cut,e.isolate??`-`,e.explode>0?`x`:`-`,t.join(`,`),n.join(`,`)].join(`|`)}var Ne=1.25;function Pe(e){let t=[],n=new Set,r=e=>{let r=Me(e);n.has(r)||(n.add(r),t.push(e))};r(e.stateAt(0));for(let t of e.beats)r(e.stateAt(Math.min(e.duration,t.t+Ne)));let i=e.cuts?.length?e.cuts:[`solid`],a=e.assemblies[0]?.id??null,o=t=>e.stateAt(0,t);for(let t of i){r(o({cut:t,isolate:null}));for(let n of e.assemblies)r(o({cut:t,isolate:n.id}))}return r(o({explode:1})),r(o({apart:Object.fromEntries(e.assemblies.map(e=>[e.id,1]))})),r(o({toggles:Object.fromEntries(e.toggles.map(e=>[e.id,!0]))})),a&&r(o({toggles:Object.fromEntries(e.toggles.map(e=>[e.id,!0])),isolate:a,explode:1})),t}var Fe=[.59719,.35458,.04823,.076,.90834,.01566,.0284,.13383,.83777],Ie=[1.60475,-.53108,-.07367,-.10208,1.10813,-.00605,-.00327,-.07276,1.07602],Le=.0245786,Re=90537e-9,ze=.983729,Be=.432951,Ve=.238081,He=.6;function Ue(e,t){return[e[0]*t[0]+e[1]*t[1]+e[2]*t[2],e[3]*t[0]+e[4]*t[1]+e[5]*t[2],e[6]*t[0]+e[7]*t[1]+e[8]*t[2]]}function We(e){let[t,n,r,i,a,o,s,c,l]=e,u=a*l-o*c,d=-(i*l-o*s),f=i*c-a*s,p=1/(t*u+n*d+r*f);return[u*p,-(n*l-r*c)*p,(n*o-r*a)*p,d*p,(t*l-r*s)*p,-(t*o-r*i)*p,f*p,-(t*c-n*s)*p,(t*a-n*i)*p]}var Ge=We(Fe),Ke=We(Ie),qe=(e,t,n)=>Math.min(n,Math.max(t,e));function Je(e){let t=qe(e,0,1),n=1-ze*t,r=Le-Be*t,i=-(Re+Ve*t);return(-r+Math.sqrt(Math.max(r*r-4*n*i,0)))/(2*n)}function Ye(e,t=1){let n=Ue(Ke,[qe(e[0],0,.995),qe(e[1],0,.995),qe(e[2],0,.995)]),r=Ue(Ge,[Je(n[0]),Je(n[1]),Je(n[2])]),i=He/Math.max(t,1e-4);return[Math.max(0,r[0])*i,Math.max(0,r[1])*i,Math.max(0,r[2])*i]}var Xe=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,Ze=e=>e<=.0031308?e*12.92:1.055*Math.max(e,0)**(1/2.4)-.055;function Qe(e){let t=parseInt(e.replace(`#`,``),16);return[Xe((t>>16&255)/255),Xe((t>>8&255)/255),Xe((t&255)/255)]}var $e=e=>{let t=String(e);return/[.e]/.test(t)?t:`${t}.0`},et=e=>`mat3(${[e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]].map($e).join(`, `)})`,tt=`
vec3 acesFilmicInverse( vec3 display, float exposure ) {
  const mat3 OUT_INV = ${et(Ke)};
  const mat3 IN_INV = ${et(Ge)};
  vec3 y = clamp( OUT_INV * clamp( display, 0.0, 0.995 ), 0.0, 1.0 );
  vec3 a = 1.0 - ${$e(ze)} * y;
  vec3 b = ${$e(Le)} - ${$e(Be)} * y;
  vec3 c = -( ${$e(Re)} + ${$e(Ve)} * y );
  vec3 v = ( -b + sqrt( max( b * b - 4.0 * a * c, 0.0 ) ) ) / ( 2.0 * a );
  return max( IN_INV * v, 0.0 ) * ( ${$e(He)} / max( exposure, 1e-4 ) );
}
`;function nt(e){if(e.isEmpty())return nt(new z(new f(-.15,0,-.15),new f(.15,.3,.15)));let t=e.getSize(new f);return{box:e.clone(),center:e.getCenter(new f),radius:Math.max(t.length()/2,.001),footprint:Math.max(Math.hypot(t.x,t.z)/2,.001),height:Math.max(e.max.y,.001)}}function rt(e,t,n=new f){let r=e*Math.PI/180,i=t*Math.PI/180,a=Math.cos(i);return n.set(a*Math.sin(r),Math.sin(i),a*Math.cos(r))}function it(){return{position:new f,target:new f,half:1,near:.1,far:10,normalBias:0}}function at(e,t,n,r=it()){let i=e.radius*1.06,a=e.radius*2,o=(e.center.y+e.radius)/Math.max(t.y,.08);return r.position.copy(e.center).addScaledVector(t,a),r.target.copy(e.center),r.half=i,r.near=Math.max(.001,a-i),r.far=a+i+o,r.normalBias=2*i/n*1.5,r}function ot(e,t,n=0){if(t.isEmpty())return!1;let r=e.box;return t.min.x<r.min.x-n||t.min.y<r.min.y-n||t.min.z<r.min.z-n||t.max.x>r.max.x+n||t.max.y>r.max.y+n||t.max.z>r.max.z+n}function st(e){let t=e.footprint;return{center:[e.center.x,e.center.z],radii:[t*1.3,t*1.62,t*2.05],tickLength:t*.06}}var ct={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new R},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new B},cameraProjectionMatrixInverse:{value:new B},cameraWorldMatrix:{value:new B},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new f(-1,-1,-1)},sceneBoxMax:{value:new f(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				#if PERSPECTIVE_CAMERA == 1
					vec3 viewDir = normalize(-viewPos.xyz);
				#else
					vec3 viewDir = vec3(0., 0., 1.);
				#endif
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},lt={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},ut={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function dt(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=ft(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new f(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new o(i,t,t);return a.wrapS=j,a.wrapT=j,a.needsUpdate=!0,a}function ft(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var pt={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:mt(16,2,1),NORMAL_VECTOR_TYPE:1},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new R},cameraProjectionMatrixInverse:{value:new B},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).r;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).r;
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function mt(e,t,n){let r=ht(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function ht(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new f(Math.cos(a),Math.sin(a),o))}return r}var gt=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,ee=_-C+2*d,k=v-w+2*d,te=g-1+3*d,A=_-1+3*d,ne=v-1+3*d,j=c&255,M=l&255,N=u&255,P=this.perm[j+this.perm[M+this.perm[N]]]%12,F=this.perm[j+y+this.perm[M+b+this.perm[N+x]]]%12,I=this.perm[j+S+this.perm[M+C+this.perm[N+w]]]%12,re=this.perm[j+1+this.perm[M+1+this.perm[N+1]]]%12,L=.6-g*g-_*_-v*v;L<0?r=0:(L*=L,r=L*L*this._dot3(this.grad3[P],g,_,v));let R=.6-T*T-E*E-D*D;R<0?i=0:(R*=R,i=R*R*this._dot3(this.grad3[F],T,E,D));let z=.6-O*O-ee*ee-k*k;z<0?a=0:(z*=z,a=z*z*this._dot3(this.grad3[I],O,ee,k));let B=.6-te*te-A*A-ne*ne;return B<0?o=0:(B*=B,o=B*B*this._dot3(this.grad3[re],te,A,ne)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,ee=w>E?16:0,k=T>E?8:0,te=w>D?4:0,A=T>D?2:0,ne=+(E>D),j=O+ee+k+te+A+ne,M=+(a[j][0]>=3),N=+(a[j][1]>=3),P=+(a[j][2]>=3),F=+(a[j][3]>=3),I=+(a[j][0]>=2),re=+(a[j][1]>=2),L=+(a[j][2]>=2),R=+(a[j][3]>=2),z=+(a[j][0]>=1),B=+(a[j][1]>=1),ie=+(a[j][2]>=1),V=+(a[j][3]>=1),H=w-M+c,U=T-N+c,W=E-P+c,G=D-F+c,ae=w-I+2*c,oe=T-re+2*c,se=E-L+2*c,ce=D-R+2*c,le=w-z+3*c,K=T-B+3*c,ue=E-ie+3*c,de=D-V+3*c,q=w-1+4*c,J=T-1+4*c,fe=E-1+4*c,Y=D-1+4*c,X=h&255,pe=g&255,me=_&255,Z=v&255,he=o[X+o[pe+o[me+o[Z]]]]%32,ge=o[X+M+o[pe+N+o[me+P+o[Z+F]]]]%32,_e=o[X+I+o[pe+re+o[me+L+o[Z+R]]]]%32,ve=o[X+z+o[pe+B+o[me+ie+o[Z+V]]]]%32,ye=o[X+1+o[pe+1+o[me+1+o[Z+1]]]]%32,be=.6-w*w-T*T-E*E-D*D;be<0?l=0:(be*=be,l=be*be*this._dot4(i[he],w,T,E,D));let xe=.6-H*H-U*U-W*W-G*G;xe<0?u=0:(xe*=xe,u=xe*xe*this._dot4(i[ge],H,U,W,G));let Q=.6-ae*ae-oe*oe-se*se-ce*ce;Q<0?d=0:(Q*=Q,d=Q*Q*this._dot4(i[_e],ae,oe,se,ce));let Se=.6-le*le-K*K-ue*ue-de*de;Se<0?f=0:(Se*=Se,f=Se*Se*this._dot4(i[ve],le,K,ue,de));let Ce=.6-q*q-J*J-fe*fe-Y*Y;return Ce<0?p=0:(Ce*=Ce,p=Ce*Ce*this._dot4(i[ye],q,J,fe,Y)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},_t=class e extends J{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=dt(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new E(this.width,this.height,{type:G,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new d({defines:Object.assign({},ct.defines),uniforms:_.clone(ct.uniforms),vertexShader:ct.vertexShader,fragmentShader:ct.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new F,this.normalMaterial.blending=0,this.pdMaterial=new d({defines:Object.assign({},pt.defines),uniforms:_.clone(pt.uniforms),vertexShader:pt.vertexShader,fragmentShader:pt.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new d({defines:Object.assign({},lt.defines),uniforms:_.clone(lt.uniforms),vertexShader:lt.vertexShader,fragmentShader:lt.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new d({uniforms:_.clone(q.uniforms),vertexShader:q.vertexShader,fragmentShader:q.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new d({uniforms:_.clone(ut.uniforms),vertexShader:ut.vertexShader,fragmentShader:ut.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new X(null),this._originalClearColor=new A,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget&&this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget&&this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){if(e!==void 0)this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1;else{if(this.normalRenderTarget===void 0){let e=new u;e.format=y,e.type=C,this.normalRenderTarget=new E(this.width,this.height,{minFilter:L,magFilter:L,type:G,depthTexture:e})}this.depthTexture=this.normalRenderTarget.depthTexture,this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0}let n=+!!this.normalTexture;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.needsUpdate=!0,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.needsUpdate=!0,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=mt(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalTexture||null,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new gt,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new o(r,e,e,h,ae);return i.wrapS=j,i.wrapT=j,i.needsUpdate=!0,i}};_t.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var vt=`
uniform vec2 uResolution;
uniform vec3 uBgCenter;
uniform vec3 uBgEdge;
uniform vec2 uBgFocus;
uniform float uExposure;

vec3 studioBackdrop( vec2 frag ) {
  vec2 uv = frag / max( uResolution, vec2( 1.0 ) );
  // an ellipse that touches the middle of every frame edge: --bg at the edges, a whisper lighter behind the machine
  vec2 d = ( uv - uBgFocus ) / vec2( 0.62, 0.6 );
  float r = clamp( length( d ), 0.0, 1.0 );
  float k = 1.0 - r * r * ( 3.0 - 2.0 * r );
  return mix( uBgEdge, uBgCenter, k );
}

${tt}
`,yt=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4( position.xy, 0.0, 1.0 );
}
`,bt=`
${vt}
void main() {
  gl_FragColor = vec4( acesFilmicInverse( studioBackdrop( gl_FragCoord.xy ), uExposure ), 1.0 );
}
`,xt=`
#include <common>
#include <shadowmap_pars_vertex>
varying vec3 vWorld;
void main() {
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #include <project_vertex>
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  vWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
}
`,St=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>

${vt}

varying vec3 vWorld;

uniform vec3 uKeyShade;
uniform vec3 uContactShade;
uniform float uKeySoft;          // penumbra radius in shadow-map uv
uniform float uKeyStrength;

uniform sampler2D uContactTight;  // r: tight contact (pre-blurred)
uniform sampler2D uContactWide;   // g: wide contact (pre-blurred, lower resolution)
uniform vec2 uContactCenter;     // world xz
uniform float uContactHalf;      // half extent of the contact map (m)
uniform float uContactOn;

uniform vec2 uRingCenter;
uniform vec3 uRingRadii;
uniform float uTickLength;
uniform vec3 uRingColor;
uniform float uRingAlpha;
uniform vec3 uAccent;            // StageOptions.accent (scene-linear); the 30 degree ticks carry it
uniform float uAccentMix;        // 0 when no accent was given
uniform float uLinePx;

float studioIgn( vec2 p ) {
  return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) );
}

vec2 studioDisk( int i, int n, float phi ) {
  float r = sqrt( ( float( i ) + 0.5 ) / float( n ) );
  float th = float( i ) * 2.39996323 + phi;
  return vec2( cos( th ), sin( th ) ) * r;
}

float keyLight() {
  #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0 && defined( SHADOWMAP_TYPE_PCF )
    vec4 sc = vDirectionalShadowCoord[ 0 ];
    sc.xyz /= sc.w;
    sc.z += directionalLightShadows[ 0 ].shadowBias;
    vec2 edge = min( sc.xy, 1.0 - sc.xy );
    if ( min( edge.x, edge.y ) <= 0.0 || sc.z >= 1.0 ) return 1.0;
    float phi = studioIgn( gl_FragCoord.xy ) * PI2;
    float s = 0.0;
    for ( int i = 0; i < 16; i ++ ) {
      s += texture( directionalShadowMap[ 0 ], vec3( sc.xy + studioDisk( i, 16, phi ) * uKeySoft, sc.z ) );
    }
    s /= 16.0;
    // fade out toward the frustum border so the map edge never shows on the floor
    float fade = smoothstep( 0.0, 0.08, min( edge.x, edge.y ) );
    return mix( 1.0, s, fade * uKeyStrength );
  #else
    return 1.0;
  #endif
}

float contactShadow() {
  if ( uContactOn < 0.5 ) return 0.0;
  vec2 uv = ( vWorld.xz - uContactCenter ) / ( 2.0 * uContactHalf ) + 0.5;
  vec2 edge = min( uv, 1.0 - uv );
  if ( min( edge.x, edge.y ) <= 0.0 ) return 0.0;
  vec2 m = vec2( texture2D( uContactTight, uv ).r, texture2D( uContactWide, uv ).g );
  float c = clamp( 0.6 * m.r + 0.4 * m.g, 0.0, 1.0 );
  c = 1.0 - ( 1.0 - c ) * ( 1.0 - c );
  return c * smoothstep( 0.0, 0.1, min( edge.x, edge.y ) );
}

// anti-aliased line of half width px (device pixels) around d = 0
float aaLine( float d, float px ) {
  float fw = max( fwidth( d ), 1e-6 );
  return clamp( px - abs( d ) / fw + 0.5, 0.0, 1.0 );
}

float aaBand( float x, float a, float b ) {
  float fw = max( fwidth( x ), 1e-6 );
  return clamp( ( x - a ) / fw + 0.5, 0.0, 1.0 ) * clamp( ( b - x ) / fw + 0.5, 0.0, 1.0 );
}

float ringAccent = 0.0; // share of rings() that comes from the major ticks

float rings() {
  vec2 p = vWorld.xz - uRingCenter;
  float r = length( p );
  float a = r > 1e-6 ? atan( p.y, p.x ) * 57.2957795 : 0.0; // degrees; atan(0, 0) is undefined on some drivers
  float px = uLinePx * 0.5;

  float ink = aaLine( r - uRingRadii.x, px ) * 0.9;
  ink = max( ink, aaLine( r - uRingRadii.y, px ) * 0.55 );

  // ticks every 5 degrees just outside the middle ring, a longer one every 30
  float minor = abs( fract( a / 5.0 + 0.5 ) - 0.5 ) * 5.0;
  float major = abs( fract( a / 30.0 + 0.5 ) - 0.5 ) * 30.0;
  float arcMinor = r * minor * 0.01745329;
  float arcMajor = r * major * 0.01745329;
  float tMinor = aaLine( arcMinor, px ) * aaBand( r, uRingRadii.y, uRingRadii.y + uTickLength );
  float tMajor = aaLine( arcMajor, px ) * aaBand( r, uRingRadii.y - uTickLength * 0.6, uRingRadii.y + uTickLength * 2.2 );
  ink = max( ink, max( tMinor * 0.7, tMajor ) );
  ringAccent = tMajor;

  // outer dashed ring
  float dash = abs( fract( a / 3.0 ) - 0.5 ) * 2.0; // 0..1 triangle
  float dashMask = clamp( ( dash - 0.45 ) / max( fwidth( dash ), 1e-4 ) + 0.5, 0.0, 1.0 );
  ink = max( ink, aaLine( r - uRingRadii.z, px ) * dashMask * 0.7 );

  return ink;
}

void main() {
  vec3 col = studioBackdrop( gl_FragCoord.xy );
  float lit = keyLight();
  float contact = clamp( contactShadow(), 0.0, 1.0 );
  col *= mix( uKeyShade, vec3( 1.0 ), lit );
  col *= mix( vec3( 1.0 ), uContactShade, contact );
  float ring = clamp( rings(), 0.0, 1.0 );
  vec3 ringCol = mix( uRingColor, uAccent, clamp( ringAccent, 0.0, 1.0 ) * uAccentMix );
  col = mix( col, ringCol, ring * uRingAlpha * ( 1.0 + ringAccent * uAccentMix * 0.6 ) );
  gl_FragColor = vec4( acesFilmicInverse( col, uExposure ), 1.0 );
}
`,Ct=`
uniform sampler2D tDepth;
uniform float uBase;
uniform float uNear;
uniform float uFar;
uniform float uFade;
varying vec2 vUv;
void main() {
  float d = texture2D( tDepth, vUv ).r;
  float h = d >= 0.9999 ? 1e3 : uBase + uNear + d * ( uFar - uNear );
  gl_FragColor = vec4( 1.0 - smoothstep( 0.0, uFade, h ), 1.0 - smoothstep( 0.0, uFade * 3.0, h ), 0.0, 1.0 );
}
`,wt=`
uniform sampler2D tMap;
uniform vec2 uStepTight;
uniform vec2 uStepWide;
varying vec2 vUv;
void main() {
  float w[ 5 ];
  w[ 0 ] = 0.2270270270; w[ 1 ] = 0.1945945946; w[ 2 ] = 0.1216216216; w[ 3 ] = 0.0540540541; w[ 4 ] = 0.0162162162;
  float r = texture2D( tMap, vUv ).r * w[ 0 ];
  float g = texture2D( tMap, vUv ).g * w[ 0 ];
  for ( int i = 1; i < 5; i ++ ) {
    float fi = float( i );
    r += ( texture2D( tMap, vUv + uStepTight * fi ).r + texture2D( tMap, vUv - uStepTight * fi ).r ) * w[ i ];
    g += ( texture2D( tMap, vUv + uStepWide * fi ).g + texture2D( tMap, vUv - uStepWide * fi ).g ) * w[ i ];
  }
  gl_FragColor = vec4( r, g, 0.0, 1.0 );
}
`,Tt=`
uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform float uThick;
uniform float uNear;
uniform float uFar;
uniform vec3 uInk;
uniform float uSilhouette;
uniform float uCrease;
uniform float uDither;
varying vec2 vUv;

float linDepth( float d ) {
  float z = d * 2.0 - 1.0;
  return 2.0 * uNear * uFar / max( uFar + uNear - z * ( uFar - uNear ), 1e-6 );
}

void main() {
  vec4 c = texture2D( tDiffuse, vUv );
  vec4 n0 = texture2D( tNormal, vUv );
  float a0 = n0.a;
  float e = 0.0;
  if ( a0 > 0.01 ) {
    vec3 nc = normalize( n0.rgb * 2.0 - 1.0 + 1e-5 );
    float dc = linDepth( texture2D( tDepth, vUv ).r );
    float sil = 0.0;
    float crease = 0.0;
    vec2 offs[ 4 ];
    offs[ 0 ] = vec2( uThick, 0.0 );
    offs[ 1 ] = vec2( -uThick, 0.0 );
    offs[ 2 ] = vec2( 0.0, uThick );
    offs[ 3 ] = vec2( 0.0, -uThick );
    for ( int i = 0; i < 4; i ++ ) {
      vec2 uv = vUv + offs[ i ] * uTexel;
      vec4 nn = texture2D( tNormal, uv );
      float dn = linDepth( texture2D( tDepth, uv ).r );
      // background next to the part, or a surface clearly behind it: a silhouette on this (nearer) pixel
      float behind = ( dn - dc ) / max( dc, 1e-4 );
      float s = max( 1.0 - nn.a, smoothstep( 0.012, 0.04, behind ) );
      sil = max( sil, s );
      if ( nn.a > 0.5 && abs( behind ) < 0.03 ) {
        vec3 nb = normalize( nn.rgb * 2.0 - 1.0 + 1e-5 );
        crease = max( crease, smoothstep( 0.3, 0.75, 1.0 - dot( nc, nb ) ) );
      }
    }
    e = max( sil * uSilhouette, crease * uCrease ) * clamp( a0, 0.0, 1.0 );
  }
  vec3 col = mix( c.rgb, uInk, e );
  // break up 8-bit banding in the pale gradients
  float n = fract( 52.9829189 * fract( dot( gl_FragCoord.xy, vec2( 0.06711056, 0.00583715 ) ) ) );
  col += ( n - 0.5 ) * uDither;
  gl_FragColor = vec4( clamp( col, 0.0, 1.0 ), 1.0 );
}
`,Et=e=>e.visible===!1||!!e.transparent&&(e.opacity??1)<.6;function Dt(e){let t=e.material;if(!t)return!1;if(!Array.isArray(t))return Et(t);if(t.length===0)return!1;for(let e of t)if(!Et(e))return!1;return!0}var Ot=class{casters=new Set;hidden=[];floors=[];changed=[];visit=e=>{let t=e;if(e.userData.studio){(e.userData.floor?this.floors:this.hidden).push(e);return}let n=Dt(e);t.isMesh&&this.casters.has(e)&&(e.castShadow=!n),(n||t.isPoints||t.isLine||t.isLine2||t.isSprite)&&this.hidden.push(e)};collect(e){this.hidden.length=0,this.floors.length=0,e.traverseVisible(this.visit)}hide(e=!1){let t=this.changed;t.length=0;for(let e of this.hidden)e.visible&&(e.visible=!1,t.push(e));if(!e)for(let e of this.floors)e.visible&&(e.visible=!1,t.push(e))}restore(){for(let e of this.changed)e.visible=!0;this.changed.length=0}},kt=class extends J{material;quad;constructor(e){super(),this.needsSwap=!1,this.material=new d({name:`StudioBackdrop`,uniforms:e,vertexShader:yt,fragmentShader:bt,depthTest:!1,depthWrite:!1,blending:0}),this.quad=new X(this.material)}render(e,t,n){e.setRenderTarget(this.renderToScreen?null:n),e.clear(!0,!0,!0),this.quad.render(e)}dispose(){this.material.dispose(),this.quad.dispose()}},At=class extends J{material;quad;constructor(){super(),this.material=new d({name:`StudioNanGuard`,uniforms:{tDiffuse:{value:null}},vertexShader:yt,fragmentShader:`
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D(tDiffuse, vUv);
          bool bad = any(isnan(c)) || any(isinf(c));
          gl_FragColor = bad ? vec4(0.0, 0.0, 0.0, 1.0) : c;
        }`,depthTest:!1,depthWrite:!1,blending:0}),this.quad=new X(this.material)}render(e,t,n){this.material.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(this.renderToScreen?null:t),this.quad.render(e)}dispose(){this.material.dispose(),this.quad.dispose()}},jt=e=>new A().setRGB(...Qe(e).map(Ze)),Mt=class extends J{scene;camera;visibility;prepass;normalMaterial=new F({side:2});material;quad;clearColor=new A;constructor(e,t,n,r){super(),this.scene=e,this.camera=t,this.visibility=r,this.normalMaterial.blending=0,this.normalMaterial.clippingPlanes=n,this.prepass=new E(1,1,{type:G}),this.prepass.depthTexture=new u(1,1,S),this.material=new d({name:`StudioInk`,uniforms:{tDiffuse:{value:null},tNormal:{value:this.prepass.texture},tDepth:{value:this.prepass.depthTexture},uTexel:{value:new R(1,1)},uThick:{value:1},uNear:{value:.01},uFar:{value:100},uInk:{value:jt(K.ink)},uSilhouette:{value:K.inkSilhouette},uCrease:{value:K.inkCrease},uDither:{value:1/255}},vertexShader:yt,fragmentShader:Tt,depthTest:!1,depthWrite:!1,blending:0}),this.quad=new X(this.material)}setPixelRatio(e){this.material.uniforms.uThick.value=Math.max(1,e*.9)}setSize(e,t){this.prepass.setSize(e,t),this.material.uniforms.uTexel.value.set(1/Math.max(1,e),1/Math.max(1,t))}render(e,t,n){this.visibility.hide();let r=this.scene.background,i=this.scene.overrideMaterial,a=e.getClearAlpha();e.getClearColor(this.clearColor),this.scene.background=null,this.scene.overrideMaterial=this.normalMaterial,e.setRenderTarget(this.prepass),e.setClearColor(8421631,0),e.clear(!0,!0,!1),e.render(this.scene,this.camera),this.scene.overrideMaterial=i,this.scene.background=r,e.setClearColor(this.clearColor,a),this.visibility.restore();let o=this.material.uniforms;o.tDiffuse.value=n.texture,o.uNear.value=this.camera.near,o.uFar.value=this.camera.far,e.setRenderTarget(this.renderToScreen?null:t),this.quad.render(e)}dispose(){this.prepass.depthTexture?.dispose(),this.prepass.dispose(),this.normalMaterial.dispose(),this.material.dispose(),this.quad.dispose()}},Nt=class extends _t{visibility;constructor(e,t,n,r,i,a){super(e,t,n,r),this.visibility=a,this.normalMaterial.clippingPlanes=i,this.normalMaterial.side=2,this.blendIntensity=.85,this.updateGtaoMaterial({radius:.25,distanceExponent:1,thickness:1,scale:1,samples:16}),this.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:16})}setRadius(e){this.updateGtaoMaterial({radius:e})}_overrideVisibility(){this.visibility.hide(!0)}_restoreVisibility(){this.visibility.restore()}},Pt=512,Ft=256,It=128,Lt=2,Rt=3,zt=1.75,Bt=(e,t)=>Math.min(2.5,Math.max(.5,e/(zt*Math.sqrt(t))));function Vt(e,n,r){let i=new E(Pt,Pt);i.depthTexture=new u(Pt,Pt,S);let a={type:G,minFilter:w,magFilter:w,depthBuffer:!1},o=new E(Ft,Ft,a),s=new E(Ft,Ft,a),c=new E(It,It,a),l=new E(It,It,a),p=new H(-1,1,1,-1,.01,2),m=new O({colorWrite:!1,side:2});m.clippingPlanes=n;let h=new d({name:`StudioContactHeight`,uniforms:{tDepth:{value:i.depthTexture},uBase:{value:0},uNear:{value:.001},uFar:{value:1},uFade:{value:.05}},vertexShader:yt,fragmentShader:Ct,depthTest:!1,depthWrite:!1,blending:0}),g=new d({name:`StudioContactBlur`,uniforms:{tMap:{value:null},uStepTight:{value:new R},uStepWide:{value:new R}},vertexShader:yt,fragmentShader:wt,depthTest:!1,depthWrite:!1,blending:0}),y=new X(h),b=1,x=2,C={..._.merge([t.lights]),...e,uKeyShade:{value:new f(...K.keyShade)},uContactShade:{value:new f(...K.contactShade)},uKeySoft:{value:.004},uKeyStrength:{value:K.floorKeyStrength},uContactTight:{value:o.texture},uContactWide:{value:c.texture},uContactCenter:{value:new R},uContactHalf:{value:1},uContactOn:{value:0},uRingCenter:{value:new R},uRingRadii:{value:new f(1,1.2,1.5)},uTickLength:{value:.02},uRingColor:{value:new f(...Qe(K.ringColor))},uRingAlpha:{value:K.ringAlpha},uAccent:{value:r?new f(...new A(r).toArray()):new f(...Qe(K.ringColor))},uAccentMix:{value:r?K.ringAccentMix:0},uLinePx:{value:1}},T=new d({name:`StudioFloor`,uniforms:C,vertexShader:xt,fragmentShader:St,lights:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1}),D=new P(new v(1,1),T);D.rotation.x=-Math.PI/2,D.receiveShadow=!0,D.castShadow=!1,D.renderOrder=-10,D.userData.studio=!0,D.userData.floor=!0,D.name=`studio-floor`;let ee=(e,t)=>{let n=Math.max(e.radius*60,20);D.scale.set(n,n,1),D.updateMatrixWorld();let r=e.footprint*1.6+e.radius*.2,i=e.box.max.y+e.radius*.1+.01,a=-.005;p.left=-r,p.right=r,p.top=r,p.bottom=-r,p.near=.001,p.far=i-a,p.position.set(e.center.x,a,e.center.z),p.up.set(0,0,1),p.lookAt(e.center.x,1,e.center.z),p.updateProjectionMatrix(),p.updateMatrixWorld();let o=h.uniforms;o.uBase.value=a,o.uNear.value=p.near,o.uFar.value=p.far,o.uFade.value=Math.max(.01,e.radius*.16),b=Bt(e.radius*.03/(2*r/Ft),Lt),x=Bt(e.radius*.12/(2*r/It),Rt),C.uContactCenter.value.set(e.center.x,e.center.z),C.uContactHalf.value=r,C.uContactOn.value=1,C.uRingCenter.value.set(...t.center),C.uRingRadii.value.set(...t.radii),C.uTickLength.value=t.tickLength},k=(e,t,n,r,i)=>{let a=g.uniforms,o=t.width;a.tMap.value=e.texture,a.uStepTight.value.set(n/o,r/o),a.uStepWide.value.set(n/o,r/o),i.setRenderTarget(t),y.render(i)};return{mesh:D,material:T,fit:ee,setKeySoftness:e=>{C.uKeySoft.value=e},setPixelRatio:e=>{C.uLinePx.value=Math.max(1,e)*1.1},updateContact:(e,t,n)=>{if(C.uContactOn.value<.5)return;n.hide();let r=t.overrideMaterial,a=t.background,u=e.shadowMap.autoUpdate;t.overrideMaterial=m,t.background=null,e.shadowMap.autoUpdate=!1,e.setRenderTarget(i),e.clear(!1,!0,!1),e.render(t,p),e.shadowMap.autoUpdate=u,t.background=a,t.overrideMaterial=r,n.restore(),y.material=h,e.setRenderTarget(o),y.render(e),y.material=g,k(o,c,0,0,e);for(let t=0;t<Rt;t++)k(c,l,x,0,e),k(l,c,0,x,e);for(let t=0;t<Lt;t++)k(o,s,b,0,e),k(s,o,0,b,e)},dispose:()=>{D.geometry.dispose(),T.dispose(),m.dispose(),h.dispose(),g.dispose(),y.dispose(),i.depthTexture?.dispose(),i.dispose();for(let e of[o,s,c,l])e.dispose()}}}var Ht=e=>.2126*e[0]+.7152*e[1]+.0722*e[2],Ut=nt(new z),Wt=10;function Gt(e,t={}){let i=new n({canvas:e,antialias:!1,alpha:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!!t.preserveDrawingBuffer});i.outputColorSpace=s,i.toneMapping=4,i.toneMappingExposure=K.exposure,i.shadowMap.enabled=!0,i.shadowMap.type=1,i.shadowMap.autoUpdate=!1,i.localClippingEnabled=!0,i.setClearColor(K.bgEdge,1);let o=new b;o.name=`studio`;let c=new ee(30,16/9,.01,100),u=new r(i),d=new xe,p=u.fromScene(d,.04).texture;d.dispose(),o.environment=p,o.environmentIntensity=K.envIntensity;let m=new l(K.key.color,K.key.intensity);m.castShadow=!0,m.shadow.bias=-2e-4,m.shadow.intensity=K.key.shadowIntensity;let h=new l(K.rim.color,K.rim.intensity),g=new a(K.hemi.sky,K.hemi.ground,K.hemi.intensity);m.name=`key`,h.name=`rim`,g.name=`fill`,o.add(m,m.target,h,h.target,g);let _={uResolution:{value:new R(1,1)},uBgCenter:{value:new f(...Qe(K.bgCenter))},uBgEdge:{value:new f(...Qe(K.bgEdge))},uBgFocus:{value:new R(...K.bgFocus)},uExposure:{value:K.exposure}},v=[],y=Vt(_,v,t.accent),x=new Ot;o.add(y.mesh);let S=le[0],C=i.capabilities.maxSamples??4,w=()=>new E(1,1,{type:G,samples:Oe(S,C)}),T=new he(i,w());T.setPixelRatio(1);let D=new kt(_),O=new ge(o,c);O.clear=!1,O.clearDepth=!0;let k=Ht(Ye(Qe(K.bgCenter),K.exposure)),te=new ve(new R(256,256),K.bloom.strength,K.bloom.radius,Math.max(k*K.bloom.headroom,K.bloom.minThreshold));te.highPassUniforms.smoothWidth.value=k*K.bloom.smoothWidth;let A=new be,ne=new Mt(o,c,v,x);T.addPass(D),T.addPass(O),T.addPass(new At),T.addPass(te),T.addPass(A),T.addPass(ne);let j=null,M=1,N=1,P=1,F=1,I=1,re=()=>{let e=De(P,S);i.setPixelRatio(e),i.setSize(M,N,!1);let t=i.getDrawingBufferSize(new R);F=Math.max(1,t.x),I=Math.max(1,t.y),T.setSize(F,I),j?.setSize(F,I),_.uResolution.value.set(F,I),ne.setPixelRatio(e),y.setPixelRatio(e),c.aspect=M/N,c.updateProjectionMatrix()},L=null,B=null,ie=null,V=[],H=null,U=null,W=new z,ae=new z,oe=0,ue=e=>(e.updateMatrixWorld(!0),W.makeEmpty(),e.traverseVisible(e=>{e.isMesh&&!e.userData.studio&&W.expandByObject(e,!1)}),W.isEmpty()||(W.min.y=Math.max(0,W.min.y)),W),de=()=>{H&&U&&(y.fit(H,st(H)),j?.setRadius(Math.max(.01,H.radius*.18)))},q=e=>{if(!L||!U)return;let t=ue(L.root);(e||ot(U,t,U.radius*.02))&&(t.isEmpty()||(U=nt(ae.copy(U.box).union(t))))},J=()=>{++oe<Wt||(oe=0,q(!1))},fe=new f,Y=it(),X=e=>{let t=U??Ut;rt(e+K.key.az,K.key.el,fe),at(t,fe,S.shadow,Y),m.position.copy(Y.position),m.target.position.copy(Y.target);let n=m.shadow.camera;n.left=-Y.half,n.right=Y.half,n.top=Y.half,n.bottom=-Y.half,n.near=Y.near,n.far=Y.far,n.updateProjectionMatrix(),m.shadow.normalBias=Y.normalBias,y.setKeySoftness(K.keySoftness*t.radius/(2*Y.half)),m.shadow.radius=K.partSoftness*t.radius/(2*Y.half)*S.shadow,rt(e+K.rim.az,K.rim.el,fe),h.position.copy(t.center).addScaledVector(fe,t.radius*3),h.target.position.copy(t.center)},pe=e=>{let t=H?.radius??.5,n=Math.max(.004,Math.min(e-t*2.5,e*.25)),r=e*6+t*40;(c.near!==n||c.far!==r)&&(c.near=n,c.far=r,c.updateProjectionMatrix())},me=e=>{x.casters.clear(),e.traverse(e=>{let t=e;t.isMesh&&(e.userData.noShadow||(t.castShadow=!0,t.receiveShadow=!0,x.casters.add(t)))})},Z={target:[0,0,0],az:0,el:0,dist:1,fov:30},_e=e=>{Object.assign(Z,e.camera),Z.dist=e.camera.dist*se(e.explode),ce(Z,c,M/N),pe(Z.dist),L&&L.pose(e);for(let t of V)t.update(e);J(),X(e.camera.az)},ye=()=>{x.collect(o),L&&H&&y.updateContact(i,o,x),i.shadowMap.needsUpdate=!0,T.render()},Q=()=>{S.ao?(j||(j=new Nt(o,c,F,I,v,x),H&&j.setRadius(Math.max(.01,H.radius*.18)),T.insertPass(j,T.passes.indexOf(O)+1),j.setSize(F,I)),j.enabled=!0):j&&=(T.removePass(j),j.dispose(),null)};return m.shadow.mapSize.set(S.shadow,S.shadow),Q(),re(),{renderer:i,scene:o,camera:c,mount(e,t){if(L){o.remove(L.root);for(let e of V)e.dispose()}L=e,B=t,v.length=0,me(e.root),o.add(e.root),e.pose(t.stateAt(0)),H=nt(ue(e.root)),U=H,oe=9,de(),ie={model:e,def:t,scene:o,camera:c,renderer:i,clippingPlanes:v};for(let e of V)e.mount(ie)},use(e){V.push(e),ie&&e.mount(ie)},frame(e){_e(e),ye()},resize(e,t,n){M=Math.max(1,Math.round(e)),N=Math.max(1,Math.round(t)),P=n,re()},setQuality:e=>{let t=S;S=e,t.shadow===e.shadow&&m.shadow.map||(m.shadow.mapSize.set(e.shadow,e.shadow),m.shadow.map?.dispose(),m.shadow.map=null),Oe(t,C)!==Oe(e,C)&&T.reset(w()),Q(),re()},async warm(e){let t=B?Pe(B):[],n=T.renderToScreen;T.renderToScreen=!1;try{await je({renderer:i,scene:o,camera:c,states:t,apply:e=>{_e(e),q(!0)},render:ye,onProgress:e})}finally{T.renderToScreen=n}de()},dispose(){for(let e of V)e.dispose();V.length=0,L&&o.remove(L.root),L=null,ie=null,x.casters.clear();for(let e of T.passes)e.dispose();T.dispose(),y.dispose(),m.shadow.map?.dispose(),m.dispose(),h.dispose(),g.dispose(),p.dispose(),u.dispose(),o.environment=null,i.dispose()}}}var Kt={ink:`#a9b8cc`,accent:`#5cc8ff`,ghostOpacity:.1,ghostEdge:2.4,ghostDesat:.85,ghostInk:.2,rim:.75,focusTint:.14,outline:1.5,capWhite:.82,hatchWhite:.55,hatchShare:.024,glass:{color:`#eef3f6`,opacity:.07,roughness:.14,edge:`#8fa3b8`,envMapIntensity:.9}},qt={ink:`#16181b`,accent:`#f0532d`,ghostOpacity:.1,ghostEdge:2.4,ghostDesat:.85,ghostInk:.35,rim:.75,focusTint:.14,outline:1.5,capWhite:.82,hatchWhite:.55,hatchShare:.024,glass:{color:`#eef3f6`,opacity:.07,roughness:.14,edge:`#7f8b94`,envMapIntensity:.9}},$={...de()===`light`?qt:Kt};ue(e=>Object.assign($,e===`light`?qt:Kt));function Jt(e,t){let n={r:0,g:0,b:0};return new A(e).getRGB(n,s),new A().setRGB(n.r+(1-n.r)*t,n.g+(1-n.g)*t,n.b+(1-n.b)*t,s)}function Yt(e){return{fxInk:{value:new A($.ink)},fxAccent:{value:new A(e)},fxRim:{value:$.rim},fxTint:{value:$.focusTint},fxGhostEdge:{value:$.ghostEdge},fxDesat:{value:$.ghostDesat},fxGhostInk:{value:$.ghostInk},fxCap:{value:Jt(e,$.capWhite)},fxHatch:{value:Jt(e,$.hatchWhite)},fxHatchDir:{value:new f(1,0,0)},fxHatchStep:{value:.005},fxGlassEdge:{value:new A($.glass.edge)}}}var Xt=(e,t,n)=>e.includes(t)?e.replace(t,`${t}\n${n}`):e,Zt=(e,t)=>Xt(e,`#include <common>`,t),Qt=`( isOrthographic ? vec3( 0.0, 0.0, 1.0 ) : normalize( vViewPosition ) )`,$t=`vec3( 0.2126, 0.7152, 0.0722 )`,en=e=>e.fragmentShader.includes(`#include <normal_fragment_begin>`)&&e.fragmentShader.includes(`vViewPosition`),tn={key:`ghost`,apply(e,t){e.uniforms.fxInk=t.fxInk,e.uniforms.fxGhostEdge=t.fxGhostEdge,e.uniforms.fxDesat=t.fxDesat,e.uniforms.fxGhostInk=t.fxGhostInk,e.fragmentShader=Zt(e.fragmentShader,`uniform vec3 fxInk;
uniform float fxGhostEdge;
uniform float fxDesat;
uniform float fxGhostInk;`);let n=`gl_FragColor.rgb = mix( gl_FragColor.rgb, vec3( dot( gl_FragColor.rgb, ${$t} ) ), fxDesat );`,r=en(e)?`{
  float fxEdge = pow( clamp( 1.0 - abs( dot( normal, ${Qt} ) ), 0.0, 1.0 ), 2.0 );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fxInk, fxGhostInk + fxEdge * ( 0.85 - fxGhostInk ) );
  // relative boost, so the ghost of an already see-through part stays see-through at its edges
  gl_FragColor.a = clamp( gl_FragColor.a * ( 1.0 + fxEdge * fxGhostEdge ), 0.0, 1.0 );
}`:`gl_FragColor.rgb = mix( gl_FragColor.rgb, fxInk, fxGhostInk );`;e.fragmentShader=Xt(e.fragmentShader,`#include <opaque_fragment>`,`${n}\n${r}`)}},nn={key:`rim`,apply(e,t){en(e)&&(e.uniforms.fxAccent=t.fxAccent,e.uniforms.fxRim=t.fxRim,e.uniforms.fxTint=t.fxTint,e.fragmentShader=Zt(e.fragmentShader,`uniform vec3 fxAccent;
uniform float fxRim;
uniform float fxTint;`),e.fragmentShader=Xt(e.fragmentShader,`#include <opaque_fragment>`,`#ifdef DOUBLE_SIDED
bool fxFace = gl_FrontFacing;
#else
bool fxFace = true;
#endif
if ( fxFace ) {
  float fxG = clamp( 1.0 - abs( dot( normal, ${Qt} ) ), 0.0, 1.0 );
  float fxL = clamp( dot( gl_FragColor.rgb, ${$t} ), 0.0, 1.0 );
  // 1 on near-black surfaces, 0 from mid grey up
  float fxDark = 1.0 - smoothstep( 0.04, 0.25, fxL );
  float fxF = smoothstep( mix( 0.4, 0.7, fxDark ), 1.0, fxG );
  // a warm wash that follows the lit brightness (white parts turn faintly warm, dark parts keep their colour)
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fxAccent * ( 0.3 + 0.8 * fxL ), fxTint * fxL );
  // the rim proper: plain accent on faces turned away from the camera, never brighter than the accent itself
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fxAccent * 0.9, clamp( fxRim * fxF * ( 1.0 - 0.4 * fxDark ), 0.0, 1.0 ) );
}`))}},rn={key:`cap`,apply(e,t){e.uniforms.fxCap=t.fxCap,e.uniforms.fxHatch=t.fxHatch,e.uniforms.fxHatchDir=t.fxHatchDir,e.uniforms.fxHatchStep=t.fxHatchStep,e.vertexShader=Zt(e.vertexShader,`varying vec3 vFxWorld;`),e.vertexShader=Xt(e.vertexShader,`#include <project_vertex>`,`vec4 fxWp = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  fxWp = batchingMatrix * fxWp;
#endif
#ifdef USE_INSTANCING
  fxWp = instanceMatrix * fxWp;
#endif
vFxWorld = ( modelMatrix * fxWp ).xyz;`),e.fragmentShader=Zt(e.fragmentShader,`varying vec3 vFxWorld;
uniform vec3 fxCap;
uniform vec3 fxHatch;
uniform vec3 fxHatchDir;
uniform float fxHatchStep;`),e.fragmentShader=Xt(e.fragmentShader,`#include <opaque_fragment>`,`#if NUM_CLIPPING_PLANES > 0
  if ( ! gl_FrontFacing ) {
    vec4 fxPl = clippingPlanes[ NUM_CLIPPING_PLANES - 1 ];
    vec3 fxP = - vClipPosition;
    float fxDen = dot( fxPl.xyz, fxP );
    float fxT = abs( fxDen ) > 1e-9 ? - fxPl.w / fxDen : - 1.0;
    if ( fxT <= 0.0 || fxT > 1.0001 ) discard;
    vec3 fxW = mix( cameraPosition, vFxWorld, fxT );
    float fxH = dot( fxW, fxHatchDir ) / fxHatchStep;
    float fxPix = max( fwidth( fxH ), 1e-5 );
    float fxLine = 1.0 - smoothstep( 0.0, fxPix, abs( fract( fxH ) - 0.5 ) );
    fxLine *= 1.0 - smoothstep( 0.16, 0.34, fxPix );
    gl_FragColor = vec4( mix( fxCap, fxHatch, fxLine ), 1.0 );
  }
#endif`)}},an={key:`hollow`,apply(e){e.fragmentShader=Xt(e.fragmentShader,`#include <opaque_fragment>`,`if ( ! gl_FrontFacing ) gl_FragColor.rgb *= 0.72;`)}},on={key:`glass`,apply(e,t){en(e)&&e.fragmentShader.includes(`totalSpecular`)&&(e.uniforms.fxGlassEdge=t.fxGlassEdge,e.fragmentShader=Zt(e.fragmentShader,`uniform vec3 fxGlassEdge;`),e.fragmentShader=Xt(e.fragmentShader,`#include <opaque_fragment>`,`{
  float fxF = pow( clamp( 1.0 - abs( dot( normal, ${Qt} ) ), 0.0, 1.0 ), 3.0 );
  float fxS = clamp( dot( totalSpecular, ${$t} ), 0.0, 1.0 );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fxGlassEdge, fxF * 0.55 );
  gl_FragColor.a = clamp( diffuseColor.a + fxF * 0.5 + fxS * 0.7, 0.0, 1.0 );
}`))}};function sn(e,t,n,r){if(n.length===0)return;let i=t.onBeforeCompile,a=i!==ie.prototype.onBeforeCompile,o=a?t.customProgramCacheKey():``,s=`fx:${n.map(e=>e.key).join(`+`)}${o?`|${o}`:``}`;e.onBeforeCompile=(t,o)=>{a&&i.call(e,t,o);for(let e of n)e.apply(t,r)},e.customProgramCacheKey=()=>s}var cn=e=>e===`glass`?1:e===`section`?2:0,ln=e=>e.isMesh===!0||e.isLine===!0||e.isPoints===!0,un=e=>e.type.startsWith(`Mesh`);function dn(e){if(!Array.isArray(e))return!e.transparent;for(let t=0;t<e.length;t++)if(e[t].transparent)return!1;return!0}var fn=e=>e.isShaderMaterial===!0||e.isNodeMaterial===!0;function pn(e,t,n){for(let r=e;r;r=r===t?null:r.parent)if(n in r.userData)return r.userData[n]}var mn=class{ctx;slots=[];slotOf=new Map;plane=new W(new f(0,0,-1),0);uniforms;cut=0;users=0;dirty=!0;version=0;onChange=new Set;notified=-1;lastFrame=-1;lastToken=void 0;meta=new Map;cache=new Map;glass=null;glassFocus=null;warm=null;warmed=new Set;constructor(e){this.ctx=e;let t=e.model.root;this.uniforms=Yt(e.def.accent??$.accent),t.traverse(e=>{if(!ln(e)||!e.material||pn(e,t,`fx`)===!1)return;let n=!!pn(e,t,`shell`),r=e.isMesh===!0&&(n||!!pn(e,t,`glass`)),i=pn(e,t,`cap`),a={obj:e,original:e.material,assigned:e.material,variants:null,iso:0,glassy:r,capStyle:i===!0?`cap`:i===!1||n?`hollow`:`cap`,castSaved:null,receiveSaved:null};this.slots.push(a),this.slotOf.set(e,a)})}slotsUnder(e){let t=new Set;for(let n of e)n.traverse(e=>{let n=this.slotOf.get(e);n&&t.add(n)});return t}apply(e){let t=this.ctx.renderer.info?.render.frame;if(t!==void 0&&e!==void 0&&t===this.lastFrame&&e===this.lastToken&&!this.dirty)return;this.lastFrame=t??-1,this.lastToken=e,this.dirty&&this.version++,this.dirty=!1;let n=this.cut;for(let e=0;e<this.slots.length;e++){let t=this.slots[e],r=t.obj;r.material!==t.assigned&&(t.original=r.material,t.variants=null);let i=t.iso*3+n,a=t.original;i!==0&&(t.variants||=this.variantsFor(t),a=t.variants[i]),r.material!==a&&(r.material=a,this.version++),t.assigned=a,t.iso===1||n===1&&t.glassy?t.castSaved===null&&(t.castSaved=r.castShadow,r.castShadow=!1):t.castSaved!==null&&(r.castShadow=t.castSaved,t.castSaved=null),t.iso===1?t.receiveSaved===null&&(t.receiveSaved=r.receiveShadow,r.receiveShadow=!1):t.receiveSaved!==null&&(r.receiveShadow=t.receiveSaved,t.receiveSaved=null),a!==t.original&&this.sync(a)}if(this.version!==this.notified){this.notified=this.version;for(let e of this.onChange)e()}}prewarm(e){let t=[];for(let n of[0,1,2])for(let r of new Set([`solid`,...e]))t.push(n*3+cn(r));this.warm||(this.warm=new g,this.warm.name=`fx-warm`,this.warm.visible=!1,this.warm.userData.fxHelper=!0,this.ctx.scene.add(this.warm));for(let e of this.slots){e.variants||=this.variantsFor(e);for(let n of t){let t=e.variants[n];for(let r of Array.isArray(t)?t:[t]){if(this.warmed.has(r)||(Array.isArray(e.original)?e.original.includes(r):r===e.original))continue;this.warmed.add(r);let t=hn(e.obj,r,Math.floor(n/3)!==1&&e.obj.receiveShadow);t&&this.warm.add(t)}}}}dispose(){for(let e of this.slots)e.obj.material=e.original,e.castSaved!==null&&(e.obj.castShadow=e.castSaved),e.receiveSaved!==null&&(e.obj.receiveShadow=e.receiveSaved),e.castSaved=null,e.receiveSaved=null,e.assigned=e.original,e.variants=null,e.iso=0;for(let e of this.meta.keys())e.dispose();this.glass?.dispose(),this.glassFocus?.dispose(),this.meta.clear(),this.cache.clear(),this.onChange.clear(),this.warmed.clear(),this.warm&&=(this.warm.removeFromParent(),this.warm.traverse(e=>e.isInstancedMesh&&e.dispose()),null)}variantsFor(e){let t=e.original,n=e=>Array.isArray(t)?t.map(e):e(t),r=n(t=>this.variant(t,!0,!1,!1,e.capStyle)),i=n(t=>this.variant(t,!1,!0,!1,e.capStyle));return[t,e.glassy?this.glassMat(!1):t,n(t=>this.variant(t,!1,!1,!0,e.capStyle)),r,r,n(t=>this.variant(t,!0,!1,!0,e.capStyle)),i,e.glassy?this.glassMat(!0):i,n(t=>this.variant(t,!1,!0,!0,e.capStyle))]}variant(e,t,n,r,i){if(fn(e))return e;let a=un(e)&&`emissive`in e,o=n&&a,s=r&&!t&&un(e)&&e.side===0&&!e.transparent?i:null;if(!t&&!o&&!r)return e;let c=`${t?`g`:``}${o?`r`:``}${r?`s${s??``}`:``}`,l=this.cache.get(e);l||this.cache.set(e,l=new Map);let u=l.get(c);if(u)return u;let d=e.clone();d.name=`${e.name||e.type}·${c}`;let f=[];return t&&(d.transparent=!0,d.depthWrite=!1,d.opacity=e.opacity*$.ghostOpacity,d.userData.fxGhost=!0,f.push(tn)),o&&f.push(nn),r&&(d.clippingPlanes=[this.plane],d.clipShadows=!0,d.userData.fxSection=!0,s&&(d.side=2,f.push(s===`cap`?rn:an))),sn(d,e,f,this.uniforms),this.meta.set(d,{src:e,ghost:t}),l.set(c,d),d}glassMat(e){if(!this.glass){let e=new V({color:$.glass.color,roughness:$.glass.roughness,metalness:0,transparent:!0,opacity:$.glass.opacity,depthWrite:!1,side:2,envMapIntensity:$.glass.envMapIntensity});e.name=`fx-glass`,e.userData.fxGlass=!0,sn(e,e,[on],this.uniforms),this.glass=e}if(!e)return this.glass;if(!this.glassFocus){let e=this.glass.clone();e.name=`fx-glass·r`,sn(e,e,[on,nn],this.uniforms),this.glassFocus=e}return this.glassFocus}sync(e){if(Array.isArray(e))for(let t=0;t<e.length;t++)this.syncOne(e[t]);else this.syncOne(e)}syncOne(e){let t=this.meta.get(e);if(!t)return;let n=t.src,r=e;n.color&&r.color&&r.color.copy(n.color),n.emissive&&r.emissive&&r.emissive.copy(n.emissive),n.emissiveIntensity!==void 0&&(r.emissiveIntensity=n.emissiveIntensity),n.roughness!==void 0&&(r.roughness=n.roughness),n.metalness!==void 0&&(r.metalness=n.metalness),e.visible=n.visible,t.ghost?e.opacity=n.opacity*$.ghostOpacity:(e.opacity=n.opacity,e.transparent!==n.transparent&&(e.transparent=n.transparent,e.needsUpdate=!0,this.version++))}};function hn(e,t,n){let r;if(e.isSkinnedMesh)return null;if(e.isInstancedMesh){let n=e,i=new x(n.geometry,t,1);n.instanceColor&&(i.instanceColor=n.instanceColor),r=i}else r=e.isMesh?new P(e.geometry,t):e.isLine?new T(e.geometry,t):new U(e.geometry,t);return r.receiveShadow=n,r.matrixAutoUpdate=!1,r.frustumCulled=!1,r.userData.fxHelper=!0,r}var gn=new WeakMap;function _n(e){let t=gn.get(e.model.root);return t||(t=new mn(e),gn.set(e.model.root,t)),t.users++,t}function vn(e){e.users--,e.users>0||(e.dispose(),gn.delete(e.ctx.model.root))}function yn(e){let t=e.getAttribute(`position`);if(!t||t.itemSize!==3)return null;let n=t.count,r=e.getIndex(),i=r?r.count:n,a=new Map,o=new Int32Array(n),s=0;for(let e=0;e<n;e++){let n=`${Math.round(t.getX(e)*1e5)},${Math.round(t.getY(e)*1e5)},${Math.round(t.getZ(e)*1e5)}`,r=a.get(n);r===void 0&&a.set(n,r=s++),o[e]=r}let c=new Float32Array(s*3),l=[new f,new f,new f],u=new f,d=new f,p=new f;for(let e=0;e+2<i;e+=3){let n=[r?r.getX(e):e,r?r.getX(e+1):e+1,r?r.getX(e+2):e+2];for(let e=0;e<3;e++)l[e].fromBufferAttribute(t,n[e]);if(u.subVectors(l[1],l[0]).cross(d.subVectors(l[2],l[0])),!(u.lengthSq()<1e-30)){u.normalize();for(let e=0;e<3;e++){d.subVectors(l[(e+1)%3],l[e]),p.subVectors(l[(e+2)%3],l[e]);let t=d.angleTo(p),r=o[n[e]]*3;c[r]=c[r]+u.x*t,c[r+1]=c[r+1]+u.y*t,c[r+2]=c[r+2]+u.z*t}}}let m=new f,h=new Float32Array(n*3);for(let e=0;e<n;e++){let t=o[e]*3;m.set(c[t],c[t+1],c[t+2]),m.lengthSq()<1e-30?m.set(0,0,0):m.normalize(),h[e*3]=m.x,h[e*3+1]=m.y,h[e*3+2]=m.z}return h}function bn(e){let t=e;return!t.isMesh||t.isSkinnedMesh||t.isInstancedMesh||!t.geometry||Object.keys(t.geometry.morphAttributes).length>0?!1:(Array.isArray(t.material)?t.material:[t.material]).every(e=>e&&e.side===0&&!e.transparent&&!e.isShaderMaterial)}var xn=class{widthCss;material;res={value:new R(1,1)};width;hulls=new Map;geos=new Map;size=new R;constructor(e,t){this.widthCss=t,this.width={value:t};let n=new O({color:e,side:1,toneMapped:!1,fog:!1});n.polygonOffset=!0,n.polygonOffsetFactor=2,n.polygonOffsetUnits=4,n.name=`fx-outline`,n.userData.fxOutline=!0,n.onBeforeCompile=e=>{e.uniforms.fxRes=this.res,e.uniforms.fxWidth=this.width,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute vec3 fxNormal;
uniform vec2 fxRes;
uniform float fxWidth;`),e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`#include <project_vertex>
{
  vec2 fxD = ( projectionMatrix * vec4( normalMatrix * fxNormal, 0.0 ) ).xy;
  float fxL = length( fxD );
  if ( fxL > 1e-6 ) gl_Position.xy += ( fxD / fxL ) * ( 2.0 * fxWidth / fxRes ) * gl_Position.w;
}`)},n.customProgramCacheKey=()=>`fx-outline`,this.material=n}build(e){for(let t of e){if(this.hulls.has(t)||!bn(t))continue;let e=this.hullGeometry(t.geometry);if(!e)continue;let n=new P(e,this.material);n.name=`fx-outline`,n.visible=!1,n.castShadow=n.receiveShadow=!1,n.frustumCulled=t.frustumCulled,n.raycast=()=>{},n.userData.fx=!1,n.userData.fxHelper=!0,t.add(n),this.hulls.set(t,n)}}show(e,t){let n=this.hulls.get(e);n&&(n.visible=t)}update(e,t){e.getDrawingBufferSize(this.size),this.res.value.set(Math.max(1,this.size.x),Math.max(1,this.size.y)),this.width.value=this.widthCss*e.getPixelRatio();let n=t!==null;n!==(this.material.clippingPlanes!==null&&this.material.clippingPlanes.length>0)&&(this.material.clippingPlanes=n?[t]:null)}dispose(){for(let e of this.hulls.values())e.removeFromParent();this.hulls.clear();for(let e of this.geos.values())e?.dispose();this.geos.clear(),this.material.dispose()}hullGeometry(e){if(this.geos.has(e))return this.geos.get(e);let t=yn(e),n=null;return t&&(n=new I,n.setAttribute(`position`,e.getAttribute(`position`)),n.setAttribute(`fxNormal`,new D(t,3)),e.getIndex()&&n.setIndex(e.getIndex()),n.setDrawRange(e.drawRange.start,e.drawRange.count),n.boundingSphere=e.boundingSphere,n.boundingBox=e.boundingBox,n.boundingSphere||n.computeBoundingSphere()),this.geos.set(e,n),n}};function Sn(){let e=null,t=null,n=null,r=new Map,i=null,a=!0;function o(n){let i=r.get(n);return i||(i=t.slotsUnder(e.model.assemblies[n]??[]),r.set(n,i)),i}function s(e){let n=t.slots,r=e===null?null:o(e);for(let e=0;e<n.length;e++){let t=n[e];t.iso=r===null?0:r.has(t)?2:1}t.dirty=!0,i=e}function c(){if(!t||!n||!e)return;let r=t.cut===2,i=t.slots;for(let e=0;e<i.length;e++){let t=i[e],a=t.iso===2&&dn(t.assigned)&&!(r&&t.capStyle===`hollow`);n.show(t.obj,a)}n.update(e.renderer,r?t.plane:null)}function l(){t&&(s(null),t.apply(),t.onChange.delete(c),vn(t)),n?.dispose(),n=null,t=null,e=null,r.clear(),i=null,a=!0}return{mount(o){e&&l(),e=o,t=_n(o),n=new xn(new A(o.def.accent??$.accent),$.outline),n.build(t.slots.map(e=>e.obj)),t.onChange.add(c),r.clear(),i=null,a=!0,t.prewarm(o.def.cuts??[`solid`])},update(r){if(!e||!t)return;let o=r.isolate!==null&&e.model.assemblies[r.isolate]?r.isolate:null,c=o!==i;c&&s(o),o!==null&&n?.update(e.renderer,t.cut===2?t.plane:null),(c||o!==null||!a)&&t.apply(r),a=o===null},dispose(){l()}}}var Cn=new f(0,1,0),wn=new f(1,0,0);function Tn(e,t,n,r){return n.setFromMatrixPosition(e),r.setFromMatrixColumn(e,2),r.lengthSq()<1e-18&&r.set(0,0,1),r.normalize().negate(),t.setFromNormalAndCoplanarPoint(r,n)}function En(e,t,n){let r=t.x-e.x,i=t.z-e.z;return Math.abs(r)<1e-9&&Math.abs(i)<1e-9?n.set(0,0,-1):Math.abs(r)>Math.abs(i)?n.set(-Math.sign(r),0,0):n.set(0,0,-Math.sign(i))}function Dn(e,t,n){return n.crossVectors(e,Math.abs(e.dot(Cn))>.95?wn:Cn),n.lengthSq()<1e-18&&n.set(1,0,0),n.normalize(),t.crossVectors(e,n).normalize(),t.add(n).normalize()}function On(){let e=null,t=null,n=`solid`,r=!1,a=!1,o=new f,s=new f,c=new f,l=new f,u=new f,d=new i,p=new z,m=new f(0,0,-1);function h(e){e.model.root.updateWorldMatrix(!0,!0),p.setFromObject(e.model.root),p.isEmpty()?(o.setFromMatrixPosition(e.model.root.matrixWorld),d.radius=.2):(p.getBoundingSphere(d),o.copy(d.center))}function g(e,t){let n=e.model.anchors.section;n?(n.updateWorldMatrix(!0,!1),Tn(n.matrixWorld,t.plane,c,l)):(a||=(e.camera.updateMatrixWorld(),En(o,s.setFromMatrixPosition(e.camera.matrixWorld),m),!0),t.plane.setFromNormalAndCoplanarPoint(m,o)),Dn(t.plane.normal,t.uniforms.fxHatchDir.value,u)}return{get mode(){return n},mount(i){e&&this.dispose(),e=i,t=_n(i),r=i.renderer.localClippingEnabled,i.renderer.localClippingEnabled=!0,h(i),t.uniforms.fxHatchStep.value=Math.max(1e-4,d.radius*$.hatchShare),t.prewarm(i.def.cuts??[`solid`]),n=`solid`,a=!1},update(r){if(!e||!t)return;let i=r.cut===`glass`||r.cut===`section`?r.cut:`solid`,o=i!==n;n=i,t.cut=cn(n),o&&(t.dirty=!0);let s=e.clippingPlanes;if(n===`section`)g(e,t),s.includes(t.plane)||s.push(t.plane);else{a=!1;let e=s.indexOf(t.plane);e>=0&&s.splice(e,1)}(o||t.cut!==0)&&t.apply(r)},dispose(){if(e&&t){t.cut=0,t.dirty=!0,t.apply();let n=e.clippingPlanes.indexOf(t.plane);n>=0&&e.clippingPlanes.splice(n,1),e.renderer.localClippingEnabled=r,vn(t)}t=null,e=null,n=`solid`,a=!1}}}var kn=e({assemble:()=>An});async function An(e,t,n={}){let{warm:r=!0,onWarm:i,...a}=n,o=Gt(e,a),s=[oe(),Sn(),On()];for(let e of s)o.use(e);let c;try{c=await t.build()}catch(e){throw o.dispose(),e}return o.mount(c,t),r&&await o.warm(i),{stage:o,model:c,effects:s,dispose(){o.dispose(),c.dispose()}}}export{ke as a,yn as i,kn as n,Ee as o,xn as r,Te as s,An as t};