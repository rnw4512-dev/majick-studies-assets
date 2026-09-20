(function(){
'use strict';

const VERSION=1;
const TYPES=['luna','ember','nova','mallow'];
const GUARDIANS={
  luna:{name:'Velora',icon:'☾',favoriteItem:'velvet-moon-cushion',favoriteLabel:'Velvet Moon Cushion'},
  ember:{name:'Cascade',icon:'✧',favoriteItem:'rune-puzzle',favoriteLabel:'Rune Puzzle'},
  nova:{name:'Solstice',icon:'✦',favoriteItem:'comet-ball',favoriteLabel:'Comet Ball'},
  mallow:{name:'Aurelia',icon:'♡',favoriteItem:'moonflower-plush',favoriteLabel:'Moonflower Plush'}
};

const CATALOG=[
  {id:'moonberry-meal',name:'Moonberry Familiar Meals',icon:'✦',cost:6,kind:'consumable',qty:3,desc:'Three nourishing familiar meals. Used when you Feed a Guardian.'},
  {id:'starlight-treat',name:'Starlight Treats',icon:'☆',cost:8,kind:'consumable',qty:3,desc:'Three tiny celebratory treats that raise affection and fun.'},
  {id:'moon-silver-brush',name:'Moon-Silver Grooming Brush',icon:'☾',cost:16,kind:'tool',desc:'Permanent grooming tool. Makes Brush/Groom available forever.'},
  {id:'comet-ball',name:'Comet Ball',icon:'◉',cost:18,kind:'toy',desc:'A permanent enchanted play toy. Solstice especially loves it.'},
  {id:'celestial-feather-wand',name:'Celestial Feather Wand',icon:'✧',cost:20,kind:'toy',desc:'A permanent floating feather toy for playful familiar sessions.'},
  {id:'moonflower-plush',name:'Moonflower Plush',icon:'❀',cost:20,kind:'toy',desc:'A soft enchanted plush. Aurelia gets a favorite-item bond bonus.'},
  {id:'rune-puzzle',name:'Rune Puzzle',icon:'◇',cost:22,kind:'toy',desc:'A reusable puzzle toy. Cascade gets a favorite-item bond bonus.'},
  {id:'velvet-moon-cushion',name:'Velvet Moon Cushion',icon:'☾',cost:24,kind:'comfort',desc:'A permanent velvet comfort item. Velora gets a favorite-item bond bonus.'},
  {id:'guardian-bell-collar',name:'Celestial Bell Collar',icon:'✦',cost:28,kind:'accessory',desc:'A collectible Guardian accessory for later dress-up expansion.'},
  {id:'sanctuary-upgrade-token',name:'Sanctuary Expansion Seal',icon:'⌂',cost:75,kind:'future',disabled:true,desc:'Reserved for the future dorm-room expansion system.'}
];

const DEFAULT_NEEDS={hunger:82,hydration:86,energy:84,fun:78,grooming:86,affection:82,bond:0};
const DECAY_PER_HOUR={hunger:1.15,hydration:1.35,energy:.8,fun:.55,grooming:.24,affection:.30};
const NEED_KEYS=['hunger','hydration','energy','fun','grooming','affection'];

const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)||0));
const escCare=s=>{try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}};

function legacyPet(type){
  return (window.S?.legacy?.pets||[]).find(p=>p.type===type)||null;
}
function activeGuardianType(){
  try{return activePet()?.type||window.S?.legacy?.pets?.[0]?.type||'luna'}catch(_){return window.S?.legacy?.pets?.[0]?.type||'luna'}
}
function ensureAccount(){
  try{window.MajickCourseManager?.ensure?.()}catch(_){}
  if(!window.S)return {};
  S.majickAccount=S.majickAccount||{xp:0,crystals:0,chests:0,schemaVersion:1};
  const a=S.majickAccount;
  a.guardianCare=a.guardianCare||{schemaVersion:VERSION,lastDecayAt:Date.now(),guardians:{},log:[]};
  a.guardianCare.schemaVersion=VERSION;
  a.guardianCare.guardians=a.guardianCare.guardians||{};
  a.guardianCare.log=Array.isArray(a.guardianCare.log)?a.guardianCare.log:[];
  a.guardianInventory=a.guardianInventory||{};
  a.guardianOwned=Array.isArray(a.guardianOwned)?a.guardianOwned:[];
  if(!a.guardianOwned.includes('starter-ribbon-toy'))a.guardianOwned.push('starter-ribbon-toy');

  for(const type of TYPES){
    const g=a.guardianCare.guardians[type]||(a.guardianCare.guardians[type]={...DEFAULT_NEEDS});
    for(const k of NEED_KEYS)g[k]=clamp(g[k]??DEFAULT_NEEDS[k],25,100);
    g.bond=Math.max(0,Number(g.bond||0));
    g.favoriteItem=GUARDIANS[type].favoriteItem;
    g.lastCareAt=g.lastCareAt||null;
    g.lastAction=g.lastAction||null;
    g.affectionCooldownUntil=Number(g.affectionCooldownUntil||0);
    const pet=legacyPet(type);
    if(pet)pet.bond=Math.max(Number(pet.bond||0),g.bond);
  }
  applyDecay(a);
  return a;
}

function applyDecay(a=ensureAccount()){
  const care=a.guardianCare;
  const now=Date.now();
  const last=Number(care.lastDecayAt||now);
  const hours=Math.min(36,Math.max(0,(now-last)/3600000));
  if(hours<.05)return;
  for(const type of TYPES){
    const g=care.guardians[type];
    for(const [k,rate] of Object.entries(DECAY_PER_HOUR)){
      g[k]=clamp(g[k]-hours*rate,25,100);
    }
  }
  care.lastDecayAt=now;
}
function state(type){
  const a=ensureAccount();
  applyDecay(a);
  return a.guardianCare.guardians[type]||a.guardianCare.guardians.luna;
}
function averageNeeds(g){
  return NEED_KEYS.reduce((n,k)=>n+clamp(g[k]),0)/NEED_KEYS.length;
}
function moodInfo(g){
  const avg=averageNeeds(g);
  if(avg>=88)return {label:'Radiant',icon:'✦'};
  if(avg>=74)return {label:'Content',icon:'☾'};
  if(avg>=60)return {label:'Cozy',icon:'♡'};
  return {label:'Ready for a little care',icon:'✧'};
}
function crystalBalance(){
  try{return Number(prog()?.crystals||0)}catch(_){return Number(S?.majickAccount?.crystals||0)}
}
function inventoryCount(id){
  const a=ensureAccount();
  return Number(a.guardianInventory[id]||0);
}
function owns(id){
  return ensureAccount().guardianOwned.includes(id);
}
function saveCare(){
  for(const type of TYPES){
    const pet=legacyPet(type),g=state(type);
    if(pet)pet.bond=Math.max(Number(pet.bond||0),Number(g.bond||0));
  }
  try{save()}catch(e){console.warn('Guardian care save',e)}
}
function logCare(type,action,message){
  const a=ensureAccount(),g=a.guardianCare.guardians[type];
  a.guardianCare.log.unshift({type,action,message,at:new Date().toISOString()});
  a.guardianCare.log=a.guardianCare.log.slice(0,60);
  g.lastCareAt=new Date().toISOString();
  g.lastAction=action;
}
function consume(id,n=1){
  const a=ensureAccount();
  const have=Number(a.guardianInventory[id]||0);
  if(have<n)return false;
  a.guardianInventory[id]=have-n;
  return true;
}
function addOwned(id){
  const a=ensureAccount();
  if(!a.guardianOwned.includes(id))a.guardianOwned.push(id);
}
function addInventory(id,n){
  const a=ensureAccount();
  a.guardianInventory[id]=Number(a.guardianInventory[id]||0)+Number(n||0);
}
function change(g,changes){
  for(const [k,v] of Object.entries(changes)){
    if(k==='bond')g.bond=Math.max(0,Number(g.bond||0)+Number(v||0));
    else g[k]=clamp(Number(g[k]||0)+Number(v||0),25,100);
  }
}
function favoriteOwned(type){
  return owns(GUARDIANS[type]?.favoriteItem);
}
function bestToy(type){
  const favorite=GUARDIANS[type]?.favoriteItem;
  if(favorite&&owns(favorite))return favorite;
  const ids=['comet-ball','celestial-feather-wand','moonflower-plush','rune-puzzle','velvet-moon-cushion'];
  return ids.find(owns)||'starter-ribbon-toy';
}
function assignedBed(type){
  try{
    const beds=S?.v3311?.sanctuaryState?.bedAssignments||{};
    const found=Object.entries(beds).find(([,guardian])=>guardian===type);
    if(found)return found[0];
  }catch(_){}
  return (type==='luna'||type==='mallow')?'bed-west':'bed-east';
}

function resultBase(type,action){
  const g=state(type),meta=GUARDIANS[type]||GUARDIANS.luna;
  return {ok:true,guardian:type,name:meta.name,action,state:g,icon:meta.icon,visualAction:'play'};
}

function performAction(type,action,opts={}){
  if(!TYPES.includes(type))type=activeGuardianType();
  const a=ensureAccount(),g=a.guardianCare.guardians[type],meta=GUARDIANS[type],r=resultBase(type,action);
  let msg='',favoriteBonus=false;

  if(action==='feed'){
    if(!consume('moonberry-meal',1))return {ok:false,guardian:type,action,message:'You are out of Moonberry Familiar Meals. Visit the Moon Crystal Boutique.',needsShop:true};
    change(g,{hunger:34,affection:3,bond:3});
    msg=meta.name+' happily finishes a Moonberry meal and looks noticeably more content.';
    r.icon='✦';
  }else if(action==='water'){
    change(g,{hydration:38,bond:1});
    msg=meta.name+' drinks from the enchanted water basin. The water shimmers as they finish.';
    r.icon='◌';
  }else if(action==='treat'){
    if(!consume('starlight-treat',1))return {ok:false,guardian:type,action,message:'You are out of Starlight Treats. Visit the Moon Crystal Boutique.',needsShop:true};
    change(g,{hunger:10,fun:8,affection:12,bond:4});
    msg=meta.name+' takes the Starlight Treat and gives you a very pleased little reaction.';
    r.icon='☆';
  }else if(action==='groom'){
    if(!owns('moon-silver-brush'))return {ok:false,guardian:type,action,message:'You need the Moon-Silver Grooming Brush from the Boutique first.',needsShop:true};
    change(g,{grooming:38,affection:8,bond:4});
    msg=meta.name+' relaxes while you brush and groom them. Their coat and aura look immaculate.';
    r.icon='✧';
  }else if(action==='play'){
    const toy=opts.itemId||bestToy(type);
    favoriteBonus=toy===meta.favoriteItem&&owns(toy);
    change(g,{fun:favoriteBonus?44:32,energy:-4,affection:6,bond:favoriteBonus?7:4});
    const item=CATALOG.find(x=>x.id===toy);
    msg=meta.name+' plays with '+(item?.name||'the Sanctuary ribbon toy')+'.'+(favoriteBonus?' It is one of their favorite things, and the bond magic flares brighter.':'');
    r.icon=favoriteBonus?'✦':'♡';
    r.itemId=toy;
    r.favoriteBonus=favoriteBonus;
  }else if(action==='sleep'){
    const bed=opts.objectId||assignedBed(type);
    const beds=S.v3311=S.v3311||{};
    S.v3311.sanctuaryState=S.v3311.sanctuaryState||{bedAssignments:{}};
    S.v3311.sanctuaryState.bedAssignments=S.v3311.sanctuaryState.bedAssignments||{};
    const already=S.v3311.sanctuaryState.bedAssignments[bed]===type;
    S.v3311.sanctuaryState.bedAssignments[bed]=type;
    change(g,{energy:48,affection:3,bond:already?5:2});
    g.preferredBed=bed;
    msg=meta.name+(already?' settles into their familiar bed and immediately relaxes.':' chooses this bed as a favorite resting place.');
    r.icon='☾';
    r.visualAction='sleep';
    r.travelObject=bed;
  }else if(action==='affection'){
    const now=Date.now(),cool=Number(g.affectionCooldownUntil||0);
    if(now<cool){
      change(g,{affection:5});
      msg=meta.name+' leans into the affection. The bond is already glowing from your recent attention.';
      r.rewardCooledDown=true;
    }else{
      change(g,{affection:28,bond:4});
      g.affectionCooldownUntil=now+10*60*1000;
      msg=meta.name+' melts into the attention and your familiar bond brightens.';
    }
    r.icon='♡';
  }else{
    return {ok:false,guardian:type,action,message:'That Guardian-care action is not available yet.'};
  }

  logCare(type,action,msg);
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
  const balance=p?Number(p.crystals||0):crystalBalance();
  if(balance<it.cost)return {ok:false,message:'You need '+(it.cost-balance)+' more Moon Crystals.'};

  if(p)p.crystals=balance-it.cost;
  if(S.majickAccount)S.majickAccount.crystals=balance-it.cost;

  if(it.kind==='consumable')addInventory(it.id,it.qty||1);
  else addOwned(it.id);

  saveCare();
  try{glitterBurst?.(36)}catch(_){}
  try{rewardToast(it.icon+' '+it.name+' acquired!','-'+it.cost+' ◆ • Your studying paid for this.')}catch(_){}
  return {ok:true,item:it,balance:crystalBalance(),snapshot:snapshot()};
}

function snapshot(){
  const a=ensureAccount();
  applyDecay(a);
  const guardians={};
  for(const type of TYPES){
    const g=a.guardianCare.guardians[type];
    guardians[type]={
      ...g,
      name:GUARDIANS[type].name,
      favoriteItem:GUARDIANS[type].favoriteItem,
      favoriteLabel:GUARDIANS[type].favoriteLabel,
      favoriteOwned:favoriteOwned(type),
      mood:moodInfo(g)
    };
  }
  return {
    schemaVersion:VERSION,
    crystals:crystalBalance(),
    inventory:{...a.guardianInventory},
    owned:[...a.guardianOwned],
    guardians,
    catalog:CATALOG.filter(x=>!x.disabled).map(x=>({id:x.id,name:x.name,kind:x.kind,cost:x.cost,qty:x.qty||1,icon:x.icon}))
  };
}

function meter(label,value,icon){
  const n=Math.round(clamp(value));
  return '<div class="majCareMeter"><span>'+icon+' '+label+'</span><b>'+n+'%</b><i><em style="width:'+n+'%"></em></i></div>';
}

function guardianCareHTML(type=activeGuardianType()){
  const snap=snapshot(),g=snap.guardians[type]||snap.guardians.luna,meta=GUARDIANS[type]||GUARDIANS.luna;
  const meal=snap.inventory['moonberry-meal']||0,treat=snap.inventory['starlight-treat']||0,brush=snap.owned.includes('moon-silver-brush');
  const toy=bestToy(type),toyName=CATALOG.find(x=>x.id===toy)?.name||'Sanctuary Ribbon Toy';
  return '<section class="majGuardianCare" data-guardian="'+escCare(type)+'">'+
    '<div class="majCareHead"><div><div class="eyebrow">FAMILIAR CARE • SANCTUARY BOND</div><h2>'+escCare(meta.name)+' is '+escCare(g.mood.label)+'</h2><p>Care supports your bond; studying remains what drives XP and evolution.</p></div><div class="majBondSeal"><span>'+escCare(meta.icon)+'</span><b>'+Math.round(g.bond)+' Bond</b></div></div>'+
    '<div class="majCareGrid">'+
      '<div class="majCareMeters">'+
        meter('Hunger',g.hunger,'✦')+meter('Hydration',g.hydration,'◌')+meter('Energy',g.energy,'☾')+
        meter('Fun',g.fun,'☆')+meter('Grooming',g.grooming,'✧')+meter('Affection',g.affection,'♡')+
      '</div>'+
      '<div class="majCareActions">'+
        '<button onclick="majickCareAction(\''+type+'\',\'feed\')">Feed <small>Meal × '+meal+'</small></button>'+
        '<button onclick="majickCareAction(\''+type+'\',\'water\')">Fresh Water <small>Free</small></button>'+
        '<button onclick="majickCareAction(\''+type+'\',\'treat\')">Give Treat <small>Treat × '+treat+'</small></button>'+
        '<button onclick="majickCareAction(\''+type+'\',\'groom\')">Brush & Groom <small>'+(brush?'Brush owned':'Needs brush')+'</small></button>'+
        '<button onclick="majickCareAction(\''+type+'\',\'play\')">Play <small>'+escCare(toyName)+'</small></button>'+
        '<button onclick="majickCareAction(\''+type+'\',\'affection\')">Affection <small>Bond moment</small></button>'+
        '<button class="majCareSanctuary" onclick="navigate(\'companions\')">Use Sanctuary Bed <small>Rest + bond</small></button>'+
      '</div>'+
    '</div>'+
    '<div class="majFavorite"><span>Favorite item</span><b>'+escCare(meta.favoriteLabel)+'</b><em>'+(g.favoriteOwned?'Owned • favorite-play bonus active':'Find it in the Moon Crystal Boutique')+'</em></div>'+
  '</section>';
}

function catalogHTML(){
  const snap=snapshot();
  return '<section class="majCareShop">'+
    '<div class="majCareShopHead"><div><div class="eyebrow">FAMILIAR PROVISIONS • MOON CRYSTAL BOUTIQUE</div><h2>Care for the Guardians you study beside</h2><p>Study sessions earn crystals. Crystals become meals, treats, toys, grooming tools, accessories, and Sanctuary comforts.</p></div><span class="rankBadge">◆ '+snap.crystals+' crystals</span></div>'+
    '<div class="majCareInventory"><span>✦ Meals × '+(snap.inventory['moonberry-meal']||0)+'</span><span>☆ Treats × '+(snap.inventory['starlight-treat']||0)+'</span><span>✧ Brush '+(snap.owned.includes('moon-silver-brush')?'owned':'not owned')+'</span><span>♡ Toys '+snap.owned.filter(id=>CATALOG.some(x=>x.id===id&&x.kind==='toy')).length+'</span></div>'+
    '<div class="majCareShopGrid">'+CATALOG.filter(x=>!x.disabled).map(it=>{
      const owned=it.kind!=='consumable'&&snap.owned.includes(it.id);
      const count=it.kind==='consumable'?(snap.inventory[it.id]||0):null;
      return '<article class="'+(owned?'owned':'')+'"><span class="majShopIcon">'+it.icon+'</span><h3>'+escCare(it.name)+'</h3><p>'+escCare(it.desc)+'</p>'+
        '<small>'+(it.kind==='consumable'?'Inventory: '+count:'Permanent unlock')+'</small>'+
        '<footer><b>◆ '+it.cost+'</b><button class="btn '+(owned?'good':'violet')+'" onclick="majickBuyCareItem(\''+it.id+'\')" '+(owned?'disabled':'')+'>'+(owned?'Owned':it.kind==='consumable'?'Buy bundle':'Unlock')+'</button></footer></article>';
    }).join('')+'</div>'+
  '</section>';
}

function toastFromResult(r){
  try{
    if(r.ok)rewardToast((r.icon||'✦')+' '+(r.name||'Guardian')+' care',r.message);
    else rewardToast('Moon Crystal Boutique',r.message);
  }catch(_){ if(!r.ok)alert(r.message); }
}

window.majickCareAction=function(type,action,opts={}){
  const r=performAction(type,action,opts);
  toastFromResult(r);
  if(r.needsShop){try{navigate('vault')}catch(_){}}
  try{render()}catch(_){}
  broadcastState();
  return r;
};
window.majickBuyCareItem=function(id){
  const r=buy(id);
  if(!r.ok){try{alert(r.message)}catch(_){};return r;}
  try{render()}catch(_){}
  broadcastState();
  return r;
};

const oldCompanion=window.companionHTML;
if(typeof oldCompanion==='function'){
  window.companionHTML=function(){
    const base=oldCompanion();
    return base+guardianCareHTML(activeGuardianType());
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
    const r=performAction(d.guardian,d.action,{objectId:d.objectId,itemId:d.itemId});
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
  ensure:ensureAccount,state,snapshot,performAction,buy,catalog:CATALOG,guardians:GUARDIANS,
  guardianCareHTML,catalogHTML,broadcastState,moodInfo,bestToy,assignedBed
};
})();