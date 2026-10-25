(()=>{
'use strict';
const VERSION='3.4.2-atelier-fitted-11';
if(!document.querySelector('link[data-majick-ornate]')){const link=document.createElement('link');link.rel='stylesheet';link.href='./majick-ornate-panel.css';link.dataset.majickOrnate='true';document.head.append(link)}
const HAIR=['Locs','Braids','Curls','Afro','Twists','Waves'];
const SKIN=['#70412f','#9d6345','#bf8766','#deb192','#f0cdb4','#513024'];
const ROBES=['Plum Scholar','Midnight Velvet','Emerald Witch','Moonlit Silver'];
const FABRIC=['Velvet','Satin','Linen','Brocade'];
const COLORS=['#68355f','#13243d','#276459','#b7a0cf','#ad784b'];
const PATTERNS=['Cape','Skirt','Hat','Sash'];
const BOARD=['MOON','STAR','RUNE','BOOK','WAND','MATH','DATA','MEAN','RATIO','READ'];
const DICTIONARY=new Set(['MOON','STAR','RUNE','BOOK','WAND','MATH','DATA','MEAN','RATIO','READ','RAN','RAT','RATS','ART','TAR','TAN','TEN','TEA','TEAS','EAT','EATS','ATE','SEA','SEAT','EARN','EAR','EARS','ARE','AREA','RAIN','RAINY','RATE','RATED','RATES','READS','RED','ROW','WORD','WORDS','WORE','WORN','AND','ANT','ANTS','MAN','MEN','MAT','MATS','MAD','MAIN','MIND','MINE','NAME','NAMES','SAND','SEND','SENT','NOTE','NOTES','TONE','TONES','STONE','STORE','SORE','ROSE','RISE','RIDE','RIDE','NODE','NODES','CODE','CODES','RODE','MORE','MORAL','ROLE','ROLES','LORE','LONE','LINE','LINES','SINE','SIR','SIT','TIE','TIES','TIRE','TIRES','TIDE','TIDES','DIE','DIES','DEN','DENS','END','ENDS','ONE','ONES','TEN','TENS','NET','NETS','SET','SETS','LATE','LATER','LIT','LITE','LITER','LITRE','LORD','ROAD','ROADS','MODE','MODES','DOME','DOOM','ROOM','ROOMS','ROAM','ROAMS','ATOM','ATOMS','MOST','POST','PAST','PASTE','TAPE','TAPES','TAME','TEAM','TEAMS','MATE','MATES','SAME','SOME','TIME','TIMES','TIMER','TIMERS','PART','PARTS','PORT','PORTS','SORT','SORTS','RAIN','TRAIN','TRAINS','TRAIL','TRAILS','TRIAL','TRIALS','SALT','SILK','SILKS','SOLD','SAND','HAND','HANDS','HARD','HARE','HARES','HERO','HEROES','HER','HERS','HIM','HIS','SHE','THE','THEM','THEN','THIS','THAT','THESE','THOSE','OTHER','OTHERS','SEE','SEEN','SEED','SEEDS','NEAR','NEAT','NEED','NEEDS','DEAR','DEER','DEED','DEEDS']);
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tab='avatar',round=0,chosen=[],found=[],feedback='';
function player(){
 const s=window.S;
 if(!s)return null;
 s.majickIdentity=s.majickIdentity||{};
 const root=s.majickIdentity;
 root.atelier=root.atelier||{name:'Scholar',skin:2,hair:0,robe:0,fabric:0,color:0,pattern:0,inventory:[],outfits:[],equipped:null,runeRounds:0,runeWords:0,craftStage:0,craftQuality:0,accessory:null};
 return root.atelier;
}
function save(){try{window.save?.()}catch(_){}}
function iconButton(){if(document.getElementById('atelierLaunch'))return;const b=document.createElement('button');b.id='atelierLaunch';b.textContent='✦ Enchanted Atelier';b.className='atelierLaunch';b.type='button';b.addEventListener('click',open);document.body.append(b)}
function open(){if(window.MajickWardrobeStudio?.open)return window.MajickWardrobeStudio.open();const p=player();if(!p)return;let el=document.getElementById('atelierOverlay');if(!el){el=document.createElement('div');el.id='atelierOverlay';el.className='atelierOverlay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Enchanted Atelier');document.body.append(el)}render();el.hidden=false;el.querySelector('#atelierClose')?.focus()}
function close(){const el=document.getElementById('atelierOverlay');if(el)el.hidden=true}
function select(label,kind,array,current){const art=kind==='hair'?AVATAR_HAIR:kind==='robe'?AVATAR_ROBES:null;return '<label>'+E(label)+'<select data-atelier="'+kind+'">'+array.map((v,i)=>{const pending=art&&!Object.prototype.hasOwnProperty.call(art,i);return '<option value="'+i+'" '+(i===current?'selected':'')+(pending?' disabled':'')+'>'+E(v)+(pending?' · artwork pending':'')+'</option>'}).join('')+'</select></label>'}
function sharedVault(p){
 const inv=window.MajickRewardCore?.inventory?.()||{collectibles:[],treasures:[]};
 return (inv.treasures||[]).filter(t=>t.kind==='accessory'&&(inv.collectibles||[]).includes(t.id));
}
function layeredAvatar(p){
 const skin=SKIN[p.skin]||SKIN[2],tone=COLORS[p.color]||COLORS[0];
 const item=p.equipped!==null?p.inventory[p.equipped]:null;
 const garment=item?COLORS[item.color]||tone:tone;
 const accessory=sharedVault(p).find(t=>t.id===p.accessory);
 const cape=item?.pattern===0,skirt=item?.pattern===1,hat=item?.pattern===2,sash=item?.pattern===3;
 const hairShapes=[
 '<path d="M90 80Q65 52 75 30Q90 8 120 20Q156 8 166 42L155 103L147 120L139 58L129 103L119 58L108 109L96 59L88 113Z"/>',
 '<path d="M78 81Q69 21 118 19Q165 22 164 85L153 117L146 81L136 120L132 49L113 43L100 120L94 55L84 120Z"/>',
 '<path d="M75 86Q56 50 77 29Q74 9 100 18Q120 -2 142 18Q174 14 168 45Q184 70 159 94Q147 68 145 50Q124 38 100 53Q96 79 75 86Z"/>',
 '<ellipse cx="120" cy="51" rx="56" ry="48"/>',
 '<path d="M73 85Q66 17 117 15Q168 14 169 80L148 127L139 48L125 124L115 49L92 128Z"/>',
 '<path d="M72 80Q57 33 88 24Q125 -3 155 24Q182 49 165 93Q150 54 141 44Q106 37 90 54Z"/>'
 ];
 return '<svg class="atelierFigure" viewBox="0 0 240 360" role="img" aria-label="Layered full-body scholar avatar with hair, skin, robe and equipped clothing">'+
 '<defs><linearGradient id="atelierCloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+garment+'"/><stop offset="1" stop-color="#201a34"/></linearGradient></defs>'+
 '<path d="M92 150L65 336L177 336L148 150Z" fill="#10101e" stroke="#a98952" stroke-width="2"/>'+
 '<path d="M98 123L78 153L64 257L82 266L101 170ZM142 123L163 153L177 257L158 266L139 170Z" fill="'+skin+'" stroke="#503021" stroke-width="2"/>'+
 '<path d="M108 284L104 333L124 333L124 284ZM126 284L127 333L145 333L138 284Z" fill="'+skin+'"/>'+
 (cape?'<path d="M96 120L44 320L191 320L144 120Z" fill="'+garment+'" opacity=".85" stroke="#d0a969" stroke-width="3"/>':'')+
 '<path d="M92 128Q120 146 148 128L164 294Q121 312 76 294Z" fill="url(#atelierCloth)" stroke="#c8a16b" stroke-width="3"/>'+
 (skirt?'<path d="M90 214L52 318Q120 344 184 318L149 214Z" fill="'+garment+'" stroke="#dbbc82" stroke-width="3"/>':'')+
 (sash?'<path d="M91 157L157 234L153 249L85 173Z" fill="'+garment+'" stroke="#e4c586" stroke-width="3"/>':'')+
 '<path d="M112 124L120 178L128 124" fill="none" stroke="#f3d18b" stroke-width="4"/><path d="M108 199L120 186L132 199L120 213Z" fill="#d7b776"/>'+
 '<rect x="105" y="318" width="21" height="19" rx="5" fill="#21192b"/><rect x="127" y="318" width="22" height="19" rx="5" fill="#21192b"/>'+
 '<ellipse cx="120" cy="78" rx="39" ry="51" fill="'+skin+'" stroke="#67412d" stroke-width="2"/>'+
 '<g fill="#1d1423">'+(hairShapes[p.hair]||hairShapes[0])+'</g>'+
 '<ellipse cx="105" cy="81" rx="3" ry="2" fill="#291d22"/><ellipse cx="135" cy="81" rx="3" ry="2" fill="#291d22"/><path d="M113 99Q120 105 128 99" fill="none" stroke="#713f3e" stroke-width="2"/>'+
 (hat?'<path d="M70 48L166 48L138 8L106 8Z" fill="'+garment+'" stroke="#d7bb7e" stroke-width="3"/>':'')+
 (accessory?'<text x="120" y="126" text-anchor="middle" font-size="22" fill="#ffdc93">'+E(accessory.icon||'✦')+'</text>':'')+
 '</svg>';
}
const AVATAR_ASSET_ROOT='./assets/atelier/avatars/';
const AVATAR_HAIR={0:'layer-hair-locs-v2.webp',1:'layer-hair-braids-v2.webp',2:'layer-hair-curls-v1.webp',3:'layer-hair-afro-v2.webp',4:'layer-hair-twists-v2.webp',5:'layer-hair-waves-v1.webp'};
const AVATAR_ROBES={0:'layer-dress-plum.webp',1:'layer-dress-midnight.webp',2:'layer-dress-emerald-v1.webp',3:'layer-dress-silver-v1.webp'};
const ACTIVITY_PORTRAITS={sleeping:'Sleeping',playing:'Playing',studying:'Studying',walking:'Walking',talking:'Talking',companion:'With Velora'};
function portrait(activity){const key=Object.prototype.hasOwnProperty.call(ACTIVITY_PORTRAITS,activity)?activity:'studying';return '<div class="atelierActivityArt" data-activity="'+key+'"><img src="'+AVATAR_ASSET_ROOT+'activity-plum-locs-warm-'+key+'-v1.webp" alt="Warm-brown scholar with locs in her Plum Scholar gown · '+E(ACTIVITY_PORTRAITS[key])+'" draggable="false"></div>'}
function portraits(p){const key=Object.prototype.hasOwnProperty.call(ACTIVITY_PORTRAITS,p.activityPortrait)?p.activityPortrait:'studying';return '<section class="atelierPortraitCollection"><h3>✦ A Scholar’s Day</h3><p>Warm brown · Locs · Plum Scholar</p><div class="atelierPortraitButtons" aria-label="Choose an activity portrait">'+Object.entries(ACTIVITY_PORTRAITS).map(([k,label])=>'<button type="button" data-activity-portrait="'+k+'" aria-pressed="'+(key===k)+'">'+E(label)+'</button>').join('')+'</div><figure>'+portrait(key)+'<figcaption>'+E(ACTIVITY_PORTRAITS[key])+'</figcaption></figure><p class="atelierPortraitNote">This first portrait collection uses the look above. Your saved wardrobe stays in Avatar & Outfits.</p></section>'}
let artReady=false,artChecked=false;
function checkAvatarArt(){
 if(artChecked)return;artChecked=true;
 const img=new Image();
 img.onload=()=>{artReady=true;window.MajickScholarCompanion?.refresh?.(true);if(!document.getElementById('atelierOverlay')?.hidden&&tab==='avatar')render()};
 img.onerror=()=>{artReady=false};
 img.src=AVATAR_ASSET_ROOT+'layer-body-warm-v2.webp';
}
function avatarPreviewNotes(p){
 const notes=[];
 if(!Object.prototype.hasOwnProperty.call(AVATAR_HAIR,p.hair))notes.push('Your selected hairstyle needs fitted artwork; displaying Locs preview.');
 if(!Object.prototype.hasOwnProperty.call(AVATAR_ROBES,p.robe))notes.push('Your selected robe needs fitted artwork; displaying Plum Scholar preview.');
 if(Number(p.color)!==0)notes.push('Robe tint is a visual preview. Fitted recolored artwork is not yet available.');
 if(p.accessory||p.equipped!=null)notes.push('Your accessory or crafted item is saved; fitted art is pending.');
 return notes;
}
function illustratedAvatar(p,compact=false,activity=''){
 if(!artChecked)checkAvatarArt();
 if(!artReady)return '<div class="atelierArtLoading">Preparing your illustrated scholar…</div>';
 const moment=({reading:'studying',writing:'studying','game-cheer':'playing','guardian-bonding':'companion'})[activity]||activity;
 if(activity&&![0,5].includes(Number(p.skin))&&Number(p.hair)===0&&Number(p.robe)===0&&Object.prototype.hasOwnProperty.call(ACTIVITY_PORTRAITS,moment))return portrait(moment);
 const robe=AVATAR_ROBES[p.robe]||AVATAR_ROBES[0];
 const hair=AVATAR_HAIR[p.hair]||AVATAR_HAIR[0];
 const layers=[
 (Number(p.skin)===0||Number(p.skin)===5?'layer-body-deep-v2.webp':'layer-body-warm-v2.webp'),
 robe,'layer-boots-plum.webp',hair
 ];
 const notes=avatarPreviewNotes(p);
 return '<div class="atelierIllustrated" data-footwear="boots" data-wand-palette="'+Math.max(0,Math.min(COLORS.length-1,Number(p.color)||0))+'" aria-label="Illustrated scholar outfit preview">'+layers.map((src,i)=> '<img alt="" draggable="false" class="atelierArtLayer atelierArtLayer'+i+'" data-avatar-layer="'+src+'" src="'+AVATAR_ASSET_ROOT+src+'" onerror="this.style.visibility=\'hidden\'">').join('')+'</div>'+(!compact&&notes.length?'<p class="atelierPreviewNotice">'+notes.join(' ')+'</p>':'');
}
let atelierZoom=1,atelierFocus='full';
const atelierViews={full:[1,0],hair:[1.9,33],jewelry:[1.7,13],fabric:[1.55,-17],boots:[1.8,-45]};
function mirrorControl(action){
 if(action==='in')atelierZoom=Math.min(1.6,+(atelierZoom+.15).toFixed(2));
 else if(action==='out')atelierZoom=Math.max(.7,+(atelierZoom-.15).toFixed(2));
 else if(action==='reset'){atelierZoom=1;atelierFocus='full'}
 else if(atelierViews[action])atelierFocus=action;
 render();
}
function mirrorTools(){return '<div class="atelierV2Tools"><button data-mirror="in">＋ Zoom</button><button data-mirror="out">− Zoom</button><button data-mirror="reset">↺ Reset</button></div><div class="atelierV2Focus">'+Object.entries({full:'Full body',hair:'Hair',jewelry:'Jewelry',fabric:'Fabric',boots:'Boots'}).map(([k,v])=>'<button data-mirror="'+k+'" aria-pressed="'+(atelierFocus===k)+'">'+v+'</button>').join('')+'</div>'}
function avatarPicker(kind,arr,selected){return '<div class="atelierV2Picker">'+arr.map(({id,label,img,tone})=>'<button data-avatar-choice="'+kind+'" data-choice="'+id+'" aria-pressed="'+(Number(selected)===id)+'" aria-label="'+E(label)+'">'+(img?'<img src="'+AVATAR_ASSET_ROOT+img+'" alt="" loading="lazy">':'<i style="background:'+tone+'"></i>')+'<small>'+E(label)+'</small></button>').join('')+'</div>'}
function avatar(p){
 const vault=sharedVault(p),view=atelierViews[atelierFocus]||atelierViews.full,previewNotes=avatarPreviewNotes(p);
 const hairs=HAIR.map((label,id)=>({id,label,img:AVATAR_HAIR[id]})).filter(x=>x.img);
 const robes=ROBES.map((label,id)=>({id,label,img:AVATAR_ROBES[id]})).filter(x=>x.img);
 const skins=[{id:0,label:'Deep brown',tone:SKIN[0]},{id:2,label:'Warm brown',tone:SKIN[2]}];
 return '<div class="atelierSplit atelierV2"><div class="atelierPreview atelierV2Mirror"><div class="atelierV2Crest">☾ ✦ THE WARDROBE MIRROR ✦ ☽</div><div class="atelierV2Stage"><div class="atelierV2Figure" style="transform:translateY('+view[1]+'%) scale('+(view[0]*atelierZoom).toFixed(2)+')">'+illustratedAvatar(p,true)+'</div></div>'+mirrorTools()+(previewNotes.length?'<details class="atelierPreviewDetails"><summary>Preview details</summary><p class="atelierPreviewNotice">'+E(previewNotes.join(' '))+'</p></details>':'')+'<strong>'+E(p.name||'Scholar')+'</strong><small>'+E(ROBES[p.robe])+'</small></div>'+
 '<div class="atelierFields atelierV2Controls majick-ornate-panel majick-ornate-panel--wardrobe"><label>Scholar name<input data-atelier-name maxlength="26" value="'+E(p.name)+'"></label>'+
 '<h3>Skin tone</h3>'+avatarPicker('skin',skins,[0,5].includes(Number(p.skin))?0:2)+
 '<h3>Hair</h3>'+avatarPicker('hair',hairs,p.hair)+
 '<h3>Robe style</h3>'+avatarPicker('robe',robes,p.robe)+
 '<h3>Wand palette · magical fabric tint</h3><p>Select a magical color for your robe. The wand adds a preview enchantment; fitted recolored artwork can be added later.</p><div class="atelierWandSwatches">'+COLORS.map((color,i)=>'<button type="button" data-wand-color="'+i+'" aria-pressed="'+(Number(p.color)===i)+'" aria-label="Choose wand palette '+(i+1)+'" title="Wand palette '+(i+1)+'" style="--wand-tint:'+color+'"><span>✦</span></button>').join('')+'</div><p role="status" class="atelierWandFeedback">✦ Current palette '+(Number(p.color)+1)+'</p>'+
 '<label>Magic Vault accessories<select data-vault-accessory><option value="">No accessory</option>'+vault.map(t=>'<option value="'+E(t.id)+'" '+(t.id===p.accessory?'selected':'')+'>'+E(t.name)+'</option>').join('')+'</select></label>'+
 '<small>Only owned accessories are available. Unsupported wearables remain identified as pending fitted artwork.</small>'+
 '<button data-action="save-outfit">Save this outfit</button>'+(window.MajickScholarProgression?.markup?.()||'')+'<h4>Saved outfits</h4><div class="atelierSaved">'+(p.outfits.length?p.outfits.map((o,i)=>'<button data-outfit="'+i+'">'+E(o.name)+' · '+E(ROBES[o.robe])+'</button>').join(''):'No outfits saved yet.')+'</div></div></div>';
}
const atelierV2Style=document.createElement('style');atelierV2Style.textContent=".atelierWindow:has(.atelierV2){width:min(1450px,97vw)!important;max-height:95dvh!important}\n.atelierWindow:has(.atelierV2)>main{max-height:calc(95dvh - 205px);overflow:auto!important}\n.atelierV2.atelierSplit{grid-template-columns:minmax(280px,47%) minmax(290px,53%)!important;align-items:start}\n.atelierV2Mirror{height:min(69dvh,720px);position:sticky!important;top:0!important;overflow:hidden;border:4px double #d0a96a;border-radius:45% 45% 20px 20px / 12% 12% 20px 20px;background:radial-gradient(ellipse at 50% 30%,#745271,#241630 75%)!important}\n.atelierV2Crest{font:700 13px Georgia,serif;letter-spacing:2px;color:#f1d49e;text-align:center}\n.atelierV2Stage{flex:1;width:100%;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center}\n.atelierV2Figure{height:100%;width:100%;display:flex;align-items:center;justify-content:center;transition:transform .2s ease}\n.atelierV2Figure .atelierIllustrated{height:100%!important;max-height:580px!important;width:auto!important}\n.atelierV2Tools,.atelierV2Focus{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}\n.atelierV2Controls{min-width:0;max-height:70dvh;overflow:auto}\n.atelierV2Picker{display:flex;gap:9px;overflow-x:auto;padding:6px 3px 12px}\n.atelierV2Picker button{flex:0 0 96px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;min-height:100px}\n.atelierV2Picker button[aria-pressed=true],.atelierV2Focus button[aria-pressed=true]{outline:2px solid #f3ce8a;outline-offset:2px}\n.atelierV2Picker img{height:80px;width:80px;object-fit:contain}\n.atelierV2Picker i{display:block;width:48px;height:48px;border-radius:50%;border:2px solid #d7b884}\n.atelierV2Picker small{font-size:12px}\n@media(max-width:800px){.atelierV2.atelierSplit{grid-template-columns:1fr!important}.atelierV2Mirror{height:50dvh;min-height:320px!important;position:relative!important}.atelierV2Controls{max-height:none}}\n@media(prefers-reduced-motion:reduce){.atelierV2Figure{transition:none}}";document.head.append(atelierV2Style);
const CUT_POINTS=[[80,78],[130,45],[180,78],[205,145],[180,220],[130,250],[80,220],[55,145]];
const SEAMS=[[[80,115],[105,115]],[[80,155],[105,155]],[[80,195],[105,195]],[[155,115],[180,115]],[[155,155],[180,155]],[[155,195],[180,195]]];
const MOTIFS=[['moon','☾'],['star','✦'],['rune','ᚱ'],['flower','❀']];
function craft(p){return p.craftSession||(p.craftSession={stage:'trace',trace:0,cut:0,stitches:[],embroidery:null,placed:null,selectedSeam:null,message:''})}
function credits(p){return Math.max(0,Number(p.sewingCredits||0))}
function spend(p){if(!credits(p))return false;p.sewingCredits--;return true}
function progression(c){return c.stage==='trace'?c.trace>=CUT_POINTS.length:c.stage==='cut'?c.cut>=CUT_POINTS.length:c.stage==='stitch'?c.stitches.length===SEAMS.length:!!c.placed}
function shape(n){return CUT_POINTS.slice(0,n).map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ')}
function fabric(p,c){
 const outline=shape(CUT_POINTS.length)+' Z',color=COLORS[p.color]||COLORS[0];
 const cutting=c.stage==='cut',mark=c.stage==='trace'||cutting;
 let overlay='';
 if(mark){
  const done=cutting?c.cut:c.trace;
  overlay='<path d="'+shape(done)+'" stroke="'+(cutting?'#9decff':'#7af0cc')+'" stroke-width="7" fill="none" stroke-linecap="round"/>'+
   CUT_POINTS.map(([x,y],i)=>'<circle data-pattern-point="'+i+'" cx="'+x+'" cy="'+y+'" r="13" fill="'+(i<done?'#78dcbf':i===done?'#ffd47c':'#53405e')+'" stroke="#edd4aa" stroke-width="2"/>').join('');
 }else{
  overlay=SEAMS.map((pair,i)=>'<line x1="'+pair[0][0]+'" y1="'+pair[0][1]+'" x2="'+pair[1][0]+'" y2="'+pair[1][1]+'" stroke="'+(c.stitches.includes(i)?'#fbd488':'#664e77')+'" stroke-width="3" stroke-dasharray="5 3"/>'+
   (c.stage==='stitch'?pair.map(([x,y],j)=>'<circle data-seam="'+i+'" data-end="'+j+'" cx="'+x+'" cy="'+y+'" r="13" fill="'+(c.stitches.includes(i)?'#86dfb4':'#e2ba7b')+'" stroke="#342641"/>').join(''):'')).join('');
  if(c.placed)overlay+='<text x="'+c.placed.x+'" y="'+c.placed.y+'" text-anchor="middle" font-size="44" fill="#ffe6ac">'+(MOTIFS.find(x=>x[0]===c.embroidery)?.[1]||'✦')+'</text>';
 }
 return '<svg id="atelierFabricBoard" viewBox="0 0 260 300" role="group" aria-label="Interactive tailoring fabric" style="width:100%;max-width:300px;touch-action:none;user-select:none;background:#20192c;border-radius:14px">'+
 '<rect x="18" y="16" width="224" height="265" rx="12" fill="#45344d" stroke="#b69a6b"/>'+
 '<path d="'+outline+'" fill="'+color+'" stroke="#c9a06a" stroke-width="'+(c.stage==='trace'?'2':'4')+'" stroke-dasharray="'+(c.stage==='trace'?'7 7':'none')+'"/>'+overlay+
 '<text x="130" y="278" text-anchor="middle" fill="#eedcb9" font-size="12">'+E(PATTERNS[p.pattern])+' · '+E(FABRIC[p.fabric])+'</text></svg>';
}
function sew(p){
 const c=craft(p),stage=c.stage,labels={trace:'Trace the cut line',cut:'Cut the fabric',stitch:'Connect the seams',embroider:'Apply embroidery'};
 const advice={trace:'Drag or tap each glowing dot in order to trace the outline.',cut:'Follow the glowing dots to cut the fabric edge.',stitch:'Tap a seam dot, then its partner on the opposite side.',embroider:'Select a motif and tap the fabric where you want it.'};
 return '<p><strong>Earn one sewing action for every correct study answer.</strong> Bank actions through Study Now or the Learning Hub and use them in the Atelier. Assisted answers do not grant independent mastery.</p>'+
 '<p role="status"><b>🧵 Sewing actions available: '+credits(p)+'</b> · Each traced point, cut point, completed seam, or embroidery placement costs one action.</p>'+
 '<div class="atelierSplit"><div class="atelierPreview">'+fabric(p,c)+'</div><div><h3>'+E(labels[stage])+'</h3><p>'+E(advice[stage])+'</p>'+
 (stage==='trace'&&c.trace===0?'<div class="atelierFields">'+select('Pattern','pattern',PATTERNS,p.pattern)+select('Fabric','fabric',FABRIC,p.fabric)+select('Color','color',COLORS.map((_,i)=>'Palette '+(i+1)),p.color)+'</div>':'')+
 (stage==='embroider'?'<div class="atelierActions">'+MOTIFS.map(([id,glyph])=>'<button data-embroidery="'+id+'" aria-pressed="'+(c.embroidery===id)+'">'+glyph+' '+id+'</button>').join('')+'</div>':'')+
 '<p id="atelierCraftFeedback" role="status" aria-live="polite">'+E(c.message||'')+'</p>'+
 '<p>Progress: '+(stage==='trace'?c.trace+'/'+CUT_POINTS.length:stage==='cut'?c.cut+'/'+CUT_POINTS.length:stage==='stitch'?c.stitches.length+'/'+SEAMS.length:c.placed?'Embroidery placed':'Choose your design')+'</p>'+
 '<button data-action="craft-step" '+(progression(c)?'':'disabled')+'>'+(stage==='embroider'?'Finish and equip garment':'Continue to next step →')+'</button> '+
 '<button data-action="reset-stage">Reset this step</button> <button data-action="reset-craft">New design</button>'+
 (!credits(p)?'<p>Out of sewing actions? Answer study questions correctly to earn more.</p>':'')+'</div></div>'+
 '<h3>Crafted wardrobe ('+p.inventory.length+')</h3><div class="atelierSaved">'+(p.inventory.length?p.inventory.map((x,i)=>'<div class="atelierItem"><b>'+E(x.name)+'</b><button data-equip="'+i+'">'+(p.equipped===i?'Equipped ✓':'Equip')+'</button></div>').join(''):'Complete the four stages to create your first garment.')+'</div>';
}
function sewingPoint(i){
 const p=player(),c=craft(p);if(!['trace','cut'].includes(c.stage))return;const prop=c.stage==='trace'?'trace':'cut';
 if(i!==c[prop]){c.message='Follow the next glowing dot, in order.';render();return}
 if(!spend(p)){c.message='Earn a sewing action by answering a study question correctly.';render();return}
 c[prop]++;c.message='Excellent! The garment outline is taking shape.';save();render();
}
function seamPoint(i,side){
 const p=player(),c=craft(p);if(c.stage!=='stitch'||c.stitches.includes(i))return;
 if(c.selectedSeam===null){c.selectedSeam={i,side};c.message='Now connect the matching dot on the opposite edge.';render();return}
 const first=c.selectedSeam;c.selectedSeam=null;
 if(first.i!==i||first.side===side){c.message='Those endpoints do not match. Try again.';render();return}
 if(!spend(p)){c.message='Earn another sewing action by studying.';render();return}
 c.stitches.push(i);c.message='Seam connected!';save();render();
}
function embroideryPoint(ev){
 const p=player(),c=craft(p);if(c.stage!=='embroider'||!c.embroidery)return;
 const svg=ev.currentTarget,rect=svg.getBoundingClientRect();
 const x=(ev.clientX-rect.left)*260/rect.width,y=(ev.clientY-rect.top)*300/rect.height;
 if(x<75||x>185||y<95||y>224){c.message='Place the design inside the garment.';render();return}
 if(!c.placed&&!spend(p)){c.message='Earn one sewing action by answering a study question.';render();return}
 c.placed={x:Math.round(x),y:Math.round(y)};c.message='Embroidery placed.';save();render();
}

function board(){let seed=BOARD[round%BOARD.length].split('');const others='ETASRIONDLPC';while(seed.length<16)seed.push(others[(round*7+seed.length*5)%others.length]);return seed}
function rune(p){const tiles=board();return '<p>Trace adjacent letters to make words of three or more letters. Your path may not reuse a tile. This is a vocabulary warm-up, not an OA mastery score.</p><div class="atelierRuneBoard">'+tiles.map((c,i)=>'<button data-cell="'+i+'" class="'+(chosen.includes(i)?'picked':'')+'">'+c+'</button>').join('')+'</div><p><b>Word:</b> '+E(chosen.map(i=>tiles[i]).join(''))+'</p><div class="atelierActions"><button data-action="submit-word">Submit word</button><button data-action="clear-word">Clear selection</button><button data-action="next-round">New board</button></div><p aria-live="polite">'+E(feedback)+'</p><p><b>Words found this round:</b> '+(found.length?found.map(E).join(' · '):'None yet')+'</p><p>Lifetime valid words: '+p.runeWords+' · Boards played: '+p.runeRounds+'</p>'}
function render(){const el=document.getElementById('atelierOverlay'),p=player();if(!el||!p)return;if(tab==='sew')tab='avatar';el.innerHTML='<div class="atelierWindow"><header><div><small>THE MOONLIT COLLEGIUM</small><h2>✦ Enchanted Atelier</h2><p>Create your witch, tailor a wardrobe, and weave rune words.</p></div><button id="atelierClose" aria-label="Close atelier">✕</button></header><nav>'+[['avatar','Enchanted Wardrobe'],['portraits','Living Portraits'],['rune','Runeweaver']].map(([k,l])=>'<button data-tab="'+k+'" aria-pressed="'+(tab===k)+'">'+l+'</button>').join('')+'</nav><main>'+(tab==='avatar'?avatar(p):tab==='portraits'?portraits(p):rune(p))+'</main><footer>One scholar identity · No duplicate XP or mastery engine · Saved with your app progress</footer></div>';bind(el)}
function bind(el){el.querySelectorAll('[data-mirror]').forEach(b=>b.addEventListener('click',()=>mirrorControl(b.dataset.mirror)));el.querySelectorAll('[data-avatar-choice]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.avatarChoice;if(!['skin','hair','robe'].includes(k))return;player()[k]=Number(b.dataset.choice);save();render()}));el.querySelectorAll('[data-wand-color]').forEach(b=>b.addEventListener('click',()=>{player().color=Number(b.dataset.wandColor);save();render();const mirror=document.querySelector('.atelierV2Mirror');mirror?.classList.add('wandCasting')}));el.querySelectorAll('[data-activity-portrait]').forEach(b=>b.addEventListener('click',()=>{player().activityPortrait=b.dataset.activityPortrait;save();render()}));el.querySelector('#atelierClose')?.addEventListener('click',close);el.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;render()}));el.querySelectorAll('[data-atelier]').forEach(c=>c.addEventListener('change',()=>{player()[c.dataset.atelier]=Number(c.value);save();render()}));el.querySelector('[data-atelier-name]')?.addEventListener('change',e=>{player().name=e.target.value.trim().slice(0,26)||'Scholar';save();render()});el.querySelector('[data-vault-accessory]')?.addEventListener('change',e=>{player().accessory=e.target.value||null;save();render()});el.querySelectorAll('[data-outfit]').forEach(b=>b.addEventListener('click',()=>{const o=player().outfits[Number(b.dataset.outfit)];Object.assign(player(),{hair:o.hair,skin:o.skin,robe:o.robe,color:o.color,accessory:o.accessory||null,equipped:o.equipped??null});save();render()}));el.querySelectorAll('[data-equip]').forEach(b=>b.addEventListener('click',()=>{player().equipped=Number(b.dataset.equip);save();render()}));el.querySelectorAll('[data-cell]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.cell),last=chosen.at(-1);if(chosen.includes(i))return;if(last!==undefined&&Math.max(Math.abs(Math.floor(last/4)-Math.floor(i/4)),Math.abs(last%4-i%4))!==1){feedback='Choose an adjacent letter.';render();return}chosen.push(i);feedback='';render()}));el.querySelectorAll('[data-pattern-point]').forEach(dot=>dot.addEventListener('pointerdown',event=>{event.preventDefault();sewingPoint(Number(dot.dataset.patternPoint))}));
 el.querySelectorAll('[data-seam]').forEach(dot=>dot.addEventListener('click',()=>seamPoint(Number(dot.dataset.seam),Number(dot.dataset.end))));
 el.querySelectorAll('[data-embroidery]').forEach(btn=>btn.addEventListener('click',()=>{const c=craft(player());c.embroidery=btn.dataset.embroidery;c.message='Tap the garment to place your motif.';save();render()}));
 el.querySelector('#atelierFabricBoard')?.addEventListener('click',event=>{if(craft(player()).stage==='embroider')embroideryPoint(event)});
 el.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.action)))}
function act(type){const p=player();if(type==='save-outfit'){p.outfits.push({name:'Look '+(p.outfits.length+1),skin:p.skin,hair:p.hair,robe:p.robe,color:p.color,accessory:p.accessory,equipped:p.equipped});save()}if(type==='craft-step'){const c=craft(p);if(progression(c)){if(c.stage==='trace')c.stage='cut';else if(c.stage==='cut')c.stage='stitch';else if(c.stage==='stitch')c.stage='embroider';else if(c.stage==='embroider'){p.inventory.push({name:FABRIC[p.fabric]+' '+PATTERNS[p.pattern],pattern:p.pattern,fabric:p.fabric,color:p.color,embroidery:c.embroidery});p.equipped=p.inventory.length-1;p.craftSession=null;}save()}}if(type==='reset-stage'){const c=craft(p);if(c.stage==='trace')c.trace=0;if(c.stage==='cut')c.cut=0;if(c.stage==='stitch'){c.stitches=[];c.selectedSeam=null}if(c.stage==='embroider')c.placed=null;c.message='Step reset. Earned sewing actions already spent are not refunded.';save()}if(type==='reset-craft'){p.craftSession=null;save()}if(type==='clear-word'){chosen=[];feedback='Selection cleared.'}if(type==='next-round'){round++;p.runeRounds++;chosen=[];found=[];feedback='New rune board ready.';save()}if(type==='submit-word'){const word=chosen.map(i=>board()[i]).join('');if(word.length<3)feedback='Choose at least three connected letters.';else if(found.includes(word))feedback='You already found that word.';else if(!DICTIONARY.has(word))feedback='That is not in the current Runeweaver word list. Try a common word.';else{found.push(word);p.runeWords++;feedback='Word recorded: '+word+'. Try another word!';save()}chosen=[]}render()}
const style=document.createElement('style');style.textContent='.atelierFigure{width:min(100%,240px);height:310px;display:block;margin:auto;filter:drop-shadow(0 10px 12px #0009)}.atelierCut{border:1px dashed #bca578;border-radius:12px;padding:16px;margin:12px 0}.atelierFabric{min-height:120px;display:grid;place-items:center;border:2px dashed #e5cca2;border-radius:8px;color:#fff;font-weight:800}.atelierLaunch{position:fixed;bottom:17px;right:16px;z-index:900;border:1px solid #c9a56c;border-radius:28px;background:#33213e;color:#ffe7b7;padding:11px 16px;box-shadow:0 5px 25px #120c18a9;cursor:pointer}.atelierOverlay{position:fixed;inset:0;background:#0d0a13df;z-index:1500;display:grid;place-items:center;padding:16px}.atelierOverlay[hidden]{display:none}.atelierWindow{width:min(790px,100%);max-height:93vh;overflow:auto;background:#211b31;color:#f7e9d6;border:2px solid #b69a6b;border-radius:20px;padding:18px;box-shadow:0 12px 60px #000b}.atelierWindow header{display:flex;justify-content:space-between;align-items:start}.atelierWindow header h2{margin:2px 0}.atelierWindow header p{margin:3px 0 10px}.atelierWindow button,.atelierWindow select,.atelierWindow input{border:1px solid #a58fba;border-radius:8px;padding:9px;background:#473651;color:#fff;cursor:pointer}.atelierWindow nav,.atelierActions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.atelierWindow nav [aria-pressed=true],.atelierWindow button:hover{background:#795b88}.atelierWindow main{padding:12px 3px}.atelierSplit{display:grid;grid-template-columns:minmax(170px,1fr) minmax(190px,1.2fr);gap:20px}.atelierPreview{background:radial-gradient(#574064,#1a1627);border-radius:12px;min-height:370px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px}.atelierHair{font-size:15px;letter-spacing:3px;color:#e5c5a3}.atelierFace{height:95px;width:86px;border-radius:45% 45% 48% 48%;font-size:54px;text-align:center;color:#241b22}.atelierRobe{height:140px;width:130px;border-radius:45% 45% 15% 15%;font-size:28px;line-height:43px;text-align:center;border:4px solid #bba177;color:#eddaae}.atelierFields{display:grid;gap:10px}.atelierFields label{display:grid;gap:4px}.atelierSaved{display:flex;flex-wrap:wrap;gap:8px}.atelierItem{width:100%;display:flex;justify-content:space-between;align-items:center;padding:7px;border-bottom:1px solid #71627d}.atelierRuneBoard{display:grid;grid-template-columns:repeat(4,1fr);max-width:360px;gap:7px}.atelierRuneBoard button{aspect-ratio:1;font-size:22px;font-weight:700}.atelierRuneBoard button.picked{background:#a78151}.atelierWindow footer{font-size:12px;color:#d4bb9e;border-top:1px solid #65516d;padding-top:12px}@media(max-width:550px){.atelierSplit{grid-template-columns:1fr}.atelierLaunch{bottom:8px;right:8px}}';document.head.append(style);
const illustrationStyles=document.createElement('style');illustrationStyles.textContent='.atelierIllustrated{position:relative;width:min(100%,320px);aspect-ratio:512/682;margin:auto}.atelierArtLayer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none}.atelierWindow .atelierPreview:has(.atelierIllustrated){min-height:460px!important}';document.head.append(illustrationStyles);
const scholarFitRepair=document.createElement('style');
scholarFitRepair.id='majick-scholar-fit-repair';
scholarFitRepair.textContent=`
/* Keep all outfit layers in the same coordinate system, including the dock avatar. */
.atelierV2Stage .atelierV2Figure{min-height:0}
.atelierV2Stage .atelierIllustrated{height:min(100%,610px)!important;max-height:none!important;aspect-ratio:512/682;width:auto!important;max-width:100%}
.atelierV2Mirror{display:flex!important;flex-direction:column}
.atelierV2Mirror .atelierV2Stage{flex:1 1 auto!important;min-height:0}
.atelierV2Mirror .atelierV2Figure{height:100%!important}
.mscLarge{height:245px!important;width:205px!important;left:calc(50% - 102.5px)!important}
.mscLarge .atelierIllustrated{height:100%!important;width:auto!important;max-width:100%}
.mscSmall .atelierIllustrated{height:52px!important;width:auto!important}
.atelierIllustrated .atelierArtLayer[data-avatar-layer^="layer-hair-"]{transform:translateY(1%) scale(.77,.69)!important;transform-origin:50% 10%!important}
.atelierIllustrated .atelierArtLayer[data-avatar-layer="layer-hair-afro-v2.webp"]{transform:translateY(.2%) scale(.74,.66)!important}
@media(max-width:760px){.atelierV2Mirror{height:min(56dvh,510px)!important}.atelierV2Stage .atelierIllustrated{height:100%!important}}
`;
document.head.append(scholarFitRepair);
const polish=document.createElement('style');polish.textContent="\n/* Atelier visual system: deliberate modal hierarchy and compact, readable workbench */\n.atelierOverlay{position:fixed!important;inset:0!important;z-index:1500!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:clamp(10px,2vw,28px)!important;background:rgba(10,6,17,.87)!important;backdrop-filter:blur(9px)}\n.atelierOverlay[hidden]{display:none!important}\n.atelierWindow{box-sizing:border-box!important;width:min(1120px,96vw)!important;max-height:min(92dvh,900px)!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;border:1px solid #c4a66f!important;border-radius:22px!important;padding:0!important;background:linear-gradient(148deg,#24182d,#171322 68%,#2c1a35)!important;color:#faebd8!important;box-shadow:0 32px 110px #000b,0 0 0 5px #a9824629!important;font:inherit}\n.atelierWindow>header{display:flex!important;flex:0 0 auto;align-items:center!important;gap:18px;justify-content:space-between!important;padding:19px 28px 14px!important;background:radial-gradient(ellipse at 25% 0%,#553650 0%,transparent 65%),#251728;border-bottom:1px solid #ae855f66}\n.atelierWindow>header small{font-size:11px;letter-spacing:.24em;color:#d9b779}\n.atelierWindow>header h2{font-family:Georgia,serif!important;font-weight:500!important;font-size:clamp(25px,3vw,35px)!important;line-height:1.15!important;color:#f5d5a1!important;margin:6px 0!important}\n.atelierWindow>header p{font-size:13px!important;margin:0!important;color:#d2bac8!important}\n.atelierWindow #atelierClose{width:38px;height:38px;flex-shrink:0;background:#422b43!important;border:1px solid #9e777d!important;border-radius:50%!important}\n.atelierWindow>nav{display:flex!important;flex-wrap:nowrap!important;gap:6px!important;flex:0 0 auto;margin:0!important;padding:10px 26px!important;border-bottom:1px solid #7e5c573f;background:#17121e!important}\n.atelierWindow>nav button{flex:1!important;padding:10px 8px!important;border-radius:9px!important;white-space:normal;color:#ddcbd4!important;background:#302238!important;border:1px solid transparent!important;font-size:13px!important}\n.atelierWindow>nav button[aria-pressed=\"true\"]{background:linear-gradient(110deg,#70465f,#523953)!important;color:#ffe7b8!important;border-color:#caab74!important;box-shadow:inset 0 -2px #dfb878}\n.atelierWindow>main{box-sizing:border-box;flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain;padding:23px 30px 30px!important;scrollbar-width:thin;scrollbar-color:#8c6d83 #251b2d}\n.atelierWindow>main>p:first-child{font-size:13px;line-height:1.55;color:#d6c1cb;background:#36263a;border-left:3px solid #d2a66c;padding:11px 15px;border-radius:4px 10px 10px 4px;margin:0 0 15px}\n.atelierWindow>footer{flex:0 0 auto;font-size:11px!important;text-align:center!important;background:#15101d!important;color:#bcaab7!important;padding:10px 16px!important;border-top:1px solid #7e5c573f!important}\n.atelierSplit{display:grid!important;grid-template-columns:minmax(0,1.02fr) minmax(0,1fr)!important;gap:22px!important;align-items:start}\n.atelierPreview{box-sizing:border-box;position:relative;min-height:400px!important;padding:20px!important;overflow:hidden;border:1px solid #80644e!important;border-radius:18px!important;background:radial-gradient(ellipse at 50% 28%,#644456 0%,#2d2538 45%,#1b1a29 100%)!important;box-shadow:inset 0 0 0 8px #15131b60,0 9px 30px #0d0b1399}\n.atelierPreview:before{content:\"✦  THE DRESSMAKER'S MIRROR  ✦\";display:block;position:absolute;top:16px;left:0;width:100%;text-align:center;font:10px Georgia,serif;letter-spacing:.18em;color:#e5c79a;pointer-events:none}\n.atelierPreview:after{content:\"☾\";position:absolute;bottom:15px;right:21px;color:#d5b67c;font-size:25px;opacity:.55;pointer-events:none}\n.atelierFigure{width:min(100%,260px)!important;height:310px!important;margin:auto!important;filter:drop-shadow(0 14px 14px #09070b88)}\n.atelierPreview strong{font:22px Georgia,serif!important;color:#f5d6a1!important;margin-top:2px}\n.atelierPreview small{color:#d7bacb!important}\n.atelierPreview svg#atelierFabricBoard{margin:auto;max-height:345px!important;max-width:300px!important;filter:drop-shadow(0 9px 17px #0b091299)}\n.atelierFields{display:grid!important;gap:12px!important}\n.atelierFields label{display:grid!important;gap:6px!important;font-size:13px!important;color:#ead6d6!important}\n.atelierWindow select,.atelierWindow input{box-sizing:border-box;width:100%!important;min-height:43px!important;color:#fff1e7!important;border:1px solid #866280!important;border-radius:9px!important;background:#32203b!important;padding:9px 13px!important;font-size:14px!important}\n.atelierWindow button{cursor:pointer;max-width:100%;border:1px solid #a48689;border-radius:9px;padding:10px 14px;background:#54374f;color:#fff1e5;font-size:13px;transition:background .15s ease,transform .15s ease}\n.atelierWindow button:hover:not(:disabled){background:#805270!important;transform:translateY(-1px)}\n.atelierWindow button:focus-visible,.atelierWindow select:focus-visible{outline:3px solid #e9ba72!important;outline-offset:2px}\n.atelierWindow button:disabled{opacity:.45;cursor:not-allowed;filter:grayscale(.6)}\n.atelierWindow [data-action=\"craft-step\"],.atelierWindow [data-action=\"save-outfit\"]{background:linear-gradient(110deg,#a47858,#70445b)!important;color:#fff8eb!important;border-color:#dcb982!important;font-weight:700!important}\n.atelierWindow h3{font:24px Georgia,serif!important;color:#f3d2a0!important;margin:10px 0!important}\n.atelierWindow h4{font:19px Georgia,serif!important;color:#f1cea0!important;margin:14px 0 4px!important}\n.atelierWindow .atelierSplit>div:last-child>p{font-size:14px;line-height:1.5;color:#e6d3dc}\n.atelierSaved{display:flex!important;flex-wrap:wrap;gap:10px!important;margin:10px 0}\n.atelierItem{width:100%;display:flex;gap:10px;justify-content:space-between;align-items:center;border:1px solid #806272;border-radius:10px;padding:9px 11px;background:#322239}\n.atelierLaunch{position:fixed;bottom:17px;right:16px;z-index:900;border:1px solid #c9a56c;border-radius:28px;background:#33213e;color:#ffe7b7;padding:11px 16px;box-shadow:0 5px 25px #120c18a9;cursor:pointer}\n.atelierRuneBoard{display:grid;grid-template-columns:repeat(4,1fr);max-width:360px;gap:8px}.atelierRuneBoard button{aspect-ratio:1;font:700 22px Georgia,serif!important}.atelierRuneBoard button.picked{background:#ac8151}\n@media(max-width:720px){.atelierOverlay{padding:7px!important}.atelierWindow{width:100%!important;max-height:97dvh!important;border-radius:13px!important}.atelierWindow>header{padding:12px 17px!important}.atelierWindow>main{padding:17px!important}.atelierWindow>nav{padding:8px!important}.atelierSplit{grid-template-columns:1fr!important}.atelierPreview{min-height:310px!important}.atelierFigure{height:260px!important}.atelierWindow>footer{display:none!important}}\n";document.head.append(polish);
iconButton();document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.MajickAtelier={VERSION,open,close,player,renderAvatar:illustratedAvatar,refresh:render,creditSewing:(key)=>{const p=player();if(!p||!key)return false;p.sewingEarnedKeys=p.sewingEarnedKeys||[];if(p.sewingEarnedKeys.includes(key))return false;p.sewingEarnedKeys.push(key);if(p.sewingEarnedKeys.length>1500)p.sewingEarnedKeys=p.sewingEarnedKeys.slice(-1500);p.sewingCredits=(p.sewingCredits||0)+1;save();if(tab==='sew'&&!document.getElementById('atelierOverlay')?.hidden)render();return true}};
})();
const fittingStyle=document.createElement('style');fittingStyle.textContent=`
.atelierIllustrated{overflow:hidden}
.atelierWindow>nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}
.atelierPortraitCollection{max-width:860px;margin:auto;text-align:center;color:#f4dfcf}
.atelierPortraitCollection h3{color:#f3d39d;margin:0}
.atelierPortraitCollection>p{margin:8px 0}
.atelierPortraitButtons{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:12px 0}
.atelierPortraitButtons button{color:#f8e3cb;background:#38273f;border:1px solid #8f716c;border-radius:9px;padding:10px 16px;cursor:pointer}
.atelierPortraitButtons button[aria-pressed="true"]{background:#745269;border-color:#e4c18b}
.atelierPortraitCollection figure{margin:0;padding:12px;border:1px solid #8f716c;border-radius:18px;background:radial-gradient(ellipse at 50% 35%,#65516a,#261c31 72%)}
.atelierActivityArt{height:clamp(260px,calc(100dvh - 470px),400px);max-width:100%;margin:auto;aspect-ratio:3/4}
.atelierPortraitCollection .atelierActivityArt[data-activity="sleeping"]{width:100%;aspect-ratio:3/2}
.atelierActivityArt img{width:100%;height:100%;object-fit:contain;display:block}
.atelierPortraitCollection figcaption{color:#f6d9a6;margin-top:10px;font-size:19px}
.atelierPortraitNote{font:13px/1.5 system-ui;color:#e7cedc!important}
.mscLarge .atelierActivityArt{height:100%;width:100%;margin:0}
@media(max-width:600px){.atelierWindow>nav{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
.atelierIllustrated[data-footwear="boots"] .atelierArtLayer0{clip-path:inset(0 0 11.73% 0)}
.atelierArtLayer[data-avatar-layer="layer-dress-plum.webp"]{transform:translateY(-5.57%)}
.atelierArtLayer[data-avatar-layer="layer-dress-midnight.webp"]{transform:translateY(-5.57%) scaleX(1.18)}
.atelierArtLayer[data-avatar-layer="layer-dress-emerald-v1.webp"]{inset:auto;left:7.7%;top:11.5%;width:84.4%;height:84.4%;object-fit:fill}
.atelierArtLayer[data-avatar-layer="layer-hair-braids-v2.webp"]{transform:translateY(2.05%) scale(.88,.75);transform-origin:50% 0}
.atelierArtLayer[data-avatar-layer="layer-hair-twists-v2.webp"]{transform:translateY(1.17%) scale(.88,.75);transform-origin:50% 0}
.atelierArtLayer[data-avatar-layer="layer-hair-locs-v2.webp"]{transform:translateY(.73%) scale(.88,.75);transform-origin:50% 0}
.atelierArtLayer[data-avatar-layer="layer-hair-afro-v2.webp"]{transform:translateY(-.5%) scale(.8,.65);transform-origin:50% 0}
.atelierArtLayer[data-avatar-layer="layer-hair-curls-v1.webp"]{transform:translateY(-.2%) scale(.88,.75);transform-origin:50% 0}
.atelierArtLayer[data-avatar-layer="layer-hair-waves-v1.webp"]{transform:translateY(-.5%) scale(.88,.75);transform-origin:50% 0}
.atelierArtLayer[data-avatar-layer="layer-dress-silver-v1.webp"]{inset:auto;left:7.8%;top:14%;width:84.4%;height:84.4%;object-fit:fill}
.atelierArtLayer[data-avatar-layer="layer-boots-plum.webp"]{transform:scaleX(1.25)}
.mscSmall .atelierIllustrated{height:52px;width:auto;margin:0}
.mscLarge .atelierIllustrated{height:100%;width:auto;max-width:100%;margin:auto}
.atelierWindow .atelierIllustrated{height:clamp(230px,calc(100dvh - 340px),460px);width:auto;max-width:100%;margin:auto}
.atelierWindow .atelierPreview:has(.atelierIllustrated){min-height:0!important;align-self:start;position:sticky;top:0}
.atelierWindow .atelierPreviewNotice{color:#f5dfc1!important;background:#291a35;padding:10px;border-radius:10px;line-height:1.5}
@media(max-width:760px){.atelierWindow .atelierPreview:has(.atelierIllustrated){position:relative}}

/* The figure owns the stage; notices must not participate in its horizontal flex layout. */
.atelierWindow .atelierV2Mirror{display:flex!important;flex-direction:column!important;gap:10px;min-width:0}
.atelierWindow .atelierV2Mirror::before{display:none!important;content:none!important}
.atelierWindow .atelierV2Crest{position:relative;flex:0 0 auto;line-height:1.5;padding:0 8px;font-size:12px;letter-spacing:1px}
.atelierWindow .atelierV2Stage{flex:1 1 0;min-height:220px;width:100%;isolation:isolate}
.atelierWindow .atelierV2Figure{min-width:0;width:100%;height:100%;flex:none}
.atelierWindow .atelierV2Figure .atelierIllustrated{flex:0 0 auto;max-width:100%;max-height:100%!important;height:100%!important;aspect-ratio:512/682}
.atelierWindow .atelierPreviewDetails{flex:0 0 auto;width:100%;text-align:left;font:13px/1.4 system-ui}
.atelierWindow .atelierPreviewDetails summary{cursor:pointer;color:#f5dfc1;min-height:30px}
.atelierWindow .atelierPreviewDetails .atelierPreviewNotice{margin:4px 0 0;padding:8px;max-height:90px;overflow:auto}
.atelierWindow .atelierV2Tools,.atelierWindow .atelierV2Focus{flex:0 0 auto}
@media(max-width:800px){.atelierWindow .atelierV2Mirror{height:62dvh;min-height:430px!important}.atelierWindow .atelierV2Stage{min-height:210px}}
`;document.head.append(fittingStyle);
