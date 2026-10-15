'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert').strict;
const root=path.resolve(process.argv[2]||'current-site'),storage={progress:{D772:{}}},window={S:storage,MajickRenderQueue:{register(){},schedule(){}}},ctx=vm.createContext({window,document:{addEventListener(){}},console});
for(const file of ['d772-preassessment-source.js','d772-preassessment-deep-practice.js','d772-preassessment-review.js','d772-adaptive-mastery.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const m=window.MajickD772AdaptiveMastery;assert.equal(m.topics.length,5);
for(const t of m.topics){
 const pool=m.bank(t);assert(pool.length>=3,'Enough distinct questions: '+t.id);
 const c=m.cycle(t);assert.equal(c.stage,'diagnostic');
 const q=m.pick(t,'diagnostic',c);let r=m.answer(t,(q.correct+1)%q.choices.length);assert.equal(r.correct,false);assert.equal(c.stage,'repair');
 m.next(t);assert.equal(c.stage,'independent');const ind=m.pick(t,'independent',c);assert.notEqual(ind.id,q.id);m.answer(t,ind.correct);assert.equal(c.stage,'transfer');
 const transfer=m.pick(t,'transfer',c);assert.notEqual(transfer.id,q.id);assert.notEqual(transfer.id,ind.id);m.answer(t,transfer.correct);assert.equal(c.stage,'teaching');
 let fail=m.submitTeach(t,'short','misconception','model-and-recheck','new-case');assert(fail.error);
 const good=m.submitTeach(t,'I would identify the mistaken reasoning, draw a correct example step by step, then ask students to explain the correction with a fresh problem independently.','misconception','model-and-recheck','new-case');
 assert(good.correct);assert.equal(c.stage,'review');assert.equal(c.status,'evidence-awaiting-review');assert.equal(c.teaching.status,'evidence-awaiting-review');
 assert.equal(c.attempts.filter(x=>!x.assisted).length,2);
 m.reset(t);assert.equal(m.cycle(t).stage,'diagnostic');assert.equal(m.cycle(t).serial,1);
}
assert.equal(window.S.majickAccount,undefined);assert.equal(window.S.progress.D772.answers,undefined);
console.log('PASS adaptive D772: distinct diagnostic/independent/transfer questions, wrong-answer repair, structured teaching evidence, save-state isolation and no false mastery credit');
