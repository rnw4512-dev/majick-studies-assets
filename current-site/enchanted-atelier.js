(()=>{
'use strict';
const VERSION='3.4.2-atelier-2';
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
function open(){const p=player();if(!p)return;let el=document.getElementById('atelierOverlay');if(!el){el=document.createElement('div');el.id='atelierOverlay';el.className='atelierOverlay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Enchanted Atelier');document.body.append(el)}render();el.hidden=false;el.querySelector('#atelierClose')?.focus()}
function close(){const el=document.getElementById('atelierOverlay');if(el)el.hidden=true}
function select(label,kind,array,current){return '<label>'+E(label)+'<select data-atelier="'+kind+'">'+array.map((v,i)=>'<option value="'+i+'" '+(i===current?'selected':'')+'>'+E(v)+'</option>').join('')+'</select></label>'}
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
function avatar(p){
 const items=sharedVault(p);
 return '<div class="atelierSplit"><div class="atelierPreview">'+layeredAvatar(p)+'<strong>'+E(p.name||'Scholar')+'</strong><small>'+E(ROBES[p.robe])+'</small></div><div class="atelierFields"><label>Scholar name<input data-atelier-name maxlength="26" value="'+E(p.name)+'"></label>'+
 select('Skin tone','skin',SKIN.map((_,i)=>'Tone '+(i+1)),p.skin)+select('Hair','hair',HAIR,p.hair)+select('Robe style','robe',ROBES,p.robe)+select('Outfit color','color',COLORS.map((_,i)=>'Palette '+(i+1)),p.color)+
 '<label>Magic Vault accessories<select data-vault-accessory><option value="">No accessory</option>'+items.map(t=>'<option value="'+E(t.id)+'" '+(t.id===p.accessory?'selected':'')+'>'+E(t.name)+'</option>').join('')+'</select></label>'+
 '<small>'+items.length+' eligible unlocked accessories in the existing Magic Vault. No duplicate purchases or currencies.</small>'+
 '<button data-action="save-outfit">Save this outfit</button><h4>Saved outfits</h4><div class="atelierSaved">'+(p.outfits.length?p.outfits.map((o,i)=>'<button data-outfit="'+i+'">'+E(o.name)+' · '+E(ROBES[o.robe])+'</button>').join(''):'No outfits saved yet.')+'</div></div></div>';
}
function sew(p){
 const stages=['Choose your pattern, fabric and color','Cut the enchanted fabric','Stitch the garment','Add the finishing embroidery'];
 const stage=Math.max(0,Math.min(3,p.craftStage||0));
 return '<p>Complete four interactive tailoring stages to produce your own wearable design. The choices determine the garment; you must finish each stage to craft it.</p>'+
 '<div class="atelierSplit"><div class="atelierPreview">'+layeredAvatar(p)+'</div><div><h3>Step '+(stage+1)+' of 4</h3><p>'+E(stages[stage])+'</p>'+
 (stage===0?'<div class="atelierFields">'+select('Pattern','pattern',PATTERNS,p.pattern)+select('Fabric','fabric',FABRIC,p.fabric)+select('Color','color',COLORS.map((_,i)=>'Palette '+(i+1)),p.color)+'</div>':'')+
 (stage===1?'<div class="atelierCut" aria-label="Fabric cutting area"><div class="atelierFabric" style="background:'+COLORS[p.color]+'">✂ '+E(PATTERNS[p.pattern])+' template</div><p>Check the grain direction and cut the outline.</p></div>':'')+
 (stage===2?'<div class="atelierCut"><p>🪡 Sew the neckline, side seams, and hem in the proper order.</p></div>':'')+
 (stage===3?'<div class="atelierCut"><p>✦ Add a celestial stitch to complete your garment.</p></div>':'')+
 '<button data-action="craft-step">'+['Confirm design →','Cut along pattern →','Stitch seams →','Finish and place in wardrobe'][stage]+'</button>'+
 '<button data-action="reset-craft">Start a different design</button></div></div>'+
 '<h3>Crafted wardrobe ('+p.inventory.length+')</h3><div class="atelierSaved">'+(p.inventory.length?p.inventory.map((x,i)=>'<div class="atelierItem"><b>'+E(x.name)+'</b><button data-equip="'+i+'">'+(p.equipped===i?'Equipped ✓':'Equip')+'</button></div>').join(''):'Finish all tailoring stages to create a wearable item.')+'</div>';
}
function board(){let seed=BOARD[round%BOARD.length].split('');const others='ETASRIONDLPC';while(seed.length<16)seed.push(others[(round*7+seed.length*5)%others.length]);return seed}
function rune(p){const tiles=board();return '<p>Trace adjacent letters to make words of three or more letters. Your path may not reuse a tile. This is a vocabulary warm-up, not an OA mastery score.</p><div class="atelierRuneBoard">'+tiles.map((c,i)=>'<button data-cell="'+i+'" class="'+(chosen.includes(i)?'picked':'')+'">'+c+'</button>').join('')+'</div><p><b>Word:</b> '+E(chosen.map(i=>tiles[i]).join(''))+'</p><div class="atelierActions"><button data-action="submit-word">Submit word</button><button data-action="clear-word">Clear selection</button><button data-action="next-round">New board</button></div><p aria-live="polite">'+E(feedback)+'</p><p><b>Words found this round:</b> '+(found.length?found.map(E).join(' · '):'None yet')+'</p><p>Lifetime valid words: '+p.runeWords+' · Boards played: '+p.runeRounds+'</p>'}
function render(){const el=document.getElementById('atelierOverlay'),p=player();if(!el||!p)return;el.innerHTML='<div class="atelierWindow"><header><div><small>THE MOONLIT COLLEGIUM</small><h2>✦ Enchanted Atelier</h2><p>Create your witch, tailor a wardrobe, and weave rune words.</p></div><button id="atelierClose" aria-label="Close atelier">✕</button></header><nav>'+[['avatar','Avatar & Outfits'],['sew','Dressmaking'],['rune','Runeweaver']].map(([k,l])=>'<button data-tab="'+k+'" aria-pressed="'+(tab===k)+'">'+l+'</button>').join('')+'</nav><main>'+(tab==='avatar'?avatar(p):tab==='sew'?sew(p):rune(p))+'</main><footer>One scholar identity · No duplicate XP or mastery engine · Saved with your app progress</footer></div>';bind(el)}
function bind(el){el.querySelector('#atelierClose')?.addEventListener('click',close);el.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;render()}));el.querySelectorAll('[data-atelier]').forEach(c=>c.addEventListener('change',()=>{player()[c.dataset.atelier]=Number(c.value);save();render()}));el.querySelector('[data-atelier-name]')?.addEventListener('change',e=>{player().name=e.target.value.trim().slice(0,26)||'Scholar';save();render()});el.querySelector('[data-vault-accessory]')?.addEventListener('change',e=>{player().accessory=e.target.value||null;save();render()});el.querySelectorAll('[data-outfit]').forEach(b=>b.addEventListener('click',()=>{const o=player().outfits[Number(b.dataset.outfit)];Object.assign(player(),{hair:o.hair,skin:o.skin,robe:o.robe,color:o.color,accessory:o.accessory||null,equipped:o.equipped??null});save();render()}));el.querySelectorAll('[data-equip]').forEach(b=>b.addEventListener('click',()=>{player().equipped=Number(b.dataset.equip);save();render()}));el.querySelectorAll('[data-cell]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.cell),last=chosen.at(-1);if(chosen.includes(i))return;if(last!==undefined&&Math.max(Math.abs(Math.floor(last/4)-Math.floor(i/4)),Math.abs(last%4-i%4))!==1){feedback='Choose an adjacent letter.';render();return}chosen.push(i);feedback='';render()}));el.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.action)))}
function act(type){const p=player();if(type==='save-outfit'){p.outfits.push({name:'Look '+(p.outfits.length+1),skin:p.skin,hair:p.hair,robe:p.robe,color:p.color,accessory:p.accessory,equipped:p.equipped});save()}if(type==='craft-step'){if((p.craftStage||0)<3)p.craftStage++;else{p.inventory.push({name:FABRIC[p.fabric]+' '+PATTERNS[p.pattern],pattern:p.pattern,fabric:p.fabric,color:p.color});p.equipped=p.inventory.length-1;p.craftStage=0;}save()}if(type==='reset-craft'){p.craftStage=0;save()}if(type==='clear-word'){chosen=[];feedback='Selection cleared.'}if(type==='next-round'){round++;p.runeRounds++;chosen=[];found=[];feedback='New rune board ready.';save()}if(type==='submit-word'){const word=chosen.map(i=>board()[i]).join('');if(word.length<3)feedback='Choose at least three connected letters.';else if(found.includes(word))feedback='You already found that word.';else if(!DICTIONARY.has(word))feedback='That is not in the current Runeweaver word list. Try a common word.';else{found.push(word);p.runeWords++;feedback='Word recorded: '+word+'. Try another word!';save()}chosen=[]}render()}
const style=document.createElement('style');style.textContent='.atelierFigure{width:min(100%,240px);height:310px;display:block;margin:auto;filter:drop-shadow(0 10px 12px #0009)}.atelierCut{border:1px dashed #bca578;border-radius:12px;padding:16px;margin:12px 0}.atelierFabric{min-height:120px;display:grid;place-items:center;border:2px dashed #e5cca2;border-radius:8px;color:#fff;font-weight:800}.atelierLaunch{position:fixed;bottom:17px;right:16px;z-index:900;border:1px solid #c9a56c;border-radius:28px;background:#33213e;color:#ffe7b7;padding:11px 16px;box-shadow:0 5px 25px #120c18a9;cursor:pointer}.atelierOverlay{position:fixed;inset:0;background:#0d0a13df;z-index:1500;display:grid;place-items:center;padding:16px}.atelierOverlay[hidden]{display:none}.atelierWindow{width:min(790px,100%);max-height:93vh;overflow:auto;background:#211b31;color:#f7e9d6;border:2px solid #b69a6b;border-radius:20px;padding:18px;box-shadow:0 12px 60px #000b}.atelierWindow header{display:flex;justify-content:space-between;align-items:start}.atelierWindow header h2{margin:2px 0}.atelierWindow header p{margin:3px 0 10px}.atelierWindow button,.atelierWindow select,.atelierWindow input{border:1px solid #a58fba;border-radius:8px;padding:9px;background:#473651;color:#fff;cursor:pointer}.atelierWindow nav,.atelierActions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.atelierWindow nav [aria-pressed=true],.atelierWindow button:hover{background:#795b88}.atelierWindow main{padding:12px 3px}.atelierSplit{display:grid;grid-template-columns:minmax(170px,1fr) minmax(190px,1.2fr);gap:20px}.atelierPreview{background:radial-gradient(#574064,#1a1627);border-radius:12px;min-height:370px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px}.atelierHair{font-size:15px;letter-spacing:3px;color:#e5c5a3}.atelierFace{height:95px;width:86px;border-radius:45% 45% 48% 48%;font-size:54px;text-align:center;color:#241b22}.atelierRobe{height:140px;width:130px;border-radius:45% 45% 15% 15%;font-size:28px;line-height:43px;text-align:center;border:4px solid #bba177;color:#eddaae}.atelierFields{display:grid;gap:10px}.atelierFields label{display:grid;gap:4px}.atelierSaved{display:flex;flex-wrap:wrap;gap:8px}.atelierItem{width:100%;display:flex;justify-content:space-between;align-items:center;padding:7px;border-bottom:1px solid #71627d}.atelierRuneBoard{display:grid;grid-template-columns:repeat(4,1fr);max-width:360px;gap:7px}.atelierRuneBoard button{aspect-ratio:1;font-size:22px;font-weight:700}.atelierRuneBoard button.picked{background:#a78151}.atelierWindow footer{font-size:12px;color:#d4bb9e;border-top:1px solid #65516d;padding-top:12px}@media(max-width:550px){.atelierSplit{grid-template-columns:1fr}.atelierLaunch{bottom:8px;right:8px}}';document.head.append(style);
iconButton();document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.MajickAtelier={VERSION,open,close,player};
})();