(()=>{
'use strict';
const VERSION='3.3.75';
const GEM={id:'guardian-resonance-gem',name:'Guardian Resonance Gem',xp:125,icon:'◆'};
const WRAPPED=Symbol.for('majickDuplicateSafeHatchV3375');
function reg(){return window.MajickGuardianRegistry||null}
function hash(v){const s=String(v||'egg');let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function eggs(){return Array.isArray(window.S?.legacy?.eggs)?window.S.legacy.eggs.filter(Boolean):[]}
function pets(){return Array.isArray(window.S?.legacy?.pets)?window.S.legacy.pets.filter(Boolean):[]}
function eggFor(input){
 if(input&&typeof input==='object')return input;
 const key=String(input||'');
 return eggs().find(e=>String(e.id||'')===key)||null;
}
function typeOf(raw){
 const r=reg();
 return r?.resolveType?.(raw)||String(raw?.guardianType||raw?.speciesType||raw?.type||raw||'').toLowerCase();
}
function ownedTypes(){return new Set(pets().map(typeOf).filter(Boolean))}
function unownedGuardians(exclude=''){
 const owned=ownedTypes(),r=reg();
 return (r?.all?.()||[]).filter(g=>g?.type&&g.type!==exclude&&!owned.has(g.type));
}
function availableMagicItems(){
 const care=window.MajickGuardianCare;
 const account=care?.ensure?.()||window.S?.majickAccount||{};
 const owned=new Set(Array.isArray(account.guardianOwned)?account.guardianOwned:[]);
 return (care?.catalog||[]).filter(x=>x&&x.id&&!x.disabled&&x.kind!=='consumable'&&x.kind!=='future'&&!owned.has(x.id));
}
function plan(input){
 const egg=eggFor(input)||input;
 if(!egg)return {mode:'normal',reason:'egg-not-found'};
 const fromType=typeOf(egg);
 if(!fromType||!ownedTypes().has(fromType))return {mode:'normal',egg,fromType,reason:'guardian-not-owned'};
 const candidates=unownedGuardians(fromType);
 const roll=hash(egg.id||fromType)%3;
 if(roll===0&&candidates.length){
   const guardian=candidates[hash((egg.id||fromType)+'swap')%candidates.length];
   return {mode:'swap',egg,fromType,toType:guardian.type,guardian,reason:'duplicate-owned'};
 }
 if(roll===2&&availableMagicItems().length){
   const items=availableMagicItems();
   const item=items[hash((egg.id||fromType)+'item')%items.length];
   return {mode:'item',egg,fromType,item,reason:'duplicate-owned'};
 }
 return {mode:'gem',egg,fromType,gem:GEM,reason:'duplicate-owned'};
}
function account(){
 try{return window.MajickStateCore?.ensureAccount?.()||window.MajickGuardianCare?.ensure?.()||window.S?.majickAccount||null}catch(_){return window.S?.majickAccount||null}
}
function history(){
 const a=account();if(!a)return [];
 a.guardianHatchPolicyHistory=Array.isArray(a.guardianHatchPolicyHistory)?a.guardianHatchPolicyHistory:[];
 return a.guardianHatchPolicyHistory;
}
function alreadyHandled(egg){
 const id=String(egg?.id||'');return !!id&&history().some(x=>x.eggId===id);
}
function record(egg,result){
 const h=history(),row={eggId:String(egg?.id||''),at:new Date().toISOString(),...result};
 if(row.eggId&&!h.some(x=>x.eggId===row.eggId))h.unshift(row);
 if(h.length>80)h.length=80;
}
function save(){
 try{window.save?.()}catch(_){}
 try{window.MajickGuardianCare?.broadcastState?.()}catch(_){}
 try{window.render?.()}catch(_){}
}
function removeEgg(egg){
 if(!window.S?.legacy||!Array.isArray(S.legacy.eggs))return false;
 const id=String(egg?.id||'');
 const before=S.legacy.eggs.length;
 S.legacy.eggs=S.legacy.eggs.filter(e=>String(e?.id||'')!==id);
 return S.legacy.eggs.length<before;
}
function notify(title,message){
 try{window.rewardToast?.(title,message)}catch(_){try{console.info(title,message)}catch(_){}}
}
function applySwap(p){
 const egg=p.egg,meta=p.guardian||reg()?.get?.(p.toType)||{};
 egg.originalGuardianType=p.fromType;
 egg.type=p.toType;egg.guardianType=p.toType;egg.speciesType=p.toType;
 if(meta.canon)egg.canon=meta.canon;
 if(meta.species)egg.species=meta.species;
 if(meta.icon)egg.icon=meta.icon;
 egg.duplicateHatchTransmutation={mode:'swap',from:p.fromType,to:p.toType,at:new Date().toISOString()};
 record(egg,{mode:'swap',fromType:p.fromType,toType:p.toType,reward:meta.name||p.toType});
 save();
 notify('✦ Egg transmutation','That Guardian already lives in your Sanctuary, so the egg shifted into '+(meta.name||p.toType)+'.');
 return {ok:true,mode:'swap',egg,toType:p.toType,guardian:meta};
}
function grantGem(p){
 const a=account();if(!a)return {ok:false,mode:'gem'};
 a.guardianInventory=(a.guardianInventory&&typeof a.guardianInventory==='object'&&!Array.isArray(a.guardianInventory))?a.guardianInventory:{};
 a.guardianInventory[GEM.id]=Number(a.guardianInventory[GEM.id]||0)+1;
 try{const pr=window.prog?.();if(pr)pr.xp=Number(pr.xp||0)+GEM.xp;else a.xp=Number(a.xp||0)+GEM.xp}catch(_){a.xp=Number(a.xp||0)+GEM.xp}
 removeEgg(p.egg);
 record(p.egg,{mode:'gem',fromType:p.fromType,reward:GEM.name,xp:GEM.xp});
 save();
 notify(GEM.icon+' '+GEM.name,'Duplicate hatch converted into a resonance gem • +'+GEM.xp+' Majick XP.');
 return {ok:true,converted:true,mode:'gem',reward:GEM,xp:GEM.xp};
}
function grantItem(p){
 const a=account();if(!a||!p.item)return grantGem(p);
 a.guardianOwned=Array.isArray(a.guardianOwned)?a.guardianOwned:[];
 if(!a.guardianOwned.includes(p.item.id))a.guardianOwned.push(p.item.id);
 removeEgg(p.egg);
 record(p.egg,{mode:'item',fromType:p.fromType,reward:p.item.name,itemId:p.item.id});
 save();
 notify((p.item.icon||'✦')+' Magical hatch gift','That Guardian already lives here, so the egg became '+p.item.name+'.');
 return {ok:true,converted:true,mode:'item',reward:p.item};
}
function resolve(input){
 const egg=eggFor(input)||input;
 if(!egg)return {handled:false,plan:{mode:'normal'}};
 if(alreadyHandled(egg))return {handled:false,plan:{mode:'normal',reason:'already-handled'}};
 const p=plan(egg);
 if(p.mode==='normal')return {handled:false,plan:p};
 if(p.mode==='swap'){applySwap(p);return {handled:false,plan:p,swapped:true}}
 if(p.mode==='item')return {handled:true,plan:p,result:grantItem(p)};
 return {handled:true,plan:p,result:grantGem(p)};
}
function wrapGlobalHatch(){
 const fn=window.hatchEgg;
 if(typeof fn!=='function'||fn[WRAPPED])return false;
 const wrapped=function(input){
   const r=resolve(input);
   if(r.handled)return r.result;
   return fn.apply(this,arguments);
 };
 wrapped[WRAPPED]=true;wrapped.__majickOriginal=fn;window.hatchEgg=wrapped;return true;
}
function wrapIncubatorMethod(name){
 const inc=window.MajickCelestialIncubator,fn=inc?.[name];
 if(typeof fn!=='function'||fn[WRAPPED])return false;
 const wrapped=function(input){
   const r=resolve(input);
   if(r.handled)return r.result;
   return fn.apply(this,arguments);
 };
 wrapped[WRAPPED]=true;wrapped.__majickOriginal=fn;inc[name]=wrapped;return true;
}
function install(){
 let changed=wrapGlobalHatch();
 for(const name of ['queue','hatch','complete'])changed=wrapIncubatorMethod(name)||changed;
 return changed;
}
function decorate(){
 const root=document.querySelector?.('.majEggIncubator');if(!root||root.querySelector('.v3375DuplicateSafe'))return;
 const n=document.createElement('div');n.className='v3375DuplicateSafe';
 n.innerHTML='<span>✦</span><div><b>Duplicate-safe hatching is active</b><small>If an egg matches a Guardian already in your Sanctuary, it can transmute into another Guardian, a Guardian Resonance Gem, or a magical item.</small></div>';
 root.insertBefore(n,root.children[1]||null);
}
let tries=0;const timer=setInterval(()=>{install();decorate();if(++tries>=30)clearInterval(timer)},350);
const q=window.MajickRenderQueue;if(q?.register){q.register('duplicate-safe-hatch',()=>{install();decorate()},125);q.schedule()}
window.MajickDuplicateSafeHatch={VERSION,GEM,typeOf,ownedTypes,unownedGuardians,availableMagicItems,plan,resolve,applySwap,grantGem,grantItem,install,decorate,history};
})();