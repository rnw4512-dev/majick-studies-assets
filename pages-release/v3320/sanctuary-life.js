// Majick Studies V3.3.20 — SANCTUARY HOME & GUARDIAN LIFE
// Additive layer only. Protected Phase 4 Guardian movement remains owned by V3.3.10/V3.3.17.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const VERSION='3.3.20';
const GRID=20;
const EDIT_TOP=620;
const EDIT_BOTTOM_PAD=80;
const CARE_OBJECTS={
  'guardian-food-bowl':{title:'Guardian Food Bowl',mode:'delight'},
  'guardian-water-basin':{title:'Guardian Water Basin',mode:'delight'},
  'guardian-treat-jar':{title:'Guardian Treat Jar',mode:'delight'},
  'guardian-brush':{title:'Guardian Brush',mode:'sit'},
  'guardian-toy-basket':{title:'Guardian Toy Basket',mode:'delight'},
  'guardian-play-rug':{title:'Guardian Play Rug',mode:'delight'}
};
const NEEDS=[
  ['hunger','🍽','Food'],
  ['hydration','💧','Water'],
  ['energy','☾','Rest'],
  ['fun','✦','Play'],
  ['grooming','✧','Groom'],
  ['affection','♡','Affection']
];

function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0))}
function roster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
function eggs(scene){return Array.isArray(scene?.v3317CareState?.eggs)?scene.v3317CareState.eggs:[]}
function worstNeed(g){
  let best={key:'affection',icon:'♡',label:'Affection',value:100};
  for(const [key,icon,label] of NEEDS){
    const value=Number(g?.[key]??100);
    if(value<best.value)best={key,icon,label,value};
  }
  return best;
}
function findDecor(scene,idOrSlot){
  const items=scene?.decorItems||[];
  return items.find(item=>{
    const id=item.getData?.('objectId')||item.getData?.('decorId');
    const obj=item.getData?.('manifestObject');
    return id===idOrSlot||obj?.placement?.slot===idOrSlot;
  })||null;
}
function objectId(item){return item?.getData?.('objectId')||item?.getData?.('decorId')||''}
function objectMeta(item){return item?.getData?.('manifestObject')||null}
function petForGuardian(scene,g){return g?.type?scene?.[g.type]:null}

Game.prototype.v3320CareObjectDef=function(id){
  const spec=CARE_OBJECTS[id];
  if(!spec)return null;
  const item=findDecor(this,id);
  const meta=this.getSanctuaryObject?.(id);
  return {
    id,
    title:meta?.displayName||spec.title,
    x:Number(item?.x??meta?.placement?.x??this.worldWidth/2),
    y:Number(item?.y??meta?.placement?.y??760),
    mode:spec.mode,
    picker:'Choose a bonded Guardian to use this care station.'
  };
};

const baseGetObjectInteractionDef=Game.prototype.getObjectInteractionDef;
Game.prototype.getObjectInteractionDef=function(id){
  const existing=baseGetObjectInteractionDef?.call(this,id);
  return existing||this.v3320CareObjectDef(id);
};

Game.prototype.v3320CreateEditGuide=function(){
  try{this.v3320EditGuide?.destroy()}catch(_){}
  const g=this.add.graphics().setDepth(24).setVisible(false);
  g.lineStyle(1,0xa88bc8,.13);
  for(let x=120;x<=this.worldWidth-120;x+=40)g.lineBetween(x,EDIT_TOP,x,this.worldHeight-EDIT_BOTTOM_PAD);
  for(let y=EDIT_TOP;y<=this.worldHeight-EDIT_BOTTOM_PAD;y+=40)g.lineBetween(100,y,this.worldWidth-100,y);
  g.lineStyle(3,0xd0ae69,.34);
  g.strokeRect(100,EDIT_TOP,this.worldWidth-200,this.worldHeight-EDIT_TOP-EDIT_BOTTOM_PAD);
  this.v3320EditGuide=g;
};

Game.prototype.v3320SnapDecorItem=function(item){
  if(!item)return null;
  const half=Math.max(75,Number(item.width||150)/2);
  const minX=Math.max(100,half+35);
  const maxX=Math.min(this.worldWidth-100,this.worldWidth-half-35);
  const rawX=Math.round(Number(item.x||0)/GRID)*GRID;
  const rawY=Math.round(Number(item.y||0)/GRID)*GRID;
  item.x=clamp(rawX,minX,maxX);
  item.y=clamp(rawY,EDIT_TOP,this.worldHeight-EDIT_BOTTOM_PAD);
  item.setDepth?.(30+Math.round(item.y/30));
  this.saveDecorPosition?.(objectId(item),item.x,item.y);
  return {x:item.x,y:item.y};
};

Game.prototype.v3320AttachDecorEnhancements=function(){
  for(const item of (this.decorItems||[])){
    if(item.__v3320Enhanced)continue;
    item.__v3320Enhanced=true;

    const label=item.getData?.('label')||objectMeta(item)?.displayName||objectId(item);
    try{
      const tag=this.add.text(0,-Math.max(115,Number(item.height||150)*.62),String(label||''),{
        fontFamily:'Arial',fontStyle:'bold',fontSize:'11px',color:'#fff5dc',
        backgroundColor:'#2a1636e8',padding:{x:7,y:4}
      }).setOrigin(.5,1).setVisible(false);
      item.add?.(tag);
      item.v3320EditLabel=tag;
    }catch(_){}

    item.on?.('dragend',()=>{
      if(this.editMode)this.v3320SnapDecorItem(item);
    });
  }
};

Game.prototype.v3320SetEditVisuals=function(){
  this.v3320EditGuide?.setVisible?.(!!this.editMode);
  for(const item of (this.decorItems||[])){
    item.v3320EditLabel?.setVisible?.(!!this.editMode);
    item.v3320CareBadge?.setVisible?.(!this.editMode);
  }
  if(this.hudStatusText){
    this.hudStatusText.setText(this.editMode
      ?'EDIT MODE • drag furniture • 20px snap • positions save automatically'
      :'Living Sanctuary • Guardians, care objects, beds & toys are active');
  }
};

function badgeText(scene,item,snap){
  const id=objectId(item),inv=snap?.inventory||{},owned=new Set(snap?.owned||[]),rs=snap?.roster||[];
  if(id==='guardian-food-bowl')return '🍽 '+Number(inv['moonberry-meal']||0)+' meals';
  if(id==='guardian-water-basin')return '💧 fresh water';
  if(id==='guardian-treat-jar')return '☆ '+Number(inv['starlight-treat']||0)+' treats';
  if(id==='guardian-brush')return owned.has('moon-silver-brush')?'✧ brush ready':'✧ brush needed';
  if(id==='guardian-toy-basket'){
    const favorite=rs.filter(g=>g.favoriteOwned).length;
    return favorite?'✦ '+favorite+' favorite toy'+(favorite===1?'':'s'):'♡ play toys';
  }
  if(id==='guardian-play-rug')return '✦ play & bond';
  if(id==='moonstone-crystal-bed'||id==='amethyst-crystal-bed'){
    const slot=objectMeta(item)?.placement?.slot;
    const assignments=snap?.bedAssignments||{};
    const occupantId=assignments[slot]||assignments[id]||null;
    const occupant=rs.find(g=>g.petId===occupantId||g.type===occupantId||
      g.preferredBed===slot||g.preferredBed===id);
    return occupant?'☾ '+occupant.name+"'s bed":'☾ choose a Guardian';
  }
  return '';
}

Game.prototype.v3320RefreshObjectBadges=function(snapshot){
  const snap=snapshot||this.v3317CareState||{};
  for(const item of (this.decorItems||[])){
    const id=objectId(item);
    const isCare=!!CARE_OBJECTS[id]||id==='moonstone-crystal-bed'||id==='amethyst-crystal-bed';
    if(!isCare)continue;
    const text=badgeText(this,item,snap);
    if(!item.v3320CareBadge){
      try{
        const tag=this.add.text(0,-Math.max(82,Number(item.height||145)*.48),text,{
          fontFamily:'Arial',fontStyle:'bold',fontSize:'11px',color:'#f8e9c0',
          backgroundColor:'#180d22db',padding:{x:7,y:4}
        }).setOrigin(.5,1).setAlpha(.90);
        item.add?.(tag);
        item.v3320CareBadge=tag;
      }catch(_){}
    }
    item.v3320CareBadge?.setText?.(text);
    item.v3320CareBadge?.setVisible?.(!this.editMode);
  }
};

Game.prototype.v3320RefreshGuardianLabels=function(snapshot){
  const snap=snapshot||this.v3317CareState||{};
  this.v3320GuardianLabels=this.v3320GuardianLabels||{};
  const live=new Set();

  for(const g of (snap.roster||[])){
    const pet=petForGuardian(this,g);
    if(!pet?.active)continue;
    live.add(g.petId);
    let tag=this.v3320GuardianLabels[g.petId];
    if(!tag?.active){
      tag=this.add.text(pet.x,pet.y-245,'',{
        fontFamily:'Arial',fontStyle:'bold',fontSize:'12px',color:'#fff4dc',
        backgroundColor:'#1a0d24d9',padding:{x:8,y:5}
      }).setOrigin(.5,1).setDepth(520);
      this.v3320GuardianLabels[g.petId]=tag;
    }
    const need=worstNeed(g);
    const needText=need.value<60?' • '+need.icon+' '+Math.round(need.value)+'%':' • '+(g.mood?.label||'Content');
    tag.setText((g.name||'Guardian')+' • Bond '+Math.round(Number(g.bond)||0)+needText);
  }

  for(const [id,tag] of Object.entries(this.v3320GuardianLabels)){
    if(!live.has(id))tag?.setVisible?.(false);
    else tag?.setVisible?.(!this.editMode);
  }
};

Game.prototype.v3320TickGuardianLabels=function(){
  const rs=roster(this);
  for(const g of rs){
    const pet=petForGuardian(this,g),tag=this.v3320GuardianLabels?.[g.petId];
    if(!pet?.active||!tag?.active)continue;
    tag.setPosition(pet.x,pet.y-Math.max(205,Math.min(330,Number(pet.displayHeight||170)*1.35)));
    tag.setDepth((pet.depth||70)+28);
    tag.setVisible(!this.editMode);
  }
};

Game.prototype.v3320BuildHomeHud=function(snapshot){
  const snap=snapshot||this.v3317CareState||{roster:[],eggs:[]};
  try{this.v3320HomeHud?.destroy(true)}catch(_){}
  const collapsed=!!this.v3320HudCollapsed;
  const rs=Array.isArray(snap.roster)?snap.roster:[];
  const es=Array.isArray(snap.eggs)?snap.eggs:[];
  const width=356;
  const visibleRows=collapsed?0:Math.min(4,rs.length);
  const eggRows=collapsed?0:Math.min(2,es.length);
  const height=48+visibleRows*47+eggRows*44+(collapsed?0:8);
  const c=this.add.container(0,0).setDepth(12050);
  const bg=this.add.rectangle(0,0,width,height,0x15091d,.92).setOrigin(0,0).setStrokeStyle(1,0xd0ae69,.42);
  const head=this.add.rectangle(0,0,width,46,0x261631,.96).setOrigin(0,0).setInteractive({useHandCursor:true});
  const title=this.add.text(12,8,'✦ GUARDIAN HOME',{
    fontFamily:'Georgia',fontStyle:'bold',fontSize:'15px',color:'#f4d19a'
  });
  const summary=this.add.text(width-12,9,rs.length+' awake • '+es.length+' egg'+(es.length===1?'':'s'),{
    fontFamily:'Arial',fontSize:'10px',color:'#d9cadf'
  }).setOrigin(1,0);
  const toggle=this.add.text(width-12,25,collapsed?'SHOW ▾':'HIDE ▴',{
    fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:'#a98fc1'
  }).setOrigin(1,0);
  c.add([bg,head,title,summary,toggle]);
  head.on('pointerup',()=>{
    this.v3320HudCollapsed=!this.v3320HudCollapsed;
    this.v3320BuildHomeHud(this.v3317CareState);
  });

  let y=50;
  if(!collapsed){
    rs.slice(0,4).forEach(g=>{
      const need=worstNeed(g);
      const rowBg=this.add.rectangle(7,y,width-14,41,0x211429,.88).setOrigin(0,0)
        .setStrokeStyle(1,need.value<50?0xc66f79:0x6e587e,need.value<50?.70:.35)
        .setInteractive({useHandCursor:true});
      const left=this.add.text(17,y+6,(g.icon||'✦')+' '+(g.name||'Guardian'),{
        fontFamily:'Arial',fontStyle:'bold',fontSize:'12px',color:'#f4e8f1'
      });
      const right=this.add.text(width-17,y+6,need.icon+' '+Math.round(need.value)+'% • Bond '+Math.round(Number(g.bond)||0),{
        fontFamily:'Arial',fontSize:'10px',color:need.value<50?'#ffc6c9':'#d3c8da'
      }).setOrigin(1,0);
      const sub=this.add.text(17,y+23,(g.mood?.label||'Bonded')+(g.favoriteOwned?' • favorite item ready':''),{
        fontFamily:'Arial',fontSize:'9px',color:'#a99bb2'
      });
      rowBg.on('pointerup',()=>this.openGuardianCarePanel?.(g.petId));
      c.add([rowBg,left,right,sub]);
      y+=47;
    });
    es.slice(0,2).forEach(e=>{
      const rowBg=this.add.rectangle(7,y,width-14,38,0x1c1528,.84).setOrigin(0,0);
      const pct=clamp(e.pct,0,100);
      const label=this.add.text(17,y+6,'🥚 '+(e.species||'Guardian')+' Egg',{
        fontFamily:'Arial',fontStyle:'bold',fontSize:'11px',color:'#f3dfb0'
      });
      const prog=this.add.text(width-17,y+6,pct+'% • '+Number(e.moonlightLeft||0)+' moonlight left',{
        fontFamily:'Arial',fontSize:'9px',color:'#b9aac4'
      }).setOrigin(1,0);
      const track=this.add.rectangle(17,y+26,width-34,4,0x493852,.8).setOrigin(0,.5);
      const fill=this.add.rectangle(17,y+26,(width-34)*(pct/100),4,0xd0ae69,.95).setOrigin(0,.5);
      c.add([rowBg,label,prog,track,fill]);
      y+=44;
    });
  }
  this.v3320HomeHud=c;
  this.fixToScreen?.(c,26,145);
};

Game.prototype.v3320ApplyCareSnapshot=function(snapshot){
  if(!snapshot)return;
  this.v3317CareState=snapshot;
  this.v3320BuildHomeHud(snapshot);
  this.v3320RefreshObjectBadges(snapshot);
  this.v3320RefreshGuardianLabels(snapshot);
};

Game.prototype.v3320RefitHud=function(){
  if(this.v3320HomeHud?.active)this.fixToScreen?.(this.v3320HomeHud,26,145);
};

const baseToggleEdit=Game.prototype.toggleEditMode;
Game.prototype.toggleEditMode=function(){
  const result=baseToggleEdit?.call(this);
  this.v3320SetEditVisuals();
  return result;
};

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  baseCreate.call(this);
  this.v3320HudCollapsed=new URLSearchParams(location.search).get('context')==='home';
  this.v3320GuardianLabels={};
  this.v3320CreateEditGuide();
  this.v3320AttachDecorEnhancements();
  this.v3320BuildHomeHud(this.v3317CareState);
  this.v3320RefreshObjectBadges(this.v3317CareState);
  this.v3320RefreshGuardianLabels(this.v3317CareState);
  this.v3320SetEditVisuals();

  this.time.addEvent({delay:100,loop:true,callback:()=>this.v3320TickGuardianLabels()});
  this.scale.on?.('resize',()=>this.time.delayedCall(80,()=>this.v3320RefitHud()));
  this.time.delayedCall(350,()=>{
    try{window.parent?.postMessage({type:'MAJICK_CARE_STATE_REQUEST_V3317'},location.origin)}catch(_){}
  });
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  if(d.type!=='MAJICK_CARE_STATE_V3317'&&d.type!=='MAJICK_CARE_RESULT_V3317')return;
  const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
  if(!scene)return;
  const snap=d.snapshot||d.result?.snapshot||scene.v3317CareState;
  if(snap)scene.v3320ApplyCareSnapshot?.(snap);
});

function inspect(scene){
  const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game');
  const badges={};
  for(const item of (s?.decorItems||[])){
    if(item.v3320CareBadge)badges[objectId(item)]=item.v3320CareBadge.text||'';
  }
  return {
    version:VERSION,
    hud:!!s?.v3320HomeHud?.active,
    editGuide:!!s?.v3320EditGuide?.active,
    roster:Number(s?.v3317CareState?.roster?.length||0),
    eggs:Number(s?.v3317CareState?.eggs?.length||0),
    guardianLabels:Object.values(s?.v3320GuardianLabels||{}).filter(x=>x?.active).length,
    badges
  };
}

window.MajickSanctuaryLife={VERSION,GRID,CARE_OBJECTS,findDecor,worstNeed,inspect};
})();