'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(process.argv[2]||'current-site');
const src=fs.readFileSync(path.join(root,'animation-effects.js'),'utf8');
const css=fs.readFileSync(path.join(root,'animation-effects.css'),'utf8');
new vm.Script(src,{filename:'animation-effects.js'});
assert(/pointer-events:none!\s*important/.test(css),'Effect layer must never capture clicks');
assert(/prefers-reduced-motion:reduce/.test(css),'Reduced-motion styling required');
for(const asset of ['celebrations/lesson-complete-seal.svg','celebrations/course-complete-sigil.svg','guardians/guardian-heart-sigil.svg']){
 const file=path.join(root,'assets/effects',asset),svg=fs.readFileSync(file,'utf8');
 assert(svg.includes('<svg')&&svg.includes('</svg>'),'Missing standalone SVG '+asset);
}
function element(tag){
 const e={tagName:tag,children:[],style:{setProperty(k,v){this[k]=v}},dataset:{},isConnected:false,attributes:{},className:'',textContent:'',alt:'',src:'',decoding:'',
 setAttribute(k,v){this.attributes[k]=v},
 append(child){child.parent=this;child.isConnected=true;this.children.push(child)},
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.isConnected=false}
 };
 return e
}
for(const width of [1366,820,390]){
 for(const motion of [false,true]){
 const events={},timers=[],body=element('body');body.isConnected=true;
 const document={body,createElement:element,addEventListener(n,fn){events[n]=fn}};
 const ctx={window:{innerWidth:width,matchMedia(){return {matches:motion}}},document,Date,Math,Object,clearTimeout(){},setTimeout(fn){timers.push(fn);return timers.length},console};
 ctx.window.window=ctx.window;
 vm.runInNewContext(src,ctx,{filename:'animation-effects.js'});
 const effects=ctx.window.MajickAnimationEffects;
 for(const type of ['lesson','course','guardian']){
  assert(effects.play(type),'Must render '+type);
  assert.equal(body.children.length,1,'Exactly one overlay at '+width);
  assert.equal(body.children[0].children.length,1,'Exactly one active celebration');
  const effect=body.children[0].children[0];
  assert.equal(effect.dataset.fxType,type);
  assert(effect.children[0].src.includes(type==='course'?'course-complete-sigil':type==='lesson'?'lesson-complete-seal':'guardian-heart-sigil'));
  const particles=effect.children.filter(x=>x.className==='majickFxParticle');
  assert.equal(particles.length,motion?0:type==='course'?22:type==='lesson'?13:9,'Motion density '+type);
  timers.splice(0).forEach(fn=>fn());
  assert.equal(body.children[0].children.length,0,'Cleanup '+type);
 }
 assert.equal(effects.play('success'),true);
 assert.equal(effects.play('success'),false,'Deduplicate replayed success');
 timers.splice(0).forEach(fn=>fn());
 }
}
console.log('PASS animation effects: three celebration identities, one overlay, auto cleanup, dedupe, reduced motion, desktop/tablet/mobile');
