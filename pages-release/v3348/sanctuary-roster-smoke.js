const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/sanctuary-roster.js','utf8');
const callbacks={},textures=new Set(),reports=[];
function Game(){}
Game.prototype.create=function(){};
Game.prototype.v3320ApplyCareSnapshot=function(s){this.v3317CareState=s};
Game.prototype.v3320RefreshGuardianLabels=function(){this.labelsUpdated=true};
const scene=new Game();
scene.sys={isActive:()=>true};scene.worldWidth=2500;scene.worldHeight=1000;
scene.v3317GuardianStates={vesper:{level:4,stageSlug:'apprentice'}};
scene.textures={exists:key=>textures.has(key)};
scene.tweens={
  killTweensOf(target){target._tweening=false},
  add(args){
    scene.lastTween=args;
    const target=args.targets;
    if(target)target._tweening=true;
    if(args.scaleX!=null&&target)target.scaleX=args.scaleX;
    if(args.scaleY!=null&&target)target.scaleY=args.scaleY;
    if(args.angle!=null&&target)target.angle=args.angle;
    return {stop(){if(target)target._tweening=false}};
  },
  isTweening:target=>!!target?._tweening
};
scene.time={delayedCall(){},addEvent(){}};
scene.add={image(x,y,key){const data={};return {x,y,height:400,texture:{key},active:true,scaleX:1,scaleY:1,angle:0,alpha:1,flipX:false,setOrigin(){return this},setDepth(){return this},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this},setAngle(v){this.angle=v;return this},setAlpha(v){this.alpha=v;return this},setInteractive(){return this},setData(k,v){data[k]=v;this[k]=v;return this},getData(k){return data[k]},on(){return this},setFlipX(v){this.flipX=!!v;return this},destroy(){this.active=false}}}};
scene.load={once(event,fn){callbacks[event]=fn},image(key,url){scene.loaded={key,url}},start(){textures.add(scene.loaded.key);callbacks['filecomplete-image-'+scene.loaded.key]?.()}};
vm.runInNewContext(source,{Game,window:{MajickGuardianRegistry:{get:type=>({canon:type})},addEventListener(){},parent:{postMessage:data=>reports.push(data)}},location:{origin:'https://example.test'},Math});
scene.create();
scene.v3320ApplyCareSnapshot({roster:[{petId:'owned-vesper',type:'vesper',name:'My Vesper',level:4}]});
assert.equal(scene.loaded.url,'../assets/familiars/canon/vesper-guardian.webp?v=3348');
assert.equal(scene.v3348PetById['owned-vesper'].guardianName,'My Vesper');
assert.equal(scene.v3348PetById['owned-vesper'].guardianId,'owned-vesper');
assert.ok(scene.lastTween,'owned Vesper must move');
assert.equal(scene.v3348PetById['owned-vesper'].getData('v3351MotionState'),'walking','dynamic Guardian should enter walking motion state');
assert.match(source,/idleDynamicGuardian/,'dynamic Guardian idle breathing helper missing');
assert.match(source,/actionDynamicGuardian/,'dynamic Guardian care-action motion helper missing');
assert.match(source,/walking-to-care/,'dynamic Guardian travel motion state missing');
assert.ok(scene.labelsUpdated,'room labels must use current roster');
scene.v3320ApplyCareSnapshot({roster:[
  {petId:'owned-vesper',type:'vesper',name:'My Vesper',level:4},
  {petId:'second-vesper',type:'vesper',name:'Second Owl',level:3}
]});
assert.notEqual(scene.v3348PetById['owned-vesper'],scene.v3348PetById['second-vesper'],'two owned Guardians of one type need two bodies');
assert.ok(['walking','idle','breathing'].includes(scene.v3348PetById['second-vesper'].getData('v3351MotionState')),'second same-species Guardian needs independent motion state');
assert.equal(reports.at(-1).rows.filter(g=>g.present).length,2);
scene.v3320ApplyCareSnapshot({roster:[]});
assert.equal(scene.v3348PetById['owned-vesper'],undefined,'removed Guardian cannot remain visible');
assert.ok(reports.some(x=>x.type==='MAJICK_SANCTUARY_ROSTER_V3350'&&x.rows.some(g=>g.petId==='owned-vesper'&&g.present)));
console.log('V3.3.48 SANCTUARY ROSTER MOTION SMOKE PASSED');
