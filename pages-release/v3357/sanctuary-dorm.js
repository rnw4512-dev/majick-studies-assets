// Majick Studies V3.3.57 — SANCTUARY DORM POLISH
// Additive environmental layer. Does not alter protected Guardian movement or motion assets.
(function(){
'use strict';
if(typeof Game==='undefined')return;
const VERSION='3.3.57';
const ZONES=[
  {key:'study',title:'Study Nook',subtitle:'books • desk • quiet focus',x:.22,y:.68},
  {key:'care',title:'Care Station',subtitle:'food • water • grooming',x:.50,y:.68},
  {key:'play',title:'Play Commons',subtitle:'toys • bonding • favorite items',x:.78,y:.68},
  {key:'rest',title:'Rest Loft',subtitle:'beds • comfort • moonlight',x:.50,y:.86}
];
function safeDestroy(x){try{x?.destroy?.(true)}catch(_){}}
Game.prototype.v3357BuildDormIdentity=function(){
  safeDestroy(this.v3357DormLayer);
  const width=Number(this.worldWidth||1600),height=Number(this.worldHeight||1000);
  const c=this.add.container(0,0).setDepth(18);
  const frame=this.add.graphics();
  frame.lineStyle(2,0xd7b56f,.20);
  frame.strokeRoundedRect(90,600,Math.max(400,width-180),Math.max(180,height-670),24);
  frame.lineStyle(1,0xb58bc9,.12);
  frame.strokeRoundedRect(108,618,Math.max(360,width-216),Math.max(140,height-706),20);
  c.add(frame);

  const plaqueBg=this.add.rectangle(width/2,622,440,56,0x1c1024,.88).setOrigin(.5,0).setStrokeStyle(1,0xd7b56f,.42);
  const plaque=this.add.text(width/2,635,'MOONLIT COLLEGIUM • GUARDIAN RESIDENCE',{
    fontFamily:'Georgia',fontStyle:'bold',fontSize:'16px',color:'#f2d79b',
    align:'center'
  }).setOrigin(.5,0);
  const sub=this.add.text(width/2,658,'Sanctuary Dormitory • bonded Guardians live, study, play, and rest here',{
    fontFamily:'Arial',fontSize:'10px',color:'#d7c9dc',align:'center'
  }).setOrigin(.5,0);
  c.add([plaqueBg,plaque,sub]);

  this.v3357ZoneLabels=[];
  for(const z of ZONES){
    const x=Math.round(width*z.x),y=Math.round(height*z.y);
    const tag=this.add.container(x,y).setDepth(19);
    const bg=this.add.rectangle(0,0,200,46,0x160d1e,.74).setStrokeStyle(1,0xae8ac1,.24);
    const title=this.add.text(0,-8,z.title,{fontFamily:'Georgia',fontStyle:'bold',fontSize:'13px',color:'#edd49b'}).setOrigin(.5);
    const subtitle=this.add.text(0,9,z.subtitle,{fontFamily:'Arial',fontSize:'9px',color:'#bfb0c6'}).setOrigin(.5);
    tag.add([bg,title,subtitle]);
    this.v3357ZoneLabels.push(tag);c.add(tag);
  }
  this.v3357DormLayer=c;
  this.v3357SetDormEditState?.();
};
Game.prototype.v3357SetDormEditState=function(){
  const editing=!!this.editMode;
  this.v3357DormLayer?.setAlpha?.(editing?.42:1);
  for(const tag of (this.v3357ZoneLabels||[]))tag?.setVisible?.(!editing);
};
const baseToggle=Game.prototype.toggleEditMode;
Game.prototype.toggleEditMode=function(){
  const out=baseToggle?.call(this);
  this.v3357SetDormEditState?.();
  return out;
};
const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
  baseCreate.call(this);
  this.v3357BuildDormIdentity();
  if(this.hudStatusText?.setText){
    const current=String(this.hudStatusText.text||'');
    if(!current.includes('Guardian Residence'))this.hudStatusText.setText('Guardian Residence • beds, care, play, study & personal nooks are active');
  }
  this.scale.on?.('resize',()=>this.time?.delayedCall?.(100,()=>this.v3357BuildDormIdentity()));
};
window.MajickSanctuaryDorm={
  VERSION,
  ZONES,
  inspect(){
    const s=window.majickPhaserGame?.scene?.getScene?.('Game');
    return {version:VERSION,layer:!!s?.v3357DormLayer?.active,zones:Number(s?.v3357ZoneLabels?.length||0),editMode:!!s?.editMode};
  }
};
})();