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


/* Phase 7: shared scholar fitting + actual reward art verification. */
const atelier=load('enchanted-atelier.js'),companion=load('scholar-companion.js'),vault=load('reward-core.js');
for(const [name,src] of [['atelier',atelier],['scholar-companion',companion],['reward-core',vault]])new vm.Script(src,{filename:name+'.js'});
assert(atelier.includes('function hairFit(p)')&&atelier.includes('data-hair-fit')&&atelier.includes('p.hairFit=hairFit('),'Hair fitting must use the saved scholar identity and working controls');
assert(atelier.includes('MajickScholarCompanion?.refresh?.(true)'),'Outfit changes should immediately refresh scholar presence');
for(const room of ['learninglab','livinggrimoire','companions','gamerealm','studynow'])assert(companion.includes(room+':'),'Scholar companion must recognize '+room);
assert(companion.includes("majick:verified-academic-milestone"),'Scholar celebrations must use verified milestone events');
for(const name of ['clarity-potion','recall-draught','moonfocus-elixir','crystal-sight-potion','starlight-tonic'])assert(fs.existsSync(path.join(root,'assets/rewards/potions',name+'.svg')),'Potion art missing: '+name);
assert(fs.existsSync(path.join(root,'assets/rewards/crystals/majick-crystal.svg')),'Crystal art missing');
assert(vault.includes('majPotionArt')&&vault.includes('majCrystalBalance'),'Potion and crystal art must be displayed by existing Vault');
assert(companion.includes("majick:verified-study-answer")&&companion.includes("d.correct===true&&d.independent===true"),'Scholar response must require verified independent success');
assert(!companion.includes("if(t.closest('[data-correct],.correctAnswer,.is-correct'))react('celebrating')"),'Raw answer clicks must not trigger academic celebration');
for(const kind of ["earned","crafted","potion","guardian-accessory"])assert(vault.includes("scholarVisual('"+kind+"'"),'Existing reward owner must emit '+kind+' only after successful state change');
assert(companion.includes("majick:scholar-visual"),'Scholar must subscribe to verified economy changes');
console.log('PASS shared scholar hair fit, room presence, evidence-driven reactions, potion and crystal artwork');
