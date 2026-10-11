(()=>{
'use strict';
const VERSION='3.4.11-reward-sanctuary';
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
const COLORS={enchanted:0x65527b,rare:0x425d7b,arcane:0x70428b,celestial:0x9d7b35};
const KEY='majick-reward-sanctuary-v3411';
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function scene(){try{return window.majickPhaserGame?.scene?.getScene?.('Game')||null}catch(_){return null}}
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){return {}}}
function save(v){try{localStorage.setItem(KEY,JSON.stringify(v||{}))}catch(_){}}
function rewardState(){
 const s=read();s.positions=s.positions||{};s.stored=Array.isArray(s.stored)?s.stored:[];s.owned=Array.isArray(s.owned)?s.owned:[];return s;
}
function syncFurnitureState(sc,owned){
 if(!sc)return;
 const old=sc.v3321EnsureFurnitureState;
 if(old&&!old.__rewardExtended){
   const fn=function(incoming){
     const base=old.call(this,incoming),r=rewardState(),all=[...new Set([...(base.owned||[]),...(r.owned||[])])];
     const stored=[...new Set([...(base.stored||[]),...(r.stored||[])])].filter(id=>all.includes(id));
     base.owned=all;base.stored=stored;this.v3321FurnitureState=base;return base;
   };
   fn.__rewardExtended=true;sc.v3321EnsureFurnitureState=fn;
 }
 const rs=rewardState();rs.owned=[...new Set(owned.filter(id=>REWARD_DECOR[id]))];save(rs);
 if(sc.v3321FurnitureState){
   sc.v3321FurnitureState.owned=[...new Set([...(sc.v3321FurnitureState.owned||[]),...rs.owned])];
   sc.v3321FurnitureState.stored=[...new Set([...(sc.v3321FurnitureState.stored||[]),...rs.stored])];
 }
}
function buildItem(sc,id,index){
 const def=REWARD_DECOR[id];if(!def)return null;
 sc.v3411RewardDecor=sc.v3411RewardDecor||{};
 if(sc.v3411RewardDecor[id]?.active)return sc.v3411RewardDecor[id];
 const rs=rewardState(),pos=rs.positions[id]||{x:380+(index%6)*250,y:670+Math.floor(index/6)*180,scale:1,rotation:0};
 const c=sc.add.container(pos.x,pos.y).setDepth(48);
 const bg=sc.add.rectangle(0,0,def.w,def.h,COLORS[def.rarity]||0x65527b,.86).setStrokeStyle(2,0xe0c174,.68);
 const icon=sc.add.text(0,-8,def.icon,{fontFamily:'Arial',fontSize:'29px',color:'#fff4d5'}).setOrigin(.5);
 const title=sc.add.text(0,def.h/2-16,def.name,{fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:'#f4e7ee',align:'center',wordWrap:{width:def.w-12}}).setOrigin(.5);
 const rare=sc.add.text(0,-def.h/2+9,def.rarity.toUpperCase(),{fontFamily:'Arial',fontStyle:'bold',fontSize:'7px',color:'#f1d27f'}).setOrigin(.5);
 c.add([bg,icon,title,rare]);c.setSize(def.w,def.h).setInteractive({useHandCursor:true,draggable:true});
 c.setScale(Number(pos.scale||1));c.setRotation(Number(pos.rotation||0));
 c.setData('objectId',id);c.setData('decorId',id);c.setData('rewardDecor',true);c.setData('label',def.name);
 sc.input.setDraggable(c);
 c.on('drag',(pointer,x,y)=>{if(sc.editMode){c.x=Math.max(70,Math.min(sc.worldWidth-70,x));c.y=Math.max(180,Math.min(930,y))}});
 c.on('dragend',()=>{const x=Math.round(c.x/20)*20,y=Math.round(c.y/20)*20;c.x=x;c.y=y;const st=rewardState();st.positions[id]={x,y,scale:c.scaleX,rotation:c.rotation};save(st)});
 c.on('pointerup',pointer=>{
   if(!sc.editMode)return;
   if(pointer?.event?.shiftKey){c.rotation=(c.rotation+.2618)%(Math.PI*2)}
   else if(pointer?.event?.altKey){c.setScale(Math.min(1.6,Number(c.scaleX||1)+.1))}
   const st=rewardState();st.positions[id]={x:c.x,y:c.y,scale:c.scaleX,rotation:c.rotation};save(st);
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
 const rs=rewardState(),s=new Set(rs.stored);if(stored)s.add(id);else s.delete(id);rs.stored=[...s];save(rs);applyOwned(rs.owned);buildManager(scene());
 try{scene()?.showToast?.(stored?'Reward furniture stored':'Reward furniture placed',REWARD_DECOR[id]?.name||id)}catch(_){}
}
function buildButton(sc){
 if(!sc||sc.v3411RewardButton?.active)return;
 const b=sc.add.text(0,0,'✦ REWARD DECOR',{fontFamily:'Arial',fontStyle:'bold',fontSize:'10px',color:'#f8e7be',backgroundColor:'#55356dcc',padding:{x:11,y:7}}).setOrigin(1,0).setDepth(12090).setInteractive({useHandCursor:true});
 sc.fixToScreen?.(b,sc.scale.width-28,142);b.on('pointerup',()=>buildManager(sc));sc.v3411RewardButton=b;
}
function buildManager(sc){
 if(!sc)return;try{sc.v3411RewardManager?.destroy(true)}catch(_){}
 const rs=rewardState(),ids=rs.owned.filter(id=>REWARD_DECOR[id]),width=Math.min(590,Math.max(500,sc.scale.width-90)),height=500;
 const c=sc.add.container(0,0).setDepth(14500),bg=sc.add.rectangle(0,0,width,height,0x120817,.98).setOrigin(0).setStrokeStyle(2,0xc9a762,.72);
 c.add(bg);c.add(sc.add.text(18,14,'EARNED SANCTUARY TREASURES',{fontFamily:'Georgia',fontStyle:'bold',fontSize:'18px',color:'#f2d098'}));
 c.add(sc.add.text(18,40,'Mastery rewards • drag in Edit Mode • shift-click rotates • alt-click scales',{fontFamily:'Arial',fontSize:'9px',color:'#baa9c2'}));
 const close=sc.add.text(width-16,14,'✕ CLOSE',{fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:'#eee0f0',backgroundColor:'#56385f',padding:{x:8,y:5}}).setOrigin(1,0).setInteractive({useHandCursor:true});close.on('pointerup',()=>{try{c.destroy(true)}catch(_){}});c.add(close);
 let y=72;ids.slice(0,7).forEach(id=>{const d=REWARD_DECOR[id],stored=rs.stored.includes(id),row=sc.add.rectangle(14,y,width-28,48,0x1d1525,.94).setOrigin(0).setStrokeStyle(1,COLORS[d.rarity]||0x60466b,.55);
   const txt=sc.add.text(25,y+8,d.icon+' '+d.name,{fontFamily:'Arial',fontStyle:'bold',fontSize:'11px',color:'#efe3ed'}),sub=sc.add.text(25,y+27,d.rarity.toUpperCase()+' • '+(stored?'STORED':'PLACED'),{fontFamily:'Arial',fontSize:'8px',color:'#b6a3be'});
   const act=sc.add.text(width-24,y+10,stored?'PLACE':'STORE',{fontFamily:'Arial',fontStyle:'bold',fontSize:'9px',color:stored?'#24170d':'#f3e7f5',backgroundColor:stored?'#d0ae69':'#56385f',padding:{x:9,y:6}}).setOrigin(1,0).setInteractive({useHandCursor:true});act.on('pointerup',()=>setStored(id,!stored));c.add([row,txt,sub,act]);y+=54;
 });
 if(!ids.length)c.add(sc.add.text(24,88,'No reward furniture yet. Master concepts and open rare drops to furnish the Sanctuary.',{fontFamily:'Arial',fontSize:'11px',color:'#aa9bad',wordWrap:{width:width-48}}));
 sc.v3411RewardManager=c;sc.fixToScreen?.(c,Math.max(24,(sc.scale.width-width)/2),Math.max(90,(sc.scale.height-height)/2));
}
function onState(payload){
 const blueprints=payload?.rewardInventory?.blueprints||[];setTimeout(()=>applyOwned(blueprints),50);
}
window.addEventListener('message',ev=>{const d=ev.data||{};if(d.type==='MAJICK_STATE')onState(d.payload||{})});
setTimeout(()=>{const sc=scene();if(sc){const pending=window.majickPendingState;onState(pending||{})}},700);
window.MajickRewardSanctuary={VERSION,REWARD_DECOR,applyOwned,setStored,rewardState,inspect:()=>({version:VERSION,...rewardState(),live:Object.keys(scene()?.v3411RewardDecor||{})})};
})();