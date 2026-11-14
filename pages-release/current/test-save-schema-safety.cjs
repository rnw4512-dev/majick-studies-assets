'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = path.resolve(process.argv[2] || 'current-site');
const clone = x => JSON.parse(JSON.stringify(x));
const prefix = 'majick-d756-task2-rehearsal-v1';
function profile() {
  return {saveSchemaVersion:1, courses:{D772:{},D756:{}},
    progress:{D772:{answers:[{qid:'historic',correct:true}]},D756:{answers:[{qid:'meeting'}]}},
    futureField:{supported:true},v3311:{grimoire:{notes:{chapter:'kept'},bookmarks:['chapter']}},
    legacy:{pets:[{id:'guardian',type:'velora',stage:'guardian'}],eggs:[{id:'egg',progress:9}]},
    majickAccount:{xp:700,crystals:50,inventory:{robe:1},rewardCore:{ledger:{earned:{xp:20}},alchemyTransactions:{brew:{id:'brew'}}}}};
}
function fixture() {
  const data = new Map(), messages = []; let fail = () => false, state = profile(), refreshes=0;
  const storage = {get length(){return data.size},key:i=>[...data.keys()][i]??null,
    getItem:k=>data.get(k)??null,setItem(k,v){if(fail(k,v))throw Error('Storage quota');data.set(k,String(v))},
    removeItem(k){if(fail(k,null))throw Error('Storage quota');data.delete(k)}};
  const c = {localStorage:storage,CustomEvent:class {},dispatchEvent(){},confirm:()=>true,alert:x=>messages.push(x)};
  c.window=c; vm.runInNewContext(fs.readFileSync(path.join(source,'save-safety.js'),'utf8'),c);
  const api=c.MajickSaveSafety;
  api.attach({get:()=>state,set:x=>{state=x},refresh:()=>refreshes++});
  data.set(api.keys.KEY,JSON.stringify(state));
  return {api,data,messages,storage,get state(){return state},get refreshes(){return refreshes},failWith:f=>{fail=f}};
}
async function importPayload(f,payload) {
  const event={target:{files:[{text:async()=>JSON.stringify(payload)}],value:'chosen'}};
  await f.api.importFile(event);assert.equal(event.target.value,'');
}
(async()=>{
  // Adapted from PR #260: all four recovery sources must respect future primary saves.
  for(const key of ['PREVIOUS','PIN','__good_backup','__session_backup']) {
    const f=fixture(), raw=JSON.stringify({...profile(),saveSchemaVersion:2});
    f.data.set(f.api.keys.KEY,raw);
    f.data.set(f.api.keys[key]||f.api.keys.KEY+key,JSON.stringify(profile()));
    assert.throws(()=>f.api.read(),/newer schema/);
    assert.equal(f.data.get(f.api.keys.KEY),raw);assert(!f.data.has(f.api.keys.BAD));
    assert.equal(f.api.status().ok,false);
  }
  for(const key of ['PREVIOUS','PIN','__good_backup','__session_backup']) {
    const f=fixture();f.data.set(f.api.keys.KEY,'{broken');
    f.data.set(f.api.keys[key]||f.api.keys.KEY+key,JSON.stringify(profile()));
    assert.deepEqual(clone(f.api.read()),profile());assert.equal(f.data.get(f.api.keys.BAD),'{broken');
  }
  for(const backup of ['{bad','null',JSON.stringify({...profile(),saveSchemaVersion:2}),JSON.stringify({courses:{},progress:{D772:{answers:'bad'}}})]) {
    const f=fixture();f.data.set(f.api.keys.KEY,'{broken');f.data.set(f.api.keys.PREVIOUS,backup);
    assert.throws(()=>f.api.read(),/could not be read/);assert.equal(f.data.get(f.api.keys.KEY),'{broken');
    assert.equal(f.data.get(f.api.keys.BAD),'{broken');assert.equal(f.api.status().ok,false);
  }
  {
    const f=fixture();f.data.set(prefix+':course',JSON.stringify({transcript:['parent','student'],history:[{mode:'independent'}]}));
    const payload=clone(f.api.exportPayload(f.state));assert.deepEqual(clone(f.api.preview(payload)),profile());
    const destination=fixture();await importPayload(destination,payload);
    assert.deepEqual(clone(destination.state),profile());assert.equal(destination.data.get(prefix+':course'),f.data.get(prefix+':course'));
    assert.equal(destination.refreshes,1);assert.match(destination.messages[0],/restored/);
  }
  {
    const f=fixture(),older=profile();older.majickAccount={xp:1,crystals:0,rewardCore:{ledger:{},alchemyTransactions:{}}};
    older.legacy={pets:[],eggs:[{id:'hatched'}]};f.state.legacy.pets.push({id:'new-guardian',sourceEggId:'hatched',stage:'ascendant'});
    await importPayload(f,{state:older,browserData:{}});
    assert.equal(f.state.majickAccount.xp,700);assert.equal(f.state.majickAccount.crystals,50);
    assert(f.state.majickAccount.rewardCore.ledger.earned);assert(f.state.majickAccount.rewardCore.alchemyTransactions.brew);
    assert(f.state.legacy.pets.some(p=>p.id==='new-guardian'));assert(!f.state.legacy.eggs.some(e=>e.id==='hatched'));
  }
  for(const payload of [{schemaVersion:2,state:profile()},{state:{...profile(),saveSchemaVersion:2}},
    {state:profile(),browserData:{unrelated:'{}'}},{state:profile(),browserData:{[prefix]:'{bad'}}]) {
    const f=fixture(),before=[...f.data];await importPayload(f,payload);
    assert.deepEqual([...f.data],before);assert.equal(f.refreshes,0);assert.match(f.messages[0],/not imported/);
  }
  {
    const f=fixture(),prior=f.data.get(f.api.keys.KEY);f.failWith(()=>true);
    assert.throws(()=>f.api.write({...profile(),futureField:{changed:true}}),/quota/);
    assert.equal(f.data.get(f.api.keys.KEY),prior);assert.equal(f.api.status().ok,false);
    await importPayload(f,{state:profile()});assert.equal(f.data.get(f.api.keys.KEY),prior);assert.equal(f.refreshes,0);
  }
  {
    const f=fixture();f.failWith(k=>k===f.api.keys.PREVIOUS);
    const next=profile();next.futureField.changed=true;
    assert.equal(f.api.write(next).backupOk,false);assert.deepEqual(JSON.parse(f.data.get(f.api.keys.KEY)),next);
    assert.match(f.api.status().message,/snapshot unavailable/);
  }
  // A failure after a new auxiliary key was written must also remove that key on rollback.
  {
    const f=fixture(),before=f.data.get(f.api.keys.KEY),old=JSON.stringify({history:['original']});
    f.data.set(prefix+':existing',old);let thrown=false;
    f.failWith(k=>{if(k===prefix+':fail'&&!thrown){thrown=true;return true}return false});
    const incoming=profile();incoming.progress.D756.answers.push({qid:'imported'});
    await importPayload(f,{state:incoming,browserData:{[prefix+':new']:'{}',[prefix+':existing']:'{}',[prefix+':fail']:'{}'}});
    assert.equal(f.data.get(f.api.keys.KEY),before);assert.equal(f.data.get(prefix+':existing'),old);
    assert(!f.data.has(prefix+':new'),'partial import must remove new Council keys');
    assert.deepEqual(clone(f.state),profile());assert.equal(f.refreshes,0);assert.match(f.messages[0],/not imported/);
  }
  console.log('PASS save-schema protection, corruption recovery, full roundtrip, earned rewards, invalid imports, quota and partial Council rollback');
})().catch(error=>{console.error(error);process.exitCode=1});
