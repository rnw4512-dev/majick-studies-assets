// V3.3.12 — interaction polish around the protected Phase 4 movers.
// HARD RULE: no movement method is replaced; no sprite file is replaced.
(function(){
'use strict';
if(typeof Game==='undefined')return;
const PROFILES={luna:['Velora','Twilight Keeper'],ember:['Cascade','Arcane Keeper'],nova:['Solstice','Wonder Keeper'],mallow:['Aurelia','Dream Keeper']};
const baseCreate3312=Game.prototype.create;
Game.prototype.create=function(){baseCreate3312.call(this);this.time.delayedCall(120,()=>{['lunaName','lunaType','emberName','emberType','novaName','novaType','mallowName','mallowType'].forEach(k=>{if(this[k])this[k].setVisible(false)});Object.entries(PROFILES).forEach(([key,[name,title]])=>{const pet=this[key];if(!pet||pet.__v3312Interactive)return;pet.__v3312Interactive=true;pet.setInteractive({useHandCursor:true});pet.on('pointerover',()=>{this.showWorldHint?.(pet.x,Math.max(80,pet.y-145),`${name} • ${title}`,'Click to open Guardian profile');if(this[`${key}Glow`])this.tweens.add({targets:this[`${key}Glow`],alpha:.42,scale:1.12,duration:180})});pet.on('pointerout',()=>this.hideWorldHint?.())});(this.decorItems||[]).forEach(item=>{if(item.__v3312Hover)return;item.__v3312Hover=true;item.on('pointerover',()=>{if(!this.editMode)this.tweens.add({targets:item,scaleX:1.035,scaleY:1.035,duration:120,ease:'Sine.out'})});item.on('pointerout',()=>this.tweens.add({targets:item,scaleX:1,scaleY:1,duration:120,ease:'Sine.out'}))})})};
const baseApply3312=Game.prototype.applyStudyState;
Game.prototype.applyStudyState=function(state){baseApply3312.call(this,state);['lunaName','lunaType','emberName','emberType','novaName','novaType','mallowName','mallowType'].forEach(k=>{if(this[k])this[k].setVisible(false)})};
})();