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
scene.add={
 image(x,y,key){const data={};return {x,y,height:400,texture:{key},active:true,scaleX:1,scaleY:1,angle:0,alpha:1,flipX:false,setOrigin(){return this},setDepth(){return this},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this},setAngle(v){this.angle=v;return this},setAlpha(v){this.alpha=v;return this},setInteractive(){return this},setData(k,v){data[k]=v;this[k]=v;return this},getData(k){return data[k]},on(){return this},setFlipX(v){this.flipX=!!v;return this},destroy(){this.active=false}}},
 text(x,y,text){return {x,y,text,active:true,alpha:1,setOrigin(){return this},setDepth(){return this},destroy(){this.active=false}}}
};
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
assert.match(source,/playStyle/,'dynamic Guardian play-style helper missing');
assert.match(source,/favoritePlayBurst/,'favorite-toy play burst helper missing');
assert.match(source,/sleepAura/,'Guardian sleep aura helper missing');
assert.match(source,/wakeDynamicGuardian/,'Guardian wake animation helper missing');
assert.match(source,/v3353SleepState/,'Guardian sleep-state marker missing');
assert.match(source,/arcane-float/,'Vesper\/Rook play style missing');
assert.match(source,/double-hop/,'Briar\/Solara play style missing');
assert.match(source,/wiggle-bob/,'Prism\/Cascade play style missing');
assert.match(source,/walking-to-care/,'dynamic Guardian travel motion state missing');
assert.ok(scene.labelsUpdated,'room labels must use current roster');
scene.v3320ApplyCareSnapshot({roster:[
  {petId:'owned-vesper',type:'vesper',name:'My Vesper',level:4},
  {petId:'second-vesper',type:'vesper',name:'Second Owl',level:3}
]});
assert.notEqual(scene.v3348PetById['owned-vesper'],scene.v3348PetById['second-vesper'],'two owned Guardians of one type need two bodies');
assert.match(source,/seedText=String\(g\?\.petId/,'individual behavior should be deterministically seeded by Guardian identity');
assert.ok(['walking','idle','breathing'].includes(scene.v3348PetById['second-vesper'].getData('v3351MotionState')),'second same-species Guardian needs independent motion state');
assert.equal(reports.at(-1).rows.filter(g=>g.present).length,2);
assert.match(source,/playStyles:Object\.fromEntries/,'Sanctuary roster QA output should expose dynamic play styles');
assert.match(source,/sleepStates:Object\.fromEntries/,'Sanctuary roster QA output should expose dynamic sleep states');
assert.match(source,/idleStyle/,'dynamic Guardian personality idle helper missing');
assert.match(source,/watchful-tilt/,'watchful Guardian idle style missing');
assert.match(source,/quick-fidget/,'Zephyr-style idle fidget missing');
assert.match(source,/curious-wiggle/,'curious Guardian idle style missing');
assert.match(source,/idleStyles:Object\.fromEntries/,'Sanctuary roster QA output should expose dynamic idle styles');
assert.match(source,/individualBehavior/,'individual Guardian behavior helper missing');
assert.match(source,/v3355IndividualBehavior/,'individual Guardian behavior state marker missing');
assert.match(source,/roamScale/,'individual Guardian roam variation missing');
assert.match(source,/pauseScale/,'individual Guardian pause variation missing');
assert.match(source,/careVisualBurst/,'distinct Guardian care visual-burst helper missing');
for(const action of ['feed','water','treat','groom','affection']){
  assert.match(source,new RegExp("action==='"+action+"'"),action+' needs a distinct dynamic Sanctuary motion');
}
assert.match(source,/careVisualActions:\['feed','water','treat','groom','affection'\]/,'Sanctuary QA output must expose the five visible care actions');
assert.match(source,/meal/,'feeding visual label missing');
assert.match(source,/water/,'water visual label missing');
assert.match(source,/shine/,'grooming shine visual label missing');
assert.match(source,/bond/,'affection bond visual label missing');
scene.v3320ApplyCareSnapshot({roster:[]});
assert.equal(scene.v3348PetById['owned-vesper'],undefined,'removed Guardian cannot remain visible');
assert.ok(reports.some(x=>x.type==='MAJICK_SANCTUARY_ROSTER_V3350'&&x.rows.some(g=>g.petId==='owned-vesper'&&g.present)));
console.log('V3.3.48 SANCTUARY ROSTER MOTION SMOKE PASSED');
