import{c as e,d as t,h as n,o as r,s as i,u as a}from"./dist-CwlN6XwQ.js";import{n as o,t as s}from"./AcademicLayout-DLCriKwW.js";import{a as c,c as l,d as u,f as d,i as f,l as p,m,n as h,o as g,p as _,r as v,s as y,t as b,u as x}from"./eval-guard-report-9yGdGa-h.js";var S=t(((e,t)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,r={},i={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/\u00a0/g,` `)},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,`__id`,{value:++n}),e.__id},clone:function e(t,n){n||={};var r,a;switch(i.util.type(t)){case`Object`:if(a=i.util.objId(t),n[a])return n[a];for(var o in r={},n[a]=r,t)t.hasOwnProperty(o)&&(r[o]=e(t[o],n));return r;case`Array`:return a=i.util.objId(t),n[a]?n[a]:(r=[],n[a]=r,t.forEach(function(t,i){r[i]=e(t,n)}),r);default:return t}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return`none`},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,`gi`),``),e.classList.add(`language-`+n)},currentScript:function(){if(typeof document>`u`)return null;if(document.currentScript&&document.currentScript.tagName===`SCRIPT`)return document.currentScript;try{throw Error()}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var t=document.getElementsByTagName(`script`);for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var r=`no-`+t;e;){var i=e.classList;if(i.contains(t))return!0;if(i.contains(r))return!1;e=e.parentElement}return!!n}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,t){var n=i.util.clone(i.languages[e]);for(var r in t)n[r]=t[r];return n},insertBefore:function(e,t,n,r){r||=i.languages;var a=r[e],o={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var c in n)n.hasOwnProperty(c)&&(o[c]=n[c]);n.hasOwnProperty(s)||(o[s]=a[s])}var l=r[e];return r[e]=o,i.languages.DFS(i.languages,function(t,n){n===l&&t!=e&&(this[t]=o)}),o},DFS:function e(t,n,r,a){a||={};var o=i.util.objId;for(var s in t)if(t.hasOwnProperty(s)){n.call(t,s,t[s],r||s);var c=t[s],l=i.util.type(c);l===`Object`&&!a[o(c)]?(a[o(c)]=!0,e(c,n,null,a)):l===`Array`&&!a[o(c)]&&(a[o(c)]=!0,e(c,n,s,a))}}},plugins:{},highlightAll:function(e,t){i.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var r={callback:n,container:e,selector:`code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code`};i.hooks.run(`before-highlightall`,r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),i.hooks.run(`before-all-elements-highlight`,r);for(var a=0,o;o=r.elements[a++];)i.highlightElement(o,t===!0,r.callback)},highlightElement:function(t,n,r){var a=i.util.getLanguage(t),o=i.languages[a];i.util.setLanguage(t,a);var s=t.parentElement;s&&s.nodeName.toLowerCase()===`pre`&&i.util.setLanguage(s,a);var c={element:t,language:a,grammar:o,code:t.textContent};function l(e){c.highlightedCode=e,i.hooks.run(`before-insert`,c),c.element.innerHTML=c.highlightedCode,i.hooks.run(`after-highlight`,c),i.hooks.run(`complete`,c),r&&r.call(c.element)}if(i.hooks.run(`before-sanity-check`,c),s=c.element.parentElement,s&&s.nodeName.toLowerCase()===`pre`&&!s.hasAttribute(`tabindex`)&&s.setAttribute(`tabindex`,`0`),!c.code){i.hooks.run(`complete`,c),r&&r.call(c.element);return}if(i.hooks.run(`before-highlight`,c),!c.grammar){l(i.util.encode(c.code));return}if(n&&e.Worker){var u=new Worker(i.filename);u.onmessage=function(e){l(e.data)},u.postMessage(JSON.stringify({language:c.language,code:c.code,immediateClose:!0}))}else l(i.highlight(c.code,c.grammar,c.language))},highlight:function(e,t,n){var r={code:e,grammar:t,language:n};if(i.hooks.run(`before-tokenize`,r),!r.grammar)throw Error(`The language "`+r.language+`" has no grammar.`);return r.tokens=i.tokenize(r.code,r.grammar),i.hooks.run(`after-tokenize`,r),a.stringify(i.util.encode(r.tokens),r.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var r in n)t[r]=n[r];delete t.rest}var i=new c;return l(i,i.head,e),s(e,i,t,i.head,0),d(i)},hooks:{all:{},add:function(e,t){var n=i.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=i.hooks.all[e];if(!(!n||!n.length))for(var r=0,a;a=n[r++];)a(t)}},Token:a};e.Prism=i;function a(e,t,n,r){this.type=e,this.content=t,this.alias=n,this.length=(r||``).length|0}a.stringify=function e(t,n){if(typeof t==`string`)return t;if(Array.isArray(t)){var r=``;return t.forEach(function(t){r+=e(t,n)}),r}var a={type:t.type,content:e(t.content,n),tag:`span`,classes:[`token`,t.type],attributes:{},language:n},o=t.alias;o&&(Array.isArray(o)?Array.prototype.push.apply(a.classes,o):a.classes.push(o)),i.hooks.run(`wrap`,a);var s=``;for(var c in a.attributes)s+=` `+c+`="`+(a.attributes[c]||``).replace(/"/g,`&quot;`)+`"`;return`<`+a.tag+` class="`+a.classes.join(` `)+`"`+s+`>`+a.content+`</`+a.tag+`>`};function o(e,t,n,r){e.lastIndex=t;var i=e.exec(n);if(i&&r&&i[1]){var a=i[1].length;i.index+=a,i[0]=i[0].slice(a)}return i}function s(e,t,n,r,c,d){for(var f in n)if(!(!n.hasOwnProperty(f)||!n[f])){var p=n[f];p=Array.isArray(p)?p:[p];for(var m=0;m<p.length;++m){if(d&&d.cause==f+`,`+m)return;var h=p[m],g=h.inside,_=!!h.lookbehind,v=!!h.greedy,y=h.alias;if(v&&!h.pattern.global){var b=h.pattern.toString().match(/[imsuy]*$/)[0];h.pattern=RegExp(h.pattern.source,b+`g`)}for(var x=h.pattern||h,S=r.next,C=c;S!==t.tail&&!(d&&C>=d.reach);C+=S.value.length,S=S.next){var w=S.value;if(t.length>e.length)return;if(!(w instanceof a)){var T=1,E;if(v){if(E=o(x,C,e,_),!E||E.index>=e.length)break;var D=E.index,O=E.index+E[0].length,k=C;for(k+=S.value.length;D>=k;)S=S.next,k+=S.value.length;if(k-=S.value.length,C=k,S.value instanceof a)continue;for(var A=S;A!==t.tail&&(k<O||typeof A.value==`string`);A=A.next)T++,k+=A.value.length;T--,w=e.slice(C,k),E.index-=C}else if(E=o(x,0,w,_),!E)continue;var D=E.index,j=E[0],M=w.slice(0,D),N=w.slice(D+j.length),P=C+w.length;d&&P>d.reach&&(d.reach=P);var F=S.prev;M&&(F=l(t,F,M),C+=M.length),u(t,F,T);var I=new a(f,g?i.tokenize(j,g):j,y,j);if(S=l(t,F,I),N&&l(t,S,N),T>1){var L={cause:f+`,`+m,reach:P};s(e,t,n,S.prev,C,L),d&&L.reach>d.reach&&(d.reach=L.reach)}}}}}}function c(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function l(e,t,n){var r=t.next,i={value:n,prev:t,next:r};return t.next=i,r.prev=i,e.length++,i}function u(e,t,n){for(var r=t.next,i=0;i<n&&r!==e.tail;i++)r=r.next;t.next=r,r.prev=t,e.length-=i}function d(e){for(var t=[],n=e.head.next;n!==e.tail;)t.push(n.value),n=n.next;return t}if(!e.document)return e.addEventListener&&(i.disableWorkerMessageHandler||e.addEventListener(`message`,function(t){var n=JSON.parse(t.data),r=n.language,a=n.code,o=n.immediateClose;e.postMessage(i.highlight(a,i.languages[r],r)),o&&e.close()},!1)),i;var f=i.util.currentScript();f&&(i.filename=f.src,f.hasAttribute(`data-manual`)&&(i.manual=!0));function p(){i.manual||i.highlightAll()}if(!i.manual){var m=document.readyState;m===`loading`||m===`interactive`&&f&&f.defer?document.addEventListener(`DOMContentLoaded`,p):window.requestAnimationFrame?window.requestAnimationFrame(p):window.setTimeout(p,16)}return i}(typeof window<`u`?window:typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope?self:{});t!==void 0&&t.exports&&(t.exports=n),typeof global<`u`&&(global.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside[`attr-value`].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside[`internal-subset`].inside=n.languages.markup,n.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(n.languages.markup.tag,`addInlined`,{value:function(e,t){var r={};r[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i[`language-`+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var a={};a[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:i},n.languages.insertBefore(`markup`,`cdata`,a)}}),Object.defineProperty(n.languages.markup.tag,`addAttribute`,{value:function(e,t){n.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend(`markup`,{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,(function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|`+t.source+`)*?(?:;|(?=\\s*\\{))`),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:`selector`},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp(`\\burl\\((?:`+t.source+`|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`,`i`),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp(`^`+t.source+`$`),alias:`url`}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+t.source+`)*(?=\\s*\\{)`),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined(`style`,`css`),n.tag.addAttribute(`style`,`css`))})(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend(`clike`,{"class-name":[n.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),n.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),n.languages.markup&&(n.languages.markup.tag.addInlined(`script`,`javascript`),n.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),n.languages.js=n.languages.javascript,(function(){if(n===void 0||typeof document>`u`)return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e=`Loading…`,t=function(e,t){return`✖ Error `+e+` while fetching file: `+t},r=`✖ Error: File does not exist or is empty`,i={js:`javascript`,py:`python`,rb:`ruby`,ps1:`powershell`,psm1:`powershell`,sh:`bash`,bat:`batch`,h:`c`,tex:`latex`},a=`data-src-status`,o=`loading`,s=`loaded`,c=`failed`,l=`pre[data-src]:not([`+a+`="`+s+`"]):not([`+a+`="`+o+`"])`;function u(e,n,i){var a=new XMLHttpRequest;a.open(`GET`,e,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?n(a.responseText):a.status>=400?i(t(a.status,a.statusText)):i(r))},a.send(null)}function d(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||``);if(t){var n=Number(t[1]),r=t[2],i=t[3];return r?i?[n,Number(i)]:[n,void 0]:[n,n]}}n.hooks.add(`before-highlightall`,function(e){e.selector+=`, `+l}),n.hooks.add(`before-sanity-check`,function(t){var r=t.element;if(r.matches(l)){t.code=``,r.setAttribute(a,o);var f=r.appendChild(document.createElement(`CODE`));f.textContent=e;var p=r.getAttribute(`data-src`),m=t.language;if(m===`none`){var h=(/\.(\w+)$/.exec(p)||[,`none`])[1];m=i[h]||h}n.util.setLanguage(f,m),n.util.setLanguage(r,m);var g=n.plugins.autoloader;g&&g.loadLanguages(m),u(p,function(e){r.setAttribute(a,s);var t=d(r.getAttribute(`data-range`));if(t){var i=e.split(/\r\n?|\n/g),o=t[0],c=t[1]==null?i.length:t[1];o<0&&(o+=i.length),o=Math.max(0,Math.min(o-1,i.length)),c<0&&(c+=i.length),c=Math.max(0,Math.min(c,i.length)),e=i.slice(o,c).join(`
`),r.hasAttribute(`data-start`)||r.setAttribute(`data-start`,String(o+1))}f.textContent=e,n.highlightElement(f)},function(e){r.setAttribute(a,c),f.textContent=e})}}),n.plugins.fileHighlight={highlight:function(e){for(var t=(e||document).querySelectorAll(l),r=0,i;i=t[r++];)n.highlightElement(i)}};var f=!1;n.fileHighlight=function(){f||=(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}})()})),C=n(a(),1),w=n(S(),1);Prism.languages.python={comment:{pattern:/(^|[^\\])#.*/,lookbehind:!0,greedy:!0},"string-interpolation":{pattern:/(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,greedy:!0,inside:{interpolation:{pattern:/((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,lookbehind:!0,inside:{"format-spec":{pattern:/(:)[^:(){}]+(?=\}$)/,lookbehind:!0},"conversion-option":{pattern:/![sra](?=[:}]$)/,alias:`punctuation`},rest:null}},string:/[\s\S]+/}},"triple-quoted-string":{pattern:/(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,greedy:!0,alias:`string`},string:{pattern:/(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,greedy:!0},function:{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)\w+/i,lookbehind:!0},decorator:{pattern:/(^[\t ]*)@\w+(?:\.\w+)*/m,lookbehind:!0,alias:[`annotation`,`punctuation`],inside:{punctuation:/\./}},keyword:/\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,builtin:/\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,boolean:/\b(?:False|None|True)\b/,number:/\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,operator:/[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,punctuation:/[{}[\];(),.:]/},Prism.languages.python[`string-interpolation`].inside.interpolation.inside.rest=Prism.languages.python,Prism.languages.py=Prism.languages.python,(function(e){e.languages.typescript=e.languages.extend(`javascript`,{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript[`literal-property`];var t=e.languages.extend(`typescript`,{});delete t[`class-name`],e.languages.typescript[`class-name`].inside=t,e.languages.insertBefore(`typescript`,`function`,{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:`operator`},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:`class-name`,inside:t}}}}),e.languages.ts=e.languages.typescript})(Prism),(function(e){var t=e.util.clone(e.languages.javascript),n=`(?:\\s|\\/\\/.*(?!.)|\\/\\*(?:[^*]|\\*(?!\\/))\\*\\/)`,r=`(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})`,i=`(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})`;function a(e,t){return e=e.replace(/<S>/g,function(){return n}).replace(/<BRACES>/g,function(){return r}).replace(/<SPREAD>/g,function(){return i}),RegExp(e,t)}i=a(i).source,e.languages.jsx=e.languages.extend(`markup`,t),e.languages.jsx.tag.pattern=a(`<\\/?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:"(?:\\\\[\\s\\S]|[^\\\\"])*"|'(?:\\\\[\\s\\S]|[^\\\\'])*'|[^\\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\\/?)?>`),e.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/,e.languages.jsx.tag.inside[`attr-value`].pattern=/=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,e.languages.jsx.tag.inside.tag.inside[`class-name`]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,e.languages.jsx.tag.inside.comment=t.comment,e.languages.insertBefore(`inside`,`attr-name`,{spread:{pattern:a(`<SPREAD>`),inside:e.languages.jsx}},e.languages.jsx.tag),e.languages.insertBefore(`inside`,`special-attr`,{script:{pattern:a(`=<BRACES>`),alias:`language-javascript`,inside:{"script-punctuation":{pattern:/^=(?=\{)/,alias:`punctuation`},rest:e.languages.jsx}}},e.languages.jsx.tag);var o=function(e){return e?typeof e==`string`?e:typeof e.content==`string`?e.content:e.content.map(o).join(``):``},s=function(t){for(var n=[],r=0;r<t.length;r++){var i=t[r],a=!1;if(typeof i!=`string`&&(i.type===`tag`&&i.content[0]&&i.content[0].type===`tag`?i.content[0].content[0].content===`</`?n.length>0&&n[n.length-1].tagName===o(i.content[0].content[1])&&n.pop():i.content[i.content.length-1].content===`/>`||n.push({tagName:o(i.content[0].content[1]),openedBraces:0}):n.length>0&&i.type===`punctuation`&&i.content===`{`?n[n.length-1].openedBraces++:n.length>0&&n[n.length-1].openedBraces>0&&i.type===`punctuation`&&i.content===`}`?n[n.length-1].openedBraces--:a=!0),(a||typeof i==`string`)&&n.length>0&&n[n.length-1].openedBraces===0){var c=o(i);r<t.length-1&&(typeof t[r+1]==`string`||t[r+1].type===`plain-text`)&&(c+=o(t[r+1]),t.splice(r+1,1)),r>0&&(typeof t[r-1]==`string`||t[r-1].type===`plain-text`)&&(c=o(t[r-1])+c,t.splice(r-1,1),r--),t[r]=new e.Token(`plain-text`,c,null,c)}i.content&&typeof i.content!=`string`&&s(i.content)}};e.hooks.add(`after-tokenize`,function(e){e.language!==`jsx`&&e.language!==`tsx`||s(e.tokens)})})(Prism),Prism.languages.javascript=Prism.languages.extend(`clike`,{"class-name":[Prism.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),Prism.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined(`script`,`javascript`),Prism.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),Prism.languages.js=Prism.languages.javascript;var T=`/assets/vtt-token-formula-Bs0WBYrh.svg`,E=`/assets/vtt-lazy-load-DOdBgSEr.svg`,D=`/assets/vtt-contact-sheet-C6AUWGyV.svg`,O=e(),k={"eval-guard":{title:`EvalGuard v1`,description:`Contamination auditor for LLM evaluations — built as a commercial v1 and positioned for acquisition by eval-infrastructure companies, MLOps platforms, or leaderboard vendors.`,fullDescription:`EvalGuard solves a specific, measurable problem: when a model's training or fine-tuning corpus overlaps with a benchmark, the reported evaluation score is inflated — and right now there is no standard tool to quantify by how much. EvalGuard fills that gap. Given a corpus D and a benchmark B, it produces two defensible numbers: contamination rate ρ (the fraction of benchmark items compromised) and score inflation Δ (the points by which the headline score is overstated). Every detection comes with a full evidence trail showing which matcher fired, the matched span, and the reason — not a black-box judgment.

The target users are teams fine-tuning open-weight models on scraped or semi-public data who need to trust their eval numbers before shipping. The framing is explicitly self-serve and non-adversarial: the corpus stays on-premise, the CLI drops into CI, and the output is an audit report rather than a public indictment. This survives the five standard objections to contamination detection as a product — the wedge is internal trust, not external accusation.

The v1 implementation covers the open-data regime with a four-matcher ensemble (n-gram/MinHash-LSH, TF-IDF, paraphrase, answer-leak), a ground-truth injection harness for rigorous detector evaluation, data-driven per-form calibration, and 34 passing tests. On real data (OpenBookQA × AG News), three of four contamination forms are recovered at precision 1.00 and recall 1.00; the auditor fails conservatively in all conditions — it under-reports, never fabricates.

Positioned for acquisition. The near-term returns are the open benchmark, CLI credibility, and the labeled injection harness — a hard-to-reproduce research artifact that compounds as a moat. Most likely acquirers are eval-infrastructure companies adding a trust layer, MLOps/model-registry platforms needing a promotion-gate check, and leaderboard or data vendors wanting a cleanliness certification. Full technical detail, experimental results, and commercial framing are in the project report linked below.`,technologies:[`Python`,`MinHash-LSH`,`TF-IDF`,`CLI`,`pytest`],github:`https://github.com/shengdynasty/evalguard`,reportUrl:`https://docs.google.com/document/d/1AtuTdvSL2f_m_dmEvNJMM6SG9Dwm2145OunH7kEnN2c/edit?usp=sharing`,image:b},"video-to-text":{title:`Video-to-Text MCP Server`,description:`Token-budgeted MCP server that lets Claude watch video without blowing its context — pixel-cost projection, lazy frame manifests, and contact-sheet montages cut a 10-min clip from ~150k tokens to ~5k.`,fullDescription:`An MCP (Model Context Protocol) server that gives Claude the ability to "watch" video — extracting frames, transcribing audio, and building searchable timelines — while keeping a tight leash on the one thing that makes vision expensive: tokens. Naively feeding a 10-minute clip to a vision model can cost ~150,000 tokens; this server delivers the same understanding for roughly 5,000 by treating token budget as a first-class constraint at every stage of the pipeline.

The core insight is that vision cost is driven by pixels, not file size. Anthropic's vision models price an image at roughly (width × height) / 750 tokens, with the long edge auto-capped at 1568px. A raw 1920×1080 frame costs ~2,765 tokens; the same frame resized to 512×288 costs ~196 — a 14× reduction with no loss of the semantic content a model actually needs. The server exposes estimate_frame_tokens() and compute_affordable_frames() so Claude can project the cost of a request before spending a single token, then resize frames to fit a target dimension via _scale_to_fit().

Seven tools form the pipeline: probe_video (ffprobe metadata), extract_frames (fps-sampled, perceptually deduplicated frame extraction that returns a lightweight JSON manifest — not pixels), get_contact_sheet (tiles N frames into one montage image, ~40% cheaper than sending them individually), get_frames (loads specific frames on demand), transcribe (faster-whisper audio→text with timestamps), build_timeline (merges visual + audio events into a unified searchable timeline), and cleanup (purges the job cache). Frames are written to a per-job cache directory with a 24-hour TTL, so extraction happens once and Claude can inspect, re-inspect, and transcribe without re-decoding the video. Lazy loading means the manifest is cheap to read and pixels are only paid for when explicitly requested.`,technologies:[`Python`,`FastMCP`,`ffmpeg`,`faster-whisper`,`Pillow`],github:`https://github.com/shengdynasty/video-to-text-mcp`,image:h,language:`python`,diagrams:[{src:T,title:`Token Cost Model`,caption:`Vision cost scales with pixels, not file size: tokens ≈ (w × h) / 750. Resizing a 1920×1080 frame to 512×288 turns ~2,765 tokens into ~196 — a 14× saving that drops a 10-minute clip from ~150k to ~5k tokens.`},{src:E,title:`Lazy Loading & Job Lifecycle`,caption:`extract_frames() returns a lightweight JSON manifest — not pixels — written to a per-job cache (~/.cache/video-to-text-mcp/<job_id>/) with a 24h TTL. Pixels are only paid for when get_contact_sheet or get_frames is explicitly called.`},{src:D,title:`Contact Sheet vs Per-Frame`,caption:`Tiling 12 frames into a single montage costs ~1,440 tokens versus ~2,350 sent individually — roughly 40% fewer tokens for the same visual coverage, because per-image overhead is paid once instead of twelve times.`}],features:[`7 MCP tools: probe_video, extract_frames, get_contact_sheet, get_frames, transcribe, build_timeline, cleanup`,`Pixel-cost projection: estimate_frame_tokens() and compute_affordable_frames() price a request before spending tokens`,`Token formula tokens ≈ (w × h) / 750 with long-edge auto-cap at 1568px baked into every cost estimate`,`Frame resizing via _scale_to_fit(): a 1920×1080 frame drops from ~2,765 to ~196 tokens (14× cheaper)`,`Lazy manifests: extract_frames() returns JSON metadata, not pixels — pixels loaded only on demand`,`Contact-sheet montages tile N frames into one image, ~40% cheaper than sending frames individually`,`Perceptual deduplication skips near-identical frames so the token budget is spent on distinct content`,`fps sampling + token_budget ceiling: 10-min clip drops from ~150k to ~5k tokens`,`faster-whisper transcription with timestamps merged into a unified searchable timeline`,`Per-job cache directory with 24h TTL — extract once, inspect and transcribe repeatedly without re-decoding`],codeSnippet:`# Token-budget core — project vision cost before spending a single token
# Anthropic vision pricing: ~ (width x height) / 750 tokens per image,
# with the long edge auto-capped at 1568px.

TOKENS_PER_PIXEL_DIVISOR = 750
MAX_LONG_EDGE = 1568


def estimate_frame_tokens(width: int, height: int) -> int:
    """Project the token cost of a single frame at the given resolution."""
    w, h = _scale_to_fit(width, height, MAX_LONG_EDGE)
    return round((w * h) / TOKENS_PER_PIXEL_DIVISOR)


def _scale_to_fit(width: int, height: int, max_dim: int) -> tuple[int, int]:
    """Scale (w, h) down so the long edge <= max_dim, preserving aspect ratio."""
    long_edge = max(width, height)
    if long_edge <= max_dim:
        return width, height
    scale = max_dim / long_edge
    return round(width * scale), round(height * scale)


def compute_affordable_frames(
    width: int,
    height: int,
    token_budget: int,
    max_dimension: int = 512,
) -> int:
    """How many resized frames fit inside a token budget?"""
    w, h = _scale_to_fit(width, height, max_dimension)
    per_frame = max(1, round((w * h) / TOKENS_PER_PIXEL_DIVISOR))
    return token_budget // per_frame


# A 10-min clip sampled at fps=0.5 -> ~25 frames.
# Naive (full-res, every frame):  25 * 2765  ~= 150,000 tokens
# Budgeted (resized to 512px):     25 *  196  ~=   5,000 tokens`},"autonomous-researcher":{title:`Autonomous Research Agent`,description:`Agentic research tool that plans its own sub-questions, searches the web, evaluates sources, retries bad results, and synthesizes a cited Markdown report — entirely local via Ollama. No API keys.`,fullDescription:`A fully local, zero-API-key autonomous research agent built in TypeScript and React. Unlike a one-shot search tool, this agent runs a four-stage loop that mirrors how a human researcher actually works: it first asks "what do I need to know?", then searches, reads and evaluates every source, discards low-quality pages, and only writes the final report once it has gathered enough credible evidence.

Stage 1 (Plan): given any topic, the local Ollama LLM generates four targeted sub-questions that together give a comprehensive view. Stage 2 (Search): each sub-question is sent to DuckDuckGo via HTML scraping — no API key, no rate limits for personal use. Stage 3 (Scrape + Evaluate): for each result, the page is fetched with axios, cleaned with cheerio, and scored 0–10 by the LLM for relevance. If the score falls below 5, the agent refines the search query and retries — up to three attempts per sub-question. Stage 4 (Synthesize): once sufficient high-quality sources are collected, the LLM writes a 500–700 word Markdown report with inline citations, saved to ./reports/*.md with a date-stamped filename.

The Express backend streams every agent decision to the React frontend via Server-Sent Events (SSE), producing a real-time terminal-style log — color-coded by stage (PLAN / SRCH / FETCH / EVAL / SYNC). The frontend's ReportViewer tab shows the finished report with full Markdown rendering, and a Saved Reports panel lets you browse all past research sessions.`,technologies:[`TypeScript`,`Node.js`,`Ollama`,`React`,`Express`,`SSE`],github:`https://github.com/shengdynasty/autonomous-researcher`,image:v,video:`/autonomous-researcher-demo.mp4`,language:`typescript`,features:[`4-stage autonomous loop: Plan → Search → Scrape → Evaluate → Synthesize`,`LLM-powered planner breaks any topic into 4 targeted search sub-questions`,`DuckDuckGo HTML scraping via axios + cheerio — no API keys, no rate limits`,`Per-source relevance scoring: LLM rates each page 0–10, discards below threshold`,`Self-correcting retry logic: refines the search query and retries up to 3× per question`,`Synthesizer writes 500–700 word Markdown reports with inline [1],[2] citations`,`Server-Sent Events (SSE): every agent decision streams live to the UI`,`Color-coded terminal log: PLAN / SRCH / FETCH / EVAL / SYNC stages`,`Reports persisted to ./reports/*.md with date-stamped filenames`,`Model selector for any locally installed Ollama model (llama3.2, mistral, etc.)`],codeSnippet:`// Agent orchestrator — 4-stage autonomous loop with self-correction
export async function runResearchLoop(topic, model, onLog) {
  // Stage 1: LLM breaks topic into 4 targeted sub-questions
  onLog({ stage: 'plan', message: \`Planning research for: "\${topic}"...\` });
  const subQuestions = await planResearch(topic, model);

  const goodPages = [];

  for (const sq of subQuestions) {
    onLog({ stage: 'search', message: \`Searching: "\${sq.searchQuery}"\` });
    let results = await search(sq.searchQuery);
    let foundGood = false;

    // Self-correcting retry loop — up to 3 attempts per sub-question
    for (let attempt = 0; attempt < 3 && !foundGood; attempt++) {
      for (const result of results.slice(0, 4)) {
        const content = await scrapeUrl(result.url);
        const { score, reason } = await evaluatePage(content, sq.question, model);

        if (score >= 5) {  // threshold: discard low-relevance pages
          onLog({ stage: 'evaluate', message: \`✓ \${score}/10 — \${reason}\` });
          goodPages.push({ question: sq.question, content, url: result.url });
          foundGood = true;
          break;
        }
      }
      if (!foundGood) {
        // Refine query and search again
        results = await search(\`\${sq.searchQuery} explained guide\`);
        onLog({ stage: 'search', message: \`Retrying with refined query...\` });
      }
    }
  }

  // Stage 4: synthesize all sources into a cited Markdown report
  onLog({ stage: 'synthesize', message: \`Writing report from \${goodPages.length} sources...\` });
  return synthesize(topic, goodPages, model);
}`},"web-researcher":{title:`AI Web Researcher`,description:`Local-first AI research assistant — type any topic, get live DuckDuckGo search results synthesized into a streaming markdown report via Ollama. No API keys.`,fullDescription:`A fully local, zero-API-key research tool built in React + TypeScript (Vite). The user enters any research topic, the app proxies a query through Vite's dev server to DuckDuckGo's Instant Answer API to retrieve real search results, then feeds those results as structured context into a local Ollama model (default: llama3.2). The LLM synthesizes a structured markdown report using the streaming endpoint, so the text appears word-by-word in real time. A model selector dropdown auto-populates from Ollama's /api/tags, a depth toggle switches between Quick (3–5 sections) and Deep Dive (6–10 sections), and a collapsible panel exposes the raw search results used as context. The finished report can be exported to PDF via window.print() with dedicated print CSS.`,technologies:[`React`,`TypeScript`,`Ollama`,`Vite`],github:`https://github.com/shengdynasty/web-researcher`,image:g,language:`typescript`,features:[`Live DuckDuckGo web search via Vite proxy — no CORS, no API key`,`Ollama streaming endpoint: report text appears token-by-token in real time`,`Model selector auto-populated from Ollama's /api/tags endpoint`,`Quick (3–5 sections) vs Deep Dive (6–10 sections) depth toggle`,`Collapsible sources panel showing raw search results used as context`,`Full GFM markdown rendering — tables, code blocks, headers, lists`,`PDF export via window.print() with print CSS stripping all UI chrome`,`Amber-on-ink 'Archival Intelligence' dark theme with streaming cursor`],codeSnippet:`// Ollama streaming generator — yields tokens as they arrive
export async function* streamReport(
  model: string,
  topic: string,
  formattedResults: string,
  depth: 'quick' | 'deep',
): AsyncGenerator<string> {
  const prompt = \`You are a professional research assistant.
Based on the following search results, write a structured
research report on the topic: "\${topic}"

Search Results:
\${formattedResults}

Instructions:
- Synthesize the information — do not just summarize each result
- Identify conflicting information or debates
- Format in clean markdown with headers and bullet points
- End with a ## Sources section listing URLs
- \${depth === 'quick' ? 'Write 3-5 focused sections.' : 'Write 6-10 comprehensive sections.'}\`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: true }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      try {
        const chunk = JSON.parse(line);
        if (chunk.response) yield chunk.response;
        if (chunk.done) return;
      } catch { /* skip */ }
    }
  }
}`},"rag-chatbot":{title:`Local RAG Chatbot`,description:`100% local Retrieval-Augmented Generation chatbot — upload any PDF, ask questions, get answers grounded in your document. No API keys. Runs via Ollama.`,fullDescription:`A fully local Retrieval-Augmented Generation chatbot that lets you upload any PDF and immediately have a conversation with its content — no cloud API keys, no external services. Built in Node.js with LangChain.js and served via Express, the system extracts text from uploaded PDFs, splits it into 512-token overlapping chunks, embeds them using Ollama's llama3.2 model running locally, and stores the vectors as JSON for instant reloading. At query time, the user's question is embedded, semantically matched against the stored vectors, and the top-3 most relevant chunks are injected into a grounded prompt sent to the local LLM — eliminating hallucination entirely. The drag-and-drop web UI shows live ingestion status, switches between upload and chat modes seamlessly, and allows hot-swapping documents without restarting the server.`,technologies:[`Node.js`,`LangChain.js`,`Ollama`,`Express`],github:`https://github.com/shengdynasty/rag-chatbot`,image:y,language:`javascript`,features:[`Drag-and-drop PDF upload directly in the browser — no CLI required`,`Text extraction with pypdf, split into 512-token chunks with 128-token overlap`,`Local embeddings via Ollama llama3.2 — no API keys or internet connection`,`Pure-JS MemoryVectorStore with JSON persistence — no native C++ modules`,`Top-3 semantic retrieval using cosine similarity at query time`,`LLM constrained to document context — says "I don't know" if out of scope`,`Hot-swap documents via "Upload new PDF" without restarting the server`,`LangChain.js orchestration: createRetrievalChain + createStuffDocumentsChain`],codeSnippet:`const { ChatOllama } = require('@langchain/ollama');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');
const { createRetrievalChain } = require('langchain/chains/retrieval');

async function buildChain(retriever) {
  // Local LLM — runs entirely on your machine via Ollama
  const llm = new ChatOllama({
    model: 'llama3.2',
    baseUrl: 'http://127.0.0.1:11434',
  });

  // Inline prompt — no hub.pull(), no API key needed
  // System message constrains LLM to only use retrieved context
  const prompt = ChatPromptTemplate.fromMessages([
    ['system',
      'You are a helpful assistant. Answer using ONLY the context below. ' +
      'If the answer is not in the context, say ' +
      '"I don\\'t know based on the provided document."\\n\\nContext: {context}'],
    ['human', '{input}'],
  ]);

  // Stuff chain: concatenates top-k chunks into {context}, sends to LLM
  const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });

  // Retrieval chain: embed query → cosine search → stuff → LLM → { answer }
  return createRetrievalChain({ retriever, combineDocsChain });
}`},"mcp-server":{title:`Personal AI MCP Server`,description:`Custom MCP server suite connecting Claude to Gmail, Google Calendar, Notion, Spotify, GitHub — natural-language control of real-world tools.`,fullDescription:`A personal MCP (Model Context Protocol) server that acts as a bridge between Claude and a suite of everyday services. Built in TypeScript and running locally, it exposes tools for Gmail (read, search, send), Google Calendar (events, today's agenda, create), Notion (search, query, create pages), Spotify (now playing, recent, top artists), GitHub (profile, contributions), iMessage, and more. With 42+ registered tools, Claude can answer questions like "What's on my calendar today?", "Send an email to X", or "What have I been listening to?" entirely through natural conversation — no UI required.`,technologies:[`TypeScript`,`MCP`,`Claude AI`,`Node.js`],github:`https://github.com/shengdynasty`,image:l,features:[`42+ tools across 10+ services registered via MCP protocol`,`Gmail integration: read inbox, search messages, send emails`,`Google Calendar: fetch today's events, query by date, create events`,`Notion: search pages, query databases, create and append blocks`,`Spotify: now playing, recent tracks, and top artists`,`GitHub: profile stats and contribution history`,`iMessage: read recent chats, search conversations, send messages`,`Tool call latency logging and uptime monitoring`,`Single Claude chat interface for all services`],codeSnippet:`import Anthropic from "@anthropic-ai/sdk";
import { McpClient } from "@anthropic-ai/mcp-client";

const anthropic = new Anthropic();
const mcp = new McpClient({ serverUrl: "http://localhost:3000" });

async function chat(userMessage: string) {
  // Fetch all registered tools from the MCP server
  const { tools } = await mcp.listTools();

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    tools,
    messages: [{ role: "user", content: userMessage }],
  });

  // Handle tool use blocks from Claude's response
  for (const block of response.content) {
    if (block.type === "tool_use") {
      const result = await mcp.callTool({
        name: block.name,
        arguments: block.input as Record<string, unknown>,
      });
      console.log(\`Tool: \${block.name} →\`, result);
    }
  }
}

chat("What's on my calendar today and who emailed me this morning?");`},"task-management":{title:`Task Management Application`,description:`Productivity tool to organize tasks, track progress, and practice database-like data management.`,fullDescription:`Smart Task Manager is a productivity application designed for organizing and tracking tasks efficiently. It features a simple interface allowing users to add, delete, and view tasks with checkbox functionality for tracking completion status.`,technologies:[`Python`,`Tkinter`],github:`https://github.com/shengdynasty`,image:d,features:[`Add and delete tasks dynamically`,`Checkbox-based completion tracking`,`View all tasks in a dialog`,`Input validation for empty tasks`,`Clean and intuitive interface`],codeSnippet:`import tkinter as tk
from tkinter import messagebox

tasks = []

def add_task():
    task_text = task_entry.get().strip()
    if task_text:
        var = tk.BooleanVar()
        cb = tk.Checkbutton(task_frame, text=task_text,
                            variable=var, anchor="w")
        cb.pack(fill="x", padx=5, pady=2)
        tasks.append((task_text, var, cb))
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Input Error", "Please enter a task.")

def delete_task():
    to_remove = [t for t in tasks if t[1].get()]
    if not to_remove:
        messagebox.showwarning("Selection Error",
                               "No task selected to delete.")
        return
    for task_text, var, cb in to_remove:
        cb.destroy()
        tasks.remove((task_text, var, cb))

root = tk.Tk()
root.title("Cool To-Do List")
root.geometry("400x450")

task_entry = tk.Entry(root, width=30)
task_entry.pack(pady=10)

add_button = tk.Button(root, text="Add Task", command=add_task)
add_button.pack(pady=5)

task_frame = tk.Frame(root)
task_frame.pack(pady=10, fill="both", expand=True)

root.mainloop()`},"expense-tracker":{title:`Personal Expense Tracker`,description:`Tool to categorize and visualize personal spending, applying data structures and basic data analysis.`,fullDescription:`Personal Expense Tracker is a financial management tool that helps users categorize and track their spending habits. It applies data structures for organizing expenses and includes basic data visualization capabilities for spending analysis.`,technologies:[`Python`,`Tkinter`,`Data Visualization`],github:`https://github.com/shengdynasty`,image:_,features:[`Add and categorize expenses`,`Track spending by category`,`View expense history`,`Basic data visualization`,`Persistent data storage`],codeSnippet:`import tkinter as tk
from tkinter import ttk, messagebox

expenses = []
categories = ["Food", "Transport", "Entertainment", "Bills", "Other"]

def add_expense():
    amount = amount_entry.get()
    category = category_combo.get()
    description = desc_entry.get()

    if not amount or not category:
        messagebox.showwarning("Error", "Please fill all fields")
        return

    try:
        amount = float(amount)
        expenses.append({
            "amount": amount,
            "category": category,
            "description": description
        })
        update_list()
        clear_entries()
    except ValueError:
        messagebox.showwarning("Error", "Invalid amount")

def update_list():
    expense_list.delete(0, tk.END)
    total = 0
    for exp in expenses:
        text = "$" + str(exp['amount']) + " - " + exp['category']
        expense_list.insert(tk.END, text)
        total += exp['amount']
    total_label.config(text="Total: $" + str(total))

root = tk.Tk()
root.title("Expense Tracker")
root.geometry("400x500")

amount_entry = tk.Entry(root)
category_combo = ttk.Combobox(root, values=categories)
desc_entry = tk.Entry(root)

root.mainloop()`},"note-app":{title:`AI Note-Taking App`,description:`Notability-style app with AI flashcards, quizzes, fill-in-the-blank, and chat generated from your own notes using Claude.`,fullDescription:`A full-featured note-taking web app inspired by Notability, built entirely in the browser with no backend. Write notes on a drawing canvas with pen, highlighter, and text tools, record audio with live transcription, and import PDFs. The standout feature is the AI Learn panel powered by Claude: open any note to instantly generate a Smart Notes summary, Quizlet-style flashcards with Know/Still Learning tracking, multiple-choice quizzes with per-question explanations, fill-in-the-blank practice, and a multi-turn chat grounded in your note content.`,technologies:[`React`,`TypeScript`,`Vite`,`Claude AI`],github:`https://github.com/shengdynasty/note-app`,live:`https://shengdynasty.github.io/note-app`,image:p,features:[`Freehand drawing canvas with pen, highlighter, eraser, and shape tools`,`Audio recording with AI-powered transcription via Claude`,`PDF import and annotation support`,`Smart Notes — AI-generated summary and key terms from your notes`,`Quizlet-style flashcards with Know it / Still Learning progress tracking`,`Multiple-choice quiz with per-question explanations and results review`,`Fill-in-the-blank cloze practice generated from note content`,`Multi-turn AI chat grounded in the active note`,`Multiple themes and local persistence — no account required`],codeSnippet:`// Claude generates study materials from raw note text
async function callClaude(prompt: string, apiKey: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

// Generate Quizlet-style flashcards
const flashcardPrompt = \`
  Given these notes, generate 8 flashcards as JSON:
  [{ "term": "...", "definition": "..." }]
  Notes: \${noteText}
\`;
const raw = await callClaude(flashcardPrompt, apiKey);
const cards = JSON.parse(raw.replace(/\`\`\`json|\\n|\`\`\`/g, "").trim());`},"csv-stock-visualizer":{title:`CSV Stock Visualizer`,description:`Interactive web app that parses CSV stock data into dynamic price charts, volume graphs, and key statistics.`,fullDescription:`CSV Stock Visualizer is an interactive web application that transforms raw CSV stock data into clear, readable charts and statistics. Users can upload any CSV file containing OHLCV data and instantly see price history plotted as a line chart alongside volume bars. The app computes key metrics such as 52-week high/low, average volume, and daily percentage change.`,technologies:[`React`,`TypeScript`,`CSV Parsing`,`Data Viz`],github:`https://github.com/shengdynasty`,live:`https://stock-data-visualizer-v1.lovable.app/`,image:x,features:[`CSV file upload and real-time parsing`,`Interactive line chart with price history`,`Volume bar graph with color-coded gain/loss`,`Key statistics panel (open, high, low, close, volume)`,`52-week high/low and average volume calculations`,`Daily percentage change display`],codeSnippet:`import { useState } from "react";

interface StockRow {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function parseCSV(text: string): StockRow[] {
  const lines = text.trim().split("\\n");
  const headers = lines[0].toLowerCase().split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return {
      date:   values[headers.indexOf("date")],
      open:   parseFloat(values[headers.indexOf("open")]),
      high:   parseFloat(values[headers.indexOf("high")]),
      low:    parseFloat(values[headers.indexOf("low")]),
      close:  parseFloat(values[headers.indexOf("close")]),
      volume: parseFloat(values[headers.indexOf("volume")]),
    };
  });
}

export default function App() {
  const [rows, setRows] = useState<StockRow[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  };

  const latest = rows[rows.length - 1];
  const prev   = rows[rows.length - 2];
  const change = latest && prev
    ? ((latest.close - prev.close) / prev.close) * 100
    : 0;

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFile} />
      {latest && (
        <div>
          <span>\${latest.close.toFixed(2)}</span>
          <span>{change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
}`},"school-mcp":{title:`StudentVue MCP Server`,description:`19-tool MCP server that gives Claude natural-language access to your StudentVue gradebook — grades, GPA, attendance, schedule, missing work, and grade simulation.`,fullDescription:`A fully local Model Context Protocol (MCP) server written in TypeScript that bridges Claude Desktop to the StudentVue / Synergy school information system used by thousands of US school districts. Every aspect of a student's academic record becomes conversationally accessible: ask Claude "what's my current GPA?", "which assignments am I missing in AP Calc?", or "what score do I need on the final to get an A?" and the server fetches live data, computes the answer, and responds in plain English.

The 19 registered tools span three categories. Grade Analysis tools (7) — get_gradebook, get_grade_summary, get_grade_details, get_grade_needed, simulate_grade_scenario, get_low_grades, get_category_breakdown — parse the raw Points[] arrays from the Synergy SOAP API, compute weighted averages, project hypothetical scores, and convert percentages to letter grades via percentToLetter(). Academic Info tools (6) — get_student_info, get_school_info, get_schedule, get_calendar, get_documents, get_report_cards — surface every piece of institutional data StudentVue exposes. Smart Insights tools (6) — get_gpa, get_assignments_due, get_missing_assignments, ask_about_grades, get_attendance, get_messages — implement a full 4.0-scale GPA calculator, a missing-work detector, and a comprehensive context dump that feeds all course data to Claude for open-ended analysis.

Architecturally, the server uses the @modelcontextprotocol/sdk McpServer class with a StdioServerTransport, communicating over JSON-RPC 2.0 via stdin/stdout. All tool inputs are validated with Zod schemas before execution. A singleton StudentVue client (src/client.ts) lazily authenticates once and reuses the session across all 19 tools, avoiding repeated SOAP handshakes. A custom errFrom() utility handles the studentvue library's unusual behavior of throwing plain JavaScript objects rather than Error instances, serializing them to JSON for readable error messages in Claude.`,technologies:[`TypeScript`,`MCP`,`Node.js`,`Zod`,`StudentVue API`],github:`https://github.com/shengdynasty/school-mcp`,image:c,language:`typescript`,features:[`19 tools registered via McpServer + StdioServerTransport (JSON-RPC 2.0 over stdin/stdout)`,`Grade simulation: project hypothetical assignment scores to see grade impact before submitting`,`GPA calculator: 4.0-scale weighted GPA across all scored courses with letterToGpa() mapping`,`Missing assignment detector: flags any Score that is blank, 'Not Graded', or contains 'missing'`,`ask_about_grades: full context dump of all courses, assignments, and priorities for AI analysis`,`Grade needed calculator: computes exact score required on next assignment to hit target grade`,`Singleton client pattern: one authenticated StudentVue session shared across all 19 tools`,`Custom errFrom() serializer: handles plain-object throws from the studentvue npm library`,`Zod input validation on all tool schemas with typed argument destructuring`,`Category breakdown: per-category weighted averages (Homework, Tests, Quizzes, etc.)`],codeSnippet:`// Grade simulation tool — core logic
async ({ courseName, hypotheticalScores }) => {
  const client = await getClient();          // singleton
  const gradebook = await client.gradebook(0);
  const courses = extractCourses(gradebook);
  const course = findCourse(courses, courseName);

  // Tally current earned / total points
  let earnedPoints = 0, totalPoints = 0;
  for (const a of extractAssignments(extractMarks(course)[0])) {
    const parts = a.Points?.split('/') ?? [];
    if (parts.length !== 2) continue;
    const possible = parsePoints(parts[1]);
    const earned  = parsePoints(a.Score);
    if (possible === null || earned === null) continue;
    earnedPoints += earned;
    totalPoints  += possible;
  }

  // Add hypothetical assignments
  let simEarned = earnedPoints, simTotal = totalPoints;
  for (const h of hypotheticalScores) {
    simEarned += h.score;
    simTotal  += h.outOf;
  }

  const currentPct   = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : null;
  const projectedPct = simTotal   > 0 ? (simEarned   / simTotal)    * 100 : null;

  return ok({
    currentGrade:    currentPct   !== null ? Math.round(currentPct   * 100) / 100 : null,
    projectedGrade:  projectedPct !== null ? Math.round(projectedPct * 100) / 100 : null,
    projectedLetter: projectedPct !== null ? percentToLetter(projectedPct) : 'N/A',
    change: currentPct !== null && projectedPct !== null
      ? Math.round((projectedPct - currentPct) * 100) / 100 : null,
  });
}`},"quant-platform":{title:`Quant Research Platform`,description:`Full-stack quantitative finance platform with a 7-module React frontend, FastAPI backend, automated data pipeline via APScheduler, SQLite storage, and a local Ollama AI analyst.`,fullDescription:`A Bloomberg Terminal–inspired quantitative research platform built entirely from scratch with Python and React. It provides institutional-grade equity analysis tools in a fully local environment — no cloud API keys required beyond optional data sources, no subscription fees, and complete data privacy since everything runs on your own machine.

The React frontend is organized into seven specialized modules, each backed by a dedicated FastAPI endpoint. The Dashboard displays portfolio overview, live price charts (Recharts), and active alerts via a WebSocket connection. The Stock Screener accepts 50+ filter criteria — P/E range, RSI bounds, minimum volume, sector, EPS growth — and returns a ranked list processed server-side via Pandas DataFrames. The Research Panel pulls fundamental data (income statement, balance sheet, cash flow) from yfinance and FRED economic indicators, presenting P/E, EBITDA, ROE, and debt ratios side-by-side. The Risk Calculator runs a Monte Carlo simulation (10,000 paths via NumPy) to compute 95% Value-at-Risk, Sharpe ratio, beta against the S&P 500, and maximum drawdown. The Portfolio Tracker manages a holdings ledger in SQLite, calculating real-time P&L and allocation percentages as prices update. The Options Pricing module implements Black-Scholes from first principles using SciPy's normal CDF, outputting fair value and the full Greeks (Δ, Γ, Θ, Vega, Rho) for any call or put. The AI Analyst module submits a structured prompt containing the stock's key metrics to a local Ollama llama3.2 model and streams the response token-by-token back to the UI.

The data pipeline is automated by APScheduler with three background jobs: a 1-minute interval job fetches live OHLCV data via yfinance and writes to the price_history table; an hourly job refreshes fundamentals and FRED indicators; a nightly 2am job runs the full Monte Carlo risk computation and caches results in the analysis_cache table. Five SQLite tables (stocks, price_history, portfolio, analysis_cache, alerts) form the persistence layer, with INSERT OR REPLACE semantics to handle deduplication automatically.`,technologies:[`Python`,`FastAPI`,`React`,`TypeScript`,`SQLite`,`Ollama`,`NumPy`,`yfinance`],github:`https://github.com/shengdynasty/quant-platform`,image:f,language:`python`,features:[`7-module React frontend: Dashboard, Screener, Research, Risk, Portfolio, Options, AI Analyst`,`FastAPI backend with 8 routes: GET, POST, and WebSocket endpoints for live streaming`,`Stock Screener: 50+ filter criteria processed via Pandas DataFrame on the server`,`Black-Scholes options pricing from scratch: fair value + full Greeks (Δ Γ Θ Vega Rho)`,`Monte Carlo VaR: 10,000 simulation paths via NumPy for 95% confidence risk metrics`,`APScheduler: 3 background jobs — 1min live prices, 1hr fundamentals, 02:00 risk metrics`,`5 SQLite tables: stocks, price_history, portfolio, analysis_cache, alerts`,`Ollama AI Analyst: llama3.2 streaming analysis with bull/bear/risk breakdown, fully local`,`FRED API integration: CPI, Fed Funds Rate, GDP, unemployment alongside equity data`,`Alert system: threshold-based triggers (PRICE_ABOVE, PRICE_BELOW, RSI) pushed via WebSocket`],codeSnippet:`# Black-Scholes options pricing — core implementation
from scipy.stats import norm
import numpy as np

def black_scholes(S, K, T, r, sigma, option_type="call"):
    """
    S: spot price  K: strike  T: time to expiry (years)
    r: risk-free rate  sigma: implied volatility
    """
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == "call":
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
        delta = norm.cdf(d1)
    else:
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
        delta = -norm.cdf(-d1)

    gamma = norm.pdf(d1) / (S * sigma * np.sqrt(T))
    theta = (-(S * norm.pdf(d1) * sigma) / (2 * np.sqrt(T))
             - r * K * np.exp(-r * T) * norm.cdf(d2)) / 365
    vega  = S * norm.pdf(d1) * np.sqrt(T) / 100
    rho   = K * T * np.exp(-r * T) * norm.cdf(d2) / 100

    return {"price": round(price, 4), "delta": round(delta, 4),
            "gamma": round(gamma, 6), "theta": round(theta, 4),
            "vega":  round(vega,  4), "rho":   round(rho,   4)}`},"portfolio-website":{title:`Academic Portfolio Website`,description:`Professional web presence to communicate academic interests and projects to university admissions.`,fullDescription:`A personal portfolio website showcasing projects, skills, and experience. Built with React and Tailwind CSS, featuring smooth animations, responsive design, and optimized performance for fast loading times.`,technologies:[`React`,`TypeScript`,`Tailwind CSS`],github:`https://github.com/shengdynasty`,live:`https://sheng-yan.lovable.app`,image:u,features:[`Responsive design for all devices`,`Smooth Framer Motion animations`,`Dark theme with editorial aesthetic`,`Project showcase with detail pages`,`Optimized performance`],codeSnippet:`import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
    >
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
        >
          <Link to={project.detailPage}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};`}};function A(){let{projectId:e}=i(),t=r();(0,C.useEffect)(()=>{w.default.highlightAll()},[e]);let n=e?k[e]:null;return(0,C.useEffect)(()=>{document.title=`${n?.title??`Project`} — Sheng Yan`},[n?.title]),n?(0,O.jsx)(s,{children:(0,O.jsxs)(`div`,{style:{maxWidth:1100,margin:`0 auto`,padding:`5rem 2rem 8rem`},children:[(0,O.jsx)(o.button,{onClick:()=>t(`/projects`),initial:{opacity:0,x:-12},animate:{opacity:1,x:0},transition:{duration:.35},style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,background:`none`,border:`none`,color:`#444`,cursor:`pointer`,fontSize:`0.75rem`,letterSpacing:`0.08em`,fontFamily:`var(--font-mono)`,marginBottom:`4rem`,padding:0,transition:`color 150ms`},onMouseEnter:e=>e.currentTarget.style.color=`#ccc`,onMouseLeave:e=>e.currentTarget.style.color=`#444`,children:`← PROJECTS`}),(0,O.jsxs)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55},style:{marginBottom:`3rem`},children:[(0,O.jsx)(`h1`,{style:{fontFamily:`var(--font-display)`,fontSize:`clamp(1.8rem, 5vw, 3.5rem)`,fontWeight:700,color:`#fff`,lineHeight:1.05,letterSpacing:`-0.01em`,marginBottom:`1.5rem`},children:n.title}),(0,O.jsx)(`p`,{style:{fontSize:`0.9rem`,color:`#555`,lineHeight:1.75,maxWidth:`52rem`,marginBottom:`1.75rem`},children:n.fullDescription}),(0,O.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,alignItems:`center`,gap:`1rem`},children:[(0,O.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:6,flex:1},children:n.technologies.map(e=>(0,O.jsx)(`span`,{className:`tag`,children:e},e))}),(0,O.jsxs)(`div`,{style:{display:`flex`,gap:`0.75rem`,flexShrink:0},children:[(0,O.jsxs)(`a`,{href:n.github,target:`_blank`,rel:`noopener noreferrer`,style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,padding:`0.4rem 0.9rem`,border:`1px solid #2A2A2A`,borderRadius:2,color:`#666`,fontSize:`0.75rem`,fontFamily:`var(--font-mono)`,letterSpacing:`0.06em`,textDecoration:`none`,transition:`color 150ms, border-color 150ms`},onMouseEnter:e=>{e.currentTarget.style.color=`#ccc`,e.currentTarget.style.borderColor=`#555`},onMouseLeave:e=>{e.currentTarget.style.color=`#666`,e.currentTarget.style.borderColor=`#2A2A2A`},children:[(0,O.jsx)(m,{}),` code`]}),n.live&&(0,O.jsx)(`a`,{href:n.live,target:`_blank`,rel:`noopener noreferrer`,style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,padding:`0.4rem 0.9rem`,background:`#fff`,borderRadius:2,color:`#080808`,fontSize:`0.75rem`,fontFamily:`var(--font-mono)`,letterSpacing:`0.06em`,textDecoration:`none`,transition:`background 150ms`},onMouseEnter:e=>e.currentTarget.style.background=`#ccc`,onMouseLeave:e=>e.currentTarget.style.background=`#fff`,children:`↗ live`})]})]})]}),n.image&&(0,O.jsx)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55,delay:.1},style:{aspectRatio:`16/7`,overflow:`hidden`,borderRadius:4,border:`1px solid #1C1C1C`,marginBottom:n.video?`2rem`:`4rem`,background:`#0D0D0D`},children:(0,O.jsx)(`img`,{src:n.image,alt:n.title,loading:`lazy`,style:{width:`100%`,height:`100%`,objectFit:`cover`,filter:`brightness(0.8)`}})}),n.video&&(0,O.jsxs)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55,delay:.15},style:{marginBottom:`4rem`},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`1rem`,marginBottom:`1rem`},children:[(0,O.jsx)(`p`,{style:{fontSize:`0.6rem`,letterSpacing:`0.2em`,color:`#444`,textTransform:`uppercase`,whiteSpace:`nowrap`},children:`Demo`}),(0,O.jsx)(`div`,{style:{flex:1,height:`1px`,background:`#1C1C1C`}})]}),(0,O.jsx)(`div`,{style:{borderRadius:4,overflow:`hidden`,border:`1px solid #1C1C1C`,background:`#000`},children:(0,O.jsx)(`video`,{src:n.video,autoPlay:!0,muted:!0,loop:!0,playsInline:!0,controls:!0,style:{width:`100%`,display:`block`}})})]}),n.diagrams&&n.diagrams.length>0&&(0,O.jsxs)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55,delay:.18},style:{marginBottom:`4rem`},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`1rem`,marginBottom:`1.75rem`},children:[(0,O.jsx)(`p`,{style:{fontSize:`0.6rem`,letterSpacing:`0.2em`,color:`#444`,textTransform:`uppercase`,whiteSpace:`nowrap`},children:`How It Works`}),(0,O.jsx)(`div`,{style:{flex:1,height:`1px`,background:`#1C1C1C`}})]}),(0,O.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`3rem`},children:n.diagrams.map((e,t)=>(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`div`,{style:{borderRadius:4,overflow:`hidden`,border:`1px solid #1C1C1C`,background:`#07070f`},children:(0,O.jsx)(`img`,{src:e.src,alt:e.title,loading:`lazy`,style:{width:`100%`,display:`block`}})}),(0,O.jsxs)(`div`,{style:{display:`flex`,gap:`0.75rem`,alignItems:`flex-start`,marginTop:`1rem`},children:[(0,O.jsx)(`span`,{style:{color:`#333`,fontFamily:`var(--font-mono)`,fontSize:`0.65rem`,flexShrink:0,marginTop:`0.2rem`},children:String(t+1).padStart(2,`0`)}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`p`,{style:{fontSize:`0.82rem`,color:`#aaa`,fontWeight:600,marginBottom:`0.4rem`},children:e.title}),(0,O.jsx)(`p`,{style:{fontSize:`0.8rem`,color:`#666`,lineHeight:1.65,maxWidth:`48rem`},children:e.caption})]})]})]},t))})]}),n.reportUrl&&(0,O.jsxs)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55,delay:.2},style:{marginBottom:`4rem`},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`1rem`,marginBottom:`1.75rem`},children:[(0,O.jsx)(`p`,{style:{fontSize:`0.6rem`,letterSpacing:`0.2em`,color:`#444`,textTransform:`uppercase`,whiteSpace:`nowrap`},children:`Project Report`}),(0,O.jsx)(`div`,{style:{flex:1,height:`1px`,background:`#1C1C1C`}})]}),(0,O.jsxs)(`a`,{href:n.reportUrl,target:`_blank`,rel:`noopener noreferrer`,style:{display:`inline-flex`,alignItems:`center`,gap:`0.75rem`,padding:`1rem 1.5rem`,border:`1px solid #2A2A2A`,borderRadius:3,textDecoration:`none`,transition:`border-color 150ms, background 150ms`},onMouseEnter:e=>{e.currentTarget.style.borderColor=`#555`,e.currentTarget.style.background=`#0D0D0D`},onMouseLeave:e=>{e.currentTarget.style.borderColor=`#2A2A2A`,e.currentTarget.style.background=`transparent`},children:[(0,O.jsx)(`span`,{style:{fontSize:`1rem`,color:`#555`},children:`↗`}),(0,O.jsxs)(`div`,{children:[(0,O.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:`0.75rem`,color:`#ccc`,letterSpacing:`0.04em`,marginBottom:`0.2rem`},children:`EvalGuard — Consolidated Project Report`}),(0,O.jsx)(`p`,{style:{fontSize:`0.7rem`,color:`#444`},children:`Full technical detail, experimental results, and commercial framing`})]})]})]}),n.features&&n.features.length>0&&(0,O.jsxs)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55,delay:.2},style:{marginBottom:`4rem`},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`1rem`,marginBottom:`1.75rem`},children:[(0,O.jsx)(`p`,{style:{fontSize:`0.6rem`,letterSpacing:`0.2em`,color:`#444`,textTransform:`uppercase`,whiteSpace:`nowrap`},children:`Key Features`}),(0,O.jsx)(`div`,{style:{flex:1,height:`1px`,background:`#1C1C1C`}})]}),(0,O.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(260px, 1fr))`,gap:0},children:n.features.map((e,t)=>(0,O.jsxs)(`div`,{style:{padding:`1rem 0`,borderBottom:`1px solid #141414`,display:`flex`,gap:`0.75rem`,alignItems:`flex-start`},children:[(0,O.jsx)(`span`,{style:{color:`#333`,fontFamily:`var(--font-mono)`,fontSize:`0.65rem`,flexShrink:0,marginTop:`0.1rem`},children:String(t+1).padStart(2,`0`)}),(0,O.jsx)(`span`,{style:{fontSize:`0.83rem`,color:`#666`,lineHeight:1.55},children:e})]},t))})]}),n.codeSnippet&&(0,O.jsxs)(o.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.55,delay:.3},children:[(0,O.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`1rem`,marginBottom:`1.75rem`},children:[(0,O.jsx)(`p`,{style:{fontSize:`0.6rem`,letterSpacing:`0.2em`,color:`#444`,textTransform:`uppercase`,whiteSpace:`nowrap`},children:`Code Showcase`}),(0,O.jsx)(`div`,{style:{flex:1,height:`1px`,background:`#1C1C1C`}})]}),(0,O.jsxs)(`div`,{style:{border:`1px solid #1C1C1C`,borderRadius:4,overflow:`hidden`},children:[(0,O.jsxs)(`div`,{style:{background:`#0D0D0D`,borderBottom:`1px solid #1C1C1C`,padding:`0.6rem 1rem`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,O.jsx)(`div`,{style:{display:`flex`,gap:6},children:[`#2A2A2A`,`#2A2A2A`,`#2A2A2A`].map((e,t)=>(0,O.jsx)(`span`,{style:{width:10,height:10,borderRadius:`50%`,background:e,display:`inline-block`}},t))}),(0,O.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:`0.6rem`,color:`#444`,letterSpacing:`0.06em`},children:n.language===`javascript`?`chain.js`:n.technologies[0]===`React`||n.technologies[0]===`TypeScript`?`component.tsx`:`main.py`})]}),(0,O.jsx)(`div`,{className:`vscode-theme`,style:{background:`#0A0A0A`},children:(0,O.jsx)(`pre`,{style:{margin:0,padding:`1.5rem`,overflowX:`auto`},children:(0,O.jsx)(`code`,{className:`language-${n.language??(n.technologies.includes(`React`)||n.technologies.includes(`TypeScript`)?`typescript`:`python`)}`,style:{fontSize:`0.78rem`,lineHeight:1.65},children:n.codeSnippet})})})]})]})]})}):(0,O.jsx)(s,{children:(0,O.jsxs)(`div`,{style:{maxWidth:1100,margin:`0 auto`,padding:`5rem 2rem`,textAlign:`center`},children:[(0,O.jsx)(`p`,{style:{color:`#555`,marginBottom:`2rem`},children:`Project not found.`}),(0,O.jsx)(`button`,{onClick:()=>t(`/projects`),style:{background:`none`,border:`none`,color:`#888`,cursor:`pointer`,fontSize:`0.85rem`},children:`← Back to Projects`})]})})}export{A as default};