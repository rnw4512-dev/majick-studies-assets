'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site');
(async()=>{
 const pets=[{id:'briar-a',name:'Briar',type:'moonlit-fawn'},{id:'briar-b',name:'Briar',type:'briar'},{id:'custom',name:'Briar',type:'crystal-axolotl'}];
 const before=JSON.stringify(pets),account={sanctuaryFurniture:{owned:['future-item'],stored:['future-item'],positions:{'arcane-stacks':{x:360,y:740}}},rewardCore:{sanctuary:{positions:{'magic-mirror':{x:1500,y:700}}}}};
 const st={legacy:{pets,pixiSanctuaryPositions:{'arcane-stacks':{x:400,y:720},'moonlit-study-desk':{x:1000,y:800}},pixiSanctuaryStored:['guardian-brush']},majickAccount:account};
 const context={window:{S:st,v3321PushFurnitureState:()=>{},MajickStateCore:{ensureAccount:()=>account}},console,localStorage:{getItem:()=>'{"arcane-stacks":{"x":200,"y":700}}'},fetch:async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,'sanctuary/assets/objects/objects-manifest.json')))}),save:()=>{context.saved++},saved:0};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'guardian-registry.js'),'utf8'),context);
 const registry=context.window.MajickGuardianRegistry;
 for(const meta of registry.all()){
  assert.equal(registry.resolveType(meta.species.toLowerCase().replaceAll(' ','-')),meta.type);
  assert.equal(registry.resolveType({type:meta.species, name:'Renamed Guardian'}),meta.type);
  for(const stage of registry.stages)assert(fs.existsSync(path.join(root,'assets/familiars/evolution_stages',meta.canon+'-'+stage.slug+'.webp')));
 }
 assert.equal(registry.getFor(pets[0]).canon,'briar');assert.equal(registry.getFor(pets[1]).name,'Briar');assert.equal(registry.getFor(pets[2]).canon,'prism');assert.equal(registry.getFor(pets[2]).name,'Briar');assert.equal(JSON.stringify(pets),before);
 const source=fs.readFileSync(path.join(root,'app-runtime.js'),'utf8'),start=source.indexOf('let furnitureManifest=null;'),end=source.indexOf('\ninitializeFurniture().catch',start);
 vm.runInContext(source.slice(start,end),context);
 const api=context.window.MajickSanctuaryState;await api.initialize();const room=api.room();
 assert.equal(room.owned.length,16);assert(room.owned.includes('future-item'));assert(room.stored.includes('future-item'));assert(room.stored.includes('guardian-brush'));
 assert.equal(room.positions['arcane-stacks'].x,360);assert.equal(room.positions['moonlit-study-desk'].x,1000);assert.equal(room.positions['magic-mirror'].x,1500);
 api.change('arcane-stacks',{position:{x:2000,y:870},stored:true});assert.equal(room.positions['arcane-stacks'].x,2000);assert(room.stored.includes('arcane-stacks'));
 // A repeated read/initialize must not reapply obsolete legacy placements.
 await api.initialize();assert.equal(api.room(),room);assert.equal(room.positions['arcane-stacks'].x,2000);
 api.change('arcane-stacks',{stored:false});assert(!room.stored.includes('arcane-stacks'));
 assert.throws(()=>api.change('not-owned',{stored:false}),/inventory/);assert.throws(()=>api.change('arcane-stacks',{position:{x:2500,y:700}}),/floor/);
 assert.equal(JSON.stringify(pets),before);assert.equal(account.sanctuaryFurniture,room);
 const storage=new Map(),navState={screen:'home',progress:{D772:{answers:[{qid:'saved-answer',correct:true}]}}};
 const nav={window:{S:navState},sessionStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console};
 nav.window.navigate=route=>{navState.screen=route};vm.createContext(nav);
 vm.runInContext(source.slice(source.indexOf("const NAV_STACK_KEY="),source.indexOf('function ensureBackStyles()')),nav);
 nav.window.navigate('games');
 const route=nav.window.navigate;let cleanup=0;
 nav.window.navigate=destination=>{cleanup++;return route(destination)};
 const progress=JSON.stringify(navState.progress);nav.window.majickBack();
 assert.equal(navState.screen,'home');assert.equal(cleanup,1,'Back must use later route adapters');assert.equal(JSON.stringify(navState.progress),progress);
 console.log('PASS Back uses current navigation cleanup, prior room history and unchanged learner progress');
 console.log('PASS Sanctuary registry: ten species aliases, renamed identities, duplicate Briars and fifty stage assets');
 console.log('PASS shared furniture: non-destructive legacy migration, inventory preservation, position validation, store/place and repeatability');
})().catch(error=>{console.error(error);process.exitCode=1});
