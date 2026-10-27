// Run: node tests/study-realm-persistence-regression.test.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('current-site/wgu-practice.js','utf8');
const extract=(start,end)=>{const a=src.indexOf(start),b=src.indexOf(end,a+start.length);assert(a>=0&&b>a,'missing '+start);return src.slice(a,b)};
const code=extract('const CHECKPOINT_PREFIX=', 'function trackSkillAnswer(q){');
function environment(course='D772'){
 const store=new Map(),localStorage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)};
 const ctx={window:{S:{activeCourse:course,screen:'mission'}},localStorage,console,Date,JSON,session:null,activeD772(){return ctx.window.S.activeCourse==='D772'}};
 vm.createContext(ctx);vm.runInContext(code,ctx);return {ctx,store};
}
const question={id:'unique-1',prompt:'Test',options:['A','B'],answer:'A'};
const sample={type:'test',current:question,questions:[question],answered:false,adaptiveTracked:false,review:[]};
{
 const {ctx}=environment();ctx.session=structuredClone(sample);ctx.checkpointSession();ctx.session=null;
 assert.equal(ctx.restoreSessionCheckpoint(),true,'reload during recovery restores question');
 assert.equal(ctx.session.current.id,question.id);
 assert.equal(ctx.session.answered,false);
}
{
 const {ctx}=environment();ctx.session={...structuredClone(sample),answered:true,adaptiveTracked:true,chosen:'A'};
 ctx.checkpointSession();ctx.session=null;assert.equal(ctx.restoreSessionCheckpoint(),true);
 assert.equal(ctx.session.answered,true);assert.equal(ctx.session.adaptiveTracked,true,'answered reload cannot re-award mastery');
}
{
 const {ctx,store}=environment();ctx.session=structuredClone(sample);ctx.checkpointSession();
 ctx.window.S.activeCourse='D756';ctx.session=null;assert.equal(ctx.restoreSessionCheckpoint(),false,'another course cannot inherit D772 question');
 ctx.window.S.activeCourse='D772';assert.equal(ctx.restoreSessionCheckpoint(),true);
 assert.equal(store.size,1);
}
assert(src.includes('filter(a=>!a.assisted)'),'independent denominator excludes guided attempts');
assert(src.includes('if(!session?.answered||session.current!==q||session.adaptiveTracked)return'),'duplicate evidence guarded');
assert(src.includes('checkpointSession();\n}\nfunction practiceFeedback'),'checkpoint follows evidence recording');
console.log('Study Realm checkpoint and evidence regression checks passed');
