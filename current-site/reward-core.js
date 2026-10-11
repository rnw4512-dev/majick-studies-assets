(()=>{
'use strict';
const VERSION='3.4.10-reward-core';
const RARITIES=[
 {id:'common',label:'Common',weight:54},
 {id:'enchanted',label:'Enchanted',weight:26},
 {id:'rare',label:'Rare',weight:13},
 {id:'arcane',label:'Arcane',weight:6},
 {id:'celestial',label:'Celestial',weight:1}
];
const INGREDIENTS=[
 {id:'moonpetal',name:'Moonpetal',icon:'❀',rarity:'common'},
 {id:'star-moss',name:'Star Moss',icon:'✦',rarity:'common'},
 {id:'silver-sage',name:'Silver Sage',icon:'☾',rarity:'enchanted'},
 {id:'dream-lavender',name:'Dream Lavender',icon:'✧',rarity:'enchanted'},
 {id:'ember-root',name:'Ember Root',icon:'🔥',rarity:'rare'},
 {id:'celestial-dew',name:'Celestial Dew',icon:'◌',rarity:'rare'},
 {id:'voidberry',name:'Voidberry',icon:'●',rarity:'arcane'},
 {id:'sunstone-dust',name:'Sunstone Dust',icon:'☀',rarity:'arcane'},
 {id:'crystal-nectar',name:'Crystal Nectar',icon:'◇',rarity:'celestial'},
 {id:'aether-thread',name:'Aether Thread',icon:'〰',rarity:'celestial'}
];
const TREASURES=[
 {id:'velvet-study-chair',name:'Velvet Study Chair',kind:'furniture',rarity:'enchanted',icon:'♜'},
 {id:'constellation-rug',name:'Constellation Rug',kind:'furniture',rarity:'rare',icon:'✦'},
 {id:'moon-phase-wall-hanging',name:'Moon-Phase Wall Hanging',kind:'decor',rarity:'enchanted',icon:'☾'},
 {id:'potion-shelf',name:'Potion Shelf',kind:'furniture',rarity:'rare',icon:'⚗'},
 {id:'crystal-lamp',name:'Crystal Lamp',kind:'decor',rarity:'rare',icon:'◇'},
 {id:'floating-book-stack',name:'Floating Book Stack',kind:'decor',rarity:'arcane',icon:'📚'},
 {id:'celestial-telescope',name:'Celestial Telescope',kind:'furniture',rarity:'arcane',icon:'🔭'},
 {id:'guardian-toy-chest',name:'Guardian Toy Chest',kind:'furniture',rarity:'rare',icon:'🎁'},
 {id:'enchanted-fireplace',name:'Enchanted Fireplace',kind:'furniture',rarity:'celestial',icon:'🔥'},
 {id:'moonflower-planter',name:'Moonflower Planter',kind:'decor',rarity:'enchanted',icon:'❀'},
 {id:'canopy-bed-curtains',name:'Canopy-Bed Curtains',kind:'decor',rarity:'rare',icon:'♢'},
 {id:'rune-writing-desk',name:'Rune Writing Desk',kind:'furniture',rarity:'arcane',icon:'⌘'},
 {id:'memory-moon-brooch',name:'Memory Moon Brooch',kind:'accessory',rarity:'rare',icon:'☾'},
 {id:'scholar-rune-circlet',name:"Scholar's Rune Circlet",kind:'accessory',rarity:'arcane',icon:'♛'},
 {id:'fortune-seer-monocle',name:"Fortune-Seer's Monocle",kind:'accessory',rarity:'rare',icon:'◉'},
 {id:'celestial-dice-charm',name:'Celestial Dice Charm',kind:'accessory',rarity:'rare',icon:'⚄'},
 {id:'star-cartographer-glasses',name:'Star Cartographer Glasses',kind:'accessory',rarity:'arcane',icon:'⌖'},
 {id:'probability-scholar-cape',name:'Probability Scholar Cape',kind:'accessory',rarity:'celestial',icon:'✦'}
];
const RECIPES=[
 {id:'clarity-potion',name:'Clarity Potion',icon:'⚗',effect:'Highlights one important clue word.',cost:{'moonpetal':2,'silver-sage':1}},
 {id:'recall-draught',name:'Recall Draught',icon:'☾',effect:'Calls back one older concept for bonus retrieval XP.',cost:{'star-moss':2,'dream-lavender':1}},
 {id:'moonfocus-elixir',name:'Moonfocus Elixir',icon:'✧',effect:'+25% Guardian bond rewards for the next five questions.',cost:{'moonpetal':1,'celestial-dew':1}},
 {id:'crystal-sight-potion',name:'Crystal Sight Potion',icon:'◇',effect:'Previews the misconception family behind one distractor.',cost:{'silver-sage':1,'crystal-nectar':1}},
 {id:'starlight-tonic',name:'Starlight Tonic',icon:'✦',effect:'Adds egg moonlight to the next three independent answers.',cost:{'star-moss':2,'sunstone-dust':1}}
];
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function state(){try{return window.MajickStateCore?.exposeState?.()||window.S||null}catch(_){return window.S||null}}
function account(){
 const st=state();if(!st)return null;
 const a=window.MajickStateCore?.ensureAccount?.()||(st.majickAccount=st.majickAccount||{xp:0,crystals:0,chests:0});
 a.rewardCore=a.rewardCore&&typeof a.rewardCore==='object'?a.rewardCore:{};
 const r=a.rewardCore;
 r.version=VERSION;r.ledger=r.ledger&&typeof r.ledger==='object'?r.ledger:{};
 r.ingredients=r.ingredients&&typeof r.ingredients==='object'?r.ingredients:{};
 r.collectibles=Array.isArray(r.collectibles)?r.collectibles:[];
 r.blueprints=Array.isArray(r.blueprints)?r.blueprints:[];
 r.potions=r.potions&&typeof r.potions==='object'?r.potions:{};
 r.eggFragments=Math.max(0,Number(r.eggFragments||0));
 r.eggsConjured=Math.max(0,Number(r.eggsConjured||0));
 r.masteryXp=Math.max(0,Number(r.masteryXp||0));
 r.lastReceipt=r.lastReceipt||null;
 r.stats=r.stats&&typeof r.stats==='object'?r.stats:{correct:0,independent:0,delayed:0,repairs:0,drops:0};
 return a;
}
function save(){try{window.save?.()}catch(_){}}
function hash(str){
 let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0;
}
function roll01(key,salt=''){return (hash(String(key)+'|'+salt)%100000)/100000}
function pickWeighted(rows,key,salt=''){
 const total=rows.reduce((n,x)=>n+Number(x.weight||1),0),r=roll01(key,salt)*total;let n=0;
 for(const row of rows){n+=Number(row.weight||1);if(r<=n)return row}return rows[rows.length-1];
}
function rarityFor(key,boost=0){
 const adjusted=RARITIES.map((r,i)=>({id:r.id,label:r.label,weight:Math.max(.1,r.weight*(1-(boost*Math.max(0,i-1)*.08)))}));
 const rareBoost=Math.min(.8,boost*.08);
 adjusted[2].weight*=1+rareBoost*2;adjusted[3].weight*=1+rareBoost*3;adjusted[4].weight*=1+rareBoost*5;
 return pickWeighted(adjusted,key,'rarity');
}
function activePet(){
 const rows=(state()?.legacy?.pets||[]).filter(Boolean);if(!rows.length)return null;
 const id=state()?.legacy?.activePetId||account()?.guardianCare?.focusPetId;
 return rows.find(p=>p.id===id)||rows[0];
}
function focusedEgg(){
 const eggs=(state()?.legacy?.eggs||[]).filter(Boolean);if(!eggs.length)return null;
 const id=account()?.guardianIncubator?.focusEggId;
 return eggs.find(e=>e.id===id)||eggs[0];
}
function hatchIfReady(egg){
 if(!egg||Number(egg.progress||0)<Math.max(1,Number(egg.goal||1)))return;
 try{window.MajickCelestialIncubator?.queue?.(egg)}catch(_){}
}
function guardianRewards({correct=true,hard=false,independent=false,delayed=false,eggMoonlight=0,bondBonus=0}={}){
 const st=state(),rows=(st?.legacy?.pets||[]).filter(Boolean),active=activePet();
 const activeXp=correct?(hard?15:10):3,sharedXp=correct?(hard?5:3):1;
 const activeBond=correct?(hard?4:3):1;
 for(const p of rows){
   const isActive=active&&p.id===active.id;
   p.studyXP=Math.max(0,Number(p.studyXP||0))+(isActive?activeXp:sharedXp);
   p.totalStudyXP=Math.max(Number(p.totalStudyXP||0),Number(p.studyXP||0));
   p.bond=Math.max(0,Number(p.bond||0))+(isActive?activeBond+Number(bondBonus||0):correct?1:0);
   p.lastGain=isActive?activeXp:sharedXp;p.lastGainAt=Date.now();
 }
 let moon=correct?(hard?3:2):0;
 if(delayed)moon+=1;
 if(independent&&account()?.rewardCore?.activeEffects?.starlightTonic>0)moon+=1;
 moon+=Number(eggMoonlight||0);
 const egg=focusedEgg();
 if(egg&&moon>0){egg.progress=Math.max(0,Number(egg.progress||0))+moon;hatchIfReady(egg)}
 return {guardian:active?{name:active.name||window.MajickGuardianRegistry?.getFor?.(active)?.name||'Guardian',xp:activeXp,bond:activeBond+Number(bondBonus||0)}:null,egg:egg?{id:egg.id,moonlight:moon,progress:Number(egg.progress||0),goal:Number(egg.goal||1)}:null};
}
function baseFor(type,ctx){
 const d=Math.max(1,Math.min(5,Number(ctx.difficulty||3))),hard=ctx.hard===true||d>=4;
 if(type==='correct-answer'){
   const xp=8+d*3,crystals=hard?2:1;
   return {xp,crystals,masteryXp:0,eggFragments:0,lootChance:.045,hard};
 }
 if(type==='independent-correct')return {xp:5,crystals:0,masteryXp:5,eggFragments:0,lootChance:.09,hard};
 if(type==='delayed-recall')return {xp:8,crystals:1,masteryXp:8,eggFragments:ctx.firstDelayedForLesson?1:0,lootChance:.16,hard:true,extraMoonlight:1};
 if(type==='mixed-transfer-success')return {xp:8,crystals:1,masteryXp:6,eggFragments:0,lootChance:.13,hard:true};
 if(type==='misconception-repaired')return {xp:20,crystals:3,masteryXp:10,eggFragments:1,lootChance:1,hard:true,bondBonus:3,forcedIngredient:true};
 if(type==='micro-skill-mastered')return {xp:12,crystals:1,masteryXp:5,eggFragments:0,lootChance:.18,hard:false,chest:0};
 if(type==='concept-mastered')return {xp:30,crystals:4,masteryXp:15,eggFragments:1,lootChance:1,hard:true,chest:1,minimumRarity:'enchanted'};
 if(type==='lesson-mastered')return {xp:45,crystals:6,masteryXp:20,eggFragments:2,lootChance:1,hard:true,chest:1,minimumRarity:'rare'};
 if(type==='competency-mastered')return {xp:75,crystals:10,masteryXp:30,eggFragments:3,lootChance:1,hard:true,chest:1,minimumRarity:'arcane'};
 if(type==='oa-competency-ready')return {xp:100,crystals:15,masteryXp:40,eggFragments:4,lootChance:1,hard:true,chest:1,minimumRarity:'celestial'};
 if(type==='course-passed')return {xp:250,crystals:40,masteryXp:100,eggFragments:10,lootChance:1,hard:true,chest:3,minimumRarity:'celestial'};
 if(type==='boss-victory')return {xp:45,crystals:8,masteryXp:8,eggFragments:1,lootChance:.45,hard:true,chest:1};
 if(type==='endurance-test')return {xp:35,crystals:10,masteryXp:10,eggFragments:1,lootChance:.35,hard:true,chest:1};
 if(type==='streak-5')return {xp:0,crystals:3,masteryXp:0,eggFragments:0,lootChance:.05,hard:false};
 if(type==='streak-10')return {xp:0,crystals:0,masteryXp:0,eggFragments:0,lootChance:.15,hard:false,chest:1};
 if(type==='weekly-goal')return {xp:30,crystals:5,masteryXp:8,eggFragments:1,lootChance:.35,hard:false};
 return {xp:0,crystals:0,masteryXp:0,eggFragments:0,lootChance:0,hard:false};
}
function rarityRank(id){return ['common','enchanted','rare','arcane','celestial'].indexOf(id)}
function clampRarity(r,min){
 if(!min||rarityRank(r.id)>=rarityRank(min))return r;
 return RARITIES.find(x=>x.id===min)||r;
}
function chooseIngredient(key,rarity){
 let pool=INGREDIENTS.filter(x=>rarityRank(x.rarity)<=rarityRank(rarity.id));
 if(!pool.length)pool=INGREDIENTS.slice(0,2);
 return pool[hash(key+'|ingredient')%pool.length];
}
function chooseTreasure(key,rarity){
 let pool=TREASURES.filter(x=>x.rarity===rarity.id);
 if(!pool.length)pool=TREASURES.filter(x=>rarityRank(x.rarity)<=rarityRank(rarity.id));
 return pool[hash(key+'|treasure')%pool.length]||TREASURES[0];
}
function addCollectible(item){
 const r=account().rewardCore;
 if(item.kind==='furniture'||item.kind==='decor'){
   if(!r.blueprints.includes(item.id))r.blueprints.push(item.id);
 }else if(!r.collectibles.includes(item.id))r.collectibles.push(item.id);
}
function treasureDrop(key,cfg,ctx){
 const r=account().rewardCore,boost=(cfg.hard?1:0)+(ctx.independent?1:0)+(ctx.delayed?1.5:0)+(ctx.transfer?1:0);
 if(!cfg.forcedIngredient&&roll01(key,'drop')>Math.min(.85,Number(cfg.lootChance||0)+(boost*.025)))return null;
 let rarity=clampRarity(rarityFor(key,boost),cfg.minimumRarity);
 const ingredientOnly=cfg.forcedIngredient||roll01(key,'drop-kind')<.55;
 if(ingredientOnly){
   const it=chooseIngredient(key,rarity),qty=rarity.id==='common'?2:1;
   r.ingredients[it.id]=Number(r.ingredients[it.id]||0)+qty;r.stats.drops++;
   return {kind:'ingredient',id:it.id,name:it.name,icon:it.icon,rarity:it.rarity,qty};
 }
 const item=chooseTreasure(key,rarity);addCollectible(item);r.stats.drops++;
 return {kind:item.kind,id:item.id,name:item.name,icon:item.icon,rarity:item.rarity,qty:1};
}
function rewardKey(type,ctx){
 return String(ctx.key||[type,ctx.course||state()?.activeCourse||'',ctx.qid||ctx.conceptId||ctx.lessonId||ctx.competencyId||'',ctx.at||''].join(':'));
}
function updateEffects(){
 const r=account().rewardCore;r.activeEffects=r.activeEffects&&typeof r.activeEffects==='object'?r.activeEffects:{};
 return r.activeEffects;
}
function award(type,ctx={}){
 const a=account();if(!a)return null;const r=a.rewardCore,key=rewardKey(type,ctx);
 if(r.ledger[key])return r.ledger[key].receipt||null;
 const cfg=baseFor(type,ctx),independent=ctx.independent===true||type==='independent-correct',delayed=ctx.delayed===true||type==='delayed-recall',transfer=ctx.transfer===true||type==='mixed-transfer-success';
 const beforeXp=Math.max(Number(a.xp||0),Number(a.xpHighWater||0));
 let xp=Number(cfg.xp||0),crystals=Number(cfg.crystals||0);
 if(type==='correct-answer'&&independent){xp+=5;cfg.masteryXp=Number(cfg.masteryXp||0)+5}
 if(type==='correct-answer'&&delayed){xp+=8;cfg.masteryXp=Number(cfg.masteryXp||0)+8}
 if(type==='correct-answer'&&transfer){xp+=8;crystals+=1;cfg.masteryXp=Number(cfg.masteryXp||0)+6}
 a.xp=beforeXp+xp;
 a.xpHighWater=Math.max(Number(a.xpHighWater||0),Number(a.xp||0));a.lifetimeXpHighWater=a.xpHighWater;
 a.crystals=Math.max(0,Number(a.crystals||0)+crystals);
 const milestoneChest=Math.floor(a.xp/250)>Math.floor(beforeXp/250)?1:0;
 a.chests=Math.max(0,Number(a.chests||0)+Number(cfg.chest||0)+milestoneChest);
 r.masteryXp+=Number(cfg.masteryXp||0);
 r.eggFragments+=Number(cfg.eggFragments||0);
 if(type==='correct-answer')r.stats.correct++;
 if(independent)r.stats.independent++;
 if(delayed)r.stats.delayed++;
 if(type==='misconception-repaired')r.stats.repairs++;
 let gr={guardian:null,egg:null};
 if(type==='correct-answer')gr=guardianRewards({correct:true,hard:cfg.hard,independent,delayed,eggMoonlight:Number(cfg.extraMoonlight||0),bondBonus:Number(cfg.bondBonus||0)});
 else if(type==='misconception-repaired')gr=guardianRewards({correct:false,hard:false,independent:true,delayed:false,eggMoonlight:0,bondBonus:Number(cfg.bondBonus||0)});
 const drop=treasureDrop(key,cfg,{...ctx,independent,delayed,transfer});
 const receipt={
   key,type,label:type.replace(/-/g,' '),xp,crystals,masteryXp:Number(cfg.masteryXp||0),chests:Number(cfg.chest||0),eggFragments:Number(cfg.eggFragments||0),
   guardian:gr.guardian,egg:gr.egg,drop,fragmentTotal:r.eggFragments,conjuresReady:Math.floor(r.eggFragments/10),milestoneChest,chests:Number(cfg.chest||0)+milestoneChest,at:Date.now()
 };
 r.ledger[key]={type,at:receipt.at,receipt};r.lastReceipt=receipt;
 save();showReceipt(receipt);
 try{window.MajickProductCore?.record?.('reward-earned',{type,xp,crystals,eggFragments:receipt.eggFragments,item:drop?.id||null})}catch(_){}
 return receipt;
}
function receiptLines(x){
 const rows=[];if(x.xp)rows.push('+'+x.xp+' Scholar XP');if(x.crystals)rows.push('+'+x.crystals+' Moon Crystal'+(x.crystals===1?'':'s'));
 if(x.masteryXp)rows.push('+'+x.masteryXp+' Mastery XP');
 if(x.guardian)rows.push('+'+x.guardian.xp+' '+x.guardian.name+' Study XP • +'+x.guardian.bond+' Bond');
 if(x.egg&&x.egg.moonlight)rows.push('+'+x.egg.moonlight+' Egg Moonlight');
 if(x.chests)rows.push('+'+x.chests+' '+(x.chests===1?'Treasure Chest':'Treasure Chests'));
 if(x.eggFragments)rows.push('+'+x.eggFragments+' Celestial Egg Fragment'+(x.eggFragments===1?'':'s'));
 return rows;
}
function showReceipt(receipt){
 if(typeof document==='undefined')return;
 document.getElementById('majRewardReceipt')?.remove();
 const host=document.createElement('div');host.id='majRewardReceipt';host.className='majRewardReceipt '+(receipt.drop?'hasDrop':'');
 const rarity=receipt.drop?.rarity||'common';
 host.innerHTML='<section class="majRewardCard '+E(rarity)+'"><div class="majRewardStars">✦ ✧ ✦</div><small>'+E(receipt.type==='misconception-repaired'?'MISCONCEPTION BROKEN':'MAJICK REWARD')+'</small><h3>'+E(receipt.type==='correct-answer'?'Correct — the Collegium responds!':receipt.label.replace(/\b\w/g,m=>m.toUpperCase()))+'</h3>'+
 '<div class="majRewardLines">'+receiptLines(receipt).map(x=>'<span>'+E(x)+'</span>').join('')+'</div>'+
 (receipt.drop?'<div class="majRareDrop"><em>'+E(receipt.drop.rarity.toUpperCase())+'</em><b>'+E(receipt.drop.icon)+' '+E(receipt.drop.name)+(receipt.drop.qty>1?' × '+receipt.drop.qty:'')+'</b><span>Something fell from the spellbook.</span></div>':'')+
 '<footer><span>🥚 Egg fragments: <b>'+receipt.fragmentTotal+'/10</b></span>'+(receipt.conjuresReady?'<button data-maj-conjure>Conjure Egg ✦</button>':'')+'</footer></section>';
 document.body.appendChild(host);
 host.querySelector('[data-maj-conjure]')?.addEventListener('click',()=>showConjuring());
 setTimeout(()=>{if(document.body.contains(host))host.remove()},receipt.drop||receipt.eggFragments?5200:3000);
}
function availableEggTypes(){
 const st=state(),owned=new Set((st?.legacy?.pets||[]).map(p=>String(p.type||''))),eggs=new Set((st?.legacy?.eggs||[]).map(e=>String(e.type||'')));
 const all=(window.MajickGuardianRegistry?.all?.()||[]).map(x=>x.type).filter(Boolean);
 const fresh=all.filter(t=>!owned.has(t)&&!eggs.has(t));return fresh.length?fresh:all.filter(t=>!eggs.has(t)).length?all.filter(t=>!eggs.has(t)):all;
}
function eggMystery(type,key){
 const colors=['amethyst','moon-silver','rose-gold','deep teal','midnight blue','sunrise amber'],auras=['starlight mist','flickering runes','soft lunar fire','tiny orbiting stars','aurora shimmer'],patterns=['constellation speckles','crescent bands','crystal veining','rune spirals','comet streaks'],marks=['The Lantern','The Scholar','The Wanderer','The Crown','The Twin Moons'];
 const pick=(a,s)=>a[hash(key+'|'+s)%a.length];
 return {type,color:pick(colors,'c'),aura:pick(auras,'a'),pattern:pick(patterns,'p'),mark:pick(marks,'m')};
}
function showConjuring(){
 const a=account(),r=a.rewardCore;if(r.eggFragments<10)return;
 document.getElementById('majEggConjure')?.remove();
 const types=availableEggTypes();if(!types.length)return;
 const key='egg-'+r.eggsConjured+'-'+r.eggFragments,m=eggMystery(types[hash(key)%types.length],key);
 const host=document.createElement('div');host.id='majEggConjure';host.className='majConjureBackdrop';
 host.innerHTML='<section class="majConjureDialog"><div class="majConjureSigil">☾✦</div><small>CELESTIAL EGG CONJURING</small><h2>The fragments answer you.</h2><div class="majMysteryEgg '+E(m.color.replace(/\s+/g,'-'))+'">🥚</div><p><b>Aura:</b> '+E(m.aura)+'<br><b>Shell:</b> '+E(m.color)+' with '+E(m.pattern)+'<br><b>Constellation mark:</b> '+E(m.mark)+'</p><p>The species remains hidden until the bond is sealed.</p><button data-seal>Seal the Egg Bond</button><button class="ghost" data-close>Not yet</button></section>';
 document.body.appendChild(host);host.querySelector('[data-close]').onclick=()=>host.remove();
 host.querySelector('[data-seal]').onclick=()=>{conjureEgg(m,key);host.remove()};
}
function conjureEgg(m,key){
 const a=account(),r=a.rewardCore;if(r.eggFragments<10)return null;
 const st=state();st.legacy=st.legacy||{};st.legacy.eggs=Array.isArray(st.legacy.eggs)?st.legacy.eggs:[];
 r.eggFragments-=10;r.eggsConjured++;
 const egg={id:'earned_'+Date.now()+'_'+(hash(key)%9999),type:m.type,progress:0,goal:28,source:'celestial-fragments',createdAt:Date.now(),mystery:{color:m.color,aura:m.aura,pattern:m.pattern,constellationMark:m.mark}};
 st.legacy.eggs.push(egg);a.guardianIncubator=a.guardianIncubator||{version:'3.4.10',focusEggId:null,lastFocusAt:0};a.guardianIncubator.focusEggId=egg.id;a.guardianIncubator.lastFocusAt=Date.now();
 save();
 try{window.rewardToast?.('🥚 Celestial Egg discovered!',m.color+' • '+m.aura+' • Study answers will now grow it.')}catch(_){}
 try{window.render?.()}catch(_){}
 return egg;
}

function rarityLabel(id){return RARITIES.find(x=>x.id===id)?.label||id}
function ingredientName(id){return INGREDIENTS.find(x=>x.id===id)?.name||id}
const vaultFilters={status:'all',kind:'all',rarity:'all'};
function vaultCard(it,owned){
 return '<article class="majVaultItem '+E(it.rarity)+(owned?'':' isLocked')+'"><div class="majVaultItemArt" aria-hidden="true">'+E(it.icon)+'</div><small>'+E(rarityLabel(it.rarity))+' • '+E(it.kind)+'</small><h4>'+E(it.name)+'</h4><p>'+(owned?(it.kind==='accessory'?'Collected accessory':'Blueprint discovered • available in Sanctuary decor'):'Undiscovered • mastery rewards and study treasure can reveal this item')+'</p><b class="majVaultOwnership">'+(owned?'✦ '+(it.kind==='accessory'?'Collected':'Blueprint owned'):'◇ Still to discover')+'</b></article>';
}
function vaultPanelHTML(){
 const inv=inventory(),r=account()?.rewardCore||{},owned=new Set([...inv.collectibles,...inv.blueprints]);
 const ingredients=Object.entries(inv.ingredients).filter(([,n])=>Number(n)>0);
 const finds=TREASURES.filter(it=>(vaultFilters.status==='all'||(vaultFilters.status==='owned'?owned.has(it.id):!owned.has(it.id)))&&(vaultFilters.kind==='all'||it.kind===vaultFilters.kind)&&(vaultFilters.rarity==='all'||it.rarity===vaultFilters.rarity));
 const select=(key,label,options)=>'<label>'+label+'<select onchange="majickVaultFilter(\''+key+'\',this.value)">'+options.map(([v,n])=>'<option value="'+v+'" '+(vaultFilters[key]===v?'selected':'')+'>'+n+'</option>').join('')+'</select></label>';
 const recent=Object.values(r.ledger||{}).map(x=>x.receipt).filter(x=>x?.drop||x?.eggFragments).sort((a,b)=>b.at-a.at).slice(0,4);
 const remaining=Math.max(0,10-inv.eggFragments),ready=Math.floor(inv.eggFragments/10);
 return '<section class="majArcaneVault" id="majArcaneVault"><header><div><small>MAGIC VAULT</small><h2>The treasures of your studies.</h2><p>Explore your discoveries, prepare a potion, and watch your next egg take shape.</p></div><button onclick="majickConjureEgg()" '+(ready?'':'disabled')+'>'+(ready?'✦ Conjure Egg':'🥚 '+remaining+' fragments to your next egg')+'</button></header>'+
 '<div class="majVaultStats"><span>✦ '+TREASURES.filter(it=>owned.has(it.id)).length+' / '+TREASURES.length+' treasures discovered</span><span>◇ '+Object.values(inv.ingredients).reduce((a,b)=>a+Number(b||0),0)+' ingredients</span><span>⚗ '+Object.values(inv.potions).reduce((a,b)=>a+Number(b||0),0)+' potions</span><span>🥚 '+inv.eggFragments+' egg fragments'+(ready?' • '+ready+' conjuring'+(ready===1?'':'s')+' ready':'')+'</span></div>'+
 '<div class="majVaultEggProgress"><label for="majVaultEggMeter">Next egg • '+Math.min(10,inv.eggFragments)+'/10 fragments</label><progress id="majVaultEggMeter" value="'+Math.min(10,inv.eggFragments)+'" max="10"></progress><p>Earn fragments through mastery and learning milestones.</p></div>'+
 '<h3>Your Treasure Collection</h3><div class="majVaultFilters">'+select('status','Discovery',[['all','All treasures'],['owned','Owned'],['locked','Undiscovered']])+select('kind','Item type',[['all','All types'],['furniture','Furniture'],['decor','Decor'],['accessory','Accessories']])+select('rarity','Rarity',[['all','All rarities'],...RARITIES.map(x=>[x.id,x.label])])+'</div><div class="majVaultCollection">'+(finds.length?finds.map(it=>vaultCard(it,owned.has(it.id))).join(''):'<p class="majVaultEmpty">No treasures match these filters. Choose All treasures to explore the collection.</p>')+'</div>'+
 '<div class="majRecipeShelf"><h3>Potion Workshop</h3>'+RECIPES.map(rec=>{const count=Number(inv.potions[rec.id]||0),can=Object.entries(rec.cost).every(([k,n])=>Number(inv.ingredients[k]||0)>=n);return '<div class="majRecipe"><span aria-hidden="true">'+E(rec.icon)+'</span><div><b>'+E(rec.name)+'</b><p>'+E(rec.effect)+'</p><div class="majRecipeCosts">'+Object.entries(rec.cost).map(([k,n])=>{const have=Number(inv.ingredients[k]||0);return '<span class="'+(have>=n?'ready':'missing')+'">'+E(ingredientName(k))+' '+have+'/'+n+(have>=n?' ✓':' • need '+(n-have))+'</span>'}).join('')+'</div></div><aside><button onclick="majickCraftPotion(\''+E(rec.id)+'\')" '+(can?'':'disabled')+'>'+ (can?'Craft potion':'Gather ingredients')+'</button>'+(count?'<button class="use" onclick="majickUsePotion(\''+E(rec.id)+'\')">Use • '+count+' owned</button>':'')+'</aside></div>'}).join('')+'</div>'+
 '<div class="majRecipeShelf"><h3>Ingredient Cabinet</h3><div class="majLootGrid">'+(ingredients.length?ingredients.map(([id,n])=>{const it=INGREDIENTS.find(x=>x.id===id)||{};return '<span class="'+E(it.rarity||'common')+'"><i aria-hidden="true">'+E(it.icon||'✦')+'</i><b>'+E(it.name||id)+'</b><small>'+E(rarityLabel(it.rarity||'common'))+' • '+Number(n)+' owned</small></span>'}).join(''):'<p class="majVaultEmpty">Your cabinet is waiting for its first discovery. Study treasure can reveal magical ingredients.</p>')+'</div></div>'+
 '<div class="majRecipeShelf"><h3>Recent Discoveries</h3>'+(recent.length?recent.map(x=>'<div class="majVaultRecent"><b>'+E(x.drop?x.drop.name:'Celestial Egg Fragments')+'</b><span>'+E(x.label||x.type.replace(/-/g,' '))+(x.drop?' • '+E(rarityLabel(x.drop.rarity)):' • +'+x.eggFragments+' fragments')+'</span></div>').join(''):'<p class="majVaultEmpty">New treasures and egg fragments will appear here as you earn them.</p>')+'</div></section>';
}
window.majickVaultFilter=(key,value)=>{
 const allowed={status:['all','owned','locked'],kind:['all','furniture','decor','accessory'],rarity:['all',...RARITIES.map(x=>x.id)]};
 if(!allowed[key]?.includes(value))return;
 vaultFilters[key]=value;const panel=document.getElementById('majArcaneVault');if(panel){panel.outerHTML=vaultPanelHTML();document.querySelector('#majArcaneVault select[onchange*="'+key+'"]')?.focus()}
};
function patchVault(){
 if(typeof window.vaultHTML!=='function'||window.vaultHTML.__majickRewardVault)return false;
 const old=window.vaultHTML,fn=function(){return old.apply(this,arguments)+vaultPanelHTML()};fn.__majickRewardVault=true;window.vaultHTML=fn;return true;
}

function inventory(){
 const r=account()?.rewardCore||{};
 return {ingredients:{...(r.ingredients||{})},collectibles:[...(r.collectibles||[])],blueprints:[...(r.blueprints||[])],potions:{...(r.potions||{})},eggFragments:Number(r.eggFragments||0),recipes:RECIPES,treasures:TREASURES};
}
function craft(id){
 const a=account(),r=a.rewardCore,rec=RECIPES.find(x=>x.id===id);if(!rec)return {ok:false,message:'Unknown recipe.'};
 for(const [k,n] of Object.entries(rec.cost))if(Number(r.ingredients[k]||0)<n)return {ok:false,message:'You still need '+n+' '+(INGREDIENTS.find(x=>x.id===k)?.name||k)+'.'};
 for(const [k,n] of Object.entries(rec.cost))r.ingredients[k]-=n;r.potions[id]=Number(r.potions[id]||0)+1;save();
 return {ok:true,recipe:rec,count:r.potions[id]};
}
function usePotion(id){
 const a=account(),r=a.rewardCore;if(Number(r.potions[id]||0)<1)return false;r.potions[id]--;const fx=updateEffects();
 if(id==='moonfocus-elixir')fx.moonfocus=5;if(id==='starlight-tonic')fx.starlightTonic=3;if(id==='clarity-potion')fx.clarity=1;if(id==='recall-draught')fx.recall=1;if(id==='crystal-sight-potion')fx.crystalSight=1;save();return true;
}
function rewardPreview(type,ctx={}){const x=baseFor(type,ctx);return {...x,type};}
function patchLegacyGameRewards(){
 if(typeof window.grantMoonlight!=='function'||window.grantMoonlight.__majickRewardCore)return;
 const fn=function(q){
   const combo=Number(window.session?.combo||0),d=Number(q?.difficulty||1),hard=d>=4;
   const receipt=award('correct-answer',{key:'game:'+String(state()?.activeCourse||'')+':'+String(q?.id||'q')+':'+Date.now(),course:state()?.activeCourse,qid:q?.id,difficulty:d,hard,independent:true,source:'game-realm'});
   if(combo>0&&combo%5===0)award('streak-5',{key:'streak5:'+String(state()?.activeCourse||'')+':'+String(q?.id||'q')+':'+combo,source:'combo',difficulty:d});
   if(combo>0&&combo%10===0)award('streak-10',{key:'streak10:'+String(state()?.activeCourse||'')+':'+String(q?.id||'q')+':'+combo,source:'combo',difficulty:d});
   if(window.session)window.session.reward={xp:receipt?.xp||0,cr:receipt?.crystals||0};
   return receipt;
 };fn.__majickRewardCore=true;window.grantMoonlight=fn;
}
function inspect(){const a=account(),r=a?.rewardCore;return {version:VERSION,xp:a?.xp||0,crystals:a?.crystals||0,chests:a?.chests||0,eggFragments:r?.eggFragments||0,ingredients:{...(r?.ingredients||{})},collectibles:[...(r?.collectibles||[])],blueprints:[...(r?.blueprints||[])],stats:{...(r?.stats||{})},lastReceipt:r?.lastReceipt||null}}
window.MajickRewardCore={VERSION,RARITIES,INGREDIENTS,TREASURES,RECIPES,award,rewardPreview,inventory,craft,usePotion,showConjuring,conjureEgg,vaultPanelHTML,patchVault,inspect,patchLegacyGameRewards};
window.majickConjureEgg=()=>showConjuring();
window.majickCraftPotion=id=>{const r=craft(id);try{window.rewardToast?.(r.ok?'⚗ Potion crafted':'Missing ingredients',r.ok?r.recipe.name:r.message)}catch(_){if(!r.ok)alert(r.message)};try{window.render?.()}catch(_){};return r};
window.majickUsePotion=id=>{const ok=usePotion(id);try{window.rewardToast?.(ok?'✦ Potion activated':'No potion available',ok?(RECIPES.find(x=>x.id===id)?.effect||'Magic stirred.'):'Craft one first.')}catch(_){};try{window.render?.()}catch(_){};return ok};
document.documentElement.dataset.majickRewardCore=VERSION;
setTimeout(()=>{patchLegacyGameRewards();patchVault()},0);
})();
