const fs=require('fs');
const vm=require('vm');
function assert(x,msg){if(!x)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3342/sanctuary-alive.js','utf8');

function obj(x=0,y=0){
  return {x,y,width:300,height:160,visible:true,active:true,alpha:1,depth:0,data:{},events:{},
    setDepth(v){this.depth=v;return this},setScale(){return this},setTint(){return this},setOrigin(){return this},setStrokeStyle(){return this},
    setInteractive(){return this},on(ev,fn){this.events[ev]=fn;return this},setSize(){return this},
    setData(k,v){this.data[k]=v;return this},getData(k){return this.data[k]},add(){return this},destroy(){this.destroyed=true},
    setVisible(v){this.visible=!!v;return this},setAlpha(v){this.alpha=Number(v);return this}
  };
}
function decor(id,x,y,slot,blocks=true){
  const o=obj(x,y);o.data.objectId=id;o.data.manifestObject={id,category:'core',blocksWalking:blocks,placement:{x,y,slot}};return o;
}
function Game(){
  this.worldWidth=2800;this.worldHeight=1000;
  this.v3317CareState={roster:[
    {petId:'p1',type:'luna',name:'Velora',energy:90,hunger:90,hydration:90,fun:90,grooming:90,favoriteLabel:'Velvet Moon Cushion'},
    {petId:'p2',type:'ember',name:'Cascade',energy:90,hunger:90,hydration:90,fun:90,grooming:90,favoriteLabel:'Rune Puzzle'},
    {petId:'p3',type:'nova',name:'Solstice',energy:35,hunger:90,hydration:90,fun:90,grooming:90,favoriteLabel:'Comet Ball'}
  ],bedAssignments:{}};
  this.decorItems=[
    decor('moonstone-crystal-bed',760,840,'bed-west',true),
    decor('amethyst-crystal-bed',1980,840,'bed-east',true),
    decor('arcane-stacks',200,720,null,true),
    decor('guardian-food-bowl',920,880,null,false),
    decor('guardian-water-basin',1060,880,null,false),
    decor('guardian-play-rug',1380,880,null,false),
    decor('guardian-toy-basket',1700,860,null,false)
  ];
  this.luna=obj(500,700);this.ember=obj(900,700);this.nova=obj(1450,700);
  this.textures={exists(k){return k==='obj-moonstone-crystal-bed'||k==='obj-amethyst-crystal-bed'}};
  this.add={
    container(x,y){return obj(x,y)},
    image(x,y){return obj(x,y)},
    ellipse(x,y){return obj(x,y)},
    rectangle(x,y){return obj(x,y)},
    circle(x,y){return obj(x,y)},
    text(x,y,t){const o=obj(x,y);o.text=t;return o}
  };
  this.tweens={add(cfg){if(cfg.targets){cfg.targets.x=cfg.x??cfg.targets.x;cfg.targets.y=cfg.y??cfg.targets.y}cfg.onComplete?.();return {isPlaying(){return false},stop(){},remove(){}}}};
  this.time={delayedCall(ms,fn){fn();return {remove(){}}},addEvent(){return {active:true}}};
  this.scale={width:1200,height:720};
}
Game.prototype.create=function(){};
Game.prototype.v3320ApplyCareSnapshot=function(s){this.v3317CareState=s};
Game.prototype.getObjectInteractionDef=function(){return null};
Game.prototype.getSanctuaryObject=function(){return null};
Game.prototype.v3317CareRequest=function(){};
Game.prototype.v3317ShowAction=function(){};
Game.prototype.showPetMessage=function(){};

const ctx={
  console,Math,Date,JSON,Game,
  document:{documentElement:{dataset:{}}},
  location:{origin:'https://example.test'},
  addEventListener(){},innerWidth:1200,innerHeight:720
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'sanctuary-alive.js'});

const M=ctx.MajickSanctuaryAlive;
assert(M&&M.VERSION==='3.3.42','Sanctuary Alive version missing');
const scene=new ctx.Game();
scene.v3342BuildPersonalNooks();

const inspect=M.inspect(scene);
assert(inspect.roster.length===3,'Expected three Guardians');
const beds=inspect.roster.map(x=>x.bed);
assert(new Set(beds).size===3,'Every hatched Guardian must have a distinct bed');
assert(beds[0]==='bed-west','First Guardian should use west bed by default');
assert(beds[1]==='bed-east','Second Guardian should use east bed by default');
assert(/^guardian-bed-/.test(beds[2]),'Third Guardian needs an expandable personal bed');
assert(inspect.personalBeds.length===1,'Third Guardian personal bed was not created');
assert(inspect.nookItems.length===6,'Each Guardian should receive a keepsake and comfort item');

const third=scene.v3317CareState.roster[2];
const target=scene.v3342RoutineTarget(third,2);
assert(target.id===beds[2]&&target.action==='sleep','Low-energy Guardian should seek its own bed');
assert(M.PROFILES.luna.preferences.includes('arcane-stacks'),'Velora personality preferences missing');
assert(M.PROFILES.ember.preferences.includes('guardian-play-rug'),'Cascade personality preferences missing');
assert(M.PROFILES.nova.preferences.includes('observatory-telescope'),'Solstice personality preferences missing');
assert(M.PROFILES.mallow.preferences.includes('guardian-play-rug'),'Aurelia personality preferences missing');

console.log('V3.3.42 SANCTUARY ALIVE SMOKE PASSED');
console.log(JSON.stringify({version:M.VERSION,beds,personalBeds:inspect.personalBeds,nookItems:inspect.nookItems.length,target}));
