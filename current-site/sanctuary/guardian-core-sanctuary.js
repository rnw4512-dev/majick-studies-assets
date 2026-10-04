(()=>{
'use strict';
if(typeof window.Game==='undefined')return;
const VERSION='3.3.41';
const MOVE_FN={luna:'lunaWalk',ember:'emberWalk',nova:'novaRun',mallow:'mallowHop'};
let audioCtx=null;

function types(){try{return window.MajickGuardianRegistry?.protectedMotionTypes?.()||['luna','ember','nova','mallow']}catch(_){return ['luna','ember','nova','mallow']}}
function roster(scene){return Array.isArray(scene?.v3317CareState?.roster)?scene.v3317CareState.roster:[]}
function owned(scene,type){return roster(scene).some(g=>String(g?.type||'')===String(type||''))}
function guardian(scene,type){return roster(scene).find(g=>String(g?.type||'')===String(type||''))||null}
function unlockAudio(){
  if(audioCtx)return audioCtx;
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    audioCtx=new C();if(audioCtx.state==='suspended')audioCtx.resume?.();
  }catch(_){audioCtx=null}
  return audioCtx;
}
function tone(ctx,freq,start,duration,volume=.035,type='sine',end=null){
  try{
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);
    if(end)o.frequency.exponentialRampToValueAtTime(Math.max(25,end),start+duration);
    g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(volume,start+.015);g.gain.exponentialRampToValueAtTime(.0001,start+duration);
    o.connect(g);g.connect(ctx.destination);o.start(start);o.stop(start+duration+.03);
  }catch(_){}
}
function noise(ctx,start,duration,volume=.014){
  try{
    const n=Math.max(1,Math.floor(ctx.sampleRate*duration)),buf=ctx.createBuffer(1,n,ctx.sampleRate),a=buf.getChannelData(0);
    for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=buf;filter.type='bandpass';filter.frequency.value=760;filter.Q.value=2.4;
    g.gain.setValueAtTime(volume,start);g.gain.exponentialRampToValueAtTime(.0001,start+duration);src.connect(filter);filter.connect(g);g.connect(ctx.destination);src.start(start);src.stop(start+duration);
  }catch(_){}
}
function voice(type,kind='hello'){
  const ctx=unlockAudio();if(!ctx)return;
  try{if(ctx.state==='suspended')ctx.resume?.()}catch(_){}
  const t=ctx.currentTime+.01;
  if(type==='luna'){tone(ctx,155,t,.13,.027,'sine',135);tone(ctx,600,t+.1,.14,.021,'sine',780)}
  else if(type==='ember'){noise(ctx,t,.12,.012);tone(ctx,225,t+.01,.18,.03,'sawtooth',145);tone(ctx,470,t+.13,.11,.018,'triangle',630)}
  else if(type==='nova'){tone(ctx,720,t,.08,.025,'sine',960);tone(ctx,970,t+.07,.08,.022,'sine',820);tone(ctx,810,t+.14,.1,.018,'triangle',1060)}
  else if(type==='mallow'){tone(ctx,850,t,.08,.022,'sine',1100);tone(ctx,1160,t+.08,.1,.018,'sine',900)}
  else{tone(ctx,540,t,.11,.022,'triangle',720);tone(ctx,730,t+.09,.11,.017,'sine',900)}
  if(kind==='mastery')tone(ctx,520,t+.2,.22,.025,'triangle',1040);
}
function burst(scene,type,count=18){
  const pet=scene?.[type];if(!pet?.active)return;
  try{scene.createSparkles?.(pet.x,pet.y-75,count)}catch(_){}
  for(let i=0;i<Math.min(18,count);i++){
    try{
      const a=(Math.PI*2*i/Math.max(1,count))+(Math.random()-.5)*.35,dist=42+Math.random()*70;
      const s=scene.add.text(pet.x,pet.y-75,i%3===0?'✦':i%3===1?'·':'✧',{fontFamily:'Georgia',fontSize:(12+Math.random()*10)+'px',color:i%2?'#f5d98f':'#d7b7ee',stroke:'#1c1025',strokeThickness:2}).setOrigin(.5).setDepth(700);
      scene.tweens.add({targets:s,x:pet.x+Math.cos(a)*dist,y:pet.y-75+Math.sin(a)*dist-18,alpha:0,scale:1.35,duration:650+Math.random()*500,ease:'Cubic.out',onComplete:()=>s.destroy()});
    }catch(_){}
  }
}
function message(scene,type,text){
  const pet=scene?.[type];if(!pet?.active)return;
  try{scene.showPetMessage?.(pet,text,'#ead7ff')}catch(_){}
}
function motionWatch(scene,type){
  if(!owned(scene,type))return false;
  const pet=scene[type];if(!pet?.active)return false;
  const action=scene['v3317Action_'+type];
  if(action?.active)return false;
  const movingTween=scene[type+'MoveTween'];
  const nextTimer=scene[type+'NextTimer'];
  if(movingTween?.isPlaying?.()||nextTimer?.getProgress?.()<1)return true;
  const fn=MOVE_FN[type];
  if(fn&&typeof scene[fn]==='function'){
    try{scene[fn]();return true}catch(e){console.warn('Guardian Core motion restart',type,e)}
  }
  return false;
}
function startWatchdog(scene){
  if(scene.__v3341MotionWatchdog)return;
  scene.__v3341MotionWatchdog=scene.time?.addEvent?.({delay:2400,loop:true,callback:()=>types().forEach(type=>motionWatch(scene,type))});
}
const baseUpdate=Game.prototype.v3317UpdateGuardianVisuals;
Game.prototype.v3317UpdateGuardianVisuals=function(){
  const r=typeof baseUpdate==='function'?baseUpdate.apply(this,arguments):undefined;
  this.__v3341Prev=this.__v3341Prev||{};
  for(const type of types()){
    if(!owned(this,type))continue;
    const pet=this[type];if(!pet?.active)continue;
    const prev=this.__v3341Prev[type]||{x:pet.x,y:pet.y};
    const dx=pet.x-prev.x,dy=pet.y-prev.y;
    const moving=Math.abs(dx)>.55||Math.abs(dy)>.55;
    this.__v3341Prev[type]={x:pet.x,y:pet.y};
    const walk=this['v3317Walk_'+type],action=this['v3317Action_'+type];
    if(action?.active){
      walk?.setVisible?.(false);
      try{pet.setVisible(true).setAlpha(0)}catch(_){}
    }else if(moving){
      // Restore the protected animated Phaser controller while movement is happening.
      // The evolved overlay returns when the Guardian settles.
      walk?.setVisible?.(false);
      try{pet.setVisible(true).setAlpha(1)}catch(_){}
    }else if(walk?.active){
      walk.setVisible(true);
      try{pet.setVisible(true).setAlpha(0)}catch(_){}
    }else{
      try{pet.setVisible(true).setAlpha(1)}catch(_){}
    }
  }
  return r;
};

const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  const r=baseCreate.apply(this,arguments);
  startWatchdog(this);
  this.time?.delayedCall?.(700,()=>types().forEach(t=>motionWatch(this,t)));
  return r;
};

const baseCare=Game.prototype.v3317CareReaction;
Game.prototype.v3317CareReaction=function(result){
  const r=typeof baseCare==='function'?baseCare.apply(this,arguments):undefined;
  const type=result?.guardianType;
  if(type&&owned(this,type)){
    burst(this,type,result?.favoriteBonus?30:20);voice(type,result?.action||'care');
  }
  return r;
};

const basePanel=Game.prototype.openGuardianCarePanel;
Game.prototype.openGuardianCarePanel=function(target){
  const g=roster(this).find(x=>x.petId===target||x.type===target);
  if(g){voice(g.type,'hello');burst(this,g.type,10)}
  return typeof basePanel==='function'?basePanel.apply(this,arguments):undefined;
};

window.addEventListener('pointerdown',()=>unlockAudio(),{once:true,capture:true});
window.addEventListener('message',ev=>{
  if(ev.origin!==location.origin)return;
  const d=ev.data||{};if(d.type!=='MAJICK_STUDY_GUARDIAN_REACTION_V3341')return;
  const type=String(d.guardianType||'');if(!type||!owned(window.majickPhaserGame?.scene?.getScene?.('Game')||null,type))return;
  const scene=window.majickPhaserGame?.scene?.getScene?.('Game');if(!scene)return;
  const kind=d.kind||'correct';
  if(kind==='concept'||kind==='mastery')scene.v3317ShowAction?.(type,'play',kind==='mastery'?3400:2400);
  burst(scene,type,kind==='mastery'?34:kind==='concept'?26:16);voice(type,kind);
  message(scene,type,kind==='mastery'?'We did it!':kind==='concept'?'That concept is ours.':'Nice work!');
});

function inspect(scene){
  const s=scene||window.majickPhaserGame?.scene?.getScene?.('Game'),out={};
  for(const type of types()){
    const pet=s?.[type],walk=s?.['v3317Walk_'+type],action=s?.['v3317Action_'+type],prev=s?.__v3341Prev?.[type];
    out[type]={owned:owned(s,type),controllerVisible:!!pet?.visible&&Number(pet?.alpha??1)>.05,walkVisible:!!walk?.visible&&Number(walk?.alpha??1)>.05,actionVisible:!!action?.visible&&Number(action?.alpha??1)>.05,position:pet?{x:pet.x,y:pet.y}:null,hasPrev:!!prev,moveTween:!!s?.[type+'MoveTween'],nextTimer:!!s?.[type+'NextTimer']};
  }
  return {version:VERSION,audioUnlocked:!!audioCtx,guardians:out};
}
window.MajickGuardianCoreSanctuary={VERSION,inspect,voice,burst,motionWatch};
document.documentElement.dataset.majickGuardianCoreSanctuary=VERSION;
})();