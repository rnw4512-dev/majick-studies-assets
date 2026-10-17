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

// Original four: one final visual owner, actual two-frame textures, no duplicate engines.
const sanctuaryRuntime=load('sanctuary/sanctuary-runtime.js');
const visualAuthority=load('sanctuary/sanctuary-visual-authority.js');
new vm.Script(sanctuaryRuntime,{filename:'sanctuary-runtime.js'});
new vm.Script(visualAuthority,{filename:'sanctuary-visual-authority.js'});
assert(sanctuaryRuntime.includes('Game.prototype.v3317LoadOriginalMotion='),'Shared original PNG texture loader must remain');
for(const name of ['v3317EnsureWalkSkin','v3317ShowAction','v3317UpdateGuardianVisuals']){
 assert(!sanctuaryRuntime.includes('Game.prototype.'+name+'='),'Runtime must not shadow final Guardian visual owner '+name);
 assert(visualAuthority.includes('Game.prototype.'+name+'='),'Final authority missing Guardian rendering method '+name);
}
assert(visualAuthority.includes('walk.setTexture(next)'),'Painted walk animation must actually change textures');
assert(visualAuthority.includes("walk:['walk-1','walk-2']")&&visualAuthority.includes("walk:['hop-1','hop-2']"),'Original sprites require genuine paired frames');
assert(visualAuthority.includes("this.v3317LoadAction(type,action,done)"),'Unavailable optional PNG action must fall back to canonical evolution action');
console.log('PASS Guardian single visual owner, two painted walk frames, real action textures and safe fallback');

// Study Now integrates the workshop in one panel; OA mixed queue crosses D772 sections.
const workshop=load('solution-engine.js');new vm.Script(workshop,{filename:'solution-engine.js'});
assert(workshop.includes("if(screen!=='mission')return"),'Reasoning Workshop must not auto-append to Study Guide or Game Realm');
assert(workshop.includes("data-study-view=\"practice\"")&&workshop.includes("data-study-view=\"reasoning\""),'Studio tabs must share the Study Now shell');
const bankCtx={window:{}};vm.runInNewContext(load('lesson-activity-bank.js'),bankCtx);
const sourceTasks=bankCtx.window.MajickLessonActivities.tasks.filter(t=>t.course==='D772');
const begin=workshop.indexOf('function mixTasks(cid)'),end=workshop.indexOf('\nfunction mount(){',begin);
assert(begin>=0&&end>begin,'Mixed section selection implementation missing');
const actual=new Function('BANK',workshop.slice(begin,end)+'\nreturn mixTasks("D772");')({D772:sourceTasks});
assert.equal(actual.length,sourceTasks.length,'Mixed queue lost a real D772 activity');
assert.equal(new Set(actual.map(t=>t.id)).size,sourceTasks.length,'Mixed queue repeats an activity unexpectedly');
assert.deepEqual(actual.slice(0,9).map(t=>Number(t.section)),[1,2,3,1,2,3,1,2,3],'OA workshop must interleave sections 1, 2, and 3 across the actual source bank');
assert(workshop.includes("id:'d772-s1")===false || workshop.includes("mixTasks"),'Mixed course task owner must exist');
console.log('PASS Study Realm workshop: one panel, mixed Section 1/2/3 OA practice, no Guide stack');

const rosterCode=load('sanctuary/sanctuary-roster.js');new vm.Script(rosterCode,{filename:'sanctuary-roster.js'});
assert(rosterCode.includes("evolution_stages/'+canon(g)+'-'+stage(g,scene)+'.webp"),'Six Guardians must render the actual level-specific portraits');
assert(rosterCode.includes("portraitURL(g)"),'If a stage file fails, show the exact canonical portrait');
assert(rosterCode.includes("paintedMotion"),'Diagnostics must distinguish real frame movement from tween movement');
for(const kind of ['vesper','briar','zephyr','prism','rook','solara'])for(const step of ['new-bond','apprentice','guardian','ascendant','celestial'])assert(fs.existsSync(path.join(root,'assets/familiars/evolution_stages',kind+'-'+step+'.webp')),'Missing six-Guardian stage image '+kind+' '+step);
for(const kind of ['luna','ember','nova','mallow'])for(const frame of kind==='mallow'?['hop-1','hop-2']:['walk-1','walk-2'])assert(fs.existsSync(path.join(root,'sanctuary/assets/motion',kind+'-'+frame+'.png')),'Original protected animation frame missing '+kind+' '+frame);
assert(fs.existsSync(path.join(root,'sanctuary/assets/motion/ember-fly.png')),'Existing Cascade flight PNG must be at runtime load path');
console.log('PASS Sanctuary stage portraits (30), originals retained, real walk frame references, existing flight artwork');
