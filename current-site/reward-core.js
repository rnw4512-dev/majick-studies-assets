(()=>{
'use strict';
const VERSION='3.4.2-guardian-collections';
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
TREASURES.push(...[{"id": "solstice-reading-chaise", "name": "Solstice’s Reading Chaise", "kind": "furniture", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/reading-chaise.webp", "collection": "solstice"}, {"id": "solstice-star-pouf", "name": "Solstice’s Star Pouf", "kind": "furniture", "rarity": "enchanted", "icon": "☾", "image": "assets/rewards/solstice/items/star-pouf.webp", "collection": "solstice"}, {"id": "solstice-explorer-telescope", "name": "Solstice’s Explorer Telescope", "kind": "furniture", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/explorer-telescope.webp", "collection": "solstice"}, {"id": "solstice-starlight-hammock", "name": "Solstice’s Starlight Hammock", "kind": "furniture", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/starlight-hammock.webp", "collection": "solstice"}, {"id": "solstice-galaxy-vanity", "name": "Solstice’s Galaxy Vanity", "kind": "furniture", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/galaxy-vanity.webp", "collection": "solstice"}, {"id": "solstice-nebula-bowl", "name": "Solstice’s Nebula Bowl", "kind": "decor", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/nebula-bowl.webp", "collection": "solstice"}, {"id": "solstice-solar-orrery", "name": "Solstice’s Solar Orrery", "kind": "toy", "rarity": "celestial", "icon": "✧", "image": "assets/rewards/solstice/items/solar-orrery.webp", "collection": "solstice"}, {"id": "solstice-astronomy-bookshelf", "name": "Solstice’s Astronomy Bookshelf", "kind": "furniture", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/astronomy-bookshelf.webp", "collection": "solstice"}, {"id": "solstice-fox-star-den", "name": "Solstice’s Fox Star Den", "kind": "furniture", "rarity": "celestial", "icon": "☾", "image": "assets/rewards/solstice/items/fox-star-den.webp", "collection": "solstice"}, {"id": "solstice-constellation-rug", "name": "Solstice’s Constellation Rug", "kind": "furniture", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/constellation-rug.webp", "collection": "solstice"}, {"id": "solstice-exploration-chest", "name": "Solstice’s Exploration Chest", "kind": "toy", "rarity": "rare", "icon": "✧", "image": "assets/rewards/solstice/items/exploration-chest.webp", "collection": "solstice"}, {"id": "solstice-planet-climbing-tower", "name": "Solstice’s Planet Climbing Tower", "kind": "toy", "rarity": "rare", "icon": "✧", "image": "assets/rewards/solstice/items/planet-climbing-tower.webp", "collection": "solstice"}, {"id": "solstice-amber-canopy-bed", "name": "Solstice’s Amber Canopy Bed", "kind": "furniture", "rarity": "celestial", "icon": "☾", "image": "assets/rewards/solstice/items/amber-canopy-bed.webp", "collection": "solstice"}, {"id": "solstice-star-perch-tree", "name": "Solstice’s Star Perch Tree", "kind": "toy", "rarity": "rare", "icon": "✧", "image": "assets/rewards/solstice/items/star-perch-tree.webp", "collection": "solstice"}, {"id": "solstice-moon-writing-desk", "name": "Solstice’s Moon Writing Desk", "kind": "furniture", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/moon-writing-desk.webp", "collection": "solstice"}, {"id": "solstice-fox-ear-reading-chair", "name": "Solstice’s Fox-Ear Reading Chair", "kind": "furniture", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/fox-ear-reading-chair.webp", "collection": "solstice"}, {"id": "solstice-crescent-lantern", "name": "Solstice’s Crescent Lantern", "kind": "decor", "rarity": "enchanted", "icon": "☾", "image": "assets/rewards/solstice/items/crescent-lantern.webp", "collection": "solstice"}, {"id": "solstice-astral-doorway", "name": "Solstice’s Astral Doorway", "kind": "decor", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/astral-doorway.webp", "collection": "solstice"}, {"id": "solstice-galaxy-folding-screen", "name": "Solstice’s Galaxy Folding Screen", "kind": "furniture", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/galaxy-folding-screen.webp", "collection": "solstice"}, {"id": "solstice-orbit-play-ball", "name": "Solstice’s Orbit Play Ball", "kind": "toy", "rarity": "enchanted", "icon": "✧", "image": "assets/rewards/solstice/items/orbit-play-ball.webp", "collection": "solstice"}, {"id": "solstice-star-charm-rack", "name": "Solstice’s Star Charm Rack", "kind": "toy", "rarity": "rare", "icon": "✧", "image": "assets/rewards/solstice/items/star-charm-rack.webp", "collection": "solstice"}, {"id": "solstice-solar-circlet", "name": "Solstice’s Solar Circlet", "kind": "accessory", "rarity": "celestial", "icon": "✦", "image": "assets/rewards/solstice/items/solar-circlet.webp", "collection": "solstice"}, {"id": "solstice-moon-collar", "name": "Solstice’s Moon Collar", "kind": "accessory", "rarity": "enchanted", "icon": "✦", "image": "assets/rewards/solstice/items/moon-collar.webp", "collection": "solstice"}, {"id": "solstice-nebula-wand", "name": "Solstice’s Nebula Wand", "kind": "accessory", "rarity": "arcane", "icon": "✦", "image": "assets/rewards/solstice/items/nebula-wand.webp", "collection": "solstice"}, {"id": "solstice-star-glasses", "name": "Solstice’s Star Glasses", "kind": "accessory", "rarity": "rare", "icon": "✦", "image": "assets/rewards/solstice/items/star-glasses.webp", "collection": "solstice"}, {"id": "solstice-orbit-bracelet", "name": "Solstice’s Orbit Bracelet", "kind": "accessory", "rarity": "rare", "icon": "✦", "image": "assets/rewards/solstice/items/orbit-bracelet.webp", "collection": "solstice"}, {"id": "solstice-explorer-satchel", "name": "Solstice’s Explorer Satchel", "kind": "accessory", "rarity": "rare", "icon": "✦", "image": "assets/rewards/solstice/items/explorer-satchel.webp", "collection": "solstice"}, {"id": "solstice-galaxy-cape", "name": "Solstice’s Galaxy Cape", "kind": "accessory", "rarity": "celestial", "icon": "✦", "image": "assets/rewards/solstice/items/galaxy-cape.webp", "collection": "solstice"}, {"id": "solstice-astronomy-book-stack", "name": "Solstice’s Astronomy Book Stack", "kind": "decor", "rarity": "enchanted", "icon": "☾", "image": "assets/rewards/solstice/items/astronomy-book-stack.webp", "collection": "solstice"}, {"id": "solstice-planet-mobile", "name": "Solstice’s Planet Mobile", "kind": "decor", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/planet-mobile.webp", "collection": "solstice"}, {"id": "solstice-starlight-tea-table", "name": "Solstice’s Starlight Tea Table", "kind": "furniture", "rarity": "rare", "icon": "☾", "image": "assets/rewards/solstice/items/starlight-tea-table.webp", "collection": "solstice"}, {"id": "solstice-cosmic-orbit-puzzle", "name": "Solstice’s Cosmic Orbit Puzzle", "kind": "toy", "rarity": "arcane", "icon": "✧", "image": "assets/rewards/solstice/items/cosmic-orbit-puzzle.webp", "collection": "solstice"}, {"id": "solstice-sun-globe-lamp", "name": "Solstice’s Sun Globe Lamp", "kind": "decor", "rarity": "arcane", "icon": "☾", "image": "assets/rewards/solstice/items/sun-globe-lamp.webp", "collection": "solstice"}, {"id": "solstice-celestial-fox-gateway", "name": "Solstice’s Celestial Fox Gateway", "kind": "decor", "rarity": "celestial", "icon": "☾", "image": "assets/rewards/solstice/items/celestial-fox-gateway.webp", "collection": "solstice"}]);
for(const it of [{"id": "aurelia-bunny-ear-reading-chair", "name": "Aurelia’s Bunny-Ear Reading Chair", "kind": "furniture", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/bunny-ear-reading-chair.webp"}, {"id": "aurelia-wingback-reading-chaise", "name": "Aurelia’s Wingback Reading Chaise", "kind": "furniture", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/wingback-reading-chaise.webp"}, {"id": "aurelia-quilted-ruby-canopy-bed", "name": "Aurelia’s Quilted Ruby Canopy Bed", "kind": "furniture", "rarity": "celestial", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/quilted-ruby-canopy-bed.webp"}, {"id": "aurelia-burrow-hammock", "name": "Aurelia’s Burrow Hammock", "kind": "furniture", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/burrow-hammock.webp"}, {"id": "aurelia-velvet-footstool", "name": "Aurelia’s Velvet Footstool", "kind": "furniture", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/velvet-footstool.webp"}, {"id": "aurelia-scholar-writing-desk", "name": "Aurelia’s Scholar Writing Desk", "kind": "furniture", "rarity": "arcane", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/scholar-writing-desk.webp"}, {"id": "aurelia-arched-bookcase", "name": "Aurelia’s Arched Bookcase", "kind": "furniture", "rarity": "enchanted", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/arched-bookcase.webp"}, {"id": "aurelia-rose-crystal-lamp", "name": "Aurelia’s Rose Crystal Lamp", "kind": "decor", "rarity": "enchanted", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/rose-crystal-lamp.webp"}, {"id": "aurelia-wing-framed-moon-mirror", "name": "Aurelia’s Wing-Framed Moon Mirror", "kind": "decor", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/wing-framed-moon-mirror.webp"}, {"id": "aurelia-feather-lantern", "name": "Aurelia’s Feather Lantern", "kind": "decor", "rarity": "arcane", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/feather-lantern.webp"}, {"id": "aurelia-flowering-sage-planter", "name": "Aurelia’s Flowering Sage Planter", "kind": "decor", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/flowering-sage-planter.webp"}, {"id": "aurelia-feeding-and-water-station", "name": "Aurelia’s Feeding and Water Station", "kind": "decor", "rarity": "enchanted", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/feeding-and-water-station.webp"}, {"id": "aurelia-potion-apothecary", "name": "Aurelia’s Potion Apothecary", "kind": "decor", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/potion-apothecary.webp"}, {"id": "aurelia-wing-embroidered-rug", "name": "Aurelia’s Wing-Embroidered Rug", "kind": "decor", "rarity": "arcane", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/wing-embroidered-rug.webp"}, {"id": "aurelia-rose-tea-table", "name": "Aurelia’s Rose Tea Table", "kind": "toy", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/rose-tea-table.webp"}, {"id": "aurelia-feather-play-wand", "name": "Aurelia’s Feather Play Wand", "kind": "toy", "rarity": "enchanted", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/feather-play-wand.webp"}, {"id": "aurelia-rune-play-ball", "name": "Aurelia’s Rune Play Ball", "kind": "toy", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/rune-play-ball.webp"}, {"id": "aurelia-treat-puzzle-carousel", "name": "Aurelia’s Treat Puzzle Carousel", "kind": "toy", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/treat-puzzle-carousel.webp"}, {"id": "aurelia-bunny-toy-trunk", "name": "Aurelia’s Bunny Toy Trunk", "kind": "toy", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/bunny-toy-trunk.webp"}, {"id": "aurelia-hopping-stones", "name": "Aurelia’s Hopping Stones", "kind": "toy", "rarity": "rare", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/hopping-stones.webp"}, {"id": "aurelia-rose-and-star-mobile", "name": "Aurelia’s Rose and Star Mobile", "kind": "toy", "rarity": "arcane", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/rose-and-star-mobile.webp"}, {"id": "aurelia-ruby-rose-circlet", "name": "Aurelia’s Ruby Rose Circlet", "kind": "accessory", "rarity": "celestial", "icon": "✦", "collection": "aurelia", "image": "assets/rewards/aurelia/items/ruby-rose-circlet.webp"}, {"id": "aurelia-sage-moon-collar", "name": "Aurelia’s Sage Moon Collar", "kind": "accessory", "rarity": "enchanted", "icon": "✦", "collection": "aurelia", "image": "assets/rewards/aurelia/items/sage-moon-collar.webp"}, {"id": "aurelia-scholar-glasses", "name": "Aurelia’s Scholar Glasses", "kind": "accessory", "rarity": "rare", "icon": "✦", "collection": "aurelia", "image": "assets/rewards/aurelia/items/scholar-glasses.webp"}, {"id": "aurelia-wing-and-petal-cloak", "name": "Aurelia’s Wing-and-Petal Cloak", "kind": "accessory", "rarity": "celestial", "icon": "✦", "collection": "aurelia", "image": "assets/rewards/aurelia/items/wing-and-petal-cloak.webp"}, {"id": "aurelia-scholar-satchel", "name": "Aurelia’s Scholar Satchel", "kind": "accessory", "rarity": "rare", "icon": "✦", "collection": "aurelia", "image": "assets/rewards/aurelia/items/scholar-satchel.webp"}, {"id": "aurelia-rose-heart-arcane-orb", "name": "Aurelia’s Rose-Heart Arcane Orb", "kind": "decor", "rarity": "arcane", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/rose-heart-arcane-orb.webp"}, {"id": "aurelia-celestial-rabbit-dream-altar", "name": "Aurelia’s Celestial Rabbit Dream Altar", "kind": "decor", "rarity": "celestial", "icon": "☾", "collection": "aurelia", "image": "assets/rewards/aurelia/items/celestial-rabbit-dream-altar.webp"}])if(!TREASURES.some(t=>t.id===it.id))TREASURES.push(it);
const ITEM_ART={"velvet-study-chair": "assets/rewards/items/velvet-study-chair.webp", "constellation-rug": "assets/rewards/items/constellation-rug.webp", "moon-phase-wall-hanging": "assets/rewards/items/moon-phase-wall-hanging.webp", "potion-shelf": "assets/rewards/items/potion-shelf.webp", "crystal-lamp": "assets/rewards/items/crystal-lamp.webp", "floating-book-stack": "sanctuary/assets/runtime-objects/enchanted-bookstack.webp", "celestial-telescope": "sanctuary/assets/runtime-objects/celestial-telescope.webp", "guardian-toy-chest": "assets/rewards/items/guardian-toy-chest.webp", "enchanted-fireplace": "assets/rewards/items/enchanted-fireplace.webp", "moonflower-planter": "assets/rewards/items/moonflower-planter.webp", "canopy-bed-curtains": "assets/rewards/items/canopy-bed-curtains.webp", "rune-writing-desk": "sanctuary/assets/runtime-objects/moonlit-study-desk.webp", "memory-moon-brooch": "assets/rewards/items/memory-moon-brooch.webp", "scholar-rune-circlet": "assets/rewards/items/scholar-rune-circlet.webp", "fortune-seer-monocle": "assets/rewards/items/fortune-seer-monocle.webp", "celestial-dice-charm": "assets/rewards/items/celestial-dice-charm.webp", "star-cartographer-glasses": "assets/rewards/items/star-cartographer-glasses.webp", "probability-scholar-cape": "assets/rewards/items/probability-scholar-cape.webp"};
for(const item of TREASURES){if(item.image)ITEM_ART[item.id]=item.image;else item.image=ITEM_ART[item.id];}
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
 save();pushRewardState();showReceipt(receipt);
 if(['concept-mastered','lesson-mastered','competency-mastered','oa-competency-ready','course-passed'].includes(type)){
   if(typeof document!=='undefined'&&typeof CustomEvent==='function')document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{type:type==='course-passed'?'course':'mastery',key,course:ctx.course||window.S?.activeCourse||'',verified:true}}));
 }
 // Emit visual-only feedback only after the authoritative one-time ledger write.
 const milestone={'micro-skill-mastered':'success','concept-mastered':'mastery','lesson-mastered':'lesson','competency-mastered':'mastery','oa-competency-ready':'mastery','course-passed':'course','misconception-repaired':'guardian'}[type];
 if(milestone)try{window.MajickAnimationEffects?.play?.(milestone,{label:type==='course-passed'?'Course completed':type==='lesson-mastered'?'Lesson mastered':type==='misconception-repaired'?'Reasoning repaired':receipt.label})}catch(_){}

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
let vaultTab='treasures',vaultPage=0,vaultLegacyHTML='';
const VAULT_PAGE_SIZE=4;
const VAULT_TABS=[['treasures','Treasures'],['potions','Potions'],['ingredients','Ingredients'],['eggs','Eggs'],['recent','Recent Finds'],['shop','Shop & Chests']];
const vaultFilters={status:'all',kind:'all',rarity:'all',collection:'all'};
function roomState(){
 const r=account()?.rewardCore;if(!r)return {stored:[],positions:{}};
 if(!r.sanctuary)return null;
 return r.sanctuary;
}
function refreshVault(){const panel=document.getElementById('majArcaneVault');if(panel)panel.outerHTML=vaultPanelHTML()}
function equippedItem(p){const it=TREASURES.find(x=>x.id===p?.rewardAccessoryId);return it&&p.accessory===it.icon+' '+it.name?it.id:null}
function equipment(){return (state()?.legacy?.pets||[]).map(p=>({petId:p.id,type:p.type,itemId:equippedItem(p),accessory:p.accessory||''}))}
function pushRewardState(target){
 const payload={type:'MAJICK_REWARD_INVENTORY',inventory:inventory(),room:roomState(),equipment:equipment()};
 const frames=target?[target]:[...document.querySelectorAll('.v3317SanctuaryFrame,#phase4SanctuaryFrame')].map(f=>f.contentWindow);
 for(const frame of frames)try{frame?.postMessage(payload,location.origin)}catch(_){}
}
function placeReward(id,stored=false){
 const it=TREASURES.find(x=>x.id===id),r=account()?.rewardCore;
 if(!it||it.kind==='accessory'||!r?.blueprints.includes(id))return false;
 r.sanctuary=r.sanctuary||{stored:[],positions:{}};
 const rows=new Set(r.sanctuary.stored||[]);if(stored)rows.add(id);else rows.delete(id);r.sanctuary.stored=[...rows];
 save();pushRewardState();refreshVault();return true;
}
function equipReward(id,petId,remove=false){
 const it=TREASURES.find(x=>x.id===id),r=account()?.rewardCore,p=(state()?.legacy?.pets||[]).find(x=>x.id===petId);
 if(!p||it?.kind!=='accessory'||!r?.collectibles.includes(id))return false;
 if(remove){if(equippedItem(p)!==id)return false;p.rewardAccessoryId=null;p.accessory=''}
 else {p.rewardAccessoryId=id;p.accessory=it.icon+' '+it.name}
 save();window.MajickGuardianCare?.broadcastState?.();pushRewardState();refreshVault();return true;
}
function vaultCard(it,owned){
 const pet=activePet(),room=roomState(),stored=room?.stored?.includes(it.id),isEquipped=equippedItem(pet)===it.id,wearers=(state()?.legacy?.pets||[]).filter(p=>equippedItem(p)===it.id);
 const action=owned?(it.kind==='accessory'?'<label class="majEquipTarget">Guardian<select data-equip-target="'+E(it.id)+'">'+(state()?.legacy?.pets||[]).map(p=>'<option value="'+E(p.id)+'" '+(p.id===pet?.id?'selected':'')+'>'+E(p.name||window.MajickGuardianRegistry?.getFor?.(p)?.name||'Guardian')+'</option>').join('')+'</select></label><button type="button" data-equip-item="'+E(it.id)+'" '+(pet?'':'disabled')+'>'+(pet?'Equip':'Hatch a Guardian first')+'</button>'+wearers.map(p=>'<button type="button" data-unequip-item="'+E(it.id)+'" data-pet-id="'+E(p.id)+'">Unequip '+E(p.name||'Guardian')+'</button>').join(''):'<button type="button" data-place-item="'+E(it.id)+'" data-stored="'+(!stored)+'">'+(stored?'Place in Sanctuary':'Store item')+'</button><button type="button" onclick="navigate(\'companions\')">Open Sanctuary</button>'):'';
 return '<article class="majVaultItem '+E(it.rarity)+(owned?'':' isLocked')+'"><button type="button" class="majVaultItemArt" data-preview-item="'+E(it.id)+'" aria-label="Preview '+E(it.name)+'"><img src="'+E(it.image)+'" alt="'+E(it.name)+'" loading="lazy"></button><small>'+E(rarityLabel(it.rarity))+' • '+E(it.kind)+'</small><h4>'+E(it.name)+'</h4><p>'+(owned?(it.kind==='accessory'?'Choose a bonded Guardian to wear this treasure.':stored?'Stored safely. Place it to decorate your room.':'Placed in your Sanctuary. Use Edit Room to arrange it.'):'Undiscovered • mastery rewards and study treasure can reveal this item')+'</p><b class="majVaultOwnership">'+(owned?'✦ '+(it.kind==='accessory'?(wearers.length?'Equipped on '+wearers.map(p=>p.name||'Guardian').join(', '):'Collected'):stored?'Stored':'Placed'):'◇ Still to discover')+'</b><div class="majVaultItemActions">'+action+'</div></article>';
}
window.addEventListener('message',ev=>{
 if(ev.origin!==location.origin||![...document.querySelectorAll('.v3317SanctuaryFrame,#phase4SanctuaryFrame')].some(f=>f.contentWindow===ev.source))return;
 const d=ev.data||{};
 if(d.type==='MAJICK_SANCTUARY_READY'||d.type==='MAJICK_REWARD_REQUEST'){pushRewardState(ev.source);return}
 if(d.type==='MAJICK_REWARD_ROOM_EDIT'){
  const r=account()?.rewardCore;if(!r)return;
  if(d.id){if(!r.blueprints.includes(d.id))return;if(typeof d.stored==='boolean'){placeReward(d.id,d.stored);return}
   const pos=d.position;if(!pos||!['x','y','scale','rotation'].every(k=>Number.isFinite(pos[k])))return;
   r.sanctuary=r.sanctuary||{stored:[],positions:{}};r.sanctuary.positions[d.id]={x:Math.max(70,Math.min(2400,pos.x)),y:Math.max(180,Math.min(930,pos.y)),scale:Math.max(.2,Math.min(2,pos.scale)),rotation:pos.rotation};
  }else if(d.room&&!r.sanctuary){const valid=new Set(r.blueprints);r.sanctuary={stored:(d.room.stored||[]).filter(id=>valid.has(id)),positions:{}};for(const [id,v] of Object.entries(d.room.positions||{}))if(valid.has(id)&&['x','y','scale','rotation'].every(k=>Number.isFinite(v[k])))r.sanctuary.positions[id]=v}
  save();pushRewardState();refreshVault();
 }
});
function previewItem(id){
 const it=TREASURES.find(x=>x.id===id);if(!it)return;
 document.getElementById('majItemPreview')?.remove();
 const dialog=document.createElement('dialog');dialog.id='majItemPreview';dialog.className='majItemPreview';dialog.setAttribute('aria-labelledby','majItemPreviewTitle');
 dialog.innerHTML='<button type="button" class="majPreviewClose" autofocus aria-label="Close artwork preview">✕ Close</button><img src="'+E(it.image)+'" alt="'+E(it.name)+'"><h3 id="majItemPreviewTitle">'+E(it.name)+'</h3><p>'+E(rarityLabel(it.rarity))+' • '+E(it.kind)+'</p>';
 document.body.appendChild(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{dialog.remove();document.querySelector('[data-preview-item="'+id+'"]')?.focus()});dialog.showModal();
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest?.('[data-place-item],[data-equip-item],[data-unequip-item],[data-preview-item]');if(!b)return;
 if(b.dataset.previewItem){previewItem(b.dataset.previewItem);return}
 if(b.dataset.placeItem)placeReward(b.dataset.placeItem,b.dataset.stored==='true');
 if(b.dataset.equipItem){const id=b.dataset.equipItem,select=document.querySelector('[data-equip-target="'+id+'"]');equipReward(id,select?.value)}
 if(b.dataset.unequipItem)equipReward(b.dataset.unequipItem,b.dataset.petId,true);
});
function vaultPanelHTML(){
 const inv=inventory(),r=account()?.rewardCore||{},owned=new Set([...inv.collectibles,...inv.blueprints]);
 const ingredients=Object.entries(inv.ingredients).filter(([,n])=>Number(n)>0);
 const finds=TREASURES.filter(it=>(vaultFilters.collection==='all'||(it.collection||'shared')===vaultFilters.collection)&&(vaultFilters.status==='all'||(vaultFilters.status==='owned'?owned.has(it.id):!owned.has(it.id)))&&(vaultFilters.kind==='all'||it.kind===vaultFilters.kind)&&(vaultFilters.rarity==='all'||it.rarity===vaultFilters.rarity));
 const select=(key,label,options)=>'<label>'+label+'<select onchange="majickVaultFilter(\''+key+'\',this.value)">'+options.map(([v,n])=>'<option value="'+v+'" '+(vaultFilters[key]===v?'selected':'')+'>'+n+'</option>').join('')+'</select></label>';
 const recent=Object.values(r.ledger||{}).map(x=>x.receipt).filter(x=>x?.drop||x?.eggFragments).sort((a,b)=>b.at-a.at).slice(0,4);
 const remaining=Math.max(0,10-inv.eggFragments),ready=Math.floor(inv.eggFragments/10);
 const pages=Math.max(1,Math.ceil(finds.length/VAULT_PAGE_SIZE));vaultPage=Math.max(0,Math.min(pages-1,vaultPage));
 const pageRows=finds.slice(vaultPage*VAULT_PAGE_SIZE,(vaultPage+1)*VAULT_PAGE_SIZE);
 const panel=id=>'<section class="majVaultPanel" role="tabpanel" id="majVault-panel-'+id+'" aria-labelledby="majVault-tab-'+id+'" '+(vaultTab===id?'':'hidden')+'>';
 const tabs='<nav class="majVaultTabs" role="tablist" aria-label="Magic Vault sections">'+VAULT_TABS.map(([id,label])=>'<button type="button" role="tab" id="majVault-tab-'+id+'" aria-controls="majVault-panel-'+id+'" aria-selected="'+(vaultTab===id)+'" tabindex="'+(vaultTab===id?'0':'-1')+'" onclick="majickVaultTab(\''+id+'\')" onkeydown="majickVaultTabKeys(event,\''+id+'\')">'+label+'</button>').join('')+'</nav>';
 const pagination='<nav class="majVaultPages" aria-label="Treasure pages"><button type="button" onclick="majickVaultPage('+(vaultPage-1)+')" '+(vaultPage===0?'disabled':'')+'>← Previous</button><span aria-live="polite">'+(finds.length?'Showing '+(vaultPage*VAULT_PAGE_SIZE+1)+'–'+Math.min(finds.length,(vaultPage+1)*VAULT_PAGE_SIZE)+' of '+finds.length:'No treasures')+' • Page '+(vaultPage+1)+' of '+pages+'</span><button type="button" onclick="majickVaultPage('+(vaultPage+1)+')" '+(vaultPage===pages-1?'disabled':'')+'>Next →</button></nav>';
 return '<section class="majArcaneVault" id="majArcaneVault"><header><div><small>MAGIC VAULT</small><h2>The treasures of your studies.</h2><p>Explore your discoveries, prepare a potion, and watch your next egg take shape.</p></div><button onclick="majickConjureEgg()" '+(ready?'':'disabled')+'>'+(ready?'✦ Conjure Egg':'🥚 '+remaining+' fragments to your next egg')+'</button></header>'+
 '<div class="majVaultStats"><span>✦ '+TREASURES.filter(it=>owned.has(it.id)).length+' / '+TREASURES.length+' treasures discovered</span><span>◇ '+Object.values(inv.ingredients).reduce((a,b)=>a+Number(b||0),0)+' ingredients</span><span>⚗ '+Object.values(inv.potions).reduce((a,b)=>a+Number(b||0),0)+' potions</span><span>🥚 '+inv.eggFragments+' egg fragments'+(ready?' • '+ready+' conjuring'+(ready===1?'':'s')+' ready':'')+'</span></div>'+
 tabs+
 panel('treasures')+'<h3 id="majVaultTreasureHeading" tabindex="-1">Your Treasure Collection</h3><div class="majVaultFilters">'+select('collection','Collection',[['all','All collections'],['solstice','Solstice'],['aurelia','Aurelia'],['shared','Shared treasures']])+select('status','Discovery',[['all','All treasures'],['owned','Owned'],['locked','Undiscovered']])+select('kind','Item type',[['all','All types'],['furniture','Furniture'],['decor','Decor'],['toy','Exploration toys'],['accessory','Accessories']])+select('rarity','Rarity',[['all','All rarities'],...RARITIES.map(x=>[x.id,x.label])])+'</div><div class="majVaultCollection">'+(finds.length?pageRows.map(it=>vaultCard(it,owned.has(it.id))).join(''):'<p class="majVaultEmpty">No treasures match these filters. Choose All treasures to explore the collection.</p>')+'</div>'+pagination+'</section>'+
 panel('potions')+'<div class="majRecipeShelf"><h3>Potion Workshop</h3><p>Try each recipe with a one-time complimentary brewing kit.</p>'+(r.potionTestKitClaimed?'<p>✓ Test kit collected</p>':'<button type="button" onclick="majickClaimPotionTestKit()">Claim free brewing test kit ✦</button>')+RECIPES.map(rec=>{const count=Number(inv.potions[rec.id]||0),can=Object.entries(rec.cost).every(([k,n])=>Number(inv.ingredients[k]||0)>=n);return '<div class="majRecipe"><span aria-hidden="true">'+E(rec.icon)+'</span><div><b>'+E(rec.name)+'</b><p>'+E(rec.effect)+'</p><div class="majRecipeCosts">'+Object.entries(rec.cost).map(([k,n])=>{const have=Number(inv.ingredients[k]||0);return '<span class="'+(have>=n?'ready':'missing')+'">'+E(ingredientName(k))+' '+have+'/'+n+(have>=n?' ✓':' • need '+(n-have))+'</span>'}).join('')+'</div></div><aside><button onclick="majickCraftPotion(\''+E(rec.id)+'\')" '+(can?'':'disabled')+'>'+ (can?'Craft potion':'Gather ingredients')+'</button>'+(count?'<button class="use" onclick="majickUsePotion(\''+E(rec.id)+'\')">Use • '+count+' owned</button>':'')+'</aside></div>'}).join('')+'</div>'+'</section>'+
 panel('ingredients')+'<div class="majRecipeShelf"><h3>Ingredient Cabinet</h3><div class="majLootGrid">'+(ingredients.length?ingredients.map(([id,n])=>{const it=INGREDIENTS.find(x=>x.id===id)||{};return '<span class="'+E(it.rarity||'common')+'"><i aria-hidden="true">'+E(it.icon||'✦')+'</i><b>'+E(it.name||id)+'</b><small>'+E(rarityLabel(it.rarity||'common'))+' • '+Number(n)+' owned</small></span>'}).join(''):'<p class="majVaultEmpty">Your cabinet is waiting for its first discovery. Study treasure can reveal magical ingredients.</p>')+'</div></div>'+'</section>'+
 panel('eggs')+'<div class="majVaultEggProgress"><label for="majVaultEggMeter">Next egg • '+Math.min(10,inv.eggFragments)+'/10 fragments</label><progress id="majVaultEggMeter" value="'+Math.min(10,inv.eggFragments)+'" max="10"></progress><p>Earn fragments through mastery and learning milestones.</p></div>'+'</section>'+
 panel('recent')+'<div class="majRecipeShelf"><h3>Recent Discoveries</h3>'+(recent.length?recent.map(x=>'<div class="majVaultRecent"><b>'+E(x.drop?x.drop.name:'Celestial Egg Fragments')+'</b><span>'+E(x.label||x.type.replace(/-/g,' '))+(x.drop?' • '+E(rarityLabel(x.drop.rarity)):' • +'+x.eggFragments+' fragments')+'</span></div>').join(''):'<p class="majVaultEmpty">New treasures and egg fragments will appear here as you earn them.</p>')+'</div>'+ '</section>'+
 panel('shop')+vaultLegacyHTML+'</section></section>';
}
window.majickVaultFilter=(key,value)=>{
 const allowed={collection:['all','solstice','aurelia','shared'],status:['all','owned','locked'],kind:['all','furniture','decor','toy','accessory'],rarity:['all',...RARITIES.map(x=>x.id)]};
 if(!allowed[key]?.includes(value))return;
 vaultPage=0;vaultFilters[key]=value;const panel=document.getElementById('majArcaneVault');if(panel){panel.outerHTML=vaultPanelHTML();document.querySelector('#majArcaneVault select[onchange*="'+key+'"]')?.focus()}
};
window.majickVaultTab=id=>{if(!VAULT_TABS.some(x=>x[0]===id))return;vaultTab=id;refreshVault();document.getElementById('majVault-tab-'+id)?.focus()};
window.majickVaultTabKeys=(ev,id)=>{const i=VAULT_TABS.findIndex(x=>x[0]===id);let next=i;if(ev.key==='ArrowRight')next=(i+1)%VAULT_TABS.length;else if(ev.key==='ArrowLeft')next=(i+VAULT_TABS.length-1)%VAULT_TABS.length;else if(ev.key==='Home')next=0;else if(ev.key==='End')next=VAULT_TABS.length-1;else return;ev.preventDefault();window.majickVaultTab(VAULT_TABS[next][0])};
window.majickVaultPage=n=>{if(!Number.isFinite(Number(n)))return;vaultPage=Math.max(0,Math.floor(Number(n)));refreshVault();document.getElementById('majVaultTreasureHeading')?.focus()};
function patchVault(){
 if(typeof window.vaultHTML!=='function'||window.vaultHTML.__majickRewardVault)return false;
 const old=window.vaultHTML,fn=function(){vaultLegacyHTML=old.apply(this,arguments);return vaultPanelHTML()};fn.__majickRewardVault=true;window.vaultHTML=fn;return true;
}

function inventory(){
 const r=account()?.rewardCore||{};
 return {ingredients:{...(r.ingredients||{})},collectibles:[...(r.collectibles||[])],blueprints:[...(r.blueprints||[])],potions:{...(r.potions||{})},eggFragments:Number(r.eggFragments||0),recipes:RECIPES,treasures:TREASURES};
}
function claimPotionTestKit(){
 const a=account();if(!a)return false;const r=a.rewardCore;
 if(r.potionTestKitClaimed){window.rewardToast?.('Already collected','Your one-time brewing kit was already added.');return false}
 const kit={'moonpetal':6,'silver-sage':4,'star-moss':6,'dream-lavender':3,'celestial-dew':2,'crystal-nectar':2,'sunstone-dust':2};
 for(const [id,n] of Object.entries(kit))r.ingredients[id]=Number(r.ingredients[id]||0)+n;
 r.potionTestKitClaimed=true;save();refreshVault();window.rewardToast?.('✦ Brewing test kit collected','Ingredients added for all five recipes.');return true;
}
window.majickClaimPotionTestKit=claimPotionTestKit;
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
window.MajickRewardCore={VERSION,RARITIES,INGREDIENTS,TREASURES,RECIPES,award,rewardPreview,inventory,craft,usePotion,showConjuring,conjureEgg,vaultPanelHTML,patchVault,inspect,patchLegacyGameRewards,placeReward,equipReward,pushRewardState,ITEM_ART};
window.majickConjureEgg=()=>showConjuring();

// Cozy Alchemy is a presentation layer. Inventory is changed only by craft(), never by animation.
let cozyRecipe=null,cozyStage=0,cozyStirs=0,cozyCommitted=false,cozySound=false,cozyAudio=null;
const cozyLooks={
 'clarity-potion':['#9d62f1','#d4a7ff','38% 38% 25% 25%'],
 'recall-draught':['#4da5f2','#a5dfff','48% 48% 10% 10%'],
 'moonfocus-elixir':['#f18bb8','#ffd4e8','45% 45% 48% 48%'],
 'crystal-sight-potion':['#65d9b3','#c7ffeb','16% 16% 35% 35%'],
 'starlight-tonic':['#e8c45c','#fff2b1','24% 24% 12% 12%']
};
function cozyChime(){
 if(!cozySound)return;
 try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;cozyAudio=cozyAudio||new C();const o=cozyAudio.createOscillator(),g=cozyAudio.createGain();o.frequency.value=520;o.type='sine';g.gain.setValueAtTime(.025,cozyAudio.currentTime);g.gain.exponentialRampToValueAtTime(.001,cozyAudio.currentTime+.2);o.connect(g).connect(cozyAudio.destination);o.start();o.stop(cozyAudio.currentTime+.21)}catch(_){}
}
window.majCozySound=()=>{cozySound=!cozySound;cozyChime();cozyDraw()};
function cozyDiscover(rec){const a=account();if(!a)return;const r=a.rewardCore;r.discoveredRecipes=r.discoveredRecipes||{};if(!r.discoveredRecipes[rec.id]){r.discoveredRecipes[rec.id]=Date.now();save();window.rewardToast?.('✦ Recipe discovered',rec.name)}}
function cozyGuardian(){const pets=state()?.legacy?.pets;const pet=Array.isArray(pets)?pets.find(p=>p?.name):null;return pet&&Math.random()<.25?E(pet.name)+' admires the bubbling potion. ✨':'Your magical potion is ready.'}

const cozyStyle=document.createElement('style');
cozyStyle.textContent=`
.majCozyShade{position:fixed;inset:0;z-index:99990;background:#0c0719cf;display:grid;place-items:center;padding:18px;overflow:auto}
.majCozyModal{width:min(520px,100%);max-height:95vh;overflow:auto;position:relative;padding:24px;border:2px solid #c8a36c;border-radius:22px;color:#fff2df;background:radial-gradient(ellipse at 50% 35%,#55346d,#1a1029 72%);box-shadow:0 20px 70px #080411}
.majCozyModal h2{font-family:Georgia,serif;color:#ffe0a4;margin:4px 0 8px}.majCozyModal p{color:#f7e8ff;line-height:1.5}
.majCozyPixiLayer{position:absolute;inset:0;z-index:2;pointer-events:none}.majCozyPixiLayer canvas{display:block;width:100%;height:100%}.majCozyScene:has(.majCozyPixiLayer) .majCozyCauldron,.majCozyScene:has(.majCozyPixiLayer) .majCozySmoke,.majCozyScene:has(.majCozyPixiLayer) .majCozyParticles{visibility:hidden}.majCozyScene{height:210px;display:grid;place-items:center;position:relative;overflow:hidden}
.majCozyCauldron{position:relative;width:210px;height:116px;margin-top:60px;border-radius:22px 22px 95px 95px;border:7px solid #c9a7df;background:linear-gradient(130deg,#735388,#241733 55%,#0e0a19);box-shadow:inset 0 -16px #120d1d,0 22px 35px #10071b}
.majCozyCauldron:before{content:'';position:absolute;left:-9px;right:-9px;top:-22px;height:49px;border:6px solid #d6b1ec;border-radius:50%;background:radial-gradient(ellipse,#e8a2fa,#8037a0);box-shadow:0 0 28px #d67fffaa;animation:cozyPulse 1.8s ease-in-out infinite}
.majCozyCauldron:after{content:'✦  ☾  ✦';position:absolute;top:56px;left:0;right:0;text-align:center;font-size:24px;color:#f9d99c}
.majCozyParticles{position:absolute;inset:0;pointer-events:none;color:#ffe1ac;font-size:24px;text-align:center;letter-spacing:20px;animation:cozyRise 2.1s ease-in-out infinite}
.majCozyActions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.majCozyActions button{border:1px solid #e3bc86;border-radius:13px;background:#65417e;color:white;padding:11px 17px;cursor:pointer;font-weight:700}.majCozyActions button:first-child{background:#a467ac}
.majCozySmoke{position:absolute;top:4px;left:0;right:0;text-align:center;color:var(--potion-glow);font-size:40px;opacity:.6;animation:cozyRise 2.5s ease-in-out infinite;pointer-events:none}.majCozyBottle{width:74px;height:98px;margin:62px auto 0;border:5px solid #e9d3a1;border-radius:var(--bottle-shape);background:linear-gradient(120deg,#ffffff88,var(--potion-color) 55%,#26133e);box-shadow:0 0 30px var(--potion-glow),inset 7px 0 12px #fff7;position:relative}.majCozyBottle:before{content:'✦';position:absolute;inset:28px 0 auto;text-align:center;color:white;font-size:25px}.majCozyBottle:after{content:'';position:absolute;width:30px;height:12px;background:#b88a5e;top:-16px;left:calc(50% - 15px)}.majCozyClose{position:absolute;right:13px;top:10px;border:0;background:transparent;color:white;font-size:25px;cursor:pointer}
@keyframes cozyPulse{50%{filter:brightness(1.4);transform:scale(1.04)}}@keyframes cozyRise{50%{opacity:.35;transform:translateY(-19px)}}
@media(prefers-reduced-motion:reduce){.majCozyModal *{animation:none!important}}
`;
document.head.appendChild(cozyStyle);

let cozyPixi=null,cozyPixiToken=0;
async function cozyMountPixi(){
 const token=++cozyPixiToken;cozyDisposePixi();
 const host=document.querySelector('#majCozyBrewing .majCozyScene');if(!host)return;
 try{
  if(!window.PIXI?.VERSION?.startsWith('8.')){await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./vendor/pixi-8.6.6.min.js';script.onload=resolve;script.onerror=reject;document.head.appendChild(script)})}
  if(token!==cozyPixiToken||!host.isConnected)return;
  const P=window.PIXI,app=new P.Application();
  await app.init({width:Math.max(200,host.clientWidth),height:210,backgroundAlpha:0,antialias:true,preference:'webgl'});
  if(token!==cozyPixiToken||!host.isConnected){app.destroy(true,{children:true});return}
  const layer=document.createElement('div');layer.className='majCozyPixiLayer';layer.setAttribute('aria-hidden','true');layer.appendChild(app.canvas);host.appendChild(layer);
  const look=cozyLooks[cozyRecipe]||cozyLooks['clarity-potion'],color=Number.parseInt(look[0].slice(1),16);
  const cauldron=new P.Container(),smoke=new P.Container(),sparks=new P.Container(),ingredients=new P.Container(),bottle=new P.Container();
  app.stage.addChild(smoke,cauldron,ingredients,bottle,sparks);
  const cx=app.screen.width/2, reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const pot=new P.Graphics();pot.ellipse(0,0,105,22).fill({color:0xd4b4ed});pot.roundRect(-102,0,204,100,30).fill({color:0x342044}).stroke({color:0xc5a0e0,width:7});pot.x=cx;pot.y=94;cauldron.addChild(pot);
  const liquid=new P.Graphics();liquid.ellipse(0,0,92,16).fill({color});liquid.x=cx;liquid.y=98;cauldron.addChild(liquid);
  const wisps=[];for(let i=0;i<22;i++){const p=new P.Graphics();p.circle(0,0,3+i%5).fill({color:i%3?color:0xffe9bc,alpha:.45});smoke.addChild(p);wisps.push({p,seed:i*17})}
  const bubbles=[];for(let i=0;i<15;i++){const p=new P.Graphics();p.circle(0,0,2+i%4).stroke({color:0xffffff,width:1,alpha:.75});cauldron.addChild(p);bubbles.push({p,seed:i*23})}
  const herbs=[];for(let i=0;i<12;i++){const p=new P.Graphics();if(i%2)p.poly([0,-7,6,0,0,7,-6,0]).fill({color:0x91d69b});else p.star(0,0,5,6,3).fill({color:0xb3e3ff});ingredients.addChild(p);herbs.push({p,seed:i})}
  const stars=[];for(let i=0;i<14;i++){const p=new P.Graphics();p.star(0,0,4,5,2).fill({color:0xffe5a8,alpha:.85});sparks.addChild(p);stars.push(p)}
  const glass=new P.Graphics();glass.roundRect(-24,-48,48,85,14).fill({color,alpha:.85}).stroke({color:0xffe9cf,width:4});glass.roundRect(-12,-62,24,17,4).fill({color:0xb18c6c});glass.star(0,-10,5,12,5).fill({color:0xffffff});bottle.addChild(glass);bottle.x=cx;bottle.y=125;
  let tick=0;const animate=(time)=>{tick+=reduced?0:time.deltaTime;const bottled=cozyStage===3,mixing=cozyStage===0||cozyStage===1;
   cauldron.visible=!bottled;ingredients.visible=mixing;bottle.visible=bottled;
   if(!reduced){liquid.tint=cozyStage===0?0xb3a2ff:cozyStage===1?0xf3bbff:0xffffff;liquid.scale.x=1+Math.sin(tick*.065)*.035}
   for(const {p,seed} of wisps){p.visible=!bottled;const progress=(tick*.35+seed*3)%125;p.x=cx+Math.sin(tick*.025+seed)*48;p.y=94-progress;p.alpha=.5*(1-progress/125)}
   for(const {p,seed} of bubbles){p.visible=!bottled;p.x=cx+Math.sin(seed*1.7)*68;p.y=105-((tick*.55+seed)%35)}
   for(const {p,seed} of herbs){const angle=tick*.045+seed*2.4,progress=((tick*.35+seed*11)%95)/95;p.x=cx+Math.cos(angle)*(115-progress*110);p.y=45+Math.sin(angle)*38+progress*55;p.alpha=1-progress*.7}
   for(let i=0;i<stars.length;i++){const a=tick*.018+i*Math.PI*2/stars.length;stars[i].x=cx+Math.cos(a)*(bottled?66:110);stars[i].y=(bottled?95:110)+Math.sin(a)*(bottled?65:48)}
   bottle.y=reduced?125:125+Math.sin(tick*.045)*8;
  };
  app.ticker.add(animate);cozyPixi={app,layer};
 }catch(_){host.classList.add('majCozyFallback')}
}
function cozyDisposePixi(){if(cozyPixi){try{cozyPixi.app.destroy(true,{children:true})}catch(_){}cozyPixi.layer.remove();cozyPixi=null}}

function cozyClose(){cozyPixiToken++;cozyDisposePixi();document.getElementById('majCozyBrewing')?.remove();cozyRecipe=null;cozyCommitted=false}
function cozyDraw(){
 const rec=RECIPES.find(x=>x.id===cozyRecipe);if(!rec)return cozyClose();
 const box=document.getElementById('majCozyBrewing');if(!box)return;
 const look=cozyLooks[rec.id]||cozyLooks['clarity-potion'];
 const labels=['Add ingredients','Stir the potion','Bottle your potion','Potion crafted!'];
 const actions=cozyStage===0?'<button onclick="majCozyNext()">Add all ingredients ✦</button>':cozyStage===1?'<button onclick="majCozyNext()">Stir ✨ '+cozyStirs+'/3</button><button onclick="majCozyQuick()">Quick mix</button>':cozyStage===2?'<button onclick="majCozyNext()">Bottle potion ⚗</button>':'<button onclick="majCozyClose()">Return to workshop</button>';
 box.innerHTML='<div class="majCozyModal" style="--potion-color:'+look[0]+';--potion-glow:'+look[1]+';--bottle-shape:'+look[2]+'" role="dialog" aria-modal="true" aria-labelledby="majCozyTitle"><button class="majCozyClose" aria-label="Close brewing workshop" onclick="majCozyClose()">×</button><small>THE MOONLIT CAULDRON • '+E(labels[cozyStage])+'</small><h2 id="majCozyTitle">'+E(rec.name)+'</h2><button type="button" onclick="majCozySound()" aria-pressed="'+cozySound+'">'+(cozySound?'♫ Cozy sound on':'♪ Cozy sound off')+'</button><p>'+E(rec.effect)+'</p><div class="majCozyScene"><div class="majCozyParticles" aria-hidden="true">✦ ✧ ✦ ✧ ✦</div>'+(cozyStage===3?'<div class="majCozyBottle" aria-label="Bottled potion"></div>':'<div class="majCozySmoke" aria-hidden="true">☁ ✧ ☁</div><div class="majCozyCauldron" aria-hidden="true"></div>')+'</div><p style="text-align:center">'+(cozyStage===3?'Your potion has been saved to inventory. '+cozyGuardian()+'':cozyStage===1?'Stir three times, or use Quick mix.':cozyStage===2?'The mixture is glowing. Ready to bottle!':'Ingredients are ready. Brew without any extra resource cost.')+'</p><div class="majCozyActions">'+actions+'</div></div>';
 cozyMountPixi();
}
window.majCozyClose=cozyClose;
window.majCozyQuick=()=>{if(cozyStage===1&&!cozyCommitted){cozyStirs=3;cozyStage=2;cozyChime();cozyDraw()}};
window.majCozyNext=()=>{
 if(!cozyRecipe||cozyCommitted||cozyStage===3)return;
 cozyChime();
 if(cozyStage===0)cozyStage=1;
 else if(cozyStage===1){cozyStirs++;if(cozyStirs>=3)cozyStage=2}
 else if(cozyStage===2){cozyCommitted=true;const result=craft(cozyRecipe);if(!result.ok){window.rewardToast?.('Missing ingredients',result.message);cozyClose();return}cozyDiscover(result.recipe);cozyStage=3;window.rewardToast?.('⚗ Potion crafted',result.recipe.name)}
 cozyDraw();
};
window.majickCraftPotion=id=>{
 const rec=RECIPES.find(x=>x.id===id),inv=inventory();
 if(!rec)return {ok:false,message:'Unknown recipe'};
 const missing=Object.entries(rec.cost).filter(([k,n])=>Number(inv.ingredients[k]||0)<n);
 if(missing.length){window.rewardToast?.('Missing ingredients','Earn more ingredients by studying.');return {ok:false,message:'Missing ingredients'}}
 if(document.getElementById('majCozyBrewing'))return {ok:false,message:'Brewing already open'};
 cozyRecipe=id;cozyStage=0;cozyStirs=0;cozyCommitted=false;
 const overlay=document.createElement('div');overlay.id='majCozyBrewing';overlay.className='majCozyShade';document.body.appendChild(overlay);cozyDraw();return {ok:true,pending:true};
};

window.majickUsePotion=id=>{const ok=usePotion(id);try{window.rewardToast?.(ok?'✦ Potion activated':'No potion available',ok?(RECIPES.find(x=>x.id===id)?.effect||'Magic stirred.'):'Craft one first.')}catch(_){};try{window.render?.()}catch(_){};return ok};
document.documentElement.dataset.majickRewardCore=VERSION;
setTimeout(()=>{patchLegacyGameRewards();patchVault()},0);
})();
