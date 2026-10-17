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
assert(rosterCode.includes("Number(g.level||state.level||1)")&&rosterCode.includes("slug=g.stageSlug||g.stage||state.stageSlug"),'Current saved Guardian stage must outrank legacy Phaser caches');
for(const kind of ['vesper','briar','zephyr','prism','rook','solara'])for(const step of ['new-bond','apprentice','guardian','ascendant','celestial'])assert(fs.existsSync(path.join(root,'assets/familiars/evolution_stages',kind+'-'+step+'.webp')),'Missing six-Guardian stage image '+kind+' '+step);
for(const kind of ['luna','ember','nova','mallow'])for(const frame of kind==='mallow'?['hop-1','hop-2']:['walk-1','walk-2'])assert(fs.existsSync(path.join(root,'sanctuary/assets/motion',kind+'-'+frame+'.png')),'Original protected animation frame missing '+kind+' '+frame);
assert(fs.existsSync(path.join(root,'sanctuary/assets/motion/ember-fly.png')),'Existing Cascade flight PNG must be at runtime load path');
console.log('PASS Sanctuary stage portraits (30), originals retained, real walk frame references, existing flight artwork');

// Immutable-art gate: Git blob SHA-1 includes the exact binary bytes and length.
// Reference captured from main's protected original 33 assets, not newly generated art.
const crypto=require('node:crypto');
const PROTECTED_GUARDIAN_BLOB_SHA1={
  "ember-hop.png": "de6ef0e21e49574fb08ad84130666c6fc5151716",
  "ember-idle.png": "5c0593940a6bc0fd54221cfd0426c789a0fbe7eb",
  "ember-sit.png": "976468894359bfed453a6e5824ec9827c893682d",
  "ember-sleep.png": "dc00a9feca74e65bce3c1079ddc8e88b44456983",
  "ember-slither-1.png": "8ac7ef5bffe2d0e4351775eb68f996ec82472b79",
  "ember-slither-2.png": "7c2cbbe6eb78c2a7c3feaf6269db81b620797c97",
  "ember-walk-1.png": "7f4cd0f725952188b69da23d75fd960dff070c4c",
  "ember-walk-2.png": "6c67f1947a4a002e31beae618b8e07701aa9b757",
  "luna-hop.png": "8ab0d3d7741b499486d626290c9b9b60b6127843",
  "luna-idle.png": "9f91276da1cf75ae03caa59300b95ae768b87745",
  "luna-walk-1.png": "e96b4dc4c42457a33e0bbe700ef5dac90eb5321a",
  "luna-walk-2.png": "ea4a8699f72367ec65e816b8b21f401b2bccc673",
  "mallow-binky.png": "14d48e22d075073e604e1203b2fbeca4195d414f",
  "mallow-fly-1.png": "3bd9f16a28b20b92f6bcb282fe75e82605c65e23",
  "mallow-fly-2.png": "fe5ef5b9aa7f9f8889a72874a3d647369b39fa60",
  "mallow-hop-1.png": "2d563d7de66e04f5d42502752875eb07fbdc7786",
  "mallow-hop-2.png": "bd7435fb2d5c1fac053f970205882c169fdad3b2",
  "mallow-idle.png": "ccc2cbb417e2c08fc4e4fb40ae1905f7500d044a",
  "mallow-land.png": "1ba0ba359db946a4776d332d41fe73adb18c4625",
  "mallow-paw.png": "fca8c6cdc5a222abdec08a0608232cbcaf17646b",
  "mallow-sit.png": "e0b63ac58efd379401e9d3e334476e610a53c29a",
  "mallow-sleep.png": "1b8c9dd583f8c274271b9ba14d3b100bcaa4ed03",
  "nova-hop.png": "18b138d1ada82323ced19f09d8762e0b789c4814",
  "nova-paw.png": "c0c92e3ddef29535d6b1599d09f1c2ce09d47b86",
  "nova-pounce.png": "49819012358c9507496430e61562ad13a2d13982",
  "nova-pounce2.png": "9d25af87c5c83b1433fcf23fe963c7b5d7ff6e2b",
  "nova-pounce3.png": "cf0f66d4be8de60d3ebe4dbd9b469bd48178c53e",
  "nova-run.png": "1777ba6eb6977bb2e293e0fcc5bba617c49d0cff",
  "nova-sit.png": "4c81574337cf1ff039038f75798fedb2569353c4",
  "nova-sleep.png": "e75761e8a725bd90c1174301c1acfdb9f3043f70",
  "nova-spin.png": "1bac918bde43976fc9ba506f4ade21547d0cde92",
  "nova-walk-1.png": "b21745a0a2b5bb7ad12f4589f11b8fb2bf30d57d",
  "nova-walk-2.png": "23af933428715d198aba992bb522f6c37ccb4db8"
};
assert.equal(Object.keys(PROTECTED_GUARDIAN_BLOB_SHA1).length,33);
for(const [file,expectedSha] of Object.entries(PROTECTED_GUARDIAN_BLOB_SHA1)){
 const bytes=fs.readFileSync(path.join(root,'sanctuary/assets/motion',file));
 const actualSha=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\\0')).update(bytes).digest('hex');
 assert.equal(actualSha,expectedSha,'Protected Guardian original changed: '+file);
}
console.log('PASS protected Guardian artwork: all 33 original binary assets byte-identical');
