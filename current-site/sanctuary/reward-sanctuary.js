(()=>{
'use strict';
const VERSION='3.4.2-guardian-collections';
const REWARD_DECOR={
 'velvet-study-chair':{name:'Velvet Study Chair',icon:'♜',rarity:'enchanted',w:112,h:86},
 'constellation-rug':{name:'Constellation Rug',icon:'✦',rarity:'rare',w:190,h:82},
 'moon-phase-wall-hanging':{name:'Moon-Phase Wall Hanging',icon:'☾',rarity:'enchanted',w:120,h:100},
 'potion-shelf':{name:'Potion Shelf',icon:'⚗',rarity:'rare',w:120,h:110},
 'crystal-lamp':{name:'Crystal Lamp',icon:'◇',rarity:'rare',w:82,h:118},
 'floating-book-stack':{name:'Floating Book Stack',icon:'📚',rarity:'arcane',w:110,h:96},
 'celestial-telescope':{name:'Celestial Telescope',icon:'🔭',rarity:'arcane',w:135,h:120},
 'guardian-toy-chest':{name:'Guardian Toy Chest',icon:'🎁',rarity:'rare',w:128,h:88},
 'enchanted-fireplace':{name:'Enchanted Fireplace',icon:'🔥',rarity:'celestial',w:170,h:142},
 'moonflower-planter':{name:'Moonflower Planter',icon:'❀',rarity:'enchanted',w:105,h:105},
 'canopy-bed-curtains':{name:'Canopy-Bed Curtains',icon:'♢',rarity:'rare',w:150,h:138},
 'rune-writing-desk':{name:'Rune Writing Desk',icon:'⌘',rarity:'arcane',w:150,h:105}
};
const ITEM_ART={"velvet-study-chair": "assets/rewards/items/velvet-study-chair.webp", "constellation-rug": "assets/rewards/items/constellation-rug.webp", "moon-phase-wall-hanging": "assets/rewards/items/moon-phase-wall-hanging.webp", "potion-shelf": "assets/rewards/items/potion-shelf.webp", "crystal-lamp": "assets/rewards/items/crystal-lamp.webp", "floating-book-stack": "sanctuary/assets/runtime-objects/enchanted-bookstack.webp", "celestial-telescope": "sanctuary/assets/runtime-objects/celestial-telescope.webp", "guardian-toy-chest": "assets/rewards/items/guardian-toy-chest.webp", "enchanted-fireplace": "assets/rewards/items/enchanted-fireplace.webp", "moonflower-planter": "assets/rewards/items/moonflower-planter.webp", "canopy-bed-curtains": "assets/rewards/items/canopy-bed-curtains.webp", "rune-writing-desk": "sanctuary/assets/runtime-objects/moonlit-study-desk.webp", "memory-moon-brooch": "assets/rewards/items/memory-moon-brooch.webp", "scholar-rune-circlet": "assets/rewards/items/scholar-rune-circlet.webp", "fortune-seer-monocle": "assets/rewards/items/fortune-seer-monocle.webp", "celestial-dice-charm": "assets/rewards/items/celestial-dice-charm.webp", "star-cartographer-glasses": "assets/rewards/items/star-cartographer-glasses.webp", "probability-scholar-cape": "assets/rewards/items/probability-scholar-cape.webp"};
Object.assign(REWARD_DECOR,{"solstice-reading-chaise": {"name": "Solstice’s Reading Chaise", "icon": "☾", "rarity": "rare", "w": 190, "h": 130}, "solstice-star-pouf": {"name": "Solstice’s Star Pouf", "icon": "☾", "rarity": "enchanted", "w": 100, "h": 75}, "solstice-explorer-telescope": {"name": "Solstice’s Explorer Telescope", "icon": "☾", "rarity": "arcane", "w": 145, "h": 165}, "solstice-starlight-hammock": {"name": "Solstice’s Starlight Hammock", "icon": "☾", "rarity": "rare", "w": 180, "h": 160}, "solstice-galaxy-vanity": {"name": "Solstice’s Galaxy Vanity", "icon": "☾", "rarity": "arcane", "w": 190, "h": 160}, "solstice-nebula-bowl": {"name": "Solstice’s Nebula Bowl", "icon": "☾", "rarity": "arcane", "w": 120, "h": 125}, "solstice-solar-orrery": {"name": "Solstice’s Solar Orrery", "icon": "✧", "rarity": "celestial", "w": 130, "h": 160}, "solstice-astronomy-bookshelf": {"name": "Solstice’s Astronomy Bookshelf", "icon": "☾", "rarity": "rare", "w": 145, "h": 185}, "solstice-fox-star-den": {"name": "Solstice’s Fox Star Den", "icon": "☾", "rarity": "celestial", "w": 210, "h": 150}, "solstice-constellation-rug": {"name": "Solstice’s Constellation Rug", "icon": "☾", "rarity": "rare", "w": 220, "h": 100}, "solstice-exploration-chest": {"name": "Solstice’s Exploration Chest", "icon": "✧", "rarity": "rare", "w": 145, "h": 125}, "solstice-planet-climbing-tower": {"name": "Solstice’s Planet Climbing Tower", "icon": "✧", "rarity": "rare", "w": 125, "h": 185}, "solstice-amber-canopy-bed": {"name": "Solstice’s Amber Canopy Bed", "icon": "☾", "rarity": "celestial", "w": 220, "h": 175}, "solstice-star-perch-tree": {"name": "Solstice’s Star Perch Tree", "icon": "✧", "rarity": "rare", "w": 130, "h": 190}, "solstice-moon-writing-desk": {"name": "Solstice’s Moon Writing Desk", "icon": "☾", "rarity": "arcane", "w": 185, "h": 140}, "solstice-fox-ear-reading-chair": {"name": "Solstice’s Fox-Ear Reading Chair", "icon": "☾", "rarity": "rare", "w": 140, "h": 150}, "solstice-crescent-lantern": {"name": "Solstice’s Crescent Lantern", "icon": "☾", "rarity": "enchanted", "w": 85, "h": 145}, "solstice-astral-doorway": {"name": "Solstice’s Astral Doorway", "icon": "☾", "rarity": "arcane", "w": 150, "h": 195}, "solstice-galaxy-folding-screen": {"name": "Solstice’s Galaxy Folding Screen", "icon": "☾", "rarity": "arcane", "w": 200, "h": 150}, "solstice-orbit-play-ball": {"name": "Solstice’s Orbit Play Ball", "icon": "✧", "rarity": "enchanted", "w": 100, "h": 115}, "solstice-star-charm-rack": {"name": "Solstice’s Star Charm Rack", "icon": "✧", "rarity": "rare", "w": 160, "h": 120}, "solstice-astronomy-book-stack": {"name": "Solstice’s Astronomy Book Stack", "icon": "☾", "rarity": "enchanted", "w": 100, "h": 115}, "solstice-planet-mobile": {"name": "Solstice’s Planet Mobile", "icon": "☾", "rarity": "rare", "w": 105, "h": 155}, "solstice-starlight-tea-table": {"name": "Solstice’s Starlight Tea Table", "icon": "☾", "rarity": "rare", "w": 160, "h": 120}, "solstice-cosmic-orbit-puzzle": {"name": "Solstice’s Cosmic Orbit Puzzle", "icon": "✧", "rarity": "arcane", "w": 100, "h": 120}, "solstice-sun-globe-lamp": {"name": "Solstice’s Sun Globe Lamp", "icon": "☾", "rarity": "arcane", "w": 120, "h": 135}, "solstice-celestial-fox-gateway": {"name": "Solstice’s Celestial Fox Gateway", "icon": "☾", "rarity": "celestial", "w": 230, "h": 175}});
Object.assign(ITEM_ART,{"solstice-reading-chaise": "assets/rewards/solstice/items/reading-chaise.webp", "solstice-star-pouf": "assets/rewards/solstice/items/star-pouf.webp", "solstice-explorer-telescope": "assets/rewards/solstice/items/explorer-telescope.webp", "solstice-starlight-hammock": "assets/rewards/solstice/items/starlight-hammock.webp", "solstice-galaxy-vanity": "assets/rewards/solstice/items/galaxy-vanity.webp", "solstice-nebula-bowl": "assets/rewards/solstice/items/nebula-bowl.webp", "solstice-solar-orrery": "assets/rewards/solstice/items/solar-orrery.webp", "solstice-astronomy-bookshelf": "assets/rewards/solstice/items/astronomy-bookshelf.webp", "solstice-fox-star-den": "assets/rewards/solstice/items/fox-star-den.webp", "solstice-constellation-rug": "assets/rewards/solstice/items/constellation-rug.webp", "solstice-exploration-chest": "assets/rewards/solstice/items/exploration-chest.webp", "solstice-planet-climbing-tower": "assets/rewards/solstice/items/planet-climbing-tower.webp", "solstice-amber-canopy-bed": "assets/rewards/solstice/items/amber-canopy-bed.webp", "solstice-star-perch-tree": "assets/rewards/solstice/items/star-perch-tree.webp", "solstice-moon-writing-desk": "assets/rewards/solstice/items/moon-writing-desk.webp", "solstice-fox-ear-reading-chair": "assets/rewards/solstice/items/fox-ear-reading-chair.webp", "solstice-crescent-lantern": "assets/rewards/solstice/items/crescent-lantern.webp", "solstice-astral-doorway": "assets/rewards/solstice/items/astral-doorway.webp", "solstice-galaxy-folding-screen": "assets/rewards/solstice/items/galaxy-folding-screen.webp", "solstice-orbit-play-ball": "assets/rewards/solstice/items/orbit-play-ball.webp", "solstice-star-charm-rack": "assets/rewards/solstice/items/star-charm-rack.webp", "solstice-solar-circlet": "assets/rewards/solstice/items/solar-circlet.webp", "solstice-moon-collar": "assets/rewards/solstice/items/moon-collar.webp", "solstice-nebula-wand": "assets/rewards/solstice/items/nebula-wand.webp", "solstice-star-glasses": "assets/rewards/solstice/items/star-glasses.webp", "solstice-orbit-bracelet": "assets/rewards/solstice/items/orbit-bracelet.webp", "solstice-explorer-satchel": "assets/rewards/solstice/items/explorer-satchel.webp", "solstice-galaxy-cape": "assets/rewards/solstice/items/galaxy-cape.webp", "solstice-astronomy-book-stack": "assets/rewards/solstice/items/astronomy-book-stack.webp", "solstice-planet-mobile": "assets/rewards/solstice/items/planet-mobile.webp", "solstice-starlight-tea-table": "assets/rewards/solstice/items/starlight-tea-table.webp", "solstice-cosmic-orbit-puzzle": "assets/rewards/solstice/items/cosmic-orbit-puzzle.webp", "solstice-sun-globe-lamp": "assets/rewards/solstice/items/sun-globe-lamp.webp", "solstice-celestial-fox-gateway": "assets/rewards/solstice/items/celestial-fox-gateway.webp"});
Object.assign(REWARD_DECOR,{"aurelia-bunny-ear-reading-chair": {"name": "Aurelia’s Bunny-Ear Reading Chair", "icon": "☾", "rarity": "rare", "w": 140, "h": 150}, "aurelia-wingback-reading-chaise": {"name": "Aurelia’s Wingback Reading Chaise", "icon": "☾", "rarity": "rare", "w": 200, "h": 130}, "aurelia-quilted-ruby-canopy-bed": {"name": "Aurelia’s Quilted Ruby Canopy Bed", "icon": "☾", "rarity": "celestial", "w": 220, "h": 175}, "aurelia-burrow-hammock": {"name": "Aurelia’s Burrow Hammock", "icon": "☾", "rarity": "rare", "w": 180, "h": 150}, "aurelia-velvet-footstool": {"name": "Aurelia’s Velvet Footstool", "icon": "☾", "rarity": "rare", "w": 95, "h": 75}, "aurelia-scholar-writing-desk": {"name": "Aurelia’s Scholar Writing Desk", "icon": "☾", "rarity": "arcane", "w": 180, "h": 150}, "aurelia-arched-bookcase": {"name": "Aurelia’s Arched Bookcase", "icon": "☾", "rarity": "enchanted", "w": 150, "h": 190}, "aurelia-rose-crystal-lamp": {"name": "Aurelia’s Rose Crystal Lamp", "icon": "☾", "rarity": "enchanted", "w": 90, "h": 130}, "aurelia-wing-framed-moon-mirror": {"name": "Aurelia’s Wing-Framed Moon Mirror", "icon": "☾", "rarity": "rare", "w": 130, "h": 180}, "aurelia-feather-lantern": {"name": "Aurelia’s Feather Lantern", "icon": "☾", "rarity": "arcane", "w": 85, "h": 140}, "aurelia-flowering-sage-planter": {"name": "Aurelia’s Flowering Sage Planter", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-feeding-and-water-station": {"name": "Aurelia’s Feeding and Water Station", "icon": "☾", "rarity": "enchanted", "w": 120, "h": 75}, "aurelia-potion-apothecary": {"name": "Aurelia’s Potion Apothecary", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-wing-embroidered-rug": {"name": "Aurelia’s Wing-Embroidered Rug", "icon": "☾", "rarity": "arcane", "w": 210, "h": 95}, "aurelia-rose-tea-table": {"name": "Aurelia’s Rose Tea Table", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-feather-play-wand": {"name": "Aurelia’s Feather Play Wand", "icon": "☾", "rarity": "enchanted", "w": 120, "h": 120}, "aurelia-rune-play-ball": {"name": "Aurelia’s Rune Play Ball", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-treat-puzzle-carousel": {"name": "Aurelia’s Treat Puzzle Carousel", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-bunny-toy-trunk": {"name": "Aurelia’s Bunny Toy Trunk", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-hopping-stones": {"name": "Aurelia’s Hopping Stones", "icon": "☾", "rarity": "rare", "w": 120, "h": 120}, "aurelia-rose-and-star-mobile": {"name": "Aurelia’s Rose and Star Mobile", "icon": "☾", "rarity": "arcane", "w": 115, "h": 150}, "aurelia-rose-heart-arcane-orb": {"name": "Aurelia’s Rose-Heart Arcane Orb", "icon": "☾", "rarity": "arcane", "w": 120, "h": 120}, "aurelia-celestial-rabbit-dream-altar": {"name": "Aurelia’s Celestial Rabbit Dream Altar", "icon": "☾", "rarity": "celestial", "w": 230, "h": 190}});
Object.assign(ITEM_ART,{"aurelia-bunny-ear-reading-chair": "assets/rewards/aurelia/items/bunny-ear-reading-chair.webp", "aurelia-wingback-reading-chaise": "assets/rewards/aurelia/items/wingback-reading-chaise.webp", "aurelia-quilted-ruby-canopy-bed": "assets/rewards/aurelia/items/quilted-ruby-canopy-bed.webp", "aurelia-burrow-hammock": "assets/rewards/aurelia/items/burrow-hammock.webp", "aurelia-velvet-footstool": "assets/rewards/aurelia/items/velvet-footstool.webp", "aurelia-scholar-writing-desk": "assets/rewards/aurelia/items/scholar-writing-desk.webp", "aurelia-arched-bookcase": "assets/rewards/aurelia/items/arched-bookcase.webp", "aurelia-rose-crystal-lamp": "assets/rewards/aurelia/items/rose-crystal-lamp.webp", "aurelia-wing-framed-moon-mirror": "assets/rewards/aurelia/items/wing-framed-moon-mirror.webp", "aurelia-feather-lantern": "assets/rewards/aurelia/items/feather-lantern.webp", "aurelia-flowering-sage-planter": "assets/rewards/aurelia/items/flowering-sage-planter.webp", "aurelia-feeding-and-water-station": "assets/rewards/aurelia/items/feeding-and-water-station.webp", "aurelia-potion-apothecary": "assets/rewards/aurelia/items/potion-apothecary.webp", "aurelia-wing-embroidered-rug": "assets/rewards/aurelia/items/wing-embroidered-rug.webp", "aurelia-rose-tea-table": "assets/rewards/aurelia/items/rose-tea-table.webp", "aurelia-feather-play-wand": "assets/rewards/aurelia/items/feather-play-wand.webp", "aurelia-rune-play-ball": "assets/rewards/aurelia/items/rune-play-ball.webp", "aurelia-treat-puzzle-carousel": "assets/rewards/aurelia/items/treat-puzzle-carousel.webp", "aurelia-bunny-toy-trunk": "assets/rewards/aurelia/items/bunny-toy-trunk.webp", "aurelia-hopping-stones": "assets/rewards/aurelia/items/hopping-stones.webp", "aurelia-rose-and-star-mobile": "assets/rewards/aurelia/items/rose-and-star-mobile.webp", "aurelia-ruby-rose-circlet": "assets/rewards/aurelia/items/ruby-rose-circlet.webp", "aurelia-sage-moon-collar": "assets/rewards/aurelia/items/sage-moon-collar.webp", "aurelia-scholar-glasses": "assets/rewards/aurelia/items/scholar-glasses.webp", "aurelia-wing-and-petal-cloak": "assets/rewards/aurelia/items/wing-and-petal-cloak.webp", "aurelia-scholar-satchel": "assets/rewards/aurelia/items/scholar-satchel.webp", "aurelia-rose-heart-arcane-orb": "assets/rewards/aurelia/items/rose-heart-arcane-orb.webp", "aurelia-celestial-rabbit-dream-altar": "assets/rewards/aurelia/items/celestial-rabbit-dream-altar.webp"});
for(const [id,d] of Object.entries(REWARD_DECOR))d.image='../'+ITEM_ART[id];
const COLORS={enchanted:0x65527b,rare:0x425d7b,arcane:0x70428b,celestial:0x9d7b35};
const KEY='majick-reward-sanctuary-v3411';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function scene(){try{const sc=window.majickPhaserGame?.scene?.getScene?.('Game');return sc?.add&&sc?.sys?.isActive?.()!==false?sc:null}catch(_){return null}}
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){return {}}}
function save(v){try{localStorage.setItem(KEY,JSON.stringify(v||{}))}catch(_){}}
function notifyParent(edit){window.parent?.postMessage({type:'MAJICK_REWARD_ROOM_EDIT',...edit},location.origin)}
function rewardState(){
 const s=read();s.positions=s.positions||{};s.stored=Array.isArray(s.stored)?s.stored:[];s.owned=Array.isArray(s.owned)?s.owned:[];return s;
}
function syncFurnitureState(sc,owned){
 if(!sc)return;
 const old=sc.v3321EnsureFurnitureState;
 if(old&&!old.__rewardExtended){
   const fn=function(incoming){
     const base=old.call(this,incoming),r=rewardState(),all=[...new Set([...(base.owned||[]),...(r.owned||[])])];
     const stored=[...new Set([...(base.stored||[]).filter(id=>!REWARD_DECOR[id]),...(r.stored||[])])].filter(id=>all.includes(id));
     base.owned=all;base.stored=stored;this.v3321FurnitureState=base;return base;
   };
   fn.__rewardExtended=true;sc.v3321EnsureFurnitureState=fn;
 }
 const rs=rewardState();rs.owned=[...new Set(owned.filter(id=>REWARD_DECOR[id]))];save(rs);
 if(sc.v3321FurnitureState){
   sc.v3321FurnitureState.owned=[...new Set([...(sc.v3321FurnitureState.owned||[]),...rs.owned])];
   sc.v3321FurnitureState.stored=[...new Set([...(sc.v3321FurnitureState.stored||[]).filter(id=>!REWARD_DECOR[id]),...rs.stored])];
 }
}
function buildItem(sc,id,index){
 const def=REWARD_DECOR[id];if(!def)return null;
 sc.v3411RewardDecor=sc.v3411RewardDecor||{};
 if(sc.v3411RewardDecor[id]?.active){const c=sc.v3411RewardDecor[id],pos=rewardState().positions[id];if(pos){c.setPosition(pos.x,pos.y);c.setScale(pos.scale);c.setRotation(pos.rotation)}return c;}
 const rs=rewardState(),pos=rs.positions[id]||{x:380+(index%6)*250,y:670+Math.floor(index/6)*180,scale:1,rotation:0};
 const c=sc.add.container(pos.x,pos.y).setDepth(48);
 const key='reward-'+id;
 if(!sc.textures.exists(key)){c.destroy();return null}
 const image=sc.add.image(0,0,key);const fit=Math.min(def.w/image.width,def.h/image.height);image.setDisplaySize(image.width*fit,image.height*fit);
 c.add(image);c.setSize(def.w,def.h).setInteractive({useHandCursor:true,draggable:true});
 c.setScale(Number(pos.scale||1));c.setRotation(Number(pos.rotation||0));
 c.setData('objectId',id);c.setData('decorId',id);c.setData('rewardDecor',true);c.setData('label',def.name);
 sc.input.setDraggable(c);
 c.on('drag',(pointer,x,y)=>{if(sc.editMode){c.x=Math.max(70,Math.min(sc.worldWidth-70,x));c.y=Math.max(180,Math.min(930,y))}});
 c.on('dragend',()=>{const x=Math.round(c.x/20)*20,y=Math.round(c.y/20)*20;c.x=x;c.y=y;const st=rewardState();st.positions[id]={x,y,scale:c.scaleX,rotation:c.rotation};save(st);notifyParent({id,position:st.positions[id]})});
 c.on('pointerup',pointer=>{
   if(!sc.editMode)return;
   if(pointer?.event?.shiftKey){c.rotation=(c.rotation+.2618)%(Math.PI*2)}
   else if(pointer?.event?.altKey){c.setScale(Math.min(1.6,Number(c.scaleX||1)+.1))}
   const st=rewardState();st.positions[id]={x:c.x,y:c.y,scale:c.scaleX,rotation:c.rotation};save(st);notifyParent({id,position:st.positions[id]});
 });
 sc.v3411RewardDecor[id]=c;sc.decorItems=sc.decorItems||[];sc.decorItems.push(c);
 return c;
}
function applyOwned(owned=[]){
 const sc=scene();if(!sc)return;
 syncFurnitureState(sc,owned);
 const rs=rewardState(),set=new Set(owned);
 owned.forEach((id,i)=>buildItem(sc,id,i));
 for(const [id,c] of Object.entries(sc.v3411RewardDecor||{})){
   const visible=set.has(id)&&!rs.stored.includes(id);
   c.setVisible(visible);c.setActive(true);if(c.input)c.input.enabled=visible;
 }
 buildButton(sc);
}
function setStored(id,stored){
 const rs=rewardState();if(!rs.owned.includes(id)||!REWARD_DECOR[id])return false;
 const rows=new Set(rs.stored);if(stored)rows.add(id);else rows.delete(id);rs.stored=[...rows];save(rs);applyOwned(rs.owned);buildManager(scene());notifyParent({id,stored});return true;
}
function buildButton(sc){
 if(!sc||sc.v3411RewardButton?.active)return;
 const b=sc.add.text(0,0,'✦ REWARD DECOR',{fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#f8e7be',backgroundColor:'#55356dcc',padding:{x:11,y:7}}).setOrigin(1,0).setDepth(12090).setInteractive({useHandCursor:true});
 sc.fixToScreen?.(b,sc.scale.width-28,142);b.on('pointerup',()=>buildManager(sc));sc.v3411RewardButton=b;
}
function buildManager(sc,page=0){
 if(!sc)return;try{sc.v3411RewardManager?.destroy(true)}catch(_){}
 const rs=rewardState(),ids=rs.owned.filter(id=>REWARD_DECOR[id]),width=Math.min(590,Math.max(500,sc.scale.width-90)),height=500;
 const c=sc.add.container(0,0).setDepth(14500),bg=sc.add.rectangle(0,0,width,height,0x120817,.98).setOrigin(0).setStrokeStyle(2,0xc9a762,.72);
 const frame=window.MajickDecorativePanel?.phaserFrame?.(sc,width,height);if(frame)c.add(frame);
 c.add(bg);if(frame)c.bringToTop(frame);c.add(sc.add.text(18,14,'EARNED SANCTUARY TREASURES',{fontFamily:'Georgia',fontStyle:'bold',fontSize:'18px',color:'#f2d098'}));
 c.add(sc.add.text(18,40,'Mastery rewards • drag in Edit Mode • shift-click rotates • alt-click scales',{fontFamily:'Arial',fontSize:'9px',color:'#baa9c2'}));
 const close=sc.add.text(width-16,14,'✕ CLOSE',{fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:'#eee0f0',backgroundColor:'#56385f',padding:{x:8,y:5}}).setOrigin(1,0).setInteractive({useHandCursor:true});close.on('pointerup',()=>{try{c.destroy(true)}catch(_){}});c.add(close);
 let y=72;ids.slice(page*7,page*7+7).forEach(id=>{const d=REWARD_DECOR[id],stored=rs.stored.includes(id),row=sc.add.rectangle(14,y,width-28,48,0x1d1525,.94).setOrigin(0).setStrokeStyle(1,COLORS[d.rarity]||0x60466b,.55);
   const txt=sc.add.text(25,y+8,d.icon+' '+d.name,{fontFamily:'Arial',fontStyle:'bold',fontSize:'11px',color:'#efe3ed'}),sub=sc.add.text(25,y+27,d.rarity.toUpperCase()+' • '+(stored?'STORED':'PLACED'),{fontFamily:'Arial',fontSize:'8px',color:'#b6a3be'});
   const act=sc.add.text(width-24,y+10,stored?'PLACE':'STORE',{fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:stored?'#24170d':'#f3e7f5',backgroundColor:stored?'#d0ae69':'#56385f',padding:{x:9,y:6}}).setOrigin(1,0).setInteractive({useHandCursor:true});act.on('pointerup',()=>setStored(id,!stored));c.add([row,txt,sub,act]);y+=54;
 });
 if(!ids.length)c.add(sc.add.text(24,88,'No reward furniture yet. Master concepts and open rare drops to furnish the Sanctuary.',{fontFamily:'Arial',fontSize:'11px',color:'#aa9bad',wordWrap:{width:width-48}}));
 if(page>0){const prev=sc.add.text(18,height-32,'← Previous',{fontSize:'12px',color:'#efdcac'}).setInteractive();prev.on('pointerup',()=>buildManager(sc,page-1));c.add(prev)}
 if((page+1)*7<ids.length){const next=sc.add.text(width-90,height-32,'Next →',{fontSize:'12px',color:'#efdcac'}).setInteractive();next.on('pointerup',()=>buildManager(sc,page+1));c.add(next)}
 sc.v3411RewardManager=c;sc.fixToScreen?.(c,Math.max(24,(sc.scale.width-width)/2),Math.max(90,(sc.scale.height-height)/2));
}
let equippedRows=[];
function syncEquipment(sc){
 if(!sc)return;sc.vaultEquipment=sc.vaultEquipment||{};
 const wanted=new Set();
 for(const row of equippedRows){
  if(!ITEM_ART[row.itemId])continue;
  const pet=sc.v3348Sprites?.[row.petId]||((sc.v3317CareState?.roster||[]).find(g=>g.petId===row.petId)?.type&&sc[(sc.v3317CareState.roster.find(g=>g.petId===row.petId)).type]);
  if(!pet?.active||!pet.visible)continue;
  wanted.add(row.petId);const key='reward-'+row.itemId;if(!sc.textures.exists(key))continue;
  let img=sc.vaultEquipment[row.petId];if(!img?.active)img=sc.vaultEquipment[row.petId]=sc.add.image(0,0,key);
  if(img.texture.key!==key)img.setTexture(key);
  const isHead=/circlet|glasses|monocle/.test(row.itemId),cape=/cape|cloak/.test(row.itemId);
  const width=Math.max(28,pet.displayWidth*(cape?.6:isHead?.45:.22));
  img.setDisplaySize(width,width*img.height/img.width);img.setPosition(pet.x,pet.y-pet.displayHeight*(isHead?.65:cape?.35:.25));img.setDepth((pet.depth||50)+(cape?-1:1));img.setVisible(true);
 }
 for(const [id,img] of Object.entries(sc.vaultEquipment))if(!wanted.has(id)){img.destroy();delete sc.vaultEquipment[id]}
}
function onRewardState(d){
 const rs=rewardState();rs.owned=(d.inventory?.blueprints||[]).filter(id=>REWARD_DECOR[id]);
 if(d.room){rs.stored=(d.room.stored||[]).filter(id=>rs.owned.includes(id));rs.positions=d.room.positions||{}}
 else notifyParent({room:{stored:rs.stored,positions:rs.positions}});
 save(rs);equippedRows=d.equipment||[];
 const sc=scene();if(sc){applyOwned(rs.owned);if(!sc.__vaultEquipmentUpdate){sc.__vaultEquipmentUpdate=true;sc.events.on('postupdate',()=>syncEquipment(sc))}syncEquipment(sc)}
}
window.addEventListener('message',ev=>{if(ev.origin!==location.origin||ev.source!==window.parent)return;const d=ev.data||{};if(d.type==='MAJICK_REWARD_INVENTORY')onRewardState(d)});
function request(){window.parent?.postMessage({type:'MAJICK_REWARD_REQUEST'},location.origin)}
window.addEventListener('load',request);setTimeout(request,700);setTimeout(request,1800);
// Request the saved inventory once the Game scene is ready, even after a long preload.
const readyTimer=setInterval(()=>{if(scene()){clearInterval(readyTimer);request()}},250);
window.MajickRewardSanctuary={VERSION,REWARD_DECOR,applyOwned,setStored,rewardState,inspect:()=>({version:VERSION,...rewardState(),live:Object.keys(scene()?.v3411RewardDecor||{})})};
})();
