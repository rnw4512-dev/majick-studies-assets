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
let section='Appearance',category='Robes',pose='Idle',snapshot=null,poseRevision=0,walkTimer=null,previewFacing='right',simpleMirror=false,vanityLights=true;
function stopWalk(){if(walkTimer!==null){clearInterval(walkTimer);walkTimer=null;}}
const OUTFIT_LIMIT=8;
function looks(p){if(!Array.isArray(p.savedScholarLooks))p.savedScholarLooks=[];return p.savedScholarLooks;}
function equipped(p){return {skin:Number(p.skin)||0,hair:Number(p.hair)||0,robe:Number(p.robe)||0,wardrobeOccasion:p.wardrobeOccasion||'Class'};}
function applyLook(p,look){for(const key of ['skin','hair','robe','wardrobeOccasion'])if(Object.prototype.hasOwnProperty.call(look,key))p[key]=look[key];}
function savedLooks(p){const entries=looks(p);return '<h3>Saved outfits</h3><p class="wsHint">Save up to eight complete looks. Load any saved outfit before heading to class or the Sanctuary.</p><div class="wsSavedLooks">'+(entries.length?entries.map((look,i)=>'<div class="wsSavedLook"><strong>'+e(look.name||'Outfit '+(i+1))+'</strong><span>'+e(robeNames[Number(look.robe)]||'Scholar robe')+' · '+e(hairNames[Number(look.hair)]||'Hair')+'</span><div><button type="button" data-load-look="'+i+'">Wear</button><button type="button" data-delete-look="'+i+'" aria-label="Delete '+e(look.name||'outfit')+'">Remove</button></div></div>').join(''):'<p class="wsHint">No outfits saved yet.</p>')+'</div><label class="wsNameLabel" for="wsLookName">Name this outfit</label><input id="wsLookName" maxlength="48" placeholder="e.g. Moonlit Class"/><button type="button" class="wsSaveSlot" data-save-slot '+(entries.length>=OUTFIT_LIMIT?'disabled':'')+'>✦ Save as New Outfit</button>';}
const get=()=>window.MajickAtelier?.player?.();
function save(){try{window.save?.()}catch(_){}window.MajickScholarCompanion?.refresh?.(true)}
function celebrateSavedLook(root){
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const stage=root.querySelector('.wsMirror');if(!stage)return;
 const burst=document.createElement('div');burst.className='wsMagicBurst';burst.setAttribute('aria-hidden','true');
 for(let i=0;i<9;i++){const star=document.createElement('span');star.textContent=i%3===0?'✦':'✧';star.style.setProperty('--dx',Math.round(Math.cos(i*Math.PI*2/9)*105)+'px');star.style.setProperty('--dy',Math.round(Math.sin(i*Math.PI*2/9)*95)+'px');star.style.setProperty('--delay',(i%3)*45+'ms');burst.append(star)}
 stage.append(burst);burst.addEventListener('animationend',()=>burst.remove(),{once:true});
}
function vanityBulbs(){const points=[[22,1],[41,1],[59,1],[78,1],[1,18],[1,35],[1,52],[1,69],[1,86],[99,18],[99,35],[99,52],[99,69],[99,86]];return '<div class="wsVanityLights" aria-hidden="true">'+points.map(([x,y])=>'<i style="left:'+x+'%;top:'+y+'%"></i>').join('')+'</div>';}
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
 if(section==='Wardrobe')return occasion(p)+'<div class="wsCategories">'+['Robes','Casual','Formal','Sleepwear'].map(x=>button(x,'data-category="'+x+'"',category===x)).join('')+'</div><div class="wsInventory">'+inventory(p)+'</div>'+savedLooks(p);
 if(section==='Poses')return '<h3>Scholar poses</h3><p>Preview the same saved scholar throughout the Collegium.</p>';
 if(section==='Accessories')return '<h3>Accessories</h3><p>Equipped accessories remain saved. Fitted accessory artwork is being prepared.</p>';
 return '<h3>Mirror preview</h3><p>Choose a robe or hairstyle, then save your look.</p>'+savedLooks(p);
}
function watchArtwork(root){
 const status=root.querySelector('.wsAssetStatus');
 const images=[...root.querySelectorAll('img')];
 function update(){if(!root.isConnected||!status?.isConnected)return;const missing=images.filter(img=>img.complete&&!img.naturalWidth);const pending=images.filter(img=>!img.complete);status.textContent=missing.length?'Some artwork could not load. Retry artwork to restore your preview.':pending.length?'Loading your look…':'';status.hidden=!status.textContent;root.querySelector('[data-retry-art]').hidden=!(missing.length||pending.length);}
 images.forEach(img=>{img.addEventListener('load',()=>{img.style.visibility='';const message=root.querySelector('.wsMessage');if(message?.textContent.startsWith('A fitted garment asset'))message.textContent='';update();});img.addEventListener('error',()=>{if(img.dataset.retried)return update();img.dataset.retried='1';const u=new URL(img.src,location.href);u.searchParams.set('artRetry',String(Date.now()));img.src=u.href;update();});});update();
}
async function renderApprovedPose(p){
 const frame={Idle:'front_idle',Walk:'front_step_left',Study:'front_idle',Celebrate:'front_idle',Sit:'front_idle',Sanctuary:'front_idle'}[pose];
 const stage=document.querySelector('#wsOverlay:not([hidden]) .wsStage');
 if(!stage||!frame)return;
 const token=++poseRevision;
 if(pose==='Idle')return;
 if(pose==='Walk'){verifyApprovedWalk(p,stage,token);return;}
 const gate=window.MajickV2ApprovalGate;
 if(!gate){stage.closest('.wsMirror')?.querySelector('.wsMessage')?.replaceChildren(document.createTextNode('Pose layers are not ready. Your selected look is unchanged.'));return}
 const result=await gate.compose(p,frame,'locs');
 if(token!==poseRevision||!stage.isConnected)return;
 const msg=stage.closest('.wsMirror')?.querySelector('.wsMessage');
 if(!result.ok){if(msg)msg.textContent='This outfit and hairstyle do not yet have approved '+pose.toLowerCase()+' frames. Your appearance stays unchanged.';return}
 const image=document.createElement('img');image.className='wsApprovedPose';image.alt='Approved aligned '+pose+' pose for the current outfit';image.src=result.canvas.toDataURL('image/png');
 image.style.transform='scale(calc(var(--ws-zoom,1)*var(--ws-facing,1)),var(--ws-zoom,1))';
 try{await image.decode()}catch(_){if(token===poseRevision&&msg)msg.textContent='Pose preview could not load. Your fitted look is still shown.';return;}
 if(token!==poseRevision||!stage.isConnected)return;
 window.MajickAtelierScene?.dispose();stage.replaceChildren(image);
 if(msg)msg.textContent='Fitted look shown. Dedicated '+pose.toLowerCase()+' action frames are still being tailored.';
}
async function verifyApprovedWalk(p,originalStage,requestToken){
 const gate=window.MajickV2ApprovalGate;
 const message=document.querySelector('#wsOverlay:not([hidden]) .wsMessage');
 if(!gate||!message)return;
 // These are the approved V2 registry frame IDs, not an external demo atlas.
 const frames=['front_idle','front_step_left','front_idle','front_step_right'];
 const results=[];
 for(const frame of frames){const r=await gate.compose(p,frame,'locs');if(requestToken!==poseRevision||!originalStage.isConnected)return;results.push({frame,ok:!!r.ok,reason:r.reason||null,canvas:r.canvas||null})}
 if(results.some(r=>!r.ok)){message.textContent='Movement not approved for this hairstyle and outfit: '+results.filter(r=>!r.ok).map(r=>r.frame+' ('+r.reason+')').join(', ');return}
 const stage=document.querySelector('#wsOverlay:not([hidden]) .wsStage');
 if(!stage||stage!==originalStage||requestToken!==poseRevision)return;
 window.MajickAtelierScene?.dispose();
 let index=0;const img=document.createElement('img');img.className='wsApprovedPose';img.alt='Approved four-frame walk cycle';img.style.transform='scale(calc(var(--ws-zoom,1)*var(--ws-facing,1)),var(--ws-zoom,1))';stage.replaceChildren(img);
 const urls=results.map(r=>r.canvas.toDataURL('image/png'));
 const token=++poseRevision;
 stopWalk();
 function advance(){if(token!==poseRevision||!stage.isConnected||pose!=='Walk'){stopWalk();return;}img.src=urls[index++%urls.length];}
 advance();walkTimer=window.setInterval(advance,190);message.textContent='Movement verified: all four walk-cycle frames passed approved layered composition.';
}
function render(){
 window.MajickAtelierScene?.dispose();
 poseRevision++;
 stopWalk();
 const p=get();if(!p)return;const root=document.getElementById('wsOverlay');if(!root)return;
 root.innerHTML='<div class="wsWindow majick-decorative-panel" data-panel-kind="wardrobe" role="dialog" aria-modal="true" aria-label="Scholar Atelier"><aside class="wsSidebar"><button class="wsBack" data-close>← Back</button><div class="wsBrand">☾<h1>Scholar<br>Atelier</h1></div><p class="wsMotto">A little glamour. A little magic.</p><nav aria-label="Atelier rooms">'+['Appearance','Wardrobe','Accessories','Poses','Preview'].map(x=>button('✦ '+x,'data-section="'+x+'"',section===x)).join('')+'</nav><div class="wsSigil">✧ THE MOONLIT COLLEGIUM ✧</div></aside><main class="wsMain"><div class="wsControls"><h2>'+e(section)+'</h2>'+controls(p)+'</div><div class="wsMirror" data-lit="'+vanityLights+'">'+vanityBulbs()+'<div class="wsMirrorTitle">✦ YOUR ENCHANTED DRESSING ROOM ✦</div><div class="wsLookCaption"><strong>'+e(robeNames[Number(p.robe)]||robeNames[0])+'</strong><span>'+e(hairNames[Number(p.hair)]||hairNames[0])+' · Your fitted look</span></div><div class="wsStage" data-facing="'+previewFacing+'" style="--ws-facing:'+(previewFacing==='left'?-1:1)+'">'+art(p)+'</div><div class="wsViewTools" role="group" aria-label="Mirror zoom"><button type="button" data-view="1" aria-pressed="true">Full look</button><button type="button" data-view="1.45" aria-pressed="false">Closer look</button></div><details class="wsPoseDetails"><summary>Pose &amp; direction · '+e(pose)+'</summary><div class="wsPoseStrip">'+['Idle','Study','Celebrate','Walk','Sit','Sanctuary'].map(x=>button(x,'data-pose="'+x+'"',pose===x)).join('')+'</div><div class="wsFacing" role="group" aria-label="Preview direction">'+['left','right'].map(x=>button('Face '+x,'data-facing="'+x+'"',previewFacing===x)).join('')+'</div></details><div class="wsActions"><button data-undo>↶ Revert</button><button class="wsSave" data-save>✦ Save Look</button></div><div class="wsMessage" role="status"></div><div class="wsAssetStatus" role="status" hidden></div><div class="wsRecovery"><button type="button" data-vanity-lights aria-pressed="'+vanityLights+'">'+(vanityLights?'☀ Vanity lights on':'☾ Vanity lights off')+'</button><button type="button" data-retry-art hidden>↻ Retry artwork</button><button type="button" data-simple-mirror aria-pressed="'+simpleMirror+'">'+(simpleMirror?'Enable enchanted mirror':'Use simple mirror')+'</button></div></div></main></div>';
 root.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>{section=b.dataset.section;render()});
 root.querySelectorAll('[data-occasion]').forEach(b=>b.onclick=()=>{p.wardrobeOccasion=b.dataset.occasion;save();render()});
 root.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;render()});
 root.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>{p.skin=Number(b.dataset.skin);save();render()});
 root.querySelectorAll('[data-hair]').forEach(b=>b.onclick=()=>{p.hair=Number(b.dataset.hair);save();render()});
 root.querySelectorAll('[data-robe]').forEach(b=>b.onclick=()=>{p.robe=Number(b.dataset.robe);save();render()});
 root.querySelectorAll('[data-pose]').forEach(b=>b.onclick=()=>{pose=b.dataset.pose;render()});
 root.querySelectorAll('button[data-facing]').forEach(b=>b.onclick=()=>{previewFacing=b.dataset.facing;render()});
 root.querySelectorAll('[data-load-look]').forEach(b=>b.onclick=()=>{const look=looks(p)[Number(b.dataset.loadLook)];if(!look)return;applyLook(p,look);save();render();const msg=root.querySelector('.wsMessage');if(msg)msg.textContent='✦ '+(look.name||'Outfit')+' equipped and saved.';});
 root.querySelectorAll('[data-delete-look]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.deleteLook);if(i<0||i>=looks(p).length)return;looks(p).splice(i,1);save();render();});
 root.querySelector('[data-save-slot]')?.addEventListener('click',()=>{const entries=looks(p);if(entries.length>=OUTFIT_LIMIT)return;const name=root.querySelector('#wsLookName')?.value?.trim()||'Scholar Look '+(entries.length+1);entries.push({...equipped(p),name,createdAt:new Date().toISOString()});save();render();root.querySelector('.wsMessage').textContent='✦ '+name+' added to your saved outfits.';celebrateSavedLook(root);});
 root.querySelector('[data-undo]').onclick=()=>{if(snapshot){Object.assign(p,snapshot);save();render()}};
 root.querySelector('[data-save]').onclick=()=>{snapshot={...p};save();root.querySelector('.wsMessage').textContent='✦ Look saved to your scholar.';celebrateSavedLook(root)};
 root.querySelector('[data-close]').onclick=close;
 if(!simpleMirror)window.MajickAtelierScene?.mount(root.querySelector('.wsStage'));
 root.querySelector('[data-vanity-lights]').onclick=()=>{vanityLights=!vanityLights;const mirror=root.querySelector('.wsMirror'),b=root.querySelector('[data-vanity-lights]');mirror.dataset.lit=String(vanityLights);b.setAttribute('aria-pressed',String(vanityLights));b.textContent=vanityLights?'☀ Vanity lights on':'☾ Vanity lights off';};
 root.querySelector('[data-simple-mirror]').onclick=()=>{simpleMirror=!simpleMirror;render()};
 root.querySelector('[data-retry-art]').onclick=()=>{root.querySelectorAll('img').forEach(img=>{const u=new URL(img.src,location.href);u.searchParams.set('artRetry',String(Date.now()));img.src=u.href});};
 watchArtwork(root);
 root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const z=Number(b.dataset.view);root.querySelector('.wsStage').style.setProperty('--ws-zoom',z);root.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
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
function close(){window.MajickAtelierScene?.dispose();stopWalk();poseRevision++;const r=document.getElementById('wsOverlay');if(r)r.hidden=true;window.MajickScholarCompanion?.refresh?.(true)}
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
.wsSavedLooks{display:grid;gap:8px}.wsSavedLook{padding:10px;border:1px solid #886a65;border-radius:10px;display:grid;gap:5px;background:#26192f}.wsSavedLook span,.wsHint{color:#dbc8d8;font-size:12px}.wsSavedLook div{display:flex;gap:7px}.wsSavedLook button,.wsSaveSlot{padding:8px;background:#4b3057;color:#fff2dc;border:1px solid #d4b17d;border-radius:8px;cursor:pointer}.wsSaveSlot:disabled{opacity:.5;cursor:not-allowed}.wsNameLabel{display:block;margin:15px 0 6px}#wsLookName{width:100%;padding:10px;border:1px solid #d4b17d;border-radius:8px;background:#25172d;color:#fff2dc;margin-bottom:8px}.wsEmpty{padding:22px;border:1px dashed #8b6b62;border-radius:12px;color:#d8c2cf}
.wsMirror{min-width:0;border:3px double #c8a064;border-radius:36px 36px 18px 18px;background:radial-gradient(ellipse at 50% 32%,#65436a,#25152d 65%,#130e1c);padding:16px;display:flex;flex-direction:column;align-items:center}
.wsMirror{position:relative}.wsMagicBurst{position:absolute;inset:0;pointer-events:none;overflow:hidden}.wsMagicBurst span{position:absolute;left:50%;top:48%;font-size:25px;color:#f4d38a;text-shadow:0 0 9px #dcb6ff;animation:wsStarBurst .75s ease-out var(--delay) both}@keyframes wsStarBurst{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}20%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.3)}}.wsMirrorTitle{padding:5px 0 8px;text-align:center;color:#f3d39e;letter-spacing:3px;font:14px Georgia,serif}
.wsStage{position:relative;isolation:isolate;background:radial-gradient(ellipse at 50% 42%,#ad88ba30,transparent 62%);border-radius:48% 48% 10px 10px;height:min(65dvh,680px);min-height:340px;width:100%;display:grid;place-items:center;overflow:hidden}
.wsFigure{z-index:1;transform:scale(calc(var(--ws-zoom,1)*var(--ws-facing,1)),var(--ws-zoom,1));position:relative;height:100%;aspect-ratio:512/682;max-width:100%}
.wsLayer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none}
.wsLayer1{transform:translateY(-5.57%);transform-origin:50% 50%}
.wsLayer1[src*="layer-dress-midnight"]{transform:translateY(-5.57%) scaleX(1.18)}
.wsLayer1[src*="layer-dress-emerald"],.wsLayer1[src*="layer-dress-silver"]{inset:auto;left:7.7%;top:11.5%;width:84.4%;height:84.4%;object-fit:fill;transform:none}
.wsLayer2{transform:scaleX(1.25)}
.wsLayer3{transform:translateY(1%) scale(.77,.69);transform-origin:50% 10%}
.wsLayer3[src*="layer-hair-afro"]{transform:translateY(.2%) scale(.74,.66)}
.wsLayer3[src*="layer-hair-braids"]{transform:translateY(2.05%) scale(.77,.69)}
.wsApprovedPose{position:relative;z-index:1;height:100%;max-width:100%;object-fit:contain}.wsFacing{display:flex;gap:8px;justify-content:center}.wsFacing button{background:#30203c;border:1px solid #ad8d6d;color:#f8e6d5;border-radius:8px;padding:8px 12px;cursor:pointer}
.wsPoseStrip,.wsActions{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;padding:12px}
.wsActions .wsSave{background:#65346d;border-color:#e5bc77;font-weight:700}
.wsMessage{min-height:22px;color:#e9c892;text-align:center}
@media(max-width:900px){.wsWindow{grid-template-columns:1fr}.wsSidebar{padding:12px}.wsSidebar nav{display:flex;overflow:auto}.wsSidebar nav button{white-space:nowrap}.wsMain{grid-template-columns:1fr}.wsStage{position:relative;isolation:isolate;background:radial-gradient(ellipse at 50% 42%,#ad88ba30,transparent 62%);border-radius:48% 48% 10px 10px;height:50dvh}.wsSigil,.wsMotto{display:none}}
@media(prefers-reduced-motion:reduce){#wsOverlay *{scroll-behavior:auto;animation:none!important}.wsMagicBurst{display:none}}

.wsStage:before{content:"";position:absolute;bottom:6%;left:17%;width:66%;height:7%;border:1px solid #d3b07488;border-radius:50%;box-shadow:0 0 28px #d1a5ef22,inset 0 0 22px #d1a5ef18;pointer-events:none}.wsStage:after{content:"✧                 ·                  ✦";white-space:pre;position:absolute;inset:14% 5% auto;text-align:center;color:#e2c49388;font-size:13px;letter-spacing:4px;pointer-events:none}.wsStage:has(.wsPixiScene):before,.wsStage:has(.wsPixiScene):after{display:none}
.wsPixiScene{position:absolute;inset:0;pointer-events:none;z-index:0}.wsPixiScene canvas{display:block;width:100%;height:100%}.wsPixiReplaced{visibility:visible}.wsViewTools{display:flex;gap:8px;margin-top:10px}.wsViewTools button{color:#f8e9d4;background:#30203c;border:1px solid #ad8d6d;border-radius:20px;padding:9px 18px;cursor:pointer}
.wsMirror{box-shadow:inset 0 0 0 7px #0c081b66,0 18px 60px #08040c77;background:radial-gradient(ellipse at 50% 35%,#72536c,#30203e 58%,#140e20)}
.wsControls{box-shadow:0 10px 35px #08040c44}.wsHair button,.wsItem{transition:border-color .18s,background .18s}.wsHair button:hover,.wsItem:hover{border-color:#f1d18c;background:#45304b}
#wsOverlay button:focus-visible{outline:3px solid #ffe0a0;outline-offset:3px}.wsStage .wsFigure{max-width:90%}
@media(min-width:901px){.wsMirror{position:sticky;top:20px;align-self:start}.wsStage{height:clamp(390px,62dvh,700px)}}
@media(max-width:900px){.wsMain{display:flex;flex-direction:column;padding:14px;gap:14px}.wsMirror{order:-1}.wsStage{height:47dvh;min-height:280px}.wsSidebar nav{gap:6px}.wsSidebar nav button{font-size:13px;padding:9px}.wsBrand h1{font-size:25px}.wsBrand br{display:none}.wsPoseStrip{gap:6px;padding:10px 0}.wsMirrorTitle{font-size:11px;letter-spacing:2px}}

#wsOverlay *{box-sizing:border-box}.wsLookCaption{display:grid;gap:4px;text-align:center;padding:0 0 8px}.wsLookCaption strong{font:21px Georgia,serif;color:#ffe3af}.wsLookCaption span{font-size:12px;color:#dbc6d9}.wsRecovery{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:7px}.wsRecovery button{font:12px system-ui;color:#ead7c6;background:#211729;border:1px solid #866c70;border-radius:8px;padding:7px 11px;cursor:pointer}.wsRecovery [hidden],.wsAssetStatus[hidden]{display:none!important}.wsAssetStatus{padding:8px;border:1px solid #d1ae72;border-radius:8px;color:#ffe4b1;background:#2f2237;font-size:12px;text-align:center;max-width:100%}.wsInventory{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.wsItem{width:100%;min-width:0}.wsItem img{width:100%;height:118px;background:radial-gradient(ellipse,#71536a44,transparent 70%)}.wsItem span{font-size:12px}.wsControls h2{margin-top:0}.wsMessage{font-size:12px;line-height:1.4;max-width:95%}.wsPoseStrip{padding:8px 0;gap:6px}.wsPoseStrip button{font-size:12px;padding:8px}.wsActions{padding:8px 0}.wsHair img{background:radial-gradient(ellipse,#886b7b33,transparent 70%)}
@media(min-width:901px){.wsWindow{height:100dvh;min-height:0;overflow:hidden;grid-template-columns:190px minmax(0,1fr)}.wsMain{height:100dvh;grid-template-columns:minmax(250px,300px) minmax(0,1fr);padding:18px;gap:18px}.wsControls{max-height:calc(100dvh - 36px);overflow:auto;scrollbar-gutter:stable}.wsMirror{height:calc(100dvh - 36px);top:0;padding:14px}.wsStage{flex:1 1 auto;min-height:160px;height:auto}.wsMirror>*:not(.wsStage){flex-shrink:0}.wsBrand h1{font-size:29px}.wsSidebar nav button{font-size:14px;padding:10px}.wsSidebar{padding:18px 14px}}
@media(max-width:900px){.wsLookCaption strong{font-size:18px}.wsMirror{padding:12px}.wsStage{height:40dvh;min-height:240px}.wsControls{width:100%}.wsSidebar{gap:8px}.wsBrand{gap:8px}.wsBrand h1{margin:0}.wsBack{align-self:start}.wsActions button{min-height:40px}}

#wsOverlay .wsControls h2,#wsOverlay .wsControls h3,#wsOverlay .wsControls h4{color:#66374f!important;-webkit-text-fill-color:#66374f!important;text-shadow:none!important}
/* Champagne, rose velvet and a warm lighted vanity. One existing wardrobe owner. */
#wsOverlay{background:#f0dfd8;color:#382334}.wsWindow{background:radial-gradient(ellipse at 76% 20%,#fff9ee 0%,#f4e6e1 50%,#e4cbd1 100%)}
.wsSidebar{background:linear-gradient(165deg,#482c40,#291e30);border-right:1px solid #cba59d;box-shadow:8px 0 35px #71445017}.wsBrand{color:#ffe4bc}.wsMotto{color:#f0ced6;font-size:16px;line-height:1.5}.wsSidebar nav button,.wsBack{background:#ffffff0b;border-color:#b18a98;color:#fff0e5}.wsSidebar nav button:hover,.wsBack:hover{background:#765167}
.wsControls{background:linear-gradient(140deg,#fffaf5,#f9eeeb);border:1px solid #c9a59e;border-radius:20px;box-shadow:0 12px 35px #805c6820;scrollbar-color:#b88999 #f3e5e0}.wsControls h2,.wsControls h3{color:#66374f}.wsControls h2{font-size:28px}.wsControls h3{font-size:19px}.wsControls h4{color:#66374f}.wsHint,.wsSavedLook span{color:#725568}.wsControls p{color:#705568}.wsNameLabel{color:#513448}
#wsOverlay .wsControls button{background:#fff7ef;color:#58374d;border-color:#b9919b}#wsOverlay .wsControls button:hover{background:#f4dfe3;border-color:#875669}#wsOverlay .wsControls [aria-pressed="true"]{background:#74445c;color:#fff5e8;outline-color:#ad7d55;border-color:#74445c}
.wsHair img,.wsItem img{background:radial-gradient(ellipse,#dec2cb70,transparent 75%)}.wsHair button,.wsItem{box-shadow:0 3px 9px #88596b12}.wsItem img{height:130px}.wsItem span{font-weight:600}.wsSwatches button[aria-pressed="true"]{outline-offset:3px!important}.wsEmpty{color:#725568;background:#f6e8e7;border-color:#c09ba7}
.wsSavedLook{background:#fff7ef;border-color:#c6a1aa}.wsSavedLook strong{color:#58374d}#wsLookName{background:#fffdf8;color:#4e3146;border-color:#b68d9e}#wsLookName::placeholder{color:#856b7b}
.wsMirror{background:radial-gradient(ellipse at 50% 32%,#fffdf4 0%,#f7e9df 56%,#ead1d1 100%);border:4px double #bb8e65;border-radius:42px 42px 24px 24px;box-shadow:inset 0 0 0 8px #fff7e6,0 16px 45px #80536524;transition:box-shadow .25s,background .25s;padding:23px 24px 18px}
.wsMirror[data-lit="true"]{box-shadow:inset 0 0 0 8px #fff8e9,inset 0 0 42px #ffe6af80,0 0 36px #fff1cfaa,0 20px 45px #80536529}.wsMirror[data-lit="false"]{background:radial-gradient(ellipse at 50% 32%,#eee4e0,#d4c0c6);box-shadow:inset 0 0 0 8px #ede0da,0 15px 35px #80536524}
.wsMirrorTitle{color:#865c44;font-size:11px;letter-spacing:2px}.wsLookCaption strong{color:#64384d;font-size:24px}.wsLookCaption span{color:#806174}.wsStage{background:radial-gradient(ellipse at 50% 45%,#fffef588,transparent 68%)}.wsStage:after{color:#9d735c88}.wsStage:before{border-color:#ad7d5588;box-shadow:0 0 28px #ffddad66,inset 0 0 22px #fffdf58a}
.wsVanityLights{position:absolute;inset:12px;pointer-events:none;z-index:4;border:1px solid #caa27970;border-radius:30px 30px 15px 15px}.wsVanityLights i{position:absolute;width:12px;height:12px;border-radius:50%;transform:translate(-50%,-50%);border:1px solid #c6a275;background:#e0cdbf;box-shadow:0 1px 3px #64433644;transition:background .2s,box-shadow .2s}.wsMirror[data-lit="true"] .wsVanityLights i{background:#fffdf0;border-color:#e2c193;box-shadow:0 0 5px 2px #fff8d6,0 0 16px 6px #ffe2a27d}
#wsOverlay .wsMirror button{background:#fff7ef;color:#5c394c;border:1px solid #b9919b;box-shadow:0 2px 5px #89536c12}#wsOverlay .wsMirror button:hover{background:#f2dce1}#wsOverlay .wsMirror [aria-pressed="true"]{background:#f1d9d9;color:#593146;outline-color:#b17f55}#wsOverlay .wsActions .wsSave{background:linear-gradient(115deg,#895569,#653d57);color:#fff5e8;border-color:#704454;box-shadow:0 4px 12px #89536c2b}.wsMessage{color:#735044}.wsAssetStatus{color:#563848;background:#fff5e2;border-color:#b28764}.wsRecovery{margin-top:5px}.wsRecovery button{font-size:11px}#wsOverlay button:focus-visible,#wsLookName:focus-visible{outline:3px solid #925068;outline-offset:3px}.wsPoseStrip button{padding:7px 9px}.wsActions button{padding:9px 15px}
@media(max-width:900px){.wsMirror{padding:22px 20px 16px}.wsVanityLights{inset:10px}.wsVanityLights i{width:10px;height:10px}.wsMirrorTitle{font-size:9px;letter-spacing:1.5px}.wsLookCaption strong{font-size:21px}.wsMain{padding:12px}.wsSidebar{box-shadow:0 5px 20px #71445020}}
@media(prefers-reduced-motion:reduce){.wsMirror,.wsVanityLights i{transition:none}}

.wsPoseDetails{width:100%;text-align:center;flex-shrink:0}.wsPoseDetails summary{cursor:pointer;color:#64384d;font:13px system-ui;padding:9px;min-height:34px}.wsPoseDetails[open]{background:#ffffff55;border-radius:12px}.wsStage{flex:1 1 0!important}.wsStage .wsFigure{height:100%;width:auto;aspect-ratio:512/682;min-width:0;min-height:0}.wsMirror .wsMessage{font-size:11px}.wsMirror .wsRecovery{gap:5px}
@media(min-width:901px){.wsStage{min-height:240px}.wsMirror{min-height:620px}.wsLookCaption{padding-bottom:2px}.wsMirrorTitle{padding-bottom:4px}.wsViewTools{margin-top:4px}}
`;document.head.append(style);
window.MajickWardrobeStudio={open,close,render};
})();