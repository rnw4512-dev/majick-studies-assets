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

// Companion presentation ownership: tabs rearrange the existing cards, never clone economy/actions.
const tabs=load('companion-tabs.js');new vm.Script(tabs,{filename:'companion-tabs.js'});
for(const label of ['Your Guardians','Egg Incubator','Magical Habitat','Dress-Up Drawer','Sanctuary Decor'])assert(tabs.includes(label),'Missing existing Companion section '+label);
assert(tabs.includes("role','tablist'")&&tabs.includes("role','tabpanel'")&&tabs.includes("aria-selected"),'Keyboard-accessible tabs and panels required');
assert(!/crystals\s*[+\-]=|xp\s*[+\-]=|\.award\(/.test(tabs),'Tabs must not alter rewards or academic progress');
assert(tabs.includes("new MutationObserver(queue)"),'Tabs must remount after Companion navigation/re-render');
console.log('PASS Companion tabs: existing sections only, keyboard tabs, no new reward state owner');
