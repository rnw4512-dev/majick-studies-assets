const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let disposed=0,resizeCallback,lost;
class Container{constructor(){this.position={set(){}};this.children=[]}addChild(...items){this.children.push(...items)}}
class Graphics extends Container{circle(){return this}ellipse(){return this}fill(){return this}stroke(){return this}clear(){return this}}
const canvas={addEventListener(name,cb){if(name==='webglcontextlost')lost=cb},removeEventListener(){}};
const host={isConnected:false,setAttribute(){},append(){},remove(){this.isConnected=false},querySelector(){return canvas}};
const stage={isConnected:true,clientWidth:420,clientHeight:550,prepend(node){node.isConnected=true},querySelector(){throw Error('Scenery must never take ownership of avatar images')}};
class Application{constructor(){this.stage=new Container;this.screen={width:420,height:550};this.canvas=canvas;this.renderer={resize:(w,h)=>{this.screen={width:w,height:h}}};this.ticker={add(){}}}async init(){}start(){}stop(){}render(){}destroy(){disposed++}}
const window={PIXI:{VERSION:'8.6.6',Application,Container,Graphics},devicePixelRatio:1,matchMedia(){return {matches:false,addEventListener(){},removeEventListener(){}}}};
Object.defineProperty(window,'S',{get(){throw Error('Scenery must not access learner state')}});
const document={hidden:false,createElement(){return host},addEventListener(){},removeEventListener(){}};
class ResizeObserver{constructor(cb){resizeCallback=cb}observe(){}disconnect(){}}class MutationObserver{observe(){}disconnect(){}}
vm.runInNewContext(fs.readFileSync('current-site/atelier-pixi-scene.js','utf8'),{window,document,ResizeObserver,MutationObserver,console});
(async()=>{await window.MajickAtelierScene.mount(stage);assert.equal(host.isConnected,true);assert.equal(disposed,0);resizeCallback();assert.equal(host.isConnected,true);lost();assert.equal(disposed,1);assert.equal(host.isConnected,false);window.MajickAtelierScene.dispose();assert.equal(disposed,1,'cleanup is idempotent');console.log('PASS Atelier scenery never owns avatar images or learner state; context loss cleans up safely')})().catch(error=>{console.error(error);process.exitCode=1});
