// Majick Studies V3.3.17 — CLEAN PHASER SANCTUARY RUNTIME
// Runtime chain: base Game.js -> V3.3.10 protected motion -> THIS FILE.
// Do not load V3.3.11–V3.3.15 sanctuary wrappers with this file.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const CANON={luna:'velora',ember:'cascade',nova:'solstice',mallow:'aurelia'};
const NAMES={luna:'Velora',ember:'Cascade',nova:'Solstice',mallow:'Aurelia'};
const STAGES=['new-bond','apprentice','guardian','ascendant','celestial'];

function stageFromLevel(level){
  const n=Math.max(1,Number(level)||1);
  return n>=12?'celestial':n>=8?'ascendant':n>=5?'guardian':n>=3?'apprentice':'new-bond';
}
function guardianState(scene,type){
  const known=scene.v3317GuardianStates?.[type]||{};
  const level=Math.max(1,Number(known.level||scene[type]?.getData?.('level')||1)||1);
  return {type,canon:CANON[type]||type,level,stage:known.stageSlug||known.stage||stageFromLevel(level)};
}
function evoKey(scene,type,action){
  const s=guardianState(scene,type);
  return 'v3317-'+s.canon+'-'+s.stage+'-'+action;
}
function evoSrc(scene,type,action){
  const s=guardianState(scene,type);
  return './assets/evolutions/'+s.canon+'/'+s.stage+'/'+action+'.webp?v=3317-final';
}
function manifest(scene){
  try{return scene.cache.json.get('majick-object-manifest')||{objects:[]}}catch(_){return {objects:[]}}
}
function route(scene,destination,extra={}){
  if(!destination)return;
  scene.sendToStudyApp?.('MAJICK_OPEN_ROUTE_V3311',{route:destination,...extra});
}
function objectArt(scene,key,width){
  const c=scene.add.container(0,0);
  const im=scene.add.image(0,55,key).setOrigin(.5,1);
  im.setScale((width||240)/Math.max(1,im.width));
  c.add(im);
  return c;
}
function activateObject(scene,obj){
  if(!obj)return;

  // Interaction-specific behavior must win before a generic panel action.
  if(obj.interaction==='assign-rest'){
    return scene.openGuardianCarePicker?.('sleep',obj.placement?.slot||obj.id);
  }
  if(obj.interaction==='progress-mirror'){
    return scene.showMirrorPanel?.();
  }
  if(obj.interaction==='guardian-care'){
    return scene.openGuardianCarePicker?.(obj.careAction||null,obj.id);
  }

  switch(obj.id){
    case 'arcane-stacks': return scene.openArcaneStacks?.();
    case 'moonlit-study-desk': return scene.openStudyDesk?.();
    case 'observatory-telescope': return scene.openObservatory?.();
    case 'crystal-focus-pedestal':
    case 'study-apothecary': return scene.openCrystalFocus?.();
    case 'familiar-lounge': return scene.openFamiliarLounge?.();
    case 'magic-mirror': return scene.showMirrorPanel?.();
  }

  const panel=obj.panelAction;
  if(panel&&typeof scene[panel]==='function'){
    return scene[panel]();
  }
  if(obj.interaction==='open-route'){
    return route(scene,obj.destination,{objectId:obj.id});
  }
  if(obj.interaction==='world-navigation'){
    if(obj.destination)return route(scene,obj.destination,{objectId:obj.id});
    return scene.showToast?.(obj.displayName,'This Sanctuary path is not unlocked yet.');
  }
}

// -----------------------------------------------------------------------------
// GUARDIAN CARE — persistent state lives in the main app; Phaser owns reactions.
// -----------------------------------------------------------------------------

function careGuardian(scene,target){
  const snap=scene.v3317CareState||{};
  const key=String(target||'');
  return (snap.roster||[]).find(g=>g.petId===key) || snap.byType?.[key] || null;
}
function carePost(scene,target,action,extra={}){
  const g=careGuardian(scene,target);
  try{
    window.parent?.postMessage({
      type:'MAJICK_CARE_ACTION_V3317',
      guardianId:g?.petId||(!String(target||'').includes('undefined')?String(target||''):null),
      guardianType:g?.type||(!g&&scene[String(target||'')]?String(target||''):null),
      action,
      ...extra
    },location.origin);
  }catch(e){console.warn('V3.3.17 care post',e)}
}
function careLabel(scene,target){
  const g=careGuardian(scene,target);
  if(!g)return '';
  const avg=['hunger','hydration','energy','fun','grooming','affection']
    .reduce((n,k)=>n+(Number(g[k])||0),0)/6;
  return 'Bond '+Math.round(Number(g.bond)||0)+' • '+(g.mood?.label||Math.round(avg)+'% cared for');
}
Game.prototype.v3317CareRequest=function(target,action,extra={}){
  carePost(this,target,action,extra);
};
Game.prototype.openGuardianCarePicker=function(action,objectId){
  const snap=this.v3317CareState||{};
  const roster=snap.roster||[];
  if(!roster.length){
    try{window.parent?.postMessage({type:'MAJICK_CARE_STATE_REQUEST_V3317'},location.origin)}catch(_){}
    this.showToast?.('Guardian Care','Your bonded Guardian roster is syncing.');
    return;
  }
  const title=action?'Use '+(this.getSanctuaryObject(objectId)?.displayName||'Guardian Care Station'):'Guardian Care';
  const eggText=(snap.eggs||[]).length?' • '+snap.eggs.length+' egg incubating':'';
  const buttons=roster.map((g,i)=>({
    label:(g.name||'Guardian').toUpperCase()+' • '+(g.mood?.label||'BOND '+Math.round(g.bond||0)),
    primary:i===0,
    run:()=>action?this.v3317CareRequest(g.petId,action,{objectId}):this.openGuardianCarePanel(g.petId)
  }));
  this.showInteractionPanel?.(
    'Choose a Guardian',
    title,
    (action?'Choose which bonded Guardian should use this care object.':'Care for any Guardian you have hatched.')+eggText,
    buttons
  );
};
Game.prototype.openGuardianCarePanel=function(target){
  const snap=this.v3317CareState||{};
  const g=careGuardian(this,target);
  if(!g){
    try{window.parent?.postMessage({type:'MAJICK_CARE_STATE_REQUEST_V3317'},location.origin)}catch(_){}
    this.showToast?.('Guardian Care','Care status is syncing from Majick Studies. Try again in a moment.');
    return;
  }
  const inv=snap.inventory||{},owned=new Set(snap.owned||[]);
  const meal=Number(inv['moonberry-meal']||0),treat=Number(inv['starlight-treat']||0);
  const brush=owned.has('moon-silver-brush');
  const favorite=g.favoriteOwned?' • favorite owned':'';
  const body=[
    g.species||'Guardian',
    'Hunger '+Math.round(g.hunger)+'%',
    'Water '+Math.round(g.hydration)+'%',
    'Energy '+Math.round(g.energy)+'%',
    'Fun '+Math.round(g.fun)+'%',
    'Grooming '+Math.round(g.grooming)+'%',
    'Affection '+Math.round(g.affection)+'%',
    'Bond '+Math.round(g.bond)
  ].join('  •  ')+'\nFavorite: '+(g.favoriteLabel||'Sanctuary treasure')+favorite;

  this.showInteractionPanel?.(
    (g.name||'Guardian')+' • Care',
    (g.mood?.icon||'✦')+' '+(g.mood?.label||'Sanctuary bond'),
    body,
    [
      {label:'FEED • '+meal+' MEALS',run:()=>this.v3317CareRequest(g.petId,'feed')},
      {label:'FRESH WATER',run:()=>this.v3317CareRequest(g.petId,'water')},
      {label:'TREAT • '+treat+' LEFT',run:()=>this.v3317CareRequest(g.petId,'treat')},
      {label:brush?'BRUSH & GROOM':'BRUSH • BUY TOOL',run:()=>brush?this.v3317CareRequest(g.petId,'groom'):window.parent?.postMessage({type:'MAJICK_OPEN_CARE_SHOP_V3317'},location.origin)},
      {label:'PLAY',run:()=>this.v3317CareRequest(g.petId,'play')},
      {label:'AFFECTION',run:()=>this.v3317CareRequest(g.petId,'affection')},
      {label:'REST IN BED',run:()=>this.v3317CareRequest(g.petId,'sleep')},
      {label:'MOON CRYSTAL BOUTIQUE',primary:true,run:()=>window.parent?.postMessage({type:'MAJICK_OPEN_CARE_SHOP_V3317'},location.origin)}
    ]
  );
};
Game.prototype.v3317CareReaction=function(result){
  if(!result?.guardianId&&!result?.guardianType)return;
  const type=result.guardianType;
  const pet=type?this[type]:null;

  if(pet?.active){
    if(result.travelObject){
      this.__v3317CareSkipBed=type+'|'+result.travelObject;
      this.startFamiliarObjectInteraction?.(type,result.travelObject);
    }else{
      this.v3317ShowAction?.(type,result.visualAction==='sleep'?'sleep':'play',result.action==='affection'?2200:2900);
    }

    try{
      const def=this.getFamiliarInteractionDef?.(type);
      this.createSparkles?.(pet.x,pet.y-70,result.favoriteBonus?26:16);
      this.showPetMessage?.(pet,result.message||'The familiar bond glows a little brighter.',def?.bubble||'#e8d4ff');
      const float=this.add.text(pet.x,pet.y-150,result.icon||'✦',{
        fontFamily:'Georgia',fontSize:'34px',color:'#ffe2a0',
        stroke:'#24152f',strokeThickness:4
      }).setOrigin(.5).setDepth(500);
      this.tweens.add({targets:float,y:float.y-55,alpha:0,duration:1500,ease:'Sine.out',onComplete:()=>float.destroy()});
    }catch(e){console.warn('V3.3.17 care reaction',e)}
  }else{
    // Portrait-ready Guardians without movement sets still receive full care state,
    // inventory use and bond gains. Their bespoke Phaser movement can be added later.
    try{this.createSparkles?.(960,330,result.favoriteBonus?30:18)}catch(_){}
  }

  this.showToast?.(
    (result.name||NAMES[type]||'Guardian')+' • '+(result.mood?.label||'Bond moment'),
    result.message||'Care complete.'
  );
};

// -----------------------------------------------------------------------------
// RICH PANELS — directly on V3.3.17, no dependency on old sanctuary wrappers.
// -----------------------------------------------------------------------------
Game.prototype.openArcaneStacks=function(){
  this.createSparkles?.(360,390,12);
  this.showInteractionPanel?.('The Arcane Stacks','Living Library',
    'The shelves connect to your Living Grimoire, mistake repair, and study guide.',
    [
      {label:'OPEN LIVING GRIMOIRE',primary:true,run:()=>route(this,'livinggrimoire')},
      {label:'MISTAKE GRIMOIRE',run:()=>route(this,'grimoire')},
      {label:'STUDY GUIDE',run:()=>route(this,'guide')},
      {label:'READ WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('stacks')}
    ]);
};
Game.prototype.openStudyDesk=function(){
  this.createSparkles?.(1080,610,12);
  this.showInteractionPanel?.('Moonlit Study Desk','Notes Forge + Study Workspace',
    'Add WGU material, continue studying, write notes, or study beside a Guardian.',
    [
      {label:'ADD STUDY MATERIAL',primary:true,run:()=>route(this,'addmaterial')},
      {label:'CONTINUE STUDYING',run:()=>route(this,'mission')},
      {label:'OPEN MY JOURNAL',run:()=>route(this,'journal')},
      {label:'OPEN LIVING GRIMOIRE',run:()=>route(this,'livinggrimoire')},
      {label:'STUDY WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('desk')}
    ]);
};
Game.prototype.openObservatory=function(){
  this.showInteractionPanel?.('Celestial Observatory','Upper College',
    'Use the telescope for readiness, final review, constellations, and Guardian evolution.',
    [
      {label:'CONSTELLATION',primary:true,run:()=>route(this,'constellation')},
      {label:'FINAL REVIEW',run:()=>route(this,'finalreview')},
      {label:'GUARDIAN EVOLUTIONS',run:()=>route(this,'companions')},
      {label:'STARGAZE WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('observatory')}
    ]);
};
Game.prototype.openCrystalFocus=function(){
  const s=this.studyState||{};
  this.createSparkles?.(1480,655,18);
  this.showInteractionPanel?.('Crystal Focus Alcove','Quiet Study',
    'Your crystal reserve is '+(s.crystals||0)+'. Use focus tools or invite a Guardian.',
    [
      {label:'FOCUS TOOLS',primary:true,run:()=>route(this,'focus')},
      {label:'MAGIC VAULT',run:()=>route(this,'vault')},
      {label:'STUDY PLANNER',run:()=>route(this,'planner')},
      {label:'FOCUS WITH GUARDIAN',run:()=>this.openFamiliarObjectPicker?.('focus')}
    ]);
};

// -----------------------------------------------------------------------------
// MANIFEST OBJECTS — one owner.
// -----------------------------------------------------------------------------
Game.prototype.createDecor=function(){
  const m=manifest(this);
  const live=(m.objects||[]).filter(o=>o.enabled&&o.preload&&o.placement&&this.textures.exists('obj-'+o.id));
  this.decorItems=this.decorItems||[];

  if(!live.length){
    console.warn('V3.3.17 manifest objects unavailable; using base decor');
    return;
  }

  live.forEach(obj=>{
    const width=(obj.placement.width||240)*(obj.scale||1);
    const item=this.createMovableDecor(
      obj.id,
      obj.placement.x,
      obj.placement.y,
      obj.displayName,
      ()=>objectArt(this,'obj-'+obj.id,width),
      ()=>activateObject(this,obj)
    );
    if(!item)return;

    item.setData('objectId',obj.id);
    item.setData('manifestObject',obj);
    item.setData('blocksWalking',!!obj.blocksWalking);

    // Match the clickable/drag target to the visible furniture instead of
    // inheriting the old generic 170x140 rectangle.
    const hitW=Math.max(150,Math.min(430,width+28));
    const hitH=Math.max(140,Math.min(360,width*.82));
    try{
      item.removeInteractive();
      item.setSize(hitW,hitH);
      item.setInteractive(
        new Phaser.Geom.Rectangle(-hitW/2,-hitH+60,hitW,hitH),
        Phaser.Geom.Rectangle.Contains
      );
      item.input.cursor='pointer';
      if(this.editMode)this.input.setDraggable(item);
    }catch(e){
      console.warn('V3.3.17 object hit area',obj.id,e);
    }

    // Base createMovableDecor supplies edit-mode drag + saved positions.
    const syncDepth=()=>item.setDepth(30+Math.round(item.y/30));
    syncDepth();
    item.on('drag',syncDepth);
    item.on('dragend',syncDepth);
  });
};
Game.prototype.getSanctuaryObjectManifest=function(){return manifest(this)};
Game.prototype.getSanctuaryObject=function(id){return (manifest(this).objects||[]).find(o=>o.id===id)||null};

const baseToggleEdit=Game.prototype.toggleEditMode;
Game.prototype.toggleEditMode=function(){
  const result=baseToggleEdit?.call(this);
  if(this.editModeText){
    this.editModeText.setText(this.editMode?'✓ DONE EDITING':'✦ EDIT SANCTUARY');
  }
  return result;
};

// -----------------------------------------------------------------------------
// EVOLVED VISUALS — movement remains controlled by the protected Phase 4 mover.
// -----------------------------------------------------------------------------
Game.prototype.v3317LoadAction=function(type,action,done){
  const k=evoKey(this,type,action),src=evoSrc(this,type,action);
  if(this.textures.exists(k)){done?.(k);return;}
  if(this['__v3317Loading_'+k]){
    this.time.delayedCall(100,()=>this.v3317LoadAction(type,action,done));
    return;
  }
  this['__v3317Loading_'+k]=true;
  this.load.image(k,src);
  this.load.once('complete',()=>{
    this['__v3317Loading_'+k]=false;
    done?.(this.textures.exists(k)?k:null);
  });
  this.load.once('loaderror',()=>{
    this['__v3317Loading_'+k]=false;
    done?.(null);
  });
  this.load.start();
};

Game.prototype.v3317EnsureWalkSkin=function(type){
  const pet=this[type];if(!pet?.active)return;
  const expected=evoKey(this,type,'walk');
  const old=this['v3317Walk_'+type];
  if(old?.active&&old.texture?.key===expected)return;
  try{old?.destroy()}catch(_){}
  this['v3317Walk_'+type]=null;

  this.v3317LoadAction(type,'walk',k=>{
    if(!k||!pet?.active)return;
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+2);
    const targetH=Math.max(285,Math.min(380,(pet.displayHeight||165)*2));
    img.setScale(targetH/Math.max(1,img.height));
    this['v3317Walk_'+type]=img;
  });
};

Game.prototype.v3317ShowAction=function(type,action,duration){
  const pet=this[type];if(!pet?.active)return;
  this.v3317LoadAction(type,action,k=>{
    if(!k||!pet?.active)return;
    const old=this['v3317Action_'+type];try{old?.destroy()}catch(_){}
    const img=this.add.image(pet.x,pet.y,k).setOrigin(.5,1).setDepth((pet.depth||70)+3);
    const targetH=Math.max(285,Math.min(380,(pet.displayHeight||165)*2));
    img.setScale(targetH/Math.max(1,img.height));
    this['v3317Action_'+type]=img;
    const follow=this.time.addEvent({delay:45,loop:true,callback:()=>{
      if(img.active&&pet.active)img.setPosition(pet.x,pet.y).setDepth((pet.depth||70)+3);
    }});
    this.time.delayedCall(Math.max(900,Number(duration)||2400),()=>{
      follow.remove(false);
      try{img.destroy()}catch(_){}
      if(this['v3317Action_'+type]===img)this['v3317Action_'+type]=null;
    });
  });
};

Game.prototype.v3317UpdateGuardianVisuals=function(){
  this.__v3317Prev=this.__v3317Prev||{};
  const now=this.time.now;

  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];if(!pet?.active)return;
    this.v3317EnsureWalkSkin(type);

    const walk=this['v3317Walk_'+type],action=this['v3317Action_'+type];
    const prev=this.__v3317Prev[type]||{x:pet.x,y:pet.y};
    const dx=pet.x-prev.x,dy=pet.y-prev.y;
    const moving=Math.abs(dx)>.8||Math.abs(dy)>.8;
    this.__v3317Prev[type]={x:pet.x,y:pet.y};

    if(walk?.active){
      const base=walk.scaleX||1,step=Math.sin(now/92),breath=Math.sin(now/620);
      walk.setVisible(!action?.active);
      walk.setPosition(pet.x,pet.y+(moving?step*4:breath*2));
      walk.setDepth((pet.depth||70)+2);
      if(dx<-.2)walk.setFlipX(true);else if(dx>.2)walk.setFlipX(false);
      const abs=Math.abs(base);
      walk.setScale(abs*(moving?1-step*.014:1+breath*.006),abs*(moving?1+step*.020:1-breath*.004));
      walk.setRotation(moving?step*.009:0);

      // The original sprite stays alive and moving underneath as the controller.
      pet.setAlpha(.01).setVisible(true);
    }else{
      pet.setAlpha(1).setVisible(true);
    }

    if(action?.active)walk?.setVisible(false);
  });
};

const baseReaction=Game.prototype.playFamiliarObjectReaction;
Game.prototype.playFamiliarObjectReaction=function(def,obj,token){
  const result=baseReaction?.call(this,def,obj,token);
  const action=obj?.mode==='sleep'?'sleep':'play';
  this.v3317ShowAction?.(def?.id,action,obj?.mode==='sleep'?3900:2900);

  // Directly clicking a crystal bed now changes real care state.
  if(obj?.mode==='sleep'&&(obj.id==='bed-west'||obj.id==='bed-east')){
    const key=def?.id+'|'+obj.id;
    if(this.__v3317CareSkipBed===key){
      this.__v3317CareSkipBed=null;
    }else{
      carePost(this,def?.id,'sleep',{objectId:obj.id});
    }
  }
  return result;
};

Game.prototype.v3317CheckCoreObjects=function(){
  const required=[
    'arcane-stacks','moonlit-study-desk','observatory-telescope',
    'crystal-focus-pedestal','moonstone-crystal-bed','amethyst-crystal-bed',
    'study-apothecary','familiar-lounge','magic-mirror'
  ];
  const present=new Set((this.decorItems||[]).map(x=>x.getData?.('objectId')).filter(Boolean));
  const missing=required.filter(id=>!present.has(id));
  if(missing.length){
    console.warn('V3.3.17 missing core Sanctuary objects',missing);
    this.hudStatusText?.setText('Sanctuary loaded with '+missing.length+' object warning'+(missing.length===1?'':'s'));
  }else{
    this.hudStatusText?.setText('Sanctuary ready • 9 interactive objects');
  }
  return {ok:!missing.length,missing};
};

function hideLegacyLabels(scene){
  ['lunaName','lunaType','emberName','emberType','novaName','novaType','mallowName','mallowType']
    .forEach(k=>{if(scene[k])scene[k].setVisible(false).setAlpha(0)});
}

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  this.v3317GuardianStates={};
  this.v3317CareState={roster:[],guardians:{},byType:{},eggs:[],inventory:{},owned:[]};
  baseCreate.call(this);
  hideLegacyLabels(this);

  // Preserve base edit mode; only improve its visible label.
  if(this.editModeText)this.editModeText.setText('✦ EDIT SANCTUARY');

  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type];if(!pet)return;
    try{
      pet.setInteractive({useHandCursor:true});
      pet.on('pointerup',()=>{
        if(!this.editMode)this.openGuardianCarePanel(this.v3317CareState?.byType?.[type]?.petId||type);
      });
    }catch(_){}
  });

  this.time.addEvent({delay:70,loop:true,callback:()=>{
    hideLegacyLabels(this);
    this.v3317UpdateGuardianVisuals();
  }});
  this.time.delayedCall(250,()=>this.v3317UpdateGuardianVisuals());
  this.time.delayedCall(320,()=>this.v3317CheckCoreObjects());

  try{
    window.parent?.postMessage({type:'MAJICK_SANCTUARY_READY_V3317'},location.origin);
    window.parent?.postMessage({type:'MAJICK_CARE_STATE_REQUEST_V3317'},location.origin);
  }catch(_){}
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  const scene=window.majickPhaserGame?.scene?.getScene('Game');
  if(!scene)return;

  if(d.type==='MAJICK_GUARDIAN_LEVELS_V3317'&&d.guardians){
    scene.v3317GuardianStates=d.guardians;
    ['luna','ember','nova','mallow'].forEach(type=>{
      try{scene['v3317Walk_'+type]?.destroy()}catch(_){}
      try{scene['v3317Action_'+type]?.destroy()}catch(_){}
      scene['v3317Walk_'+type]=null;
      scene['v3317Action_'+type]=null;
      scene.v3317EnsureWalkSkin(type);
    });
    return;
  }

  if(d.type==='MAJICK_CARE_STATE_V3317'&&d.snapshot){
    scene.v3317CareState=d.snapshot;
    return;
  }

  if(d.type==='MAJICK_CARE_RESULT_V3317'&&d.result){
    scene.v3317CareState=d.snapshot||d.result.snapshot||scene.v3317CareState;
    if(d.result.ok)scene.v3317CareReaction(d.result);
    else{
      scene.showToast?.('Guardian Care',d.result.message||'That care action is not available right now.');
      if(d.result.needsShop){
        scene.time.delayedCall(650,()=>window.parent?.postMessage({type:'MAJICK_OPEN_CARE_SHOP_V3317'},location.origin));
      }
    }
  }
});

})();
