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
})();