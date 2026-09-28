const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/collegium-atmosphere.js','utf8');
let audioCreated=0,button;
const top={querySelector:()=>button,append:x=>{button=x}};
const document={hidden:false,body:{dataset:{}},querySelector:s=>s==='.top'?top:null,createElement:()=>({attributes:{},setAttribute(k,v){this.attributes[k]=v},addEventListener(){}}),addEventListener(){}};
const context={document,window:{S:{screen:'home'},render(){},AudioContext:class{constructor(){audioCreated++}}},localStorage:{getItem(){return null}},setTimeout(){},clearTimeout(){}};
vm.runInNewContext(source,context);
assert.equal(audioCreated,0,'ambience must wait for user gesture');
for(const room of ['home','learninglab','livinggrimoire','companions']){
  context.window.S.screen=room;context.window.MajickCollegiumAtmosphere.decorate();
  assert.equal(document.body.dataset.majickRoom,room);
  assert.match(button.textContent,/ambience off/);
}
assert.equal(button.attributes['aria-pressed'],'false');
console.log('V3.3.47 COLLEGIUM ATMOSPHERE SMOKE PASSED');
