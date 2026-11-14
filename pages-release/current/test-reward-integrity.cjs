'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.resolve(process.argv[2]||'current-site','reward-core.js'),'utf8');
const account={xp:100,crystals:10,chests:0,rewardCore:{ledger:{},stats:{correct:0,independent:0,delayed:0,repairs:0},masteryXp:0,eggFragments:0}};
const c={account:()=>account,rewardKey:(_t,ctx)=>ctx.key,baseFor:()=>({xp:5,crystals:1,masteryXp:3,eggFragments:2}),guardianRewards:()=>({}),treasureDrop:()=>null,save(){},pushRewardState(){},showReceipt(){},window:{}};vm.createContext(c);
vm.runInContext(source.slice(source.indexOf('function award('),source.indexOf('function receiptLines')),c);
const receipt=c.award('correct-answer',{key:'guided-contradiction',assisted:true,independent:true,delayed:true,transfer:true});
assert.equal(receipt.masteryXp,0,'assisted data must never gain independent/delayed/transfer mastery bonuses');
assert.equal(receipt.eggFragments,0);assert.equal(account.rewardCore.stats.independent,0);assert.equal(account.rewardCore.stats.delayed,0);
const before=JSON.stringify(account);c.award('correct-answer',{key:'guided-contradiction',assisted:true});assert.equal(JSON.stringify(account),before,'reward replay is read-only');
console.log('PASS assistance overrides contradictory reward flags and ledger replays');
for(const type of ['independent-correct','mixed-transfer-success','micro-skill-mastered','lesson-mastered']){
 const prior=JSON.stringify(account);assert.equal(c.award(type,{key:type,assisted:true}).rejected,'assisted-or-ineligible');assert.equal(JSON.stringify(account),prior);
}
// Exercise the actual legacy adapter with a lexical session and advancing clock.
let clock=1000;const calls=[],session={round:2,index:2,combo:5,assisted:true};
const adapter={window:{grantMoonlight(){},crypto:{randomUUID:()=> 'synthetic-session'}},session,Date:{now:()=>clock++},state:()=>({activeCourse:'D772'}),award:(type,ctx)=>{calls.push({type,ctx});return {xp:8,crystals:1}}};
vm.createContext(adapter);vm.runInContext(source.slice(source.indexOf('let legacyRewardSerial='),source.indexOf('function inspect(){')),adapter);adapter.patchLegacyGameRewards();
adapter.window.grantMoonlight({id:'q',difficulty:3});adapter.window.grantMoonlight({id:'q',difficulty:3});
assert.equal(calls[0].ctx.key,calls[2].ctx.key,'same attempt must not depend on a fresh timestamp');
assert.equal(calls[0].ctx.independent,false);assert.equal(calls[0].ctx.assisted,true);
session.round++;session.assisted=false;adapter.window.grantMoonlight({id:'q',difficulty:3});assert.notEqual(calls[0].ctx.key,calls[4].ctx.key,'a distinct round remains distinct');assert.equal(calls[4].ctx.independent,true,'unassisted gameplay keeps existing potion and reward behavior');
// Journal reads receipts without normalizing or mutating the account.
const journalState={majickAccount:{rewardCore:{ledger:{'<unsafe>':{type:'reward',receipt:{label:'<script>',xp:5,crystals:1}}}}}};
const journal={state:()=>journalState};vm.createContext(journal);
const escapeLine=source.split('\n').find(line=>line.startsWith('const E='));
vm.runInContext(escapeLine+'\n'+source.slice(source.indexOf('function rewardJournalHTML('),source.indexOf('function vaultPanelHTML(')),journal);
const journalBefore=JSON.stringify(journalState),html=journal.rewardJournalHTML();assert(html.includes('&lt;script&gt;'));assert(!html.includes('<unsafe>'));assert(html.includes('Date not recorded'));assert.equal(JSON.stringify(journalState),journalBefore);
console.log('PASS mastery rejection, stable legacy attempt keys and escaped read-only Reward Journal');
