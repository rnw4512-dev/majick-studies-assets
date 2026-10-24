(()=>{
'use strict';
if(window.MajickWardrobeStudio)return;
const ROOT='./assets/atelier/avatars/';
const hair=['layer-hair-locs-v2.webp','layer-hair-braids-v2.webp','layer-hair-curls-v1.webp','layer-hair-afro-v2.webp','layer-hair-twists-v2.webp','layer-hair-waves-v1.webp'];
const robes=['layer-dress-plum.webp','layer-dress-midnight.webp','layer-dress-emerald-v1.webp','layer-dress-silver-v1.webp'];
const robeNames=['Plum Scholar','Midnight Velvet','Emerald Witch','Moonlit Silver'];
const hairNames=['Locs','Braids','Curls','Afro','Twists','Waves'];
const skinColors=['#70412f','#9d6345','#bf8766','#deb192','#f0cdb4','#513024'];
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let section='Appearance',category='Robes',pose='Idle',snapshot=null,poseRevision=0;
const get=()=>window.MajickAtelier?.player?.();
function save(){try{window.save?.()}catch(_){}window.MajickScholarCompanion?.refresh?.(true)}
function art(p){
 const body=Number(p.skin)===0||Number(p.skin)===5?'layer-body-deep-v2.webp':'layer-body-warm-v2.webp';
 return '<div class="wsFigure" aria-label="Full-body scholar with fitted hair and outfit">'+[body,robes[p.robe]||robes[0],'layer-boots-plum.webp',hair[p.hair]||hair[0]].map((name,i)=>'<img class="wsLayer wsLayer'+i+'" alt="" src="'+ROOT+name+'" draggable="false">').join('')+'</div>';
}
function button(label,attrs='',selected=false){return '<button type="button" '+attrs+' aria-pressed="'+selected+'">'+e(label)+'</button>'}
function occasion(p){
 const options=[['Class','Scholar ready for the Learn Lab'],['Evening','A little magic after dark'],['Sanctuary','Comfort with your Guardians']];
 return '<h3>Get ready for…</h3><div class="wsOccasions">'+options.map(([name,description])=>'<button type="button" data-occasion="'+name+'" aria-pressed="'+(p.wardrobeOccasion===name)+'"><b>'+name+'</b><small>'+description+'</small></button>').join('')+'</div>';
}
function inventory(p){
 if(category==='Robes')return robes.map((src,i)=>'<button class="wsItem" type="button" data-robe="'+i+'" aria-pressed="'+(Number(p.robe)===i)+'"><img alt="" src="'+ROOT+src+'"><span>'+robeNames[i]+'</span></button>').join('');
 return '<div class="wsEmpty">✦ This collection is being tailored. Your current outfit stays equipped.</div>';
}
function controls(p){
 if(section==='Appearance')return '<h3>Skin tone</h3><div class="wsSwatches">'+skinColors.map((v,i)=>button('','data-skin="'+i+'" style="background:'+v+'" aria-label="Skin tone '+(i+1)+'"',Number(p.skin)===i)).join('')+'</div><h3>Hair</h3><div class="wsHair">'+hair.map((src,i)=>'<button type="button" data-hair="'+i+'" aria-pressed="'+(Number(p.hair)===i)+'"><img alt="" src="'+ROOT+src+'"><span>'+hairNames[i]+'</span></button>').join('')+'</div>';
 if(section==='Wardrobe')return occasion(p)+'<div class="wsCategories">'+['Robes','Casual','Formal','Sleepwear'].map(x=>button(x,'data-category="'+x+'"',category===x)).join('')+'</div><div class="wsInventory">'+inventory(p)+'</div>';
 if(section==='Poses')return '<h3>Scholar poses</h3><p>Preview the same saved scholar throughout the Collegium.</p>';
 if(section==='Accessories')return '<h3>Accessories</h3><p>Equipped accessories remain saved. Fitted accessory artwork is being prepared.</p>';
 return '<h3>Mirror preview</h3><p>Choose a robe or hairstyle, then save your look.</p>';
}
async function renderApprovedPose(p){
 const frame={Idle:'front_idle',Walk:'front_step_left',Study:'front_idle',Celebrate:'front_idle',Sit:'front_idle',Sanctuary:'front_idle'}[pose];
 const stage=document.querySelector('#wsOverlay:not([hidden]) .wsStage');
 if(!stage||!frame)return;
 const token=++poseRevision;
 if(pose==='Idle')return;
 if(pose==='Walk'){verifyApprovedWalk(p);return;}
 const gate=window.MajickV2ApprovalGate;
 if(!gate){stage.closest('.wsMirror')?.querySelector('.wsMessage')?.replaceChildren(document.createTextNode('Pose layers are not ready. Your selected look is unchanged.'));return}
 const result=await gate.compose(p,frame,'locs');
 if(token!==poseRevision||!stage.isConnected)return;
 const msg=stage.closest('.wsMirror')?.querySelector('.wsMessage');
 if(!result.ok){if(msg)msg.textContent='This outfit and hairstyle do not yet have approved '+pose.toLowerCase()+' frames. Your appearance stays unchanged.';return}
 const image=document.createElement('img');image.className='wsApprovedPose';image.alt='Approved aligned '+pose+' pose for the current outfit';image.src=result.canvas.toDataURL('image/png');
 stage.replaceChildren(image);
 if(msg)msg.textContent='Approved fitted '+pose.toLowerCase()+' frame';
}
async function verifyApprovedWalk(p){
 const gate=window.MajickV2ApprovalGate;
 const message=document.querySelector('#wsOverlay:not([hidden]) .wsMessage');
 if(!gate||!message)return;
 const frames=['front_idle','front_step_left','front_idle','front_step_right'];
 const results=[];
 for(const frame of frames){const r=await gate.compose(p,frame,'locs');results.push({frame,ok:!!r.ok,reason:r.reason||null,canvas:r.canvas||null})}
 if(results.some(r=>!r.ok)){message.textContent='Movement not approved for this hairstyle and outfit: '+results.filter(r=>!r.ok).map(r=>r.frame+' ('+r.reason+')').join(', ');return}
 const stage=document.querySelector('#wsOverlay:not([hidden]) .wsStage');
 if(!stage)return;
 let index=0;const img=document.createElement('img');img.className='wsApprovedPose';img.alt='Approved four-frame walk cycle';stage.replaceChildren(img);
 const urls=results.map(r=>r.canvas.toDataURL('image/png'));
 const token=++poseRevision;
 function advance(){if(token!==poseRevision||!stage.isConnected||pose!=='Walk')return;img.src=urls[index++%urls.length];window.setTimeout(advance,190)}
 advance();message.textContent='Movement verified: all four walk-cycle frames passed approved layered composition.';
}
function render(){
 const p=get();if(!p)return;const root=document.getElementById('wsOverlay');if(!root)return;
 root.innerHTML='<div class="wsWindow" role="dialog" aria-modal="true" aria-label="Scholar Atelier"><aside class="wsSidebar"><button class="wsBack" data-close>← Back</button><div class="wsBrand">☾<h1>Scholar<br>Atelier</h1></div><p class="wsMotto">Your look. Your story.</p><nav aria-label="Atelier rooms">'+['Appearance','Wardrobe','Accessories','Poses','Preview'].map(x=>button('✦ '+x,'data-section="'+x+'"',section===x)).join('')+'</nav><div class="wsSigil">✧ THE MOONLIT COLLEGIUM ✧</div></aside><main class="wsMain"><div class="wsControls"><h2>'+e(section)+'</h2>'+controls(p)+'</div><div class="wsMirror"><div class="wsMirrorTitle">✦ THE WARDROBE MIRROR ✦</div><div class="wsStage">'+art(p)+'</div><div class="wsPoseStrip">'+['Idle','Study','Celebrate','Walk','Sit','Sanctuary'].map(x=>button(x,'data-pose="'+x+'"',pose===x)).join('')+'</div><div class="wsActions"><button data-undo>↶ Revert</button><button class="wsSave" data-save>✦ Save Look</button></div><div class="wsMessage" role="status"></div></div></main></div>';
 root.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>{section=b.dataset.section;render()});
 root.querySelectorAll('[data-occasion]').forEach(b=>b.onclick=()=>{p.wardrobeOccasion=b.dataset.occasion;save();render()});
 root.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;render()});
 root.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>{p.skin=Number(b.dataset.skin);save();render()});
 root.querySelectorAll('[data-hair]').forEach(b=>b.onclick=()=>{p.hair=Number(b.dataset.hair);save();render()});
 root.querySelectorAll('[data-robe]').forEach(b=>b.onclick=()=>{p.robe=Number(b.dataset.robe);save();render()});
 root.querySelectorAll('[data-pose]').forEach(b=>b.onclick=()=>{pose=b.dataset.pose;render()});
 root.querySelector('[data-undo]').onclick=()=>{if(snapshot){Object.assign(p,snapshot);save();render()}};
 root.querySelector('[data-save]').onclick=()=>{snapshot={...p};save();root.querySelector('.wsMessage').textContent='✦ Look saved to your scholar.'};
 root.querySelector('[data-close]').onclick=close;
 renderApprovedPose(p);
 root.querySelector('.wsStage')?.addEventListener('error',event=>{if(event.target?.tagName==='IMG'){event.target.style.visibility='hidden';root.querySelector('.wsMessage').textContent='A fitted garment asset is unavailable; your saved selection is preserved.'}},true);
}
function open(){
 if(!get())return;
 document.getElementById('atelierOverlay')?.setAttribute('hidden','');
 let root=document.getElementById('wsOverlay');
 if(!root){root=document.createElement('div');root.id='wsOverlay';document.body.append(root)}
 snapshot={...get()};root.hidden=false;render();root.querySelector('[data-close]')?.focus();
}
function close(){const r=document.getElementById('wsOverlay');if(r)r.hidden=true;window.MajickScholarCompanion?.refresh?.(true)}
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!document.getElementById('wsOverlay')?.hidden)close()});
const style=document.createElement('style');style.textContent=`
#wsOverlay{position:fixed;inset:0;z-index:1800;background:#0d0815ed;color:#f5e5d0;font:15px system-ui;overflow:auto}
#wsOverlay[hidden]{display:none}
.wsWindow{min-height:100dvh;display:grid;grid-template-columns:230px minmax(0,1fr);background:radial-gradient(ellipse at 58% 30%,#422742,#160e20 68%)}
.wsSidebar{padding:22px 16px;background:#150c1b;border-right:1px solid #9b775a;display:flex;flex-direction:column;gap:14px}
.wsBack,.wsSidebar nav button,.wsPoseStrip button,.wsCategories button,.wsActions button{color:#f5e5d0;border:1px solid #886a65;background:#2b1b33;border-radius:12px;padding:10px;cursor:pointer}
.wsBrand{display:flex;gap:12px;align-items:center;color:#f0c990}.wsBrand h1{font:34px/1 Georgia,serif;margin:0}
.wsMotto{color:#d3afbd;font:italic 17px Georgia,serif}
.wsSidebar nav{display:grid;gap:12px}.wsSidebar nav button{text-align:left;font-size:16px}
#wsOverlay [aria-pressed="true"]{outline:2px solid #f5c879;outline-offset:1px;background:#543054}
.wsSigil{margin-top:auto;color:#e0b878;font:12px Georgia,serif}
.wsMain{display:grid;grid-template-columns:minmax(250px,320px) minmax(320px,1fr);gap:22px;padding:24px;min-width:0}
.wsControls{background:#1a1122dc;border:1px solid #8e6a58;border-radius:18px;padding:18px;align-self:start}
.wsControls h2,.wsControls h3{color:#f2c987;font-family:Georgia,serif}
.wsOccasions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:15px}.wsOccasions button{background:#291b32;color:#f8e3d5;border:1px solid #a78662;border-radius:10px;padding:8px 4px;cursor:pointer}.wsOccasions small{display:block;font-size:10px;margin-top:5px}.wsSwatches,.wsHair,.wsInventory,.wsCategories{display:flex;flex-wrap:wrap;gap:9px;margin:12px 0 25px}
.wsSwatches button{height:35px;width:35px;border:2px solid #e4bf8b;border-radius:50%;cursor:pointer}
.wsHair button,.wsItem{background:#291b32;color:#f8e3d5;border:1px solid #a78662;border-radius:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;padding:8px;gap:5px}
.wsHair button{width:83px}.wsHair img{width:66px;height:78px;object-fit:contain}
.wsItem{width:130px}.wsItem img{width:115px;height:130px;object-fit:contain}
.wsEmpty{padding:22px;border:1px dashed #8b6b62;border-radius:12px;color:#d8c2cf}
.wsMirror{min-width:0;border:3px double #c8a064;border-radius:36px 36px 18px 18px;background:radial-gradient(ellipse at 50% 32%,#65436a,#25152d 65%,#130e1c);padding:16px;display:flex;flex-direction:column;align-items:center}
.wsMirrorTitle{color:#f3d39e;letter-spacing:3px;font:14px Georgia,serif}
.wsStage{height:min(65dvh,680px);min-height:340px;width:100%;display:grid;place-items:center;overflow:hidden}
.wsFigure{position:relative;height:100%;aspect-ratio:512/682;max-width:100%}
.wsLayer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none}
.wsLayer1{transform:translateY(-5.57%);transform-origin:50% 50%}
.wsLayer1[src*="layer-dress-midnight"]{transform:translateY(-5.57%) scaleX(1.18)}
.wsLayer1[src*="layer-dress-emerald"],.wsLayer1[src*="layer-dress-silver"]{inset:auto;left:7.7%;top:11.5%;width:84.4%;height:84.4%;object-fit:fill;transform:none}
.wsLayer2{transform:scaleX(1.25)}
.wsLayer3{transform:translateY(1%) scale(.77,.69);transform-origin:50% 10%}
.wsLayer3[src*="layer-hair-afro"]{transform:translateY(.2%) scale(.74,.66)}
.wsLayer3[src*="layer-hair-braids"]{transform:translateY(2.05%) scale(.77,.69)}
.wsApprovedPose{height:100%;max-width:100%;object-fit:contain}
.wsPoseStrip,.wsActions{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;padding:12px}
.wsActions .wsSave{background:#65346d;border-color:#e5bc77;font-weight:700}
.wsMessage{min-height:22px;color:#e9c892;text-align:center}
@media(max-width:900px){.wsWindow{grid-template-columns:1fr}.wsSidebar{padding:12px}.wsSidebar nav{display:flex;overflow:auto}.wsSidebar nav button{white-space:nowrap}.wsMain{grid-template-columns:1fr}.wsStage{height:50dvh}.wsSigil,.wsMotto{display:none}}
@media(prefers-reduced-motion:reduce){#wsOverlay *{scroll-behavior:auto}}
`;document.head.append(style);
window.MajickWardrobeStudio={open,close,render};
})();