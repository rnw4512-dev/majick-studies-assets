const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{},document:{addEventListener(){}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('current-site/d772-shared-oa-questions.js','utf8'),ctx);
const bank=ctx.window.MajickD772SharedQuestions.questions,added=bank.filter(q=>q.id.startsWith('d772-oa-expansion-'));
assert.equal(added.length,24);assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
for(const q of added){assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.answer));assert(q.why&&q.sourceLabel.includes('NOT OFFICIAL'));
 const d=q.data;
 if(q.skill==='weighted-mean')assert.equal(q.answer,`${((d.counts[0]*d.means[0]+d.counts[1]*d.means[1])/(d.counts[0]+d.counts[1])).toFixed(1)} minutes`);
 if(q.skill==='exactly-one-without-replacement')assert.equal(q.answer,(2*d.red*d.blue/((d.red+d.blue)*(d.red+d.blue-1))).toFixed(3));
 if(q.skill==='complement-multistage')assert.equal(q.answer,(1-(1-d.rate)**d.trials).toFixed(3));
 if(q.skill==='conditional-denominator'){assert.equal(Object.values(d).reduce((a,b)=>a+b),100);assert.equal(q.answer,`${d.both}/${d.both+d.deliveryOnly}`)}
 if(q.skill==='iqr-outlier'){const x=d.values;assert.equal((x[5]+x[6]-x[1]-x[2])/2,8);assert(d.newValue>(x[5]+x[6])/2+12)}
 assert.equal(added.filter(x=>x.skill===q.skill).length,3);
}
vm.runInContext(fs.readFileSync('current-site/question-repair.js','utf8'),ctx);
const source=fs.readFileSync('current-site/room-section-nav.js','utf8');vm.runInContext(source.slice(source.indexOf('function queueExamFollowup'),source.indexOf('function examDeck')),ctx);
const a=added[0],peer=added.find(q=>q.id!==a.id&&q.skill===a.skill),other=added.find(q=>q.skill!==a.skill);
const state={deck:[a,other,peer],index:0};assert(ctx.queueExamFollowup(state,a));assert.equal(state.deck[1].id,peer.id);assert.equal(new Set(state.deck.map(q=>q.id)).size,3);
assert.equal(ctx.queueExamFollowup({deck:[peer,a,other],index:1},a),false);
console.log('24 new items: schema, numeric evidence, skill coverage and unseen follow-up routing passed');
