(()=>{
'use strict';
if(window.MajickScholarProgression)return;
const TIERS=[{level:1,name:'New Scholar',min:0},{level:3,name:'Apprentice Enchantress',min:200},{level:5,name:'Arcane Scholar',min:600},{level:8,name:'Master Enchantress',min:1400},{level:12,name:'Celestial Scholar',min:3000}];
const ITEMS=[
 {id:'scholar-plum',name:'Plum Scholar Gown',slot:'robe',rarity:'Common',min:0,robe:0},
 {id:'scholar-midnight',name:'Midnight Velvet',slot:'robe',rarity:'Uncommon',min:200,robe:1},
 {id:'scholar-emerald',name:'Emerald Witch',slot:'robe',rarity:'Rare',min:600,robe:2},
 {id:'scholar-silver',name:'Moonlit Silver',slot:'robe',rarity:'Epic',min:1400,robe:3},
 {id:'hair-locs',name:'Celestial Locs',slot:'hair',rarity:'Common',min:0,hair:0},
 {id:'hair-braids',name:'Scholar Braids',slot:'hair',rarity:'Common',min:0,hair:1},
 {id:'hair-afro',name:'Moonlit Afro',slot:'hair',rarity:'Common',min:0,hair:3},
 {id:'hair-curls',name:'Arcane Curls',slot:'hair',rarity:'Uncommon',min:200,hair:2},
 {id:'hair-twists',name:'Woven Twists',slot:'hair',rarity:'Rare',min:600,hair:4},
 {id:'hair-waves',name:'Astral Waves',slot:'hair',rarity:'Epic',min:1400,hair:5},
 {id:'nails-moon',name:'Moonlit Manicure',slot:'nails',rarity:'Uncommon',min:200},
 {id:'jewelry-stars',name:'Starfall Jewelry',slot:'jewelry',rarity:'Rare',min:600},
 {id:'cape-celestial',name:'Celestial Cape',slot:'cape',rarity:'Legendary',min:3000}
];
const BONDS=[['Velora','velora'],['Cascade','cascade'],['Solstice','solstice'],['Aurelia','aurelia'],['Vesper','vesper'],['Briar','briar'],['Zephyr','zephyr'],['Prism','prism'],['Rook','rook'],['Solara','solara']];
for(const [name,id] of BONDS)ITEMS.push({id:'bond-'+id,name:name+' Bond Brooch',slot:'jewelry',rarity:'Epic',guardian:id,bond:5});
function identity(){const s=window.S;if(!s)return null;s.majickIdentity=s.majickIdentity||{};const a=s.majickIdentity;a.atelier=a.atelier||{};return a.atelier}
function events(){try{return window.MajickStateCore?.ensureAccount?.()?.studyProgressBridge?.events||window.S?.majickAccount?.studyProgressBridge?.events||{}}catch(_){return {}}}
function bridge(){const a=window.MajickStateCore;try{return a?.ensureAccount?.()||window.S?.majickAccount||null}catch(_){return null}}
function validEvents(){const stored=bridge()?.studyProgressBridge?.events||events();return Object.entries(stored).filter(([k,v])=>v&&v.correct&&!v.historical&&!v.legacyAwarded&&!String(k).startsWith('hist:'))}
function score(){return validEvents().reduce((sum,[,e])=>sum+(e.independent===false?2:5),0)}
function guardianRows(){const rows=window.S?.legacy?.pets||[];return Array.isArray(rows)?rows:[]}
function current(){const p=identity();if(!p)return {xp:0,level:1,title:TIERS[0].name,owned:[],items:ITEMS};const xp=score(),tier=TIERS.filter(x=>xp>=x.min).at(-1)||TIERS[0],next=TIERS.find(x=>x.min>xp);p.scholarWardrobe=p.scholarWardrobe||{unlocked:{},equipped:{}};const owned=p.scholarWardrobe.unlocked;let updated=false;
 for(const item of ITEMS){let unlock=xp>=item.min;if(item.guardian){unlock=false;const pet=guardianRows().find(g=>String(g.name||g.type||'').toLowerCase().includes(item.guardian));unlock=!!pet&&Number(pet.bond||pet.bondLevel||0)>=item.bond}if(unlock&&!owned[item.id]){owned[item.id]=Date.now();updated=true}}
 if(updated)try{window.save?.()}catch(_){}
 const level=tier.level+(next?Math.floor((xp-tier.min)/Math.max(1,(next.min-tier.min)/(next.level-tier.level))):Math.floor((xp-tier.min)/400));
 return {xp,level,title:tier.name,next:next?.min??null,owned:Object.keys(owned),items:ITEMS,tiers:TIERS};
}
function equip(id){const p=identity(),data=current(),item=ITEMS.find(x=>x.id===id);if(!p||!item||!data.owned.includes(id))return false;
 if(item.slot==='robe')p.robe=item.robe;
 else if(item.slot==='hair')p.hair=item.hair;
 else{p.scholarWardrobe.equipped[item.slot]=id}
 try{window.save?.()}catch(_){}
 window.MajickScholarCompanion?.refresh?.(true);return true}
function markup(){const data=current(),p=identity();return '<section class="scholarWardrobe"><h3>✦ Scholar Rank · '+data.title+'</h3><p>Level '+data.level+' · '+data.xp+' Scholar progress points'+(data.next!=null?' · Next tier at '+data.next:' · Celestial tier')+'</p><small>Progress derives from qualifying study records. Your existing XP and crystals are unchanged.</small><h4>Magical Wardrobe</h4><div class="scholarWardrobeGrid">'+ITEMS.map(item=>{let owned=data.owned.includes(item.id),equipped=item.slot==='robe'?p?.robe===item.robe:item.slot==='hair'?p?.hair===item.hair:p?.scholarWardrobe?.equipped?.[item.slot]===item.id;return '<div class="scholarWardrobeItem"><b>'+item.name+'</b><span>'+item.rarity+' · '+item.slot+'</span><button type="button" data-scholar-equip="'+item.id+'" '+(!owned||equipped?'disabled':'')+'>'+(equipped?'Equipped ✓':owned?'Equip':'Locked · '+(item.guardian?'Guardian bond '+item.bond:item.min+' pts'))+'</button></div>'}).join('')+'</div></section>'}
const style=document.createElement('style');style.textContent='.scholarWardrobe{margin:22px 0;padding:18px;border:1px solid #9d7c64;border-radius:14px;background:#302239;color:#f4dfcf}.scholarWardrobe h3,.scholarWardrobe h4{color:#f4d39d}.scholarWardrobeGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px;margin-top:12px}.scholarWardrobeItem{display:flex;flex-direction:column;gap:7px;padding:12px;background:#231b2e;border:1px solid #695369;border-radius:10px}.scholarWardrobeItem span{font:12px system-ui;color:#d7bdd0}.scholarWardrobeItem button{font:12px system-ui;border-radius:8px;border:1px solid #b99579;background:#5a3b50;color:#fbe9db;padding:8px}.scholarWardrobeItem button:disabled{opacity:.6;cursor:not-allowed}';document.head.append(style);
document.addEventListener('click',event=>{const b=event.target?.closest?.('[data-scholar-equip]');if(!b)return;if(equip(b.dataset.scholarEquip)){window.MajickAtelier?.refresh?.()||document.querySelector('[data-tab="avatar"]')?.click()}});
window.MajickScholarProgression={current,equip,markup,ITEMS,TIERS,VERSION:'3.4.2-scholar-progression-1'};
})();