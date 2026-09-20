// V3.3.14 — manifest-driven sanctuary objects around protected Guardian movement.
(function(){
'use strict';
if(typeof Game==='undefined') return;

function manifest(scene){
  try{return scene.cache.json.get('majick-object-manifest')||{objects:[]}}catch(_){return {objects:[]}}
}
function route(scene,destination,extra={}){
  if(!destination) return;
  scene.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route:destination,...extra});
}
function art(scene,key,width){
  const c=scene.add.container(0,0);
  const im=scene.add.image(0,55,key).setOrigin(.5,1);
  const sc=(width||240)/Math.max(1,im.width); im.setScale(sc); c.add(im);
  return c;
}
function runInteraction(scene,obj){
  if(obj.interaction==='assign-rest') return scene.openFamiliarObjectPicker(obj.placement?.slot||obj.id);
  if(obj.interaction==='progress-mirror' && scene.openMagicMirror3313) return scene.openMagicMirror3313();
  if(obj.interaction==='guardian-care') return route(scene,'companions',{objectId:obj.id});
  if(obj.interaction==='world-navigation') return obj.destination ? route(scene,obj.destination,{objectId:obj.id}) : scene.showInteractionPanel?.(obj.displayName,'Sanctuary Path','This path is registered in the object manifest and can be activated later.',[]);
  if(obj.interaction==='open-route') return route(scene,obj.destination,{objectId:obj.id});
}
const oldDecor=Game.prototype.createDecor;
Game.prototype.createDecor=function(){
  const m=manifest(this);
  const live=(m.objects||[]).filter(o=>o.enabled && o.preload && o.placement && this.textures.exists('obj-'+o.id));
  if(!live.length){ oldDecor.call(this); return; }
  live.forEach(o=>{
    this.createMovableDecor(
      'manifest-'+o.id,
      o.placement.x,o.placement.y,o.displayName,
      ()=>art(this,'obj-'+o.id,(o.placement.width||240)*(o.scale||1)),
      ()=>runInteraction(this,o)
    );
  });
};
Game.prototype.getSanctuaryObjectManifest=function(){return manifest(this)};
Game.prototype.getSanctuaryObject=function(id){return (manifest(this).objects||[]).find(o=>o.id===id)||null};


const V3314_STAGE_COLORS=[0x8fa8ff,0x9a7cff,0xc27cff,0xf0b35f,0xffe58a];

Game.prototype.v3314ClearEvolutionFX=function(type){
  const fx=this['v3314Fx_'+type];
  if(!fx)return;
  try{fx.ring?.destroy();fx.ring2?.destroy();fx.badge?.destroy();(fx.motes||[]).forEach(x=>x.destroy());}catch(_){}
  this['v3314Fx_'+type]=null;
};

Game.prototype.v3314ApplyEvolutionFX=function(type,state){
  const pet=this[type]; if(!pet||!state)return;
  const old=this['v3314Fx_'+type];
  if(old&&old.stageIndex===state.stageIndex&&old.level===state.level)return;
  this.v3314ClearEvolutionFX(type);
  const c=V3314_STAGE_COLORS[state.stageIndex]||0xb99cff;
  const ring=this.add.ellipse(pet.x,pet.y+10,Math.max(110,pet.displayWidth*1.35),Math.max(62,pet.displayHeight*.62),c,.10)
    .setStrokeStyle(3,c,.48).setDepth(Math.max(1,(pet.depth||70)-2));
  const fx={stageIndex:state.stageIndex,level:state.level,ring,motes:[]};
  if(state.stageIndex>=2){
    fx.ring2=this.add.ellipse(pet.x,pet.y+6,Math.max(135,pet.displayWidth*1.6),Math.max(76,pet.displayHeight*.74),0xffe3a1,.03)
      .setStrokeStyle(2,0xffe3a1,.28).setDepth(Math.max(1,(pet.depth||70)-3));
  }
  const moteCount=[0,1,2,3,5][state.stageIndex];
  for(let i=0;i<moteCount;i++){
    const m=this.add.star(pet.x,pet.y,5,2,5,state.stageIndex>=3?0xffdf87:0xd8c8ff,.85).setDepth((pet.depth||70)+1);
    fx.motes.push(m);
    this.tweens.add({targets:m,alpha:.28,scale:1.45,duration:800+i*130,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  }
  if(state.stageIndex>=3){
    fx.badge=this.add.text(pet.x,pet.y-Math.max(70,pet.displayHeight*.62),state.stageIndex===4?'✦ ☾ ✦':'✦',
      {fontFamily:'Georgia',fontSize:state.stageIndex===4?'23px':'20px',color:state.stageIndex===4?'#ffe9a8':'#f2cf82',
       stroke:'#28182f',strokeThickness:4}).setOrigin(.5).setDepth((pet.depth||70)+3).setAlpha(.92);
  }
  this['v3314Fx_'+type]=fx;
};

Game.prototype.v3314UpdateEvolutionFX=function(){
  const states=this.v3314GuardianStates||{};
  ['luna','ember','nova','mallow'].forEach(type=>{
    const pet=this[type],st=states[type],fx=this['v3314Fx_'+type];
    if(!pet||!st)return;
    if(!fx||fx.stageIndex!==st.stageIndex||fx.level!==st.level)this.v3314ApplyEvolutionFX(type,st);
    const live=this['v3314Fx_'+type]; if(!live)return;
    live.ring.setPosition(pet.x,pet.y+10);
    live.ring2?.setPosition(pet.x,pet.y+6);
    live.badge?.setPosition(pet.x,pet.y-Math.max(70,pet.displayHeight*.62));
    const t=this.time.now/1000;
    (live.motes||[]).forEach((m,i)=>{
      const r=Math.max(62,pet.displayWidth*.72)+(i%2)*14;
      const a=t*(.8+(i%3)*.12)+(Math.PI*2*i/Math.max(1,live.motes.length));
      m.setPosition(pet.x+Math.cos(a)*r,pet.y-20+Math.sin(a)*r*.42);
    });
  });
};

const v3314BaseCreate=Game.prototype.create;
Game.prototype.create=function(){
  v3314BaseCreate.call(this);
  this.v3314GuardianStates=this.v3314GuardianStates||{};
  this.time.addEvent({delay:80,loop:true,callback:()=>this.v3314UpdateEvolutionFX()});
  try{window.parent?.postMessage({type:'MAJICK_SANCTUARY_READY_V3314'},location.origin)}catch(_){}
};

window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};
  if(d.type!=='MAJICK_GUARDIAN_LEVELS_V3314'||!d.guardians)return;
  const scene=window.majickPhaserGame?.scene?.getScene('Game');
  if(!scene)return;
  scene.v3314GuardianStates=d.guardians;
  ['luna','ember','nova','mallow'].forEach(type=>scene.v3314ApplyEvolutionFX(type,d.guardians[type]));
});

})();
