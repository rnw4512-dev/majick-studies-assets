// V3.3.13 — visual objects and label cleanup AROUND the protected Phase 4 movement.
// HARD RULE: no familiar movement method or motion sprite path is rewritten here.
(function(){
'use strict';
if(typeof Game==='undefined')return;

const OBJ={
  arcane:'obj-arcane-stacks',desk:'obj-moonlit-study-desk',telescope:'obj-observatory-telescope',
  crystal:'obj-crystal-focus-pedestal',moonbed:'obj-moonstone-crystal-bed',amethystbed:'obj-amethyst-crystal-bed',
  apothecary:'obj-study-apothecary',lounge:'obj-familiar-lounge',mirror:'obj-magic-mirror'
};
function hideLegacyLabels(scene){
  ['lunaName','lunaType','emberName','emberType','novaName','novaType','mallowName','mallowType'].forEach(k=>{const x=scene[k];if(x){x.setVisible(false);x.setAlpha(0)}});
}
function art(scene,key,w=260){
  const c=scene.add.container(0,0);
  const im=scene.add.image(0,55,key).setOrigin(.5,1);
  const sc=w/Math.max(1,im.width);im.setScale(sc);
  c.add(im);return c;
}
function route(scene,route,extra={}){scene.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route,...extra});}

const oldDecor=Game.prototype.createDecor;
Game.prototype.createDecor=function(){
  const ready=Object.values(OBJ).every(k=>this.textures.exists(k));
  if(!ready){oldDecor.call(this);return;}

  this.createMovableDecor('arcane-bookcase',245,725,'Arcane Stacks',()=>art(this,OBJ.arcane,265),()=>this.openArcaneStacks());
  this.createMovableDecor('moonlit-desk',1015,800,'Moonlit Study Desk',()=>art(this,OBJ.desk,335),()=>this.openStudyDesk());
  this.createMovableDecor('observatory-telescope',1285,735,'Celestial Observatory',()=>art(this,OBJ.telescope,280),()=>this.openObservatory());
  this.createMovableDecor('crystal-pedestal',1510,780,'Crystal Focus Pedestal',()=>art(this,OBJ.crystal,220),()=>this.openCrystalFocus());
  this.createMovableDecor('familiar-settee',1815,805,'Familiar Lounge',()=>art(this,OBJ.lounge,330),()=>this.openFamiliarLounge());
  this.createMovableDecor('moonstone-crystal-bed',730,855,'Moonstone Crystal Bed',()=>art(this,OBJ.moonbed,305),()=>this.openFamiliarObjectPicker('bed-west'));
  this.createMovableDecor('amethyst-crystal-bed',2035,855,'Amethyst Crystal Bed',()=>art(this,OBJ.amethystbed,305),()=>this.openFamiliarObjectPicker('bed-east'));
  this.createMovableDecor('apothecary-cabinet',360,850,'Study Apothecary',()=>art(this,OBJ.apothecary,230),()=>this.openCrystalFocus());
  this.createMovableDecor('magic-mirror',1630,690,'Magic Mirror',()=>art(this,OBJ.mirror,210),()=>this.openMagicMirror3313());
};

Game.prototype.openMagicMirror3313=function(){
  const s=this.studyState||{};
  this.createSparkles?.(1630,620,18);
  this.showInteractionPanel('Magic Mirror','Your Real Study Progress',
    'The mirror reflects your actual Majick Studies progress — not a cosmetic score.',
    [
      {label:'READINESS • '+(s.readiness||0)+'%',primary:true,run:()=>route(this,'constellation')},
      {label:'ANSWERS • '+(s.answers||0),run:()=>route(this,'analytics')},
      {label:'CRYSTALS • '+(s.crystals||0),run:()=>route(this,'vault')},
      {label:'CONTINUE STUDYING',run:()=>route(this,'mission')}
    ]);
};

/* Never allow old static labels like “Moon” to sit on a familiar's head. */
const oldDepth=Game.prototype.v3310SetPetDepths;
Game.prototype.v3310SetPetDepths=function(){if(oldDepth)oldDepth.call(this);hideLegacyLabels(this)};
const oldApply=Game.prototype.applyStudyState;
Game.prototype.applyStudyState=function(state){if(oldApply)oldApply.call(this,state);hideLegacyLabels(this)};
const oldCreate=Game.prototype.create;
Game.prototype.create=function(){
  oldCreate.call(this);hideLegacyLabels(this);
  this.time.addEvent({delay:600,loop:true,callback:()=>hideLegacyLabels(this)});
};
})();