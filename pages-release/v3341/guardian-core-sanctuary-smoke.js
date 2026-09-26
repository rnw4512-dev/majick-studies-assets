const fs=require('fs');
const vm=require('vm');
function assert(x,msg){if(!x)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3341/guardian-core-sanctuary.js','utf8');

function sprite(){
  return {
    active:true,visible:true,alpha:1,x:0,y:0,
    setVisible(v){this.visible=!!v;return this},
    setAlpha(v){this.alpha=Number(v);return this}
  };
}
function Game(){
  this.v3317CareState={roster:[{type:'luna',petId:'p1'}]};
  this.luna=sprite();
  this.v3317Walk_luna=sprite();
  this.v3317Action_luna=sprite();this.v3317Action_luna.active=false;
  this.time={
    addEvent(){return {active:true}},
    delayedCall(ms,fn){fn();return {}}
  };
  this.add={text(){return {setOrigin(){return this},setDepth(){return this},destroy(){}}}};
  this.tweens={add(cfg){cfg.onComplete?.()}};
}
Game.prototype.v3317UpdateGuardianVisuals=function(){};
Game.prototype.create=function(){};
Game.prototype.v3317CareReaction=function(){};
Game.prototype.openGuardianCarePanel=function(){};
Game.prototype.lunaWalk=function(){this.lunaMoveTween={isPlaying(){return true}}};

const document={documentElement:{dataset:{}},addEventListener(){}};
const ctx={
  console,Math,Date,setTimeout(fn){fn();return 1},clearTimeout(){},
  document,location:{origin:'https://example.test'},
  Game,
  MajickGuardianRegistry:{protectedMotionTypes(){return ['luna']}},
  addEventListener(){},
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'guardian-core-sanctuary.js'});

assert(ctx.MajickGuardianCoreSanctuary?.VERSION==='3.3.41','Sanctuary Guardian Core version missing');
assert(document.documentElement.dataset.majickGuardianCoreSanctuary==='3.3.41','Sanctuary dataset missing');

const scene=new ctx.Game();
scene.__v3341Prev={luna:{x:0,y:0}};
scene.luna.x=35;scene.luna.y=12;
scene.v3317UpdateGuardianVisuals();
assert(scene.luna.visible===true&&scene.luna.alpha===1,'Moving Phaser controller must be visible');
assert(scene.v3317Walk_luna.visible===false,'Static evolved walk layer must hide while Phaser controller moves');

scene.__v3341Prev.luna={x:35,y:12};
scene.v3317Walk_luna.active=true;
scene.v3317UpdateGuardianVisuals();
assert(scene.v3317Walk_luna.visible===true,'Evolved idle/walk layer should return when Guardian settles');
assert(scene.luna.alpha===0,'Controller should hide behind evolved idle layer when settled');

scene.v3317Action_luna.active=true;
scene.v3317Action_luna.visible=true;
scene.v3317UpdateGuardianVisuals();
assert(scene.v3317Walk_luna.visible===false,'Walk layer must hide during explicit Guardian action');
assert(scene.luna.alpha===0,'Controller must hide during explicit evolved action image');

const inspect=ctx.MajickGuardianCoreSanctuary.inspect(scene);
assert(inspect.guardians.luna.owned===true,'Owned Guardian not recognized');
assert('controllerVisible' in inspect.guardians.luna,'Movement visibility diagnostics missing');

console.log('V3.3.41 GUARDIAN PHASER SMOKE PASSED');
console.log(JSON.stringify({version:inspect.version,luna:inspect.guardians.luna}));
