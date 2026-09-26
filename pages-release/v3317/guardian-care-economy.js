(function(){
'use strict';

const VERSION=2;
const FALLBACK_META={
  luna:{name:'Velora',species:'Moon Cat',icon:'☾',favoriteItem:'velvet-moon-cushion',favoriteLabel:'Velvet Moon Cushion'},
  ember:{name:'Cascade',species:'Pocket Dragon',icon:'◇',favoriteItem:'rune-puzzle',favoriteLabel:'Rune Puzzle'},
  nova:{name:'Solstice',species:'Star Fox',icon:'✦',favoriteItem:'comet-ball',favoriteLabel:'Comet Ball'},
  mallow:{name:'Aurelia',species:'Winged Bunny',icon:'♡',favoriteItem:'moonflower-plush',favoriteLabel:'Moonflower Plush'},
  vesper:{name:'Vesper',species:'Starlight Owl',icon:'✧',favoriteItem:'celestial-feather-wand',favoriteLabel:'Celestial Feather Wand'},
  briar:{name:'Briar',species:'Moonlit Fawn',icon:'❀',favoriteItem:'moonvine-plush',favoriteLabel:'Moonvine Plush'},
  zephyr:{name:'Zephyr',species:'Cloud Ferret',icon:'🔔',favoriteItem:'ribbon-comet',favoriteLabel:'Ribbon Comet Toy'},
  prism:{name:'Prism',species:'Crystal Axolotl',icon:'◇',favoriteItem:'crystal-bubble-orb',favoriteLabel:'Crystal Bubble Orb'},
  rook:{name:'Rook',species:'Twilight Raven',icon:'🪶',favoriteItem:'strategy-rune-tokens',favoriteLabel:'Strategy Rune Tokens'},
  solara:{name:'Solara',species:'Sunrise Hedgehog',icon:'☀',favoriteItem:'sunburst-ball',favoriteLabel:'Sunburst Ball'}
};

const CATALOG=[
  {id:'moonberry-meal',name:'Moonberry Familiar Meals',icon:'✦',cost:6,kind:'consumable',qty:3,desc:'Three nourishing familiar meals. Used when you Feed a Guardian.'},
  {id:'starlight-treat',name:'Starlight Treats',icon:'☆',cost:8,kind:'consumable',qty:3,desc:'Three tiny celebratory treats that raise affection and fun.'},
  {id:'moon-silver-brush',name:'Moon-Silver Grooming Brush',icon:'☾',cost:16,kind:'tool',desc:'Permanent grooming tool. Makes Brush & Groom available forever.'},
  {id:'comet-ball',name:'Comet Ball',icon:'◉',cost:18,kind:'toy',desc:'An enchanted chase toy. Solstice especially loves it.'},
  {id:'celestial-feather-wand',name:'Celestial Feather Wand',icon:'✧',cost:20,kind:'toy',desc:'A floating feather toy. Vesper gets a favorite-item bond bonus.'},
  {id:'moonflower-plush',name:'Moonflower Plush',icon:'❀',cost:20,kind:'toy',desc:'A soft enchanted plush. Aurelia especially loves it.'},
  {id:'rune-puzzle',name:'Rune Puzzle',icon:'◇',cost:22,kind:'toy',desc:'A reusable puzzle toy. Cascade gets a favorite-item bond bonus.'},
  {id:'velvet-moon-cushion',name:'Velvet Moon Cushion',icon:'☾',cost:24,kind:'comfort',desc:'A permanent velvet comfort item. Velora especially loves it.'},
  {id:'moonvine-plush',name:'Moonvine Plush',icon:'❀',cost:20,kind:'toy',desc:'A soft moonvine fawn plush. Briar treats it like a tiny garden companion.'},
  {id:'ribbon-comet',name:'Ribbon Comet Toy',icon:'🎐',cost:18,kind:'toy',desc:'A fast enchanted ribbon toy made for Zephyr’s momentum bursts.'},
  {id:'crystal-bubble-orb',name:'Crystal Bubble Orb',icon:'◌',cost:20,kind:'toy',desc:'A floating reflective orb that Prism can chase and watch shimmer.'},
  {id:'strategy-rune-tokens',name:'Strategy Rune Tokens',icon:'♟',cost:22,kind:'toy',desc:'A set of moving rune pieces. Rook gets a favorite-item bond bonus.'},
  {id:'sunburst-ball',name:'Sunburst Ball',icon:'☀',cost:18,kind:'toy',desc:'A warm glowing ball that Solara loves to nudge around the Sanctuary.'},
  {id:'guardian-bell-collar',name:'Celestial Bell Collar',icon:'✦',cost:28,kind:'accessory',desc:'A collectible Guardian accessory for the dress-up system.'},
  {id:'sanctuary-upgrade-token',name:'Sanctuary Expansion Seal',icon:'⌂',cost:75,kind:'future',disabled:true,desc:'Reserved for future dorm-room expansion.'}
];

const DEFAULT_NEEDS={hunger:82,hydration:86,energy:84,fun:78,grooming:86,affection:82,bond:0};
const DECAY_PER_HOUR={hunger:1.15,hydration:1.35,energy:.8,fun:.55,grooming:.24,affection:.30};
const NEED_KEYS=['hunger','hydration','energy','fun','grooming','affection'];

const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)||0));
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}};

function normalizeOwnedCollection(a){
  const raw=a?.guardianOwned;
  let next=[];
  if(Array.isArray(raw))next=raw;
  else if(raw instanceof Set)next=[...raw];
  else if(typeof raw==='string'&&raw.trim())next=[raw.trim()];
  else if(raw&&typeof raw==='object'){
    if(Array.isArray(raw.items))next=raw.items;
    else next=Object.entries(raw).filter(([,v])=>!!v).map(([k])=>k);
  }
  next=[...new Set(next.filter(Boolean).map(String))];
  a.guardianOwned=next;
  return next;
}
function normalizeGuardianInventory(a){
  const raw=a?.guardianInventory;
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)){
    a.guardianInventory=raw;
    return raw;
  }
  const next={};
  if(Array.isArray(raw)){
    for(const id of raw)next[String(id)]=(Number(next[String(id)]||0)+1);
  }
  a.guardianInventory=next;
  return next;
}

function canon(type){
  const reg=window.MajickGuardianRegistry?.get?.(type);
  try{
    const c=window.V338_CANON?.[type]||window.v338Canon?.(type);
    if(c||reg)return {
      name:c?.display||reg?.name||type,
      species:c?.species||reg?.species||type,
      icon:c?.sigil||reg?.icon||'✦',
      favoriteObject:c?.favorite||reg?.favoriteLabel||'Sanctuary treasure',
      ...(FALLBACK_META[type]||{}),
      ...(reg||{})
    };
  }catch(_){}
  return reg||FALLBACK_META[type]||{name:type||'Guardian',species:'Guardian',icon:'✦',favoriteItem:'celestial-feather-wand',favoriteLabel:'Celestial Feather Wand'};
}
function ownedPets(){
  return Array.isArray(window.S?.legacy?.pets)?S.legacy.pets.filter(Boolean):[];
}
function incubatingEggs(){
  return Array.isArray(window.S?.legacy?.eggs)?S.legacy.eggs.filter(Boolean):[];
}
function petById(id){
  return ownedPets().find(p=>p.id===id)||null;
}
function petByType(type){
  return ownedPets().find(p=>p.type===type)||null;
}
function resolvePet(target){
  if(target&&typeof target==='object'&&target.id)return target;
  const key=String(target||'');
  return petById(key)||petByType(key)||null;
}
function activePetSafe(){
  try{
    const p=activePet();
    if(p)return p;
  }catch(_){}
  const id=window.S?.legacy?.activePetId;
  return petById(id)||ownedPets()[0]||null;
}

function ensureAccount(){
  try{window.MajickCourseManager?.ensure?.()}catch(_){}
  if(!window.S)return {};
  S.majickAccount=S.majickAccount||{xp:0,crystals:0,chests:0,schemaVersion:1};
  const a=S.majickAccount;
  a.guardianCare=a.guardianCare||{schemaVersion:VERSION,lastDecayAt:Date.now(),guardians:{},log:[],focusPetId:null};
  a.guardianCare.schemaVersion=VERSION;
  a.guardianCare.guardians=a.guardianCare.guardians||{};
  a.guardianCare.log=Array.isArray(a.guardianCare.log)?a.guardianCare.log:[];
  normalizeGuardianInventory(a);
  const owned=normalizeOwnedCollection(a);
  if(!owned.includes('starter-ribbon-toy'))owned.push('starter-ribbon-toy');

  const pets=ownedPets();
  for(const pet of pets){
    // Migrate the early type-key prototype automatically if it exists.
    if(!a.guardianCare.guardians[pet.id]&&a.guardianCare.guardians[pet.type]){
      a.guardianCare.guardians[pet.id]={...a.guardianCare.guardians[pet.type]};
    }
    const g=a.guardianCare.guardians[pet.id]||(a.guardianCare.guardians[pet.id]={...DEFAULT_NEEDS});
    for(const k of NEED_KEYS)g[k]=clamp(g[k]??DEFAULT_NEEDS[k],25,100);
    g.bond=Math.max(Number(pet.bond||0),Number(g.bond||0));
    g.petId=pet.id;
    g.type=pet.type;
    g.lastCareAt=g.lastCareAt||null;
    g.lastAction=g.lastAction||null;
    g.affectionCooldownUntil=Number(g.affectionCooldownUntil||0);
    pet.bond=Math.max(Number(pet.bond||0),g.bond);
  }

  if(!petById(a.guardianCare.focusPetId)){
    a.guardianCare.focusPetId=activePetSafe()?.id||pets[0]?.id||null;
  }
  applyDecay(a);
  return a;
}

function applyDecay(a){
  if(!a?.guardianCare)return;
  const care=a.guardianCare;
  const now=Date.now();
  const last=Number(care.lastDecayAt||now);
  const hours=Math.min(36,Math.max(0,(now-last)/3600000));
  if(hours<.05)return;
  const ids=new Set(ownedPets().map(p=>p.id));
  for(const [id,g] of Object.entries(care.guardians||{})){
    if(!ids.has(id))continue;
    for(const [k,rate] of Object.entries(DECAY_PER_HOUR)){
      g[k]=clamp(g[k]-hours*rate,25,100);
    }
  }
  care.lastDecayAt=now;
}

function state(target){
  const a=ensureAccount(),pet=resolvePet(target)||activePetSafe();
  if(!pet)return null;
  return a.guardianCare.guardians[pet.id]||null;
}
function averageNeeds(g){
  return g?NEED_KEYS.reduce((n,k)=>n+clamp(g[k]),0)/NEED_KEYS.length:0;
}
function moodInfo(g){
  const avg=averageNeeds(g);
  if(avg>=88)return {label:'Radiant',icon:'✦'};
  if(avg>=74)return {label:'Content',icon:'☾'};
  if(avg>=60)return {label:'Cozy',icon:'♡'};
  return {label:'Ready for a little care',icon:'✧'};
}
function crystalBalance(){
  try{
    const a=window.MajickStateCore?.ensureAccount?.();
    if(a&&Number.isFinite(Number(a.crystals)))return Number(a.crystals);
  }catch(_){}
  try{
    if(S?.majickAccount&&Number.isFinite(Number(S.majickAccount.crystals)))return Number(S.majickAccount.crystals);
  }catch(_){}
  try{return Number(prog()?.crystals||0)}catch(_){return 0}
}
function inventoryCount(id){
  const a=ensureAccount();
  return Number(normalizeGuardianInventory(a)[id]||0);
}
function owns(id){
  const a=ensureAccount();
  return normalizeOwnedCollection(a).includes(id);
}
function saveCare(){
  const a=ensureAccount();
  for(const pet of ownedPets()){
    const g=a.guardianCare.guardians[pet.id];
    if(g)pet.bond=Math.max(Number(pet.bond||0),Number(g.bond||0));
  }
  try{save()}catch(e){console.warn('Guardian care save',e)}
}
function logCare(pet,action,message){
  const a=ensureAccount(),g=a.guardianCare.guardians[pet.id];
  a.guardianCare.log.unshift({petId:pet.id,type:pet.type,name:pet.name,action,message,at:new Date().toISOString()});
  a.guardianCare.log=a.guardianCare.log.slice(0,60);
  g.lastCareAt=new Date().toISOString();
  g.lastAction=action;
}
function consume(id,n=1){
  const a=ensureAccount(),inv=normalizeGuardianInventory(a),have=Number(inv[id]||0);
  if(have<n)return false;
  inv[id]=have-n;
  return true;
}
function addOwned(id){
  const a=ensureAccount(),owned=normalizeOwnedCollection(a);
  if(!owned.includes(id))owned.push(id);
}
function addInventory(id,n){
  const a=ensureAccount(),inv=normalizeGuardianInventory(a);
  inv[id]=Number(inv[id]||0)+Number(n||0);
}
function change(g,changes){
  for(const [k,v] of Object.entries(changes)){
    if(k==='bond')g.bond=Math.max(0,Number(g.bond||0)+Number(v||0));
    else g[k]=clamp(Number(g[k]||0)+Number(v||0),25,100);
  }
}
function favoriteForPet(pet){
  const meta=canon(pet?.type);
  return {id:meta.favoriteItem||'celestial-feather-wand',label:meta.favoriteLabel||meta.favoriteObject||'Sanctuary treasure'};
}
function favoriteOwned(pet){
  return owns(favoriteForPet(pet).id);
}
function bestToy(pet){
  const fav=favoriteForPet(pet).id;
  if(fav&&owns(fav))return fav;
  const ids=CATALOG.filter(x=>x.kind==='toy'||x.kind==='comfort').map(x=>x.id);
  return ids.find(owns)||'starter-ribbon-toy';
}
function assignedBed(pet){
  try{
    const beds=S?.v3311?.sanctuaryState?.bedAssignments||{};
    const found=Object.entries(beds).find(([,guardian])=>guardian===pet.id||guardian===pet.type);
    if(found)return found[0];
  }catch(_){}
  const idx=Math.max(0,ownedPets().findIndex(p=>p.id===pet.id));
  if(idx===0)return 'bed-west';
  if(idx===1)return 'bed-east';
  return 'guardian-bed-'+String(pet.id||pet.type||idx).replace(/[^a-zA-Z0-9_-]/g,'-');
}
function resultBase(pet,action){
  const g=state(pet),meta=canon(pet.type);
  return {ok:true,guardianId:pet.id,guardianType:pet.type,name:pet.name||meta.name,action,state:g,icon:meta.icon,visualAction:'play'};
}

function performAction(target,action,opts={}){
  const pet=resolvePet(target);
  if(!pet)return {ok:false,action,message:'That Guardian is not currently in your bonded roster.'};

  const a=ensureAccount(),g=a.guardianCare.guardians[pet.id],meta=canon(pet.type),r=resultBase(pet,action);
  let msg='',favoriteBonus=false;

  if(action==='feed'){
    if(!consume('moonberry-meal',1))return {ok:false,guardianId:pet.id,guardianType:pet.type,action,message:'You are out of Moonberry Familiar Meals. Visit the Moon Crystal Boutique.',needsShop:true};
    change(g,{hunger:34,affection:3,bond:3});
    msg=(pet.name||meta.name)+' happily finishes a Moonberry meal and looks noticeably more content.';
    r.icon='✦';
  }else if(action==='water'){
    change(g,{hydration:38,bond:1});
    msg=(pet.name||meta.name)+' drinks from the enchanted water basin. The water shimmers as they finish.';
    r.icon='◌';
  }else if(action==='treat'){
    if(!consume('starlight-treat',1))return {ok:false,guardianId:pet.id,guardianType:pet.type,action,message:'You are out of Starlight Treats. Visit the Moon Crystal Boutique.',needsShop:true};
    change(g,{hunger:10,fun:8,affection:12,bond:4});
    msg=(pet.name||meta.name)+' takes the Starlight Treat and gives you a very pleased little reaction.';
    r.icon='☆';
  }else if(action==='groom'){
    if(!owns('moon-silver-brush'))return {ok:false,guardianId:pet.id,guardianType:pet.type,action,message:'You need the Moon-Silver Grooming Brush from the Boutique first.',needsShop:true};
    change(g,{grooming:38,affection:8,bond:4});
    msg=(pet.name||meta.name)+' relaxes while you brush and groom them. Their coat and aura look immaculate.';
    r.icon='✧';
  }else if(action==='play'){
    const toy=opts.itemId||bestToy(pet);
    favoriteBonus=toy===favoriteForPet(pet).id&&owns(toy);
    change(g,{fun:favoriteBonus?44:32,energy:-4,affection:6,bond:favoriteBonus?7:4});
    const item=CATALOG.find(x=>x.id===toy);
    msg=(pet.name||meta.name)+' plays with '+(item?.name||'the Sanctuary ribbon toy')+'.'+(favoriteBonus?' It is one of their favorite things, and the bond magic flares brighter.':'');
    r.icon=favoriteBonus?'✦':'♡';
    r.itemId=toy;
    r.favoriteBonus=favoriteBonus;
  }else if(action==='sleep'){
    const bed=opts.objectId||assignedBed(pet);
    S.v3311=S.v3311||{};
    S.v3311.sanctuaryState=S.v3311.sanctuaryState||{bedAssignments:{}};
    S.v3311.sanctuaryState.bedAssignments=S.v3311.sanctuaryState.bedAssignments||{};
    const beds=S.v3311.sanctuaryState.bedAssignments;
    const already=beds[bed]===pet.id||beds[bed]===pet.type;

    // A Guardian owns one active bed at a time. Moving beds clears the old slot
    // instead of leaving stale double assignments behind.
    for(const [slot,guardian] of Object.entries(beds)){
      if(slot!==bed&&(guardian===pet.id||guardian===pet.type))delete beds[slot];
    }
    const displaced=beds[bed];
    if(displaced&&displaced!==pet.id&&displaced!==pet.type){
      const other=resolvePet(displaced);
      const otherState=other?a.guardianCare.guardians[other.id]:null;
      if(otherState?.preferredBed===bed)otherState.preferredBed=null;
    }
    beds[bed]=pet.id;
    change(g,{energy:48,affection:3,bond:already?5:2});
    g.preferredBed=bed;
    msg=(pet.name||meta.name)+(already?' settles into their familiar bed and immediately relaxes.':' chooses this bed as a favorite resting place.');
    r.icon='☾';
    r.visualAction='sleep';
    r.travelObject=bed;
  }else if(action==='affection'){
    const now=Date.now(),cool=Number(g.affectionCooldownUntil||0);
    if(now<cool){
      change(g,{affection:5});
      msg=(pet.name||meta.name)+' leans into the affection. The bond is already glowing from your recent attention.';
      r.rewardCooledDown=true;
    }else{
      change(g,{affection:28,bond:4});
      g.affectionCooldownUntil=now+10*60*1000;
      msg=(pet.name||meta.name)+' melts into the attention and your familiar bond brightens.';
    }
    r.icon='♡';
  }else{
    return {ok:false,guardianId:pet.id,guardianType:pet.type,action,message:'That Guardian-care action is not available yet.'};
  }

  // When care starts from a physical Sanctuary object, send moving Guardians
  // to that exact object before their reaction. The movement controller itself
  // remains untouched.
  if(action!=='sleep'&&['feed','water','treat','groom','play'].includes(action)){
    const defaults={
      feed:'guardian-food-bowl',
      water:'guardian-water-basin',
      treat:'guardian-treat-jar',
      groom:'guardian-brush',
      play:'guardian-play-rug'
    };
    r.travelObject=String(opts.objectId||defaults[action]||'');
  }

  logCare(pet,action,msg);
  r.message=msg;
  r.state=g;
  r.mood=moodInfo(g);
  r.snapshot=snapshot();
  saveCare();
  return r;
}

function buy(id){
  const it=CATALOG.find(x=>x.id===id);
  if(!it||it.disabled)return {ok:false,message:'That item is not available yet.'};
  if(it.kind!=='consumable'&&owns(id))return {ok:false,message:it.name+' is already in your collection.'};

  let p=null;
  try{p=prog()}catch(_){}
  const account=window.MajickStateCore?.ensureAccount?.()||ensureAccount();
  const balance=Number(account?.crystals??p?.crystals??0);
  if(balance<it.cost)return {ok:false,message:'You need '+(it.cost-balance)+' more Moon Crystals.'};

  const nextBalance=balance-it.cost;
  if(account)account.crystals=nextBalance;
  // Legacy course progress remains a compatibility mirror. If it is not already
  // bound to the account ledger, synchronize it once without subtracting twice.
  if(p&&Number(p.crystals)!==nextBalance)p.crystals=nextBalance;

  if(it.kind==='consumable')addInventory(it.id,it.qty||1);
  else addOwned(it.id);

  saveCare();
  try{glitterBurst?.(36)}catch(_){}
  try{rewardToast(it.icon+' '+it.name+' acquired!','-'+it.cost+' ◆ • Your studying paid for this.')}catch(_){}
  return {ok:true,item:it,balance:crystalBalance(),snapshot:snapshot()};
}

function eggSnapshot(){
  return incubatingEggs().map(egg=>{
    const meta=canon(egg.type);
    const progress=Number(egg.progress||0),goal=Math.max(1,Number(egg.goal||1));
    return {
      id:egg.id,type:egg.type,name:meta.name,species:meta.species,icon:meta.icon,
      progress,goal,pct:Math.min(100,Math.round(progress/goal*100)),
      moonlightLeft:Math.max(0,goal-progress),source:egg.source||'mystery'
    };
  });
}

function snapshot(){
  const a=ensureAccount();
  applyDecay(a);
  const roster=ownedPets().map(pet=>{
    const g=a.guardianCare.guardians[pet.id],meta=canon(pet.type),fav=favoriteForPet(pet);
    return {
      petId:pet.id,type:pet.type,name:pet.name||meta.name,species:meta.species,icon:meta.icon,
      phaser:!!window.V338_CANON?.[pet.type]?.phaser,
      ...g,
      favoriteItem:fav.id,favoriteLabel:fav.label,favoriteOwned:favoriteOwned(pet),
      playItem:bestToy(pet),
      mood:moodInfo(g)
    };
  });
  const guardians={};
  roster.forEach(x=>{guardians[x.petId]=x});
  const byType={};
  roster.forEach(x=>{if(!byType[x.type])byType[x.type]=x});
  return {
    schemaVersion:VERSION,
    crystals:crystalBalance(),
    inventory:{...normalizeGuardianInventory(a)},
    owned:[...normalizeOwnedCollection(a)],
    focusPetId:a.guardianCare.focusPetId,
    roster,guardians,byType,
    bedAssignments:{...(S?.v3311?.sanctuaryState?.bedAssignments||{})},
    eggs:eggSnapshot(),
    catalog:CATALOG.filter(x=>!x.disabled).map(x=>({id:x.id,name:x.name,kind:x.kind,cost:x.cost,qty:x.qty||1,icon:x.icon}))
  };
}

function meter(label,value,icon){
  const n=Math.round(clamp(value));
  return '<div class="majCareMeter"><span>'+icon+' '+label+'</span><b>'+n+'%</b><i><em style="width:'+n+'%"></em></i></div>';
}

function selectCarePet(petId){
  const a=ensureAccount();
  if(!petById(petId))return;
  a.guardianCare.focusPetId=petId;
  saveCare();
  try{render()}catch(_){}
}

function eggIncubatorHTML(snap){
  if(!snap.eggs.length)return '<div class="majEggEmpty">✦ No Guardian egg is incubating right now. Keep studying and opening rewards to discover another.</div>';
  return '<div class="majEggIncubator"><div><div class="eyebrow">CELESTIAL INCUBATOR</div><h3>'+snap.eggs.length+' Guardian Egg'+(snap.eggs.length===1?'':'s')+' Growing</h3><p>Correct answers add moonlight. The egg hatches through studying—not purchases.</p></div>'+
    '<div class="majEggGrid">'+snap.eggs.map(e=>'<article><span class="majEgg">🥚</span><div><b>'+E(e.species)+' Egg</b><small>'+e.progress+'/'+e.goal+' moonlight • '+e.moonlightLeft+' left</small><i><em style="width:'+e.pct+'%"></em></i></div></article>').join('')+'</div></div>';
}

function guardianCareHTML(target){
  const snap=snapshot();
  if(!snap.roster.length){
    return '<section class="majGuardianCare"><div class="majCareHead"><div><div class="eyebrow">FAMILIAR CARE</div><h2>Your first Guardian is still waiting to awaken</h2><p>Study to hatch a Guardian, then their personal care room will appear here.</p></div></div>'+eggIncubatorHTML(snap)+'</section>';
  }

  const requested=resolvePet(target);
  const focus=petById(requested?.id||snap.focusPetId)||activePetSafe()||ownedPets()[0];
  if(focus&&snap.focusPetId!==focus.id){
    ensureAccount().guardianCare.focusPetId=focus.id;
  }
  const g=snap.guardians[focus.id],meta=canon(focus.type);
  const meal=snap.inventory['moonberry-meal']||0,treat=snap.inventory['starlight-treat']||0,brush=snap.owned.includes('moon-silver-brush');
  const toy=bestToy(focus),toyName=CATALOG.find(x=>x.id===toy)?.name||'Sanctuary Ribbon Toy';

  const rosterTabs=snap.roster.map(r=>'<button class="majGuardianTab '+(r.petId===focus.id?'active':'')+'" onclick="majickSelectCareGuardian(\''+E(r.petId)+'\')"><span>'+E(r.icon||'✦')+'</span><b>'+E(r.name)+'</b><small>'+E(r.mood?.label||'Guardian')+'</small></button>').join('');

  return '<section class="majGuardianCare" data-guardian-id="'+E(focus.id)+'">'+
    '<div class="majGuardianRoster">'+rosterTabs+'</div>'+
    '<div class="majCareHead"><div><div class="eyebrow">FAMILIAR CARE • SANCTUARY BOND</div><h2>'+E(g.name)+' is '+E(g.mood.label)+'</h2><p>'+E(g.species)+' • Care supports your bond; studying remains what drives XP, crystals, egg moonlight, and evolution.</p></div><div class="majBondSeal"><span>'+E(meta.icon)+'</span><b>'+Math.round(g.bond)+' Bond</b></div></div>'+
    '<div class="majCareGrid">'+
      '<div class="majCareMeters">'+
        meter('Hunger',g.hunger,'✦')+meter('Hydration',g.hydration,'◌')+meter('Energy',g.energy,'☾')+
        meter('Fun',g.fun,'☆')+meter('Grooming',g.grooming,'✧')+meter('Affection',g.affection,'♡')+
      '</div>'+
      '<div class="majCareActions">'+
        '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'feed\')">Feed <small>Meal × '+meal+'</small></button>'+
        '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'water\')">Fresh Water <small>Free</small></button>'+
        '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'treat\')">Give Treat <small>Treat × '+treat+'</small></button>'+
        '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'groom\')">Brush & Groom <small>'+(brush?'Brush owned':'Needs brush')+'</small></button>'+
        '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'play\')">Play <small>'+E(toyName)+'</small></button>'+
        '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'affection\')">Affection <small>Bond moment</small></button>'+
        '<button class="majCareSanctuary" onclick="navigate(\'companions\')">Use Sanctuary Bed <small>Rest + bond</small></button>'+
      '</div>'+
    '</div>'+
    '<div class="majFavorite"><span>Favorite item</span><b>'+E(g.favoriteLabel)+'</b><em>'+(g.favoriteOwned?'Owned • favorite-play bonus active':'Find it in the Moon Crystal Boutique')+'</em></div>'+
    eggIncubatorHTML(snap)+
  '</section>';
}

function catalogHTML(){
  const snap=snapshot();
  return '<section class="majCareShop">'+
    '<div class="majCareShopHead"><div><div class="eyebrow">FAMILIAR PROVISIONS • MOON CRYSTAL BOUTIQUE</div><h2>Care for the Guardians you have actually bonded with</h2><p>Study sessions earn crystals. Spend them on food, treats, toys, grooming tools, accessories, and Sanctuary comforts. Eggs hatch from study moonlight, never from purchases.</p></div><span class="rankBadge">◆ '+snap.crystals+' crystals</span></div>'+
    '<div class="majCareInventory"><span>✦ Meals × '+(snap.inventory['moonberry-meal']||0)+'</span><span>☆ Treats × '+(snap.inventory['starlight-treat']||0)+'</span><span>✧ Brush '+(snap.owned.includes('moon-silver-brush')?'owned':'not owned')+'</span><span>♡ Toys '+snap.owned.filter(id=>CATALOG.some(x=>x.id===id&&x.kind==='toy')).length+'</span><span>🐾 Guardians '+snap.roster.length+'</span><span>🥚 Eggs '+snap.eggs.length+'</span></div>'+
    '<div class="majCareShopGrid">'+CATALOG.filter(x=>!x.disabled).map(it=>{
      const owned=it.kind!=='consumable'&&snap.owned.includes(it.id);
      const count=it.kind==='consumable'?(snap.inventory[it.id]||0):null;
      const favorites=snap.roster.filter(g=>g.favoriteItem===it.id).map(g=>g.name);
      return '<article class="'+(owned?'owned':'')+'"><span class="majShopIcon">'+it.icon+'</span><h3>'+E(it.name)+'</h3><p>'+E(it.desc)+'</p>'+
        (favorites.length?'<div class="majShopFavorite">♡ Favorite of '+E(favorites.join(', '))+'</div>':'')+
        '<small>'+(it.kind==='consumable'?'Inventory: '+count:'Permanent unlock')+'</small>'+
        '<footer><b>◆ '+it.cost+'</b><button class="btn '+(owned?'good':'violet')+'" onclick="majickBuyCareItem(\''+it.id+'\')" '+(owned?'disabled':'')+'>'+(owned?'Owned':it.kind==='consumable'?'Buy bundle':'Unlock')+'</button></footer></article>';
    }).join('')+'</div>'+
  '</section>';
}

function toastFromResult(r){
  try{
    if(r.ok)rewardToast((r.icon||'✦')+' '+(r.name||'Guardian')+' care',r.message);
    else rewardToast('Moon Crystal Boutique',r.message);
  }catch(_){if(!r.ok)alert(r.message)}
}

window.majickSelectCareGuardian=function(petId){selectCarePet(petId)};
window.majickCareAction=function(target,action,opts={}){
  const r=performAction(target,action,opts);
  toastFromResult(r);
  if(r.needsShop){try{navigate('vault')}catch(_){}}
  try{render()}catch(_){}
  broadcastState();
  return r;
};
window.majickBuyCareItem=function(id){
  const r=buy(id);
  if(!r.ok){try{alert(r.message)}catch(_){};return r}
  try{render()}catch(_){}
  broadcastState();
  return r;
};

function compactCareDockHTML(){
  const snap=snapshot();
  if(!snap.roster.length){
    return '<section class="majCareDock"><div><div class="eyebrow">GUARDIAN CARE</div><b>No hatched Guardian yet</b><small>Keep studying to grow your incubating egg.</small></div></section>';
  }
  const focus=petById(snap.focusPetId)||activePetSafe()||ownedPets()[0];
  const g=snap.guardians[focus.id];
  const needs=['hunger','hydration','energy','fun','grooming','affection'];
  const low=needs.map(k=>({k,v:Number(g[k]??100)})).sort((a,b)=>a.v-b.v)[0];
  const label={hunger:'Food',hydration:'Water',energy:'Rest',fun:'Play',grooming:'Grooming',affection:'Affection'}[low.k]||'Care';
  const tabs=snap.roster.map(r=>'<button class="majCareDockPet '+(r.petId===focus.id?'active':'')+'" onclick="majickSelectCareGuardian(\''+E(r.petId)+'\')">'+E(r.name)+'</button>').join('');
  return '<section class="majCareDock" data-guardian-id="'+E(focus.id)+'">'+
    '<div class="majCareDockCopy"><div class="eyebrow">TAKE CARE • '+snap.roster.length+' OWNED GUARDIAN'+(snap.roster.length===1?'':'S')+'</div><div class="majCareDockTitle"><b>'+E(g.name)+'</b><span>'+E(g.mood?.icon||'✦')+' '+E(g.mood?.label||'Bonded')+' • '+label+' '+Math.round(low.v)+'% • Bond '+Math.round(g.bond)+'</span></div><div class="majCareDockRoster">'+tabs+'</div></div>'+
    '<div class="majCareDockActions">'+
      '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'feed\')">Feed</button>'+
      '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'water\')">Water</button>'+
      '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'play\')">Play</button>'+
      '<button onclick="majickCareAction(\''+E(focus.id)+'\',\'affection\')">Affection</button>'+
      '<button class="detail" onclick="majickToggleCareDetails()">Care Details</button>'+
    '</div>'+
  '</section>';
}
window.majickToggleCareDetails=function(){
  window.__majickCareDetailsOpen=!window.__majickCareDetailsOpen;
  try{render()}catch(_){}
};
const oldCompanion=window.companionHTML;
if(typeof oldCompanion==='function'){
  window.companionHTML=function(){
    const base=oldCompanion();
    const detail=window.__majickCareDetailsOpen?guardianCareHTML():'';
    return compactCareDockHTML()+detail+base;
  };
}
const oldVault=window.vaultHTML;
if(typeof oldVault==='function'){
  window.vaultHTML=function(){
    return oldVault()+catalogHTML();
  };
}

function broadcastState(target){
  const payload={type:'MAJICK_CARE_STATE_V3317',snapshot:snapshot()};
  if(target){
    try{target.postMessage(payload,location.origin)}catch(_){}
    return;
  }
  document.querySelectorAll('.v3317SanctuaryFrame').forEach(f=>{
    try{f.contentWindow?.postMessage(payload,location.origin)}catch(_){}
  });
}

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  if(d.type==='MAJICK_SANCTUARY_READY_V3317'||d.type==='MAJICK_CARE_STATE_REQUEST_V3317'){
    broadcastState(ev.source);
    return;
  }
  if(d.type==='MAJICK_CARE_ACTION_V3317'){
    const target=d.guardianId||d.guardianType||d.guardian;
    const r=performAction(target,d.action,{objectId:d.objectId,itemId:d.itemId});
    const payload={type:'MAJICK_CARE_RESULT_V3317',result:r,snapshot:snapshot()};
    try{ev.source?.postMessage(payload,location.origin)}catch(_){}
    broadcastState();
    if(r.needsShop){
      try{rewardToast('Guardian provisions needed',r.message)}catch(_){}
    }
    try{render()}catch(_){}
    return;
  }
  if(d.type==='MAJICK_OPEN_CARE_SHOP_V3317'){
    try{navigate('vault')}catch(_){}
  }
});

ensureAccount();
setTimeout(()=>broadcastState(),200);
window.MajickGuardianCare={
  ensure:ensureAccount,state,snapshot,performAction,buy,catalog:CATALOG,normalizeOwnedCollection,normalizeGuardianInventory,
  ownedPets,incubatingEggs,guardianCareHTML,compactCareDockHTML,catalogHTML,broadcastState,moodInfo,bestToy,assignedBed,canon
};
})();