const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/sanctuary-audit.js','utf8');
const timers=[],listeners={};
function element(){return {dataset:{},children:[],setAttribute(){},replaceChildren(){this.children=[];this.value=''},append(x){this.children.push(x)},addEventListener(k,fn){this[k]=fn},remove(){},set textContent(v){this.value=v;this.children=[]},get textContent(){return this.value||this.children.map(x=>x.textContent).join('')}}}
const wrap={querySelector(){return frame.box||null}},frame={dataset:{},isConnected:true,src:'https://example.test/sanctuary/index.html?v=3350',contentWindow:{postMessage(){}},closest:()=>wrap,before(x){this.box=x}};
const document={querySelectorAll:()=>[frame],createElement:element};
const window={S:{legacy:{pets:[{id:'v',name:'Vesper'},{id:'r',name:'Rook'}]}},render(){},addEventListener(k,fn){listeners[k]=fn}};
vm.runInNewContext(source,{window,document,location:{origin:'https://example.test',href:'https://example.test/'},URL,setTimeout:fn=>{timers.push(fn)}});
window.render();timers.shift()();
listeners.message({origin:'https://example.test',source:frame.contentWindow,data:{type:'MAJICK_SANCTUARY_ROSTER_V3350',rows:[{petId:'v',present:true},{petId:'r',present:true}]}});
assert.match(frame.box.textContent,/All 2 owned Guardians present/);
listeners.message({origin:'https://example.test',source:frame.contentWindow,data:{type:'MAJICK_SANCTUARY_ROSTER_V3350',rows:[{petId:'v',present:true},{petId:'r',present:false}]}});
assert.match(frame.box.textContent,/needs Rook/);
assert.equal(frame.box.children[1].textContent,'Repair room');
frame.box.children[1].click();
assert.match(frame.src,/repair=/);
console.log('V3.3.50 SANCTUARY AUDIT SMOKE PASSED');
