'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site'),load=p=>fs.readFileSync(path.join(root,p),'utf8');
const owner=load('animation-effects.js'),guardian=load('guardian-care-economy.js'),room=load('sanctuary/sanctuary-customize.js'),learn=load('generated-question-engine.js');
for(const [name,text] of [['animation-effects',owner],['guardian-care',guardian],['sanctuary-customize',room],['generated-question-engine',learn]])new vm.Script(text,{filename:name+'.js'});
assert(owner.includes("guardian:['guardians/")&&owner.includes("sanctuary:['celebrations/")&&owner.includes("lesson:['celebrations/"),'Existing event visuals must remain distinct');
assert(/if\(r\?\.ok&&\['feed','water','treat','groom','play','affection'\]/.test(guardian),'Guardian feedback must require successful care');
assert(guardian.includes("MajickAnimationEffects?.play?.('guardian'"),'Guardian events must reuse shared owner');
assert(room.includes("if(placed&&typeof window!=='undefined')window.MajickAnimationEffects?.play?.('sanctuary'"),'Only placed owned furniture should celebrate');
assert(room.indexOf('this.v3321CommitFurnitureState();')<room.indexOf("MajickAnimationEffects?.play?.('sanctuary'"),'Furniture state must commit first');
assert(learn.includes('work.dataset.celebrated'),'Learn Lab event must remain one-shot');
assert(!/S\.progress\s*=|S\.majickAccount\s*=/.test(owner),'Animation owner cannot mutate academic or Guardian saves');
console.log('PASS Phase 6 ownership: existing visual effects, successful care and placement only, one-shot learning, no reward owner duplication');


/* Identity-safe Sanctuary stage selection regression for all additional Guardians. */
const rosterSrc=load('sanctuary/sanctuary-roster.js');
new vm.Script(rosterSrc,{filename:'sanctuary-roster.js'});
assert(rosterSrc.includes("'-room'")&&rosterSrc.includes("stage(g,scene)"),'Room textures must be stage-specific');
assert(rosterSrc.includes("evolution_stages/")&&rosterSrc.includes("fallbackURL(g)"),'Fallback must keep the same Guardian identity');
const evo=JSON.parse(load('sanctuary/assets/evolutions/evolution-manifest.json'));
const extra=['vesper','briar','zephyr','prism','rook','solara'];
const stages=['new-bond','apprentice','guardian','ascendant','celestial'];
for(const guardian of extra){
 assert(evo.guardians[guardian],guardian+' must have a declared stage mapping');
 assert(fs.existsSync(path.join(root,'assets/familiars/canon',guardian+'-guardian.webp')),guardian+' canonical portrait missing');
 for(const stage of stages){
  const file=path.join(root,'assets/familiars/evolution_stages',guardian+'-'+stage+'.webp');
  assert(fs.existsSync(file),guardian+'/'+stage+' missing stage image');
  assert(evo.guardians[guardian].stages[stage].portrait.endsWith(guardian+'-'+stage+'.webp'),'Cross-Guardian stage art for '+guardian);
  assert.equal(evo.guardians[guardian].stages[stage].missingActions.length,3,'Unapproved action artwork may not be marked ready');
 }
}
const original=['luna','ember','nova','mallow'];
const protectedFiles=fs.readdirSync(path.join(root,'sanctuary/assets/motion')).filter(x=>x.endsWith('.png'));
assert.equal(protectedFiles.length,33,'Protected 33 original motion PNGs must remain present');
for(const name of ['velora','cascade','solstice','aurelia'])assert(evo.guardians[name],name+' original evolution actions must remain registered');
console.log('PASS 6 Guardian canonical identity / 30 stage references / protected motion library');
