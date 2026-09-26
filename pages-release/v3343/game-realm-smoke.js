const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/game-realm.js','utf8');
const context={document:{documentElement:{dataset:{}}},session:{type:'moonword',items:[
  {term:'Sample',def:'Part of a population',choice:'Sample',ok:true},
  {term:'Sample',def:'The selected individuals',choice:'Population',ok:false},
  {term:'Population',def:'The full group',choice:null,ok:null}
]},
  prog:()=>({answers:[]}),questionPool:()=>[],resultHTML:()=>'',esc:s=>String(s),
  pickAdaptive:pool=>pool[0],moonwordPick:(i,v)=>{context.session.items[i].choice=v;context.session.items[i].ok=v===context.session.items[i].term}
};
vm.createContext(context);vm.runInContext(src,context);
let html=context.moonwordHTML();
assert.match(html,/1\/2 used/,'Word with two clues must remain available after its first use');
assert.doesNotMatch(html,/realmWord used[^>]*><span>Sample/,'Repeated term must not be crossed off early');
context.moonwordPick(1,'Sample');html=context.moonwordHTML();
assert.match(html,/realmWord used[^>]*><span>Sample/,'Word must cross off after both correct uses');
context.session={type:'boss',questions:['q1']};
assert.equal(context.pickAdaptive([{id:'q1'},{id:'q2'}]).id,'q2','Do not repeat an in-session question when another is available');
context.session.questions=['q1','q2'];
assert.ok(context.pickAdaptive([{id:'q1'},{id:'q2'}]),'Small question pools must still work after exhaustion');
console.log('GAME REALM SMOKE PASSED');
