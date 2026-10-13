(()=>{
'use strict';
if(window.MajickV2ApprovalGate)return;
const ROOT='./assets/atelier/v2/fitted/';
const REQUIRED=['body','outfit','hair'];
const ORDER=['body','outfit','hair','accessories'];
const VALID_FRAMES=new Set(['front_idle','front_step_left','front_step_right','side_left_idle','side_left_walk','side_right_walk','back_idle','back_step_left','back_step_right','threequarter_left_forward','threequarter_left_step','threequarter_left_walk']);
let manifest=null,alignment=null,approvals=null,loading=null;
const imageCache=new Map();
function allowedPath(path){
 return typeof path==='string'&&/^assets\/atelier\/v2\/fitted\/[a-zA-Z0-9_/-]+\.webp$/.test(path)&&!path.includes('..');
}
async function readJson(path){
 const res=await fetch(ROOT+path,{cache:'no-cache'});
 if(!res.ok)throw Error('Missing V2 registry: '+path);
 return res.json();
}
function load(){
 if(!loading)loading=Promise.all([readJson('walk-manifest.json'),readJson('walk-alignment.json'),readJson('approval-registry.json')]).then(([m,a,r])=>{
  if(m.schemaVersion!==1||a.schemaVersion!==1||r.schemaVersion!==1||JSON.stringify(m.layerOrder)!==JSON.stringify(ORDER)||JSON.stringify(a.layerOrder)!==JSON.stringify(ORDER))throw Error('Invalid V2 registry version/layer contract');
  manifest=m;alignment=a;approvals=r;
  return {manifest,alignment,approvals};
 }).catch(e=>{loading=null;throw e});
 return loading;
}
function appearanceOK(p,style){
 return !!p && style==='locs' && Number(p.hair)===0 && Number(p.robe)===1 && Number(p.skin)!==0 && Number(p.skin)!==5;
}
function approvalFor(style,frame){return approvals?.styles?.[style]?.frames?.[frame]||null}
function reason(p,style,frame){
 if(!manifest||!alignment||!approvals)return 'registries_not_loaded';
 if(!manifest.enabled || !approvals.enabled)return 'not_released';
 if(!VALID_FRAMES.has(frame))return 'unknown_frame';
 if(!appearanceOK(p,style))return 'appearance_not_supported';
 const set=manifest.frames?.[frame],anchor=alignment.frames?.[frame],review=approvalFor(style,frame);
 if(!set||!anchor)return 'frame_missing';
 if(review?.status!=='approved'||review?.visualQA!==true)return 'frame_not_approved';
 if(anchor.validated!==true)return 'alignment_not_validated';
 if(!Array.isArray(anchor.head)||!Array.isArray(anchor.neck)||!Number.isFinite(anchor.footBaseline))return 'anchors_missing';
 if(!REQUIRED.every(k=>allowedPath(k==='hair'?manifest.hairStyleFamilies?.[style]?.[frame]:set[k])))return 'required_layer_missing';
 return null;
}
function resolve(p,frame,style='locs'){
 const blocked=reason(p,style,frame);
 if(blocked)return {ok:false,reason:blocked,fallback:'existing_V1_fitted_avatar'};
 const set=manifest.frames[frame];
 return {ok:true,frame,style,order:ORDER.slice(),layers:{
  body:set.body,outfit:set.outfit,hair:manifest.hairStyleFamilies[style][frame],accessories:[]
 },anchors:alignment.frames[frame],fallback:'existing_V1_fitted_avatar'};
}
function image(path){
 if(!allowedPath(path))return Promise.reject(Error('Disallowed asset path'));
 if(!imageCache.has(path))imageCache.set(path,new Promise((resolve,reject)=>{
   const img=new Image();img.onload=()=>img.naturalWidth===512&&img.naturalHeight===768?resolve(img):reject(Error('Unexpected V2 canvas size'));
   img.onerror=()=>reject(Error('Missing image '+path));img.src='./'+path;
 }).catch(e=>{imageCache.delete(path);throw e}));
 return imageCache.get(path);
}
async function compose(p,frame,style='locs'){
 try{
  await load();
  const check=resolve(p,frame,style);
  if(!check.ok)return check;
  const layers=await Promise.all(REQUIRED.map(k=>image(check.layers[k])));
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=768;
  const ctx=canvas.getContext('2d');
  if(!ctx)return {ok:false,reason:'canvas_unavailable',fallback:'existing_V1_fitted_avatar'};
  // Do not display the undergarment body until every required layer has loaded successfully.
  for(const img of layers)ctx.drawImage(img,0,0,512,768);
  return {ok:true,canvas,frame,style};
 }catch(error){return {ok:false,reason:'load_failed',detail:String(error.message||error),fallback:'existing_V1_fitted_avatar'}}
}
function reviewSummary(){
 if(!approvals)return {loaded:false,enabled:false};
 return {loaded:true,enabled:!!(approvals.enabled&&manifest?.enabled),approved:Object.values(approvals.styles||{}).reduce((n,s)=>n+Object.values(s.frames||{}).filter(v=>v.status==='approved'&&v.visualQA===true).length,0)};
}
window.MajickV2ApprovalGate=Object.freeze({load,resolve,compose,reviewSummary,version:'3.4.2-approval-gate-1'});
})();