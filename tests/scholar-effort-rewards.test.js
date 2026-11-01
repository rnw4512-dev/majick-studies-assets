// Run: node tests/scholar-effort-rewards.test.js
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const src=fs.readFileSync('current-site/scholar-effort-rewards.js','utf8');
const listeners={};let saved=0;const account={xp:100,xpHighWater:100,crystals:20,rewardCore:{eggFragments:1}};
const document={readyState:'loading',addEventListener:(n,cb)=>listeners[n]=cb,querySelectorAll:()=>[],querySelector:()=>null};
const window={S:{activeCourse:'D772',majickAccount:account},MajickStateCore:{ensureAccount:()=>account},save:()=>saved++};
vm.runInNewContext(src,{window,document,Date,Math,Number,String,Object,Array});
const api=window.MajickScholarEffort;
assert.equal(api.snapshot().fragments,1);
assert.equal(api.grant('mastery','fake',{}),null);
assert.equal(api.grant('feedback','wrong',{feedbackCompleted:false}),null);
assert.equal(api.grant('independent','assisted',{assisted:true,correct:true}),null);
for(let i=0;i<5;i++)assert.ok(api.grant('independent','q'+i,{correct:true,existingReward:true}));
assert.equal(api.snapshot().fragments,2);
assert.equal(api.snapshot().points,0);
assert.equal(api.grant('independent','q0',{correct:true,existingReward:true}),null);
assert.equal(api.snapshot().fragments,2);
assert.equal(account.xp,100);
assert.equal(account.crystals,20);
for(let i=0;i<30;i++)api.grant('learn','lesson'+i,{completed:true,existingReward:true});
assert.equal(api.snapshot().fragments,4); // 3 daily fragment awards max; original fragment remains
assert.equal(api.snapshot().points,10); // unredeemed effort persists after cap
const persisted=JSON.parse(JSON.stringify(account.rewardCore.scholarEffort));
account.rewardCore.scholarEffort=persisted;
assert.equal(api.grant('learn','lesson0',{completed:true}),null);
assert.equal(api.snapshot().points,10);
assert.ok(saved>0);
console.log('Scholar effort duplicate, balance, cap, persistence tests passed');
