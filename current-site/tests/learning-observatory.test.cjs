/* Run: node --test current-site/tests/learning-observatory.test.cjs */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../learning-observatory.js'),'utf8');
function boot({answers=[],events={},meetingHistory='[]'}={}){
 const nodes=new Map(),listeners={};
 class Element{
  constructor(id){this.id=id;this.innerHTML='';this.children=[];this.value='';this.onclick=null;this.style={};this.className='';this.focused=false;}
  append(node){this.children.push(node);if(node.id)nodes.set(node.id,node);}
  after(node){this.append(node)}
  remove(){nodes.delete(this.id)}
  focus(){this.focused=true}
  click(){this.onclick?.()}
  querySelector(selector){return new Element(selector)}
  getAttribute(){return null}
  setAttribute(){}
 }
 const storage=new Map([['majick-d756-task2-rehearsal-v1-history',meetingHistory]]);
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))};
 const nav=new Element('nav');nodes.set('nav',nav);
 const document={
  readyState:'loading',
  activeElement:new Element('original-focus'),
  addEventListener:(name,callback)=>listeners[name]=callback,
  createElement:tag=>new Element(tag),
  getElementById:id=>nodes.get(id)||null,
  querySelector:selector=>selector.includes('.nav')?nav:null,
  body:{append:el=>nodes.set(el.id,el)},
  head:{append:el=>nodes.set(el.id,el)}
 };
 class MutationObserver{observe(){}}
 const app={progress:{D772:{answers}},majickAccount:{studyProgressBridge:{events:{...events}}}};
 const window={S:app,localStorage,MajickRewardCore:{award(){throw new Error('No reward should be awarded while viewing Learning Observatory')}}};
 vm.runInNewContext(source,{window,document,localStorage,MutationObserver,console,Date,Math,setTimeout(){},clearTimeout(){},Blob,URL});
 listeners.DOMContentLoaded?.();
 return {window,document,nodes,app,storage,nav};
}
test('opens the Observatory with historical answers and never changes saved course progress',()=>{
 const t=Date.now(),answers=[
  {qid:'1',correct:true,assisted:true,at:t-200000,topicId:'bias',source:'guided'},
  {qid:'2',correct:false,assisted:false,at:t-150000,topicId:'bias',source:'independent'},
  {qid:'3',correct:true,at:t-100000,topicId:'bias',source:'unlabeled'}
 ];
 const env=boot({answers});
 const before=JSON.stringify(env.app);
 assert.equal(env.window.MajickLearningObservatory.summary().attempts,3);
 env.window.MajickLearningObservatory.open();
 const view=env.nodes.get('majLearningObservatory').innerHTML;
 assert.match(view,/Learning Observatory/);
 assert.match(view,/Unknown mode/);
 assert.match(view,/Independent accuracy/);
 assert.match(view,/Evidence coverage/);
 assert.equal(JSON.stringify(env.app),before,'read-only Observatory must preserve app study state');
});
test('deduplicates forwarded answers that are also present in the shared ledger',()=>{
 const key='D772:one:1',t=Date.now()-1000;
 const env=boot({
  answers:[{qid:'one',guardianBridgeKey:key,correct:true,assisted:false,at:t,topicId:'independent'}],
  events:{[key]:{course:'D772',correct:true,independent:true,at:t}}
 });
 assert.equal(env.window.MajickLearningObservatory.summary().attempts,1);
});
test('reads completed D756 rehearsals without treating the rehearsal as mastery or awarding XP',()=>{
 const attempts=JSON.stringify([{done:true,completedAt:Date.now(),profile:'angela',mode:'independent',assessment:{passed:true,checks:[]},reward:{xp:30}}]);
 const env=boot({meetingHistory:attempts});
 assert.equal(env.window.MajickLearningObservatory.summary().meetings,1);
 env.window.MajickLearningObservatory.open();
 const html=env.nodes.get('majLearningObservatory').innerHTML;
 assert.match(html,/D756 meeting practice/);
 assert.match(html,/not official Mursion scoring/i);
});
test('shows recorded Game Realm sessions without claiming independent academic mastery',()=>{
 const env=boot();
 env.app.progress.D772.realmSessions=[{key:'hex:1:1',gameId:'hex-breaker',score:7,total:10,won:true,at:Date.now(),masteryEligible:false}];
 env.window.MajickLearningObservatory.open();
 const html=env.nodes.get('majLearningObservatory').innerHTML;
 assert.match(html,/Game Realm sessions \(scores, not mastery\)/);
 assert.match(html,/hex-breaker/);
 assert.match(html,/70%/);
});
test('shows an evidence warning rather than inventing missing mastery results',()=>{
 const env=boot();
 env.window.MajickLearningObservatory.open();
 const html=env.nodes.get('majLearningObservatory').innerHTML;
 assert.match(html,/No timestamped skill records yet/);
 assert.match(html,/No independent skill evidence available/);
 assert.match(html,/No completed meeting history/);
});
