// Majick Studies V3.3.11 — Campus Connections.
// IMPORTANT: this file does not touch the original four Phase 4 movement art sets.
(function(){
'use strict';
if(typeof Game==='undefined')return;
function route(scene,route){scene.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route});}
Game.prototype.openArcaneStacks=function(){
 this.openActionPanel('ARCANE STACKS','The library is connected to your free Living Grimoire.',[
  {label:'OPEN LIVING GRIMOIRE',primary:true,run:()=>route(this,'livinggrimoire')},
  {label:'MISTAKE GRIMOIRE',run:()=>route(this,'grimoire')},
  {label:'STUDY GUIDE',run:()=>route(this,'guide')},
  {label:'READ WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('arcane-stacks')}
 ]);
};
Game.prototype.openStudyDesk=function(){
 this.openActionPanel('MOONLIT STUDY DESK','Write, review, or begin a focused study session.',[
  {label:'CONTINUE STUDYING',primary:true,run:()=>route(this,'mission')},
  {label:'OPEN MY JOURNAL',run:()=>route(this,'journal')},
  {label:'OPEN LIVING GRIMOIRE',run:()=>route(this,'livinggrimoire')},
  {label:'STUDY WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('moonlit-desk')}
 ]);
};
Game.prototype.openObservatory=function(){
 this.openActionPanel('CELESTIAL OBSERVATORY','Review mastery, final-review patterns, and guardian growth.',[
  {label:'CONSTELLATION',primary:true,run:()=>route(this,'constellation')},
  {label:'FINAL REVIEW',run:()=>route(this,'finalreview')},
  {label:'GUARDIAN EVOLUTIONS',run:()=>route(this,'companions')},
  {label:'STARGAZE WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('observatory')}
 ]);
};
Game.prototype.openCrystalFocus=function(){
 this.openActionPanel('CRYSTAL FOCUS ALCOVE','Focus tools and rewards stay inside Majick Studies — no paid-credit book system.',[
  {label:'FOCUS TOOLS',primary:true,run:()=>route(this,'focus')},
  {label:'MAGIC VAULT',run:()=>route(this,'vault')},
  {label:'TROPHIES',run:()=>route(this,'trophies')},
  {label:'FOCUS WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('crystal-focus')}
 ]);
};
Game.prototype.openFamiliarLounge=function(){
 this.openActionPanel('FAMILIAR LOUNGE','Visit the guardian roster and evolution codex, or let a familiar rest.',[
  {label:'GUARDIAN PROFILES',primary:true,run:()=>route(this,'companions')},
  {label:'REST IN CRYSTAL BED',run:()=>this.openFamiliarObjectPicker('bed-east')},
  {label:'OPEN LIVING GRIMOIRE',run:()=>route(this,'livinggrimoire')}
 ]);
};
})();