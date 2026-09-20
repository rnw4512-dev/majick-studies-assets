// Majick Studies V3.3.21 — SANCTUARY CUSTOMIZATION
// Visual/home-customization layer. Does not replace protected Guardian movement.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const VERSION='3.3.21';
const STORAGE_KEY='majick-sanctuary-furniture-v1';
const PAGE_SIZE=7;
const ZONE_DEPTH=22;
const NOOK_COLORS=[0x8663a8,0x4f8191,0x9a6d87,0x8b7447,0x58775f,0x6b6f9d];

const COZY_DORM={
  'arcane-stacks':{x:200,y:720},
  'study-apothecary':{x:360,y:840},
  'guardian-treat-jar':{x:500,y:860},
  'guardian-brush':{x:620,y:860},
  'moonstone-crystal-bed':{x:760,y:840},
  'guardian-food-bowl':{x:920,y:880},
  'guardian-water-basin':{x:1060,y:880},
  'moonlit-study-desk':{x:1100,y:780},
  'observatory-telescope':{x:1320,y:720},
  'guardian-play-rug':{x:1380,y:880},
  'crystal-focus-pedestal':{x:1540,y:760},
  'magic-mirror':{x:1640,y:700},
  'guardian-toy-basket':{x:1700,y:860},
  'familiar-lounge':{x:1860,y:780},
  'amethyst-crystal-bed':{x:1980,y:840}
};

function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0))}
function objectId(item){return item?.getData?.('objectId')||item?.getData?.('decorId')||''}
function objectMeta(item){return item?.getData?.('manifestObject')||null}
function manifestObjects(scene){
  try{
    const m=scene.cache.json.get('majick-object-manifest')||{objects:[]};
    return (m.objects||[]).filter(o=>o.enabled&&o.preload&&o.placement&&scene.textures.exists('obj-'+o.id));
  }catch(_){return[]}
}
function decor(scene,id){return (scene?.decorItems||[]).find(x=>objectId(x)===id)||null}
function unique(values){return [...new Set((values||[]).filter(Boolean).map(String))]}
function snapshotState(state){
  return {
    schemaVersion:1,
    version:VERSION,
    owned:unique(state?.owned),
    stored:unique(state?.stored),
    preset:state?.preset||null,
    updatedAt:Number(state?.updatedAt||Date.now())
  };
}
function readLocal(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch(_){return null}
}
function saveLocal(state){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(snapshotState(state)))}catch(_){}
}
function sendState(state){
  try{window.parent?.postMessage({type:'MAJICK_SANCTUARY_FURNITURE_STATE_V3321',state:snapshotState(state)},location.origin)}catch(_){}
}
function furnitureName(scene,id){
  const m=manifestObjects(scene).find(x=>x.id===id);
  return m?.displayName||id.replace(/-/g,' ');
}
function categoryName(obj){
  if(obj?.interaction==='assign-rest')return 'Guardian Bed';
  if(obj?.category==='guardian')return 'Guardian Care';
  if(obj?.id==='familiar-lounge')return 'Guardian Lounge';
  return 'Academy Furniture';
}
function placement(scene,id){
  const item=decor(scene,id),meta=manifestObjects(scene).find(x=>x.id===id);
  return {
    x:Number(item?.x??meta?.placement?.x??scene.worldWidth/2),
    y:Number(item?.y??meta?.placement?.y??820)
  };
}
function activeRoster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
function assignments(scene){return scene?.v3317CareState?.bedAssignments||{}}
function bedOccupant(scene,item,bedIndex){
  const rs=activeRoster(scene),meta=objectMeta(item),slot=meta?.placement?.slot,id=objectId(item),beds=assignments(scene);
  const key=beds[slot]||beds[id]||null;
  const explicit=rs.find(g=>g.petId===key||g.type===key||g.preferredBed===slot||g.preferredBed===id);
  if(explicit)return {guardian:explicit,explicit:true};
  return {guardian:rs[bedIndex]||null,explicit:false};
}
function isPlaced(scene,id){return !scene.v3321FurnitureState?.stored?.includes(id)}

Game.prototype.v3321EnsureFurnitureState=function(incoming){
  const ids=manifestObjects(this).map(o=>o.id);
  const local=readLocal();
  const raw=(incoming&&typeof incoming==='object')?incoming:
    (this.v3321FurnitureState&&typeof this.v3321FurnitureState==='object'?this.v3321FurnitureState:local||{});
  const owned=unique([...(raw.owned||[]),...ids]);
  const stored=unique(raw.stored||[]).filter(id=>owned.includes(id)&&ids.includes(id));
  this.v3321FurnitureState={
    schemaVersion:1,version:VERSION,owned,stored,
    preset:raw.preset||null,updatedAt:Number(raw.updatedAt||Date.now())
  };
  saveLocal(this.v3321FurnitureState);
  return this.v3321FurnitureState;
};

Game.prototype.v3321CommitFurnitureState=function(){
  const s=this.v3321EnsureFurnitureState(this.v3321FurnitureState);
  s.updatedAt=Date.now();
  saveLocal(s);
  sendState(s);
  return snapshotState(s);
};

Game.prototype.v3321ApplyFurnitureVisibility=function(){
  const state=this.v3321EnsureFurnitureState(this.v3321FurnitureState);
  const stored=new Set(state.stored);
  for(const item of (this.decorItems||[])){
    const id=objectId(item);
    if(!state.owned.includes(id))continue;
    const placed=!stored.has(id);
    item.setVisible?.(placed);
    item.setActive?.(true);
    if(item.input)item.input.enabled=placed;
    item.v3320EditLabel?.setVisible?.(placed&&!!this.editMode);
    item.v3320CareBadge?.setVisible?.(placed&&!this.editMode);
  }
  this.v3321BuildRoomZones();
  return snapshotState(state);
};

Game.prototype.v3321SetPlaced=function(id,placed){
  const state=this.v3321EnsureFurnitureState(this.v3321FurnitureState);
  if(!state.owned.includes(id))return {ok:false,id,message:'That furniture is not owned.'};
  const stored=new Set(state.stored);
  if(placed)stored.delete(id);else stored.add(id);
  state.stored=[...stored];
  state.preset=null;
  this.v3321ApplyFurnitureVisibility();
  this.v3321CommitFurnitureState();
  this.v3320RefreshObjectBadges?.(this.v3317CareState);
  this.v3321BuildFurnitureManager(this.v3321ManagerPage||0);
  this.showToast?.(placed?'Furniture placed':'Furniture stored',
    furnitureName(this,id)+(placed?' is back in the Sanctuary.':' is safe in Sanctuary Storage.'));
  return {ok:true,id,placed,state:snapshotState(state)};
};

Game.prototype.v3321ApplyPreset=function(name='cozy-dorm'){
  if(name!=='cozy-dorm')return {ok:false,name};
  const state=this.v3321EnsureFurnitureState(this.v3321FurnitureState);
  for(const [id,pos] of Object.entries(COZY_DORM)){
    if(!state.owned.includes(id)||state.stored.includes(id))continue;
    const item=decor(this,id);if(!item)continue;
    item.x=pos.x;item.y=pos.y;
    this.v3320SnapDecorItem?.(item);
  }
  state.preset='cozy-dorm';
  state.updatedAt=Date.now();
  this.v3321CommitFurnitureState();
  this.v3321BuildRoomZones();
  this.v3321BuildFurnitureManager(this.v3321ManagerPage||0);
  this.showToast?.('Cozy Dorm Layout','Study, care, play, and Guardian-rest areas have been arranged into intentional room zones.');
  return {ok:true,name,state:snapshotState(state)};
};

Game.prototype.v3321CreateFurnitureButton=function(){
  try{this.v3321FurnitureButton?.destroy()}catch(_){}
  const b=this.add.text(0,0,'▣ FURNITURE',{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#f2e6f5',
    backgroundColor:'#41254dcc',padding:{x:11,y:7}
  }).setOrigin(1,0).setDepth(12080).setInteractive({useHandCursor:true});
  this.fixToScreen?.(b,this.scale.width-28,106);
  b.on('pointerup',()=>this.v3321BuildFurnitureManager(this.v3321ManagerPage||0));
  this.v3321FurnitureButton=b;
};

Game.prototype.v3321DestroyFurnitureManager=function(){
  try{this.v3321FurnitureManager?.destroy(true)}catch(_){}
  this.v3321FurnitureManager=null;
};

Game.prototype.v3321BuildFurnitureManager=function(page=0){
  this.v3321DestroyFurnitureManager();
  const state=this.v3321EnsureFurnitureState(this.v3321FurnitureState);
  const all=manifestObjects(this).filter(o=>state.owned.includes(o.id));
  const pages=Math.max(1,Math.ceil(all.length/PAGE_SIZE));
  page=clamp(page,0,pages-1);
  this.v3321ManagerPage=page;
  const rows=all.slice(page*PAGE_SIZE,page*PAGE_SIZE+PAGE_SIZE);
  const width=Math.min(650,Math.max(520,this.scale.width-80)),height=558;
  const c=this.add.container(0,0).setDepth(14000);
  const bg=this.add.rectangle(0,0,width,height,0x120817,.97).setOrigin(0,0).setStrokeStyle(2,0xc9a762,.70);
  const header=this.add.rectangle(0,0,width,66,0x2b1834,.98).setOrigin(0,0);
  const title=this.add.text(18,12,'SANCTUARY FURNITURE',{
    fontFamily:'Georgia',fontStyle:'bold',fontSize:'19px',color:'#f2d098'
  });
  const summary=this.add.text(18,39,(state.owned.length-state.stored.length)+' placed • '+state.stored.length+' stored • '+state.owned.length+' owned',{
    fontFamily:'Arial',fontSize:'11px',color:'#cdbfd3'
  });
  const close=this.add.text(width-16,13,'✕ CLOSE',{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#eee0f0',
    backgroundColor:'#56385f',padding:{x:9,y:6}
  }).setOrigin(1,0).setInteractive({useHandCursor:true});
  close.on('pointerup',()=>this.v3321DestroyFurnitureManager());
  c.add([bg,header,title,summary,close]);

  let y=78;
  rows.forEach(obj=>{
    const stored=state.stored.includes(obj.id);
    const row=this.add.rectangle(12,y,width-24,52,stored?0x1a1520:0x21172a,.94).setOrigin(0,0)
      .setStrokeStyle(1,stored?0x55465e:0x735b7e,.50);
    const name=this.add.text(24,y+8,obj.displayName,{
      fontFamily:'Arial',fontStyle:'bold',fontSize:'12px',color:stored?'#b9abbc':'#f0e5ee'
    });
    const sub=this.add.text(24,y+28,categoryName(obj)+(stored?' • STORED':' • PLACED'),{
      fontFamily:'Arial',fontSize:'9px',color:stored?'#887c8d':'#bba8c5'
    });
    const action=this.add.text(width-24,y+12,stored?'PLACE':'STORE',{
      fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:stored?'#261a12':'#f3e7f5',
      backgroundColor:stored?'#d0ae69':'#56385f',padding:{x:10,y:7}
    }).setOrigin(1,0).setInteractive({useHandCursor:true});
    action.on('pointerup',()=>this.v3321SetPlaced(obj.id,stored));
    c.add([row,name,sub,action]);
    y+=58;
  });

  const cozy=this.add.text(18,height-76,'✦ APPLY COZY DORM LAYOUT',{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#24170d',
    backgroundColor:'#d0ae69',padding:{x:12,y:8}
  }).setInteractive({useHandCursor:true});
  cozy.on('pointerup',()=>this.v3321ApplyPreset('cozy-dorm'));

  const placeAll=this.add.text(226,height-76,'PLACE ALL',{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#eee0f0',
    backgroundColor:'#4d3658',padding:{x:12,y:8}
  }).setInteractive({useHandCursor:true});
  placeAll.on('pointerup',()=>{
    state.stored=[];
    this.v3321ApplyFurnitureVisibility();
    this.v3321CommitFurnitureState();
    this.v3321BuildFurnitureManager(page);
  });

  const pageText=this.add.text(width-18,height-70,'Page '+(page+1)+' / '+pages,{
    fontFamily:'Arial',fontSize:'10px',color:'#b9acbf'
  }).setOrigin(1,0);
  c.add([cozy,placeAll,pageText]);

  if(page>0){
    const prev=this.add.text(width-160,height-34,'← PREV',{fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#d8c8de'})
      .setInteractive({useHandCursor:true});
    prev.on('pointerup',()=>this.v3321BuildFurnitureManager(page-1));c.add(prev);
  }
  if(page<pages-1){
    const next=this.add.text(width-82,height-34,'NEXT →',{fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#d8c8de'})
      .setInteractive({useHandCursor:true});
    next.on('pointerup',()=>this.v3321BuildFurnitureManager(page+1));c.add(next);
  }

  this.v3321FurnitureManager=c;
  this.fixToScreen?.(c,Math.max(24,(this.scale.width-width)/2),Math.max(90,(this.scale.height-height)/2));
  return c;
};

Game.prototype.v3321ZoneBox=function(x,y,w,h,title,subtitle,color){
  const c=this.add.container(0,0).setDepth(ZONE_DEPTH);
  const g=this.add.graphics();
  g.fillStyle(color,.10);g.fillRoundedRect(x-w/2,y-h/2,w,h,20);
  g.lineStyle(2,color,.30);g.strokeRoundedRect(x-w/2,y-h/2,w,h,20);
  const t=this.add.text(x-w/2+14,y-h/2+10,title,{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#f0debd'
  });
  const s=this.add.text(x-w/2+14,y-h/2+26,subtitle||'',{
    fontFamily:'Arial',fontSize:'8px',color:'#aa98ae'
  });
  c.add([g,t,s]);
  return c;
};

Game.prototype.v3321BuildRoomZones=function(){
  try{this.v3321Zones?.destroy(true)}catch(_){}
  const root=this.add.container(0,0).setDepth(ZONE_DEPTH);
  const state=this.v3321EnsureFurnitureState(this.v3321FurnitureState);

  const feedIds=['guardian-food-bowl','guardian-water-basin','guardian-treat-jar'].filter(id=>isPlaced(this,id)&&decor(this,id)?.visible);
  if(feedIds.length){
    const pts=feedIds.map(id=>placement(this,id));
    const x=pts.reduce((n,p)=>n+p.x,0)/pts.length,y=pts.reduce((n,p)=>n+p.y,0)/pts.length;
    root.add(this.v3321ZoneBox(x,y-6,Math.max(330,180+feedIds.length*90),124,'FEEDING NOOK','meals • water • treats',0x6f8a78));
  }

  const playIds=['guardian-play-rug','guardian-toy-basket'].filter(id=>isPlaced(this,id)&&decor(this,id)?.visible);
  if(playIds.length){
    const pts=playIds.map(id=>placement(this,id));
    const x=pts.reduce((n,p)=>n+p.x,0)/pts.length,y=pts.reduce((n,p)=>n+p.y,0)/pts.length;
    root.add(this.v3321ZoneBox(x,y-8,430,154,'PLAY CORNER','toys • favorite items • bond time',0x8c6598));
  }

  const beds=['moonstone-crystal-bed','amethyst-crystal-bed'];
  let nookCount=0;
  beds.forEach((id,i)=>{
    const item=decor(this,id);
    if(!item?.visible||!isPlaced(this,id))return;
    const {guardian,explicit}=bedOccupant(this,item,i);
    const p=placement(this,id),color=NOOK_COLORS[i%NOOK_COLORS.length];
    const name=guardian?.name||'Open Guardian';
    const favorite=guardian?.favoriteLabel||'favorite item';
    const favoriteState=guardian?(guardian.favoriteOwned?'✦ favorite ready':'◇ favorite not collected'):'choose a Guardian';
    const c=this.v3321ZoneBox(p.x,p.y-25,380,210,(guardian?name+"'s":'OPEN')+' NOOK',
      (explicit?'assigned bed • ':'home space • ')+favorite+' • '+favoriteState,color);
    root.add(c);nookCount++;
  });

  this.v3321Zones=root;
  this.v3321NookCount=nookCount;
  return root;
};

Game.prototype.v3321RefreshAfterCare=function(snapshot){
  this.v3321BuildRoomZones();
  if(this.v3321FurnitureManager)this.v3321BuildFurnitureManager(this.v3321ManagerPage||0);
};

const baseCareApply=Game.prototype.v3320ApplyCareSnapshot;
Game.prototype.v3320ApplyCareSnapshot=function(snapshot){
  const result=baseCareApply?.call(this,snapshot);
  this.v3321RefreshAfterCare(snapshot);
  return result;
};

const baseToggleEdit=Game.prototype.toggleEditMode;
Game.prototype.toggleEditMode=function(){
  const result=baseToggleEdit?.call(this);
  this.v3321ApplyFurnitureVisibility();
  return result;
};

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  baseCreate.call(this);
  this.v3321EnsureFurnitureState();
  this.v3321ApplyFurnitureVisibility();
  this.v3321CreateFurnitureButton();
  this.v3321BuildRoomZones();

  for(const item of (this.decorItems||[])){
    item.on?.('dragend',()=>this.time.delayedCall(30,()=>this.v3321BuildRoomZones()));
  }
  this.scale.on?.('resize',()=>{
    this.time.delayedCall(60,()=>{
      if(this.v3321FurnitureButton?.active)this.fixToScreen?.(this.v3321FurnitureButton,this.scale.width-28,106);
      if(this.v3321FurnitureManager?.active)this.v3321BuildFurnitureManager(this.v3321ManagerPage||0);
    });
  });
  this.time.delayedCall(300,()=>{
    try{window.parent?.postMessage({type:'MAJICK_SANCTUARY_FURNITURE_REQUEST_V3321'},location.origin)}catch(_){}
    this.v3321CommitFurnitureState();
  });
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  if(d.type!=='MAJICK_SANCTUARY_FURNITURE_SYNC_V3321')return;
  const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
  if(!scene||!d.state)return;
  scene.v3321EnsureFurnitureState(d.state);
  scene.v3321ApplyFurnitureVisibility();
  scene.v3321BuildRoomZones();
});

function inspect(scene){
  const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
  const state=s?.v3321EnsureFurnitureState?.()||{};
  return {
    version:VERSION,
    owned:Number(state.owned?.length||0),
    placed:Number((state.owned||[]).filter(id=>!(state.stored||[]).includes(id)).length),
    stored:Number(state.stored?.length||0),
    preset:state.preset||null,
    managerButton:!!s?.v3321FurnitureButton?.active,
    zones:!!s?.v3321Zones?.active,
    nooks:Number(s?.v3321NookCount||0),
    feedingPlaced:['guardian-food-bowl','guardian-water-basin'].every(id=>isPlaced(s,id)),
    playPlaced:['guardian-play-rug','guardian-toy-basket'].every(id=>isPlaced(s,id))
  };
}

window.MajickSanctuaryCustomize={VERSION,COZY_DORM,manifestObjects,inspect};
})();