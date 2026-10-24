/* PixiJS v8 render groups: room and ambient magic; fitted scholar stays with its existing DOM owner. No save writes. */
(()=>{
'use strict';
let loading;
function library(){
 if(window.PIXI?.VERSION?.startsWith('8.'))return Promise.resolve(window.PIXI);
 return loading||(loading=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./vendor/pixi-8.6.6.min.js';s.onload=()=>resolve(window.PIXI);s.onerror=()=>{loading=null;s.remove();reject(new Error('Scene unavailable'))};document.head.append(s)}));
}
let active=null;
function dispose(){if(!active)return;const old=active;active=null;old.dead=true;old.resize?.disconnect();old.observe?.disconnect();document.removeEventListener('visibilitychange',old.visibility);old.motion?.removeEventListener('change',old.animate);old.host?.querySelector('canvas')?.removeEventListener('webglcontextlost',old.contextLost);old.host?.remove();if(old.ready)old.app.destroy(true,{children:true,texture:false,textureSource:false});}
async function mount(stage){
 dispose();if(!stage)return;
 const state={dead:false,ready:false};active=state;
 try{
  const P=await library();if(state.dead||!stage.isConnected)return;
  const app=state.app=new P.Application();await app.init({width:Math.max(1,stage.clientWidth),height:Math.max(1,stage.clientHeight),backgroundAlpha:0,antialias:true,resolution:Math.min(window.devicePixelRatio||1,2),autoDensity:true,preference:'webgl'});
  state.ready=true;if(state.dead||!stage.isConnected){app.destroy(true,{children:true});return;}
  const host=state.host=document.createElement('div');host.className='wsPixiScene';host.setAttribute('aria-hidden','true');host.append(app.canvas);stage.prepend(host);state.contextLost=()=>{if(active===state)dispose()};app.canvas.addEventListener('webglcontextlost',state.contextLost);
  const room=new P.Container({isRenderGroup:true}),magic=new P.Container({isRenderGroup:true});app.stage.addChild(room,magic);
  const platform=new P.Graphics();room.addChild(platform);
  const stars=[];for(let i=0;i<24;i++){const dot=new P.Graphics().circle(0,0,i%4===0?1.8:1).fill(i%3===0?0xf0cd85:0xc5b3ef);magic.addChild(dot);stars.push(dot);}
  function fit(){
   if(state.dead)return;
   app.renderer.resize(Math.max(1,stage.clientWidth),Math.max(1,stage.clientHeight));
   const w=app.screen.width,h=app.screen.height;
   platform.clear().ellipse(w/2,h*.92,w*.34,h*.052).fill({color:0x704456,alpha:.09}).ellipse(w/2,h*.9,w*.33,h*.045).stroke({color:0xb18a62,width:1.5,alpha:.65}).ellipse(w/2,h*.9,w*.27,h*.032).stroke({color:0xcaa8b4,width:1,alpha:.4});
   stars.forEach((star,i)=>{star.position.set(w*((i*.6180339)%1),h*i/24);star.alpha=.4});
  }
  state.resize=new ResizeObserver(()=>{try{fit()}catch(_){if(active===state)dispose()}});state.resize.observe(stage);
  state.observe=new MutationObserver(()=>{if(!host.isConnected&&active===state)dispose()});state.observe.observe(stage,{childList:true});
  let time=0;app.ticker.add(ticker=>{time+=ticker.deltaMS/1000;stars.forEach((s,i)=>{s.x=app.screen.width*((i*.6180339)%1)+Math.sin(time*.23+i)*7;s.y=app.screen.height*(1-((i/24+time*.014)%1));s.alpha=.18+(.5+.5*Math.sin(time+i))*.5;});});
  state.motion=window.matchMedia('(prefers-reduced-motion: reduce)');state.animate=()=>{if(document.hidden||state.motion.matches){app.stop();app.render()}else app.start()};state.visibility=state.animate;state.motion.addEventListener('change',state.animate);document.addEventListener('visibilitychange',state.visibility);
  fit();state.animate();
 }catch(error){console.warn('Atelier scene fallback:',error);if(active===state)dispose();}
}
window.MajickAtelierScene={mount,dispose};
})();
