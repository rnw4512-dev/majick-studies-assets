// Majick Studies V3.3.11 — Campus Connections.
// HARD RULE: do not rewrite movement methods, replace sprite files, or simplify the original four movers.
(function(){
'use strict';
if(typeof Game==='undefined')return;
function route(scene,route,extra={}){scene.sendToStudyApp('MAJICK_OPEN_ROUTE_V3311',{route,...extra});}
Game.prototype.openArcaneStacks=function(){
 this.createSparkles?.(360,390,12);
 this.showInteractionPanel('The Arcane Stacks','Living Library','The shelves connect directly to your free Majick Living Grimoire.',[
  {label:'OPEN LIVING GRIMOIRE',primary:true,run:()=>route(this,'livinggrimoire')},
  {label:'MISTAKE GRIMOIRE',run:()=>route(this,'grimoire')},
  {label:'STUDY GUIDE',run:()=>route(this,'guide')},
  {label:'READ WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('stacks')}
 ]);
};
Game.prototype.openStudyDesk=function(){
 this.createSparkles?.(1080,610,10);
 this.showInteractionPanel('Moonlit Study Desk','Your Workspace','Study, write notes, or open the Living Grimoire without leaving the magical college.',[
  {label:'CONTINUE STUDYING',primary:true,run:()=>route(this,'mission')},
  {label:'OPEN MY JOURNAL',run:()=>route(this,'journal')},
  {label:'OPEN LIVING GRIMOIRE',run:()=>route(this,'livinggrimoire')},
  {label:'STUDY WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('desk')}
 ]);
};
Game.prototype.openObservatory=function(){
 this.showInteractionPanel('Celestial Observatory','Upper College','Use the telescope for readiness review, final review, and Guardian evolution.',[
  {label:'CONSTELLATION',primary:true,run:()=>route(this,'constellation')},
  {label:'FINAL REVIEW',run:()=>route(this,'finalreview')},
  {label:'GUARDIAN EVOLUTIONS',run:()=>route(this,'companions')},
  {label:'STARGAZE WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('observatory')}
 ]);
};
Game.prototype.openCrystalFocus=function(){
 const s=this.studyState||{};this.createSparkles?.(1480,655,18);
 this.showInteractionPanel('Crystal Focus Alcove','Quiet Study','Your crystal reserve is '+(s.crystals||0)+'. Focus tools and rewards stay inside Majick Studies.',[
  {label:'FOCUS TOOLS',primary:true,run:()=>route(this,'focus')},
  {label:'MAGIC VAULT',run:()=>route(this,'vault')},
  {label:'STUDY PLANNER',run:()=>route(this,'planner')},
  {label:'FOCUS WITH FAMILIAR',run:()=>this.openFamiliarObjectPicker('focus')}
 ]);
};
Game.prototype.openFamiliarLounge=function(){
 this.createSparkles?.(1870,735,14);
 this.showInteractionPanel('Familiar Lounge','Companion Common Room','Open Guardian profiles and evolution trees, or let a familiar rest in the crystal beds.',[
  {label:'GUARDIAN PROFILES',primary:true,run:()=>route(this,'companions')},
  {label:'MOONSTONE BED',run:()=>this.openFamiliarObjectPicker('bed-west')},
  {label:'AMETHYST BED',run:()=>this.openFamiliarObjectPicker('bed-east')},
  {label:'LIVING GRIMOIRE',run:()=>route(this,'livinggrimoire')}
 ]);
};

// Add app connections around the working movers. Existing reaction and movement listeners remain intact.
const baseCreate=Game.prototype.create;
Game.prototype.create=function(){
 baseCreate.call(this);
 this.time.delayedCall(300,()=>{
  const links=[['luna','luna'],['ember','ember'],['nova','nova'],['mallow','mallow']];
  links.forEach(([prop,type])=>{
   const pet=this[prop];if(!pet||pet.__v3311ProfileLink)return;pet.__v3311ProfileLink=true;
   pet.on('pointerup',()=>{if(!this.editMode)route(this,'companions',{guardian:type})});
  });
 });
};

// Record crystal-bed assignment without changing the existing movement/reaction code.
const baseStart=Game.prototype.startFamiliarObjectInteraction;
if(typeof baseStart==='function'){
 Game.prototype.startFamiliarObjectInteraction=function(familiarId,objectId){
  const result=baseStart.call(this,familiarId,objectId);
  if(objectId==='bed-west'||objectId==='bed-east')this.sendToStudyApp('MAJICK_BED_ASSIGN',{bed:objectId,guardian:familiarId});
  return result;
 };
}
})();