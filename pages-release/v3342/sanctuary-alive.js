(()=>{
'use strict';
if(typeof window.Game==='undefined')return;
const VERSION='3.3.42';

const PROFILES={
  luna:{name:'Velora',trait:'bookish moon-cat',accent:0x9a79bd,icon:'☾',favorite:'Velvet Moon Cushion',preferences:['arcane-stacks','magic-mirror','guardian-play-rug'],routine:['study','rest','affection']},
  ember:{name:'Cascade',trait:'curious pocket dragon',accent:0xc57b62,icon:'◇',favorite:'Rune Puzzle',preferences:['crystal-focus-pedestal','guardian-play-rug','guardian-toy-basket'],routine:['play','explore','focus']},
  nova:{name:'Solstice',trait:'watchful star fox',accent:0x6e9fc8,icon:'✦',favorite:'Comet Ball',preferences:['observatory-telescope','guardian-play-rug','arcane-stacks'],routine:['explore','play','study']},
  mallow:{name:'Aurelia',trait:'cozy winged bunny',accent:0xc49abf,icon:'♡',favorite:'Moonflower Plush',preferences:['guardian-play-rug','guardian-food-bowl','arcane-stacks'],routine:['social','rest','play']},
  vesper:{name:'Vesper',trait:'quiet starlight owl',accent:0x7784bd,icon:'✧',favorite:'Celestial Feather Wand',preferences:['arcane-stacks','observatory-telescope','moonlit-study-desk'],routine:['study','observe','rest']},
  briar:{name:'Briar',trait:'gentle moonlit fawn',accent:0x75906f,icon:'❀',favorite:'Moonvine Plush',preferences:['guardian-play-rug','arcane-stacks','magic-mirror'],routine:['rest','social','explore']},
  zephyr:{name:'Zephyr',trait:'restless cloud ferret',accent:0x8ea6be,icon:'🔔',favorite:'Ribbon Comet Toy',preferences:['guardian-play-rug','guardian-toy-basket','observatory-telescope'],routine:['play','explore','social']},
  prism:{name:'Prism',trait:'dreamy crystal axolotl',accent:0x6eb3b9,icon:'◇',favorite:'Crystal Bubble Orb',preferences:['guardian-water-basin','magic-mirror','guardian-play-rug'],routine:['observe','rest','social']},
  rook:{name:'Rook',trait:'clever twilight raven',accent:0x76718d,icon:'🪶',favorite:'Strategy Rune Tokens',preferences:['arcane-stacks','crystal-focus-pedestal','moonlit-study-desk'],routine:['study','focus','observe']},
  solara:{name:'Solara',trait:'bright sunrise hedgehog',accent:0xc49d5b,icon:'☀',favorite:'Sunburst Ball',preferences:['guardian-play-rug','guardian-toy-basket','observatory-telescope'],routine:['play','social','explore']}
};
const MOVE={
  luna:{tween:'lunaMoveTween',timer:'lunaNextTimer',resume:'chooseLunaBehavior'},
  ember:{tween:'emberMoveTween',timer:'emberNextTimer',resume:'chooseEmberBehavior'},
  nova:{tween:'novaMoveTween',timer:'novaNextTimer',resume:'chooseNovaBehavior'},
  mallow:{tween:'mallowMoveTween',timer:'mallowNextTimer',resume:'chooseMallowBehavior'}
};
const STAGE_NAMES={'new-bond':'New Bond','apprentice':'Apprentice','guardian':'Guardian','ascendant':'Ascendant','celestial':'Celestial'};

function roster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
function profile(g){
  const base=PROFILES[g?.type]||{};
  return {
    name:g?.name||base.name||'Guardian',
    trait:base.trait||String(g?.species||'magical familiar').toLowerCase(),
    accent:base.accent||0x8b6ca3,
    icon:g?.icon||base.icon||'✦',
    favorite:g?.favoriteLabel||base.favorite||'Sanctuary Keepsake',
    preferences:base.preferences||['guardian-play-rug','arcane-stacks','guardian-food-bowl'],
    routine:base.routine||['explore','rest','play']
  };
}
function objectId(item){return item?.getData?.('objectId')||item?.getData?.('decorId')||''}
function objectMeta(item){return item?.getData?.('manifestObject')||null}
function findDecor(scene,idOrSlot){
  return (scene?.decorItems||[]).find(item=>{
    const id=objectId(item),meta=objectMeta(item);
    return id===idOrSlot||meta?.placement?.slot===idOrSlot;
  })||scene?.v3342PersonalBeds?.[idOrSlot]?.item||null;
}
function assignedBed(scene,g,index){
  const beds=scene?.v3317CareState?.bedAssignments||{};
  const explicit=Object.entries(beds).find(([,v])=>v===g.petId||v===g.type)?.[0];
  if(explicit)return explicit;
  if(g.preferredBed)return String(g.preferredBed);
  if(index===0)return 'bed-west';
  if(index===1)return 'bed-east';
  return 'guardian-bed-'+String(g.petId||g.type||index).replace(/[^a-zA-Z0-9_-]/g,'-');
}
function occupiedPoints(scene){
  return (scene?.decorItems||[]).map(item=>{
    const m=objectMeta(item),id=objectId(item);
    if(!item?.visible)return null;
    const block=!!m?.blocksWalking||m?.category==='core'||/bed|desk|telescope|mirror|stacks|pedestal/i.test(id);
    return block?{x:Number(item.x||0),y:Number(item.y||0),r:/bed|desk|telescope/i.test(id)?260:190}:null;
  }).filter(Boolean);
}
function nookCandidates(scene){
  const w=Number(scene?.worldWidth||2800),h=Number(scene?.worldHeight||1000);
  const ys=[Math.min(h-170,810),Math.min(h-300,690),Math.min(h-430,570)];
  const xs=[];for(let x=300;x<=w-300;x+=310)xs.push(x);
  const center=w/2;
  return ys.flatMap((y,yi)=>xs.map(x=>({x,y,score:Math.abs(x-center)*.02+yi*18})));
}
function pickNook(scene,used){
  const obstacles=[...occupiedPoints(scene),...(used||[]).map(p=>({x:p.x,y:p.y,r:270}))];
  const candidates=nookCandidates(scene).map(c=>{
    let penalty=c.score;
    for(const o of obstacles){
      const d=Math.hypot(c.x-o.x,c.y-o.y);
      if(d<o.r)penalty+=(o.r-d)*12+1200;
    }
    return {...c,penalty};
  }).sort((a,b)=>a.penalty-b.penalty);
  return candidates[0]||{x:Number(scene.worldWidth||2800)/2,y:720};
}
function makeFallbackBed(scene,x,y,accent,icon){
  const c=scene.add.container(x,y).setDepth(54);
  const glow=scene.add.ellipse(0,20,210,105,accent,.16).setStrokeStyle(2,0xe9d6ff,.18);
  const base=scene.add.rectangle(0,28,190,68,0x22152b,.98).setStrokeStyle(3,accent,.68);
  const pillow=scene.add.ellipse(0,5,92,34,0xd6c6dd,.92);
  const sig=scene.add.text(0,8,icon,{fontFamily:'Georgia',fontSize:'22px',color:'#fff0c7'}).setOrigin(.5);
  c.add([glow,base,pillow,sig]);return c;
}
function makePersonalBed(scene,g,slot,pos){
  const p=profile(g),tex=scene.textures?.exists?.('obj-moonstone-crystal-bed')?'obj-moonstone-crystal-bed':
    (scene.textures?.exists?.('obj-amethyst-crystal-bed')?'obj-amethyst-crystal-bed':null);
  let item;
  if(tex){
    item=scene.add.image(pos.x,pos.y,tex).setDepth(54);
    const ratio=Math.max(.3,Math.min(.65,190/Math.max(1,item.width||300)));
    item.setScale(ratio);item.setTint?.(p.accent);
  }else item=makeFallbackBed(scene,pos.x,pos.y,p.accent,p.icon);
  item.setData?.('objectId',slot);
  item.setData?.('decorId',slot);
  item.setData?.('manifestObject',{id:slot,displayName:p.name+"'s Bed",category:'guardian',interaction:'assign-rest',blocksWalking:false,placement:{x:pos.x,y:pos.y,slot,width:210}});
  item.setInteractive?.({useHandCursor:true});
  item.on?.('pointerup',()=>scene.v3317CareRequest?.(g.petId,'sleep',{objectId:slot}));
  const tag=scene.add.text(pos.x,pos.y-105,p.icon+' '+p.name.toUpperCase()+"'S BED",{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#f5e5c8',backgroundColor:'#25142fe0',padding:{x:7,y:4}
  }).setOrigin(.5).setDepth(88);
  return {slot,item,tag,x:pos.x,y:pos.y,guardianId:g.petId,type:g.type};
}
function makeKeepsake(scene,g,bed,index){
  const p=profile(g),angle=index%2===0?-1:1;
  const x=bed.x+angle*120,y=bed.y+18;
  const c=scene.add.container(x,y).setDepth(56);
  const plate=scene.add.ellipse(0,17,92,28,0x21152a,.96).setStrokeStyle(2,p.accent,.6);
  const orb=scene.add.circle(0,-2,18,p.accent,.42).setStrokeStyle(2,0xf0d8ff,.5);
  const icon=scene.add.text(0,-4,p.icon,{fontFamily:'Georgia',fontSize:'17px',color:'#fff0c7'}).setOrigin(.5);
  c.add([plate,orb,icon]);
  c.setSize?.(100,70);c.setInteractive?.({useHandCursor:true});
  c.on?.('pointerup',()=>scene.v3342TravelGuardian?.(g.type,{x,y},'play',p.name+' visits '+p.favorite+'.'));
  const tag=scene.add.text(x,y+48,p.favorite,{fontFamily:'Arial',fontSize:'8px',color:'#bba9c0'}).setOrigin(.5).setDepth(88);
  return {item:c,tag,x,y,label:p.favorite};
}
function makeComfortSpot(scene,g,bed,index){
  const p=profile(g),x=bed.x+(index%2===0?115:-115),y=bed.y+82;
  const c=scene.add.container(x,y).setDepth(53);
  const rug=scene.add.ellipse(0,0,118,52,p.accent,.22).setStrokeStyle(2,p.accent,.55);
  const dots=[-26,0,26].map(dx=>scene.add.circle(dx,-2,5,0xe9d8ef,.55));
  c.add([rug,...dots]);c.setSize?.(125,58);c.setInteractive?.({useHandCursor:true});
  c.on?.('pointerup',()=>scene.v3342TravelGuardian?.(g.type,{x,y},'play',p.name+' settles into their comfort spot.'));
  return {item:c,x,y,label:'Comfort Spot'};
}
Game.prototype.v3342ClearNooks=function(){
  for(const x of Object.values(this.v3342PersonalBeds||{})){try{x.item?.destroy?.()}catch(_){}try{x.tag?.destroy?.()}catch(_){}}
  for(const x of (this.v3342NookItems||[])){try{x.item?.destroy?.()}catch(_){}try{x.tag?.destroy?.()}catch(_){}}
  for(const x of (this.v3342NookLabels||[])){try{x.destroy?.()}catch(_){}}
  this.v3342PersonalBeds={};this.v3342NookItems=[];this.v3342NookLabels=[];
};
Game.prototype.v3342BuildPersonalNooks=function(){
  this.v3342ClearNooks?.();
  const rs=roster(this),used=[];
  this.v3342PersonalBeds={};this.v3342NookItems=[];this.v3342NookLabels=[];
  rs.forEach((g,index)=>{
    const slot=assignedBed(this,g,index),p=profile(g);
    let item=findDecor(this,slot),pos;
    if(item){
      pos={x:Number(item.x||0),y:Number(item.y||0)};
    }else{
      pos=pickNook(this,used);
      const bed=makePersonalBed(this,g,slot,pos);
      this.v3342PersonalBeds[slot]=bed;item=bed.item;
      this.decorItems=this.decorItems||[];if(!this.decorItems.includes(item))this.decorItems.push(item);
    }
    used.push(pos);
    const bedRef={x:pos.x,y:pos.y,slot,item};
    const keep=makeKeepsake(this,g,bedRef,index),comfort=makeComfortSpot(this,g,bedRef,index);
    this.v3342NookItems.push(keep,comfort);
    const label=this.add.text(pos.x,pos.y-140,p.icon+' '+p.name.toUpperCase()+' • '+p.trait,{
      fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:'#ead9ef',backgroundColor:'#190f22d9',padding:{x:8,y:4}
    }).setOrigin(.5).setDepth(87);
    this.v3342NookLabels.push(label);
  });
  return {guardians:rs.length,beds:rs.map((g,i)=>assignedBed(this,g,i)),nooks:used};
};
Game.prototype.v3342ObjectPoint=function(id){
  const personal=this.v3342PersonalBeds?.[id];if(personal)return {x:personal.x,y:personal.y,id};
  const item=findDecor(this,id);if(item)return {x:Number(item.x||0),y:Number(item.y||0),id};
  const meta=this.getSanctuaryObject?.(id);if(meta?.placement)return {x:Number(meta.placement.x||this.worldWidth/2),y:Number(meta.placement.y||760),id};
  return null;
};
Game.prototype.v3342TravelGuardian=function(type,target,action='play',bubble=''){
  const pet=this[type];if(!pet?.active||this.editMode)return false;
  const point=typeof target==='string'?this.v3342ObjectPoint(target):target;if(!point)return false;
  const keys=MOVE[type]||{},distance=Math.hypot(Number(point.x)-pet.x,Number(point.y)-pet.y);
  try{this[keys.tween]?.stop?.();this[keys.tween]?.remove?.()}catch(_){}
  try{this[keys.timer]?.remove?.();this[keys.timer]=null}catch(_){}
  const tx=Number(point.x)+(pet.x<=point.x?-42:42),ty=Number(point.y)-18;
  const tween=this.tweens.add({
    targets:pet,x:tx,y:ty,duration:Math.max(650,Math.min(2600,distance*2.2)),ease:'Sine.inOut',
    onComplete:()=>{
      this[keys.tween]=null;
      if(action)this.v3317ShowAction?.(type,action,action==='sleep'?5200:2400);
      if(bubble)this.showPetMessage?.(pet,bubble,'#e7d2f5');
      this.v3342RecordUse?.(type,typeof target==='string'?target:'personal-nook');
      this[keys.timer]=this.time.delayedCall(action==='sleep'?6000:2600,()=>{
        this[keys.timer]=null;const fn=keys.resume;if(fn&&typeof this[fn]==='function')this[fn]();
      });
    }
  });
  this[keys.tween]=tween;return true;
};
Game.prototype.v3342RecordUse=function(type,id){
  this.v3342UseLog=this.v3342UseLog||[];
  this.v3342UseLog.unshift({type,id,at:Date.now()});this.v3342UseLog=this.v3342UseLog.slice(0,40);
};
Game.prototype.v3342RoutineTarget=function(g,index){
  const n={hunger:Number(g.hunger??100),hydration:Number(g.hydration??100),energy:Number(g.energy??100),fun:Number(g.fun??100),grooming:Number(g.grooming??100)};
  if(n.energy<48)return {id:assignedBed(this,g,index),action:'sleep',why:'needs rest'};
  if(n.hunger<48)return {id:'guardian-food-bowl',action:'play',why:'checks the food bowl'};
  if(n.hydration<48)return {id:'guardian-water-basin',action:'play',why:'visits the water basin'};
  if(n.fun<54)return {id:'guardian-play-rug',action:'play',why:'wants to play'};
  if(n.grooming<45)return {id:'guardian-brush',action:'play',why:'visits the grooming station'};
  const p=profile(g),prefs=p.preferences||[];
  return {id:prefs[Math.floor(Math.random()*prefs.length)]||assignedBed(this,g,index),action:Math.random()<.22?'sleep':'play',why:p.trait+' routine'};
};
Game.prototype.v3342RunLifeBeat=function(){
  if(this.editMode)return false;
  const rs=roster(this).filter(g=>this[g.type]?.active);if(!rs.length)return false;
  this.v3342LifeCursor=(Number(this.v3342LifeCursor||0)+1)%rs.length;
  const g=rs[this.v3342LifeCursor],index=roster(this).findIndex(x=>x.petId===g.petId);
  const keys=MOVE[g.type]||{};
  if(this[keys.tween]?.isPlaying?.()||this['v3317Action_'+g.type]?.active)return false;
  const t=this.v3342RoutineTarget(g,index);if(!t?.id)return false;
  const p=profile(g);
  return this.v3342TravelGuardian(g.type,t.id,t.action,p.name+' '+t.why+'.');
};
const baseGetObjectInteractionDef=Game.prototype.getObjectInteractionDef;
Game.prototype.getObjectInteractionDef=function(id){
  const personal=this.v3342PersonalBeds?.[id];
  if(personal)return {id,title:(profile(roster(this).find(g=>g.petId===personal.guardianId)||{}).name||'Guardian')+"'s Bed",x:personal.x,y:personal.y,mode:'sleep',picker:'Personal Guardian bed'};
  return baseGetObjectInteractionDef?.call(this,id);
};
Game.prototype.v3342EvolutionCeremony=function(type,fromStage,toStage,data={}){
  const pet=this[type];if(!pet?.active)return;
  const g=roster(this).find(x=>x.type===type)||data||{},p=profile(g);
  try{this.v3317ShowAction?.(type,'play',5200)}catch(_){}
  try{window.MajickGuardianCoreSanctuary?.burst?.(this,type,44);window.MajickGuardianCoreSanctuary?.voice?.(type,'mastery')}catch(_){}
  const w=Number(this.scale?.width||window.innerWidth||1280),h=Number(this.scale?.height||window.innerHeight||720);
  const root=this.add.container(0,0).setDepth(1200).setScrollFactor?.(0);
  const shade=this.add.rectangle(0,0,w,h,0x08040e,.82).setOrigin(0);
  const sig=this.add.text(w/2,h*.32,p.icon,{fontFamily:'Georgia',fontSize:'58px',color:'#f2d184'}).setOrigin(.5);
  const title=this.add.text(w/2,h*.45,p.name+' EVOLVED',{fontFamily:'Georgia',fontStyle:'bold',fontSize:'32px',color:'#f5e4bd'}).setOrigin(.5);
  const sub=this.add.text(w/2,h*.53,(STAGE_NAMES[fromStage]||fromStage||'Previous Stage')+'  →  '+(STAGE_NAMES[toStage]||toStage),{fontFamily:'Arial',fontStyle:'bold',fontSize:'15px',color:'#d8bae8'}).setOrigin(.5);
  const note=this.add.text(w/2,h*.61,'New Sanctuary behavior unlocked • bond memory recorded',{fontFamily:'Arial',fontSize:'11px',color:'#b9a7c2'}).setOrigin(.5);
  root.add([shade,sig,title,sub,note]);root.alpha=0;
  this.tweens.add({targets:root,alpha:1,duration:420,yoyo:true,hold:3300,onComplete:()=>root.destroy(true)});
  try{window.parent?.postMessage({type:'MAJICK_GUARDIAN_EVOLUTION_V3342',guardianId:g.petId||null,guardianType:type,name:p.name,previousStage:fromStage,stage:toStage},location.origin)}catch(_){}
};
const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  const r=baseCreate.apply(this,arguments);
  this.v3342Stages={};this.v3342UseLog=[];this.v3342LifeCursor=-1;
  this.time.delayedCall(650,()=>this.v3342BuildPersonalNooks());
  this.v3342LifeTimer=this.time.addEvent({delay:7600,loop:true,callback:()=>this.v3342RunLifeBeat()});
  return r;
};
const baseApply=Game.prototype.v3320ApplyCareSnapshot;
Game.prototype.v3320ApplyCareSnapshot=function(snapshot){
  const before=JSON.stringify((this.v3317CareState?.roster||[]).map(g=>[g.petId,g.preferredBed]));
  const r=baseApply?.call(this,snapshot);
  const after=JSON.stringify((snapshot?.roster||[]).map(g=>[g.petId,g.preferredBed]));
  if(before!==after||Object.keys(this.v3342PersonalBeds||{}).length!==Math.max(0,(snapshot?.roster||[]).length-2))this.time?.delayedCall?.(100,()=>this.v3342BuildPersonalNooks());
  return r;
};
window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};if(d.type!=='MAJICK_GUARDIAN_LEVELS_V3317'||!d.guardians)return;
  const scene=window.majickPhaserGame?.scene?.getScene?.('Game');if(!scene)return;
  scene.v3342Stages=scene.v3342Stages||{};
  for(const [type,row] of Object.entries(d.guardians)){
    const next=String(row?.stageSlug||row?.stage||'');if(!next)continue;
    const prev=scene.v3342Stages[type];
    scene.v3342Stages[type]=next;
    if(prev&&prev!==next)scene.time?.delayedCall?.(220,()=>scene.v3342EvolutionCeremony?.(type,prev,next,row));
  }
});
function inspect(scene){
  const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game'),rs=roster(s);
  return {
    version:VERSION,
    roster:rs.map((g,i)=>({petId:g.petId,type:g.type,name:g.name,bed:assignedBed(s,g,i),profile:profile(g)})),
    personalBeds:Object.keys(s?.v3342PersonalBeds||{}),
    nookItems:(s?.v3342NookItems||[]).map(x=>x.label),
    useLog:[...(s?.v3342UseLog||[])],
    hasLifeTimer:!!s?.v3342LifeTimer
  };
}
window.MajickSanctuaryAlive={VERSION,PROFILES,profile,assignedBed,inspect};
document.documentElement.dataset.majickSanctuaryAlive=VERSION;
})();