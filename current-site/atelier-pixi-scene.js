/* PixiJS v8 render groups: room, fitted scholar, and ambient magic. No save writes. */
(()=>{
'use strict';
let loading;
function library(){
 if(window.PIXI?.VERSION?.startsWith('8.'))return Promise.resolve(window.PIXI);
 return loading||(loading=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./vendor/pixi-8.6.6.min.js';s.onload=()=>resolve(window.PIXI);s.onerror=()=>{loading=null;s.remove();reject(new Error('Scene unavailable'))};document.head.append(s)}));
}
let active=null;
function dispose(){if(!active)return;const old=active;active=null;old.dead=true;old.resize?.disconnect();old.observe?.disconnect();document.removeEventListener('visibilitychange',old.visibility);old.motion?.removeEventListener('change',old.animate);old.figure?.classList.remove('wsPixiReplaced');old.host?.querySelector('canvas')?.removeEventListener('webglcontextlost',old.contextLost);old.host?.remove();if(old.ready)old.app.destroy(true,{children:true,texture:false,textureSource:false});}
async function mount(stage){
 dispose();if(!stage)return;
 const state={dead:false,ready:false};active=state;
 try{
  const P=await library();if(state.dead||!stage.isConnected)return;
  const app=state.app=new P.Application();await app.init({width:Math.max(1,stage.clientWidth),height:Math.max(1,stage.clientHeight),backgroundAlpha:0,antialias:true,resolution:Math.min(window.devicePixelRatio||1,2),autoDensity:true,preference:'webgl'});
  state.ready=true;if(state.dead||!stage.isConnected){app.destroy(true,{children:true});return;}
  const host=state.host=document.createElement('div');host.className='wsPixiScene';host.setAttribute('aria-hidden','true');host.append(app.canvas);stage.prepend(host);state.contextLost=()=>{if(active===state)dispose()};app.canvas.addEventListener('webglcontextlost',state.contextLost);
  const room=new P.Container({isRenderGroup:true}),scholar=new P.Container({isRenderGroup:true}),magic=new P.Container({isRenderGroup:true});app.stage.addChild(room,scholar,magic);
  const platform=new P.Graphics();room.addChild(platform);
  const stars=[];for(let i=0;i<24;i++){const dot=new P.Graphics().circle(0,0,i%4===0?1.8:1).fill(i%3===0?0xf0cd85:0xc5b3ef);magic.addChild(dot);stars.push(dot);}
  let revision=0,zoom=1;
  async function fit(){
   const ticket=++revision;if(state.dead)return;
   app.renderer.resize(Math.max(1,stage.clientWidth),Math.max(1,stage.clientHeight));
   const w=app.screen.width,h=app.screen.height;
   platform.clear().ellipse(w/2,h*.92,w*.34,h*.052).fill({color:0x080510,alpha:.6}).ellipse(w/2,h*.9,w*.33,h*.045).stroke({color:0xd3b074,width:1.5,alpha:.65}).ellipse(w/2,h*.9,w*.27,h*.032).stroke({color:0xcdb1ed,width:1,alpha:.35});
   scholar.removeChildren().forEach(c=>c.destroy());state.figure?.classList.remove('wsPixiReplaced');
   const figure=stage.querySelector('.wsFigure');state.figure=figure;
   if(!figure)return; // Approved pose owner retains its own verified frame and walk timer.
   const images=[...figure.querySelectorAll('img')];
   await Promise.all(images.map(img=>img.decode()));if(state.dead||ticket!==revision||!figure.isConnected)return;
   const textures=await Promise.all(images.map(img=>P.Assets.load(img.src)));if(state.dead||ticket!==revision||!figure.isConnected)return;
   figure.style.transform='none';
   const origin=stage.getBoundingClientRect();
   images.forEach((img,i)=>{
    const rect=img.getBoundingClientRect(),sprite=new P.Sprite(textures[i]);
    const contain=getComputedStyle(img).objectFit==='contain';
    const scale=contain?Math.min(img.clientWidth/img.naturalWidth,img.clientHeight/img.naturalHeight):0;
    sprite.width=contain?img.naturalWidth*scale*rect.width/img.clientWidth:rect.width;sprite.height=contain?img.naturalHeight*scale*rect.height/img.clientHeight:rect.height;
    sprite.position.set(rect.left-origin.left+(rect.width-sprite.width)/2,rect.top-origin.top+(rect.height-sprite.height)/2);scholar.addChild(sprite);
   });
   figure.style.transform='';
   scholar.pivot.set(w/2,h*.52);scholar.position.set(w/2,h*.52);scholar.scale.set(zoom*(stage.dataset.facing==='left'?-1:1),zoom);app.render();figure.classList.add('wsPixiReplaced');
  }
  state.zoom=value=>{zoom=value;scholar.scale.set(zoom*(stage.dataset.facing==='left'?-1:1),zoom)};
  state.resize=new ResizeObserver(()=>{fit().catch(()=>{state.figure?.classList.remove('wsPixiReplaced')})});state.resize.observe(stage);
  state.observe=new MutationObserver(()=>{if(!host.isConnected){if(active===state)dispose();return;}fit().catch(()=>state.figure?.classList.remove('wsPixiReplaced'))});state.observe.observe(stage,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  let time=0;app.ticker.add(ticker=>{time+=ticker.deltaMS/1000;stars.forEach((s,i)=>{s.x=app.screen.width*((i*.6180339)%1)+Math.sin(time*.23+i)*7;s.y=app.screen.height*(1-((i/24+time*.014)%1));s.alpha=.18+(.5+.5*Math.sin(time+i))*.5;});});
  state.motion=window.matchMedia('(prefers-reduced-motion: reduce)');state.animate=()=>{if(document.hidden||state.motion.matches){app.stop();app.render()}else app.start()};state.visibility=state.animate;state.motion.addEventListener('change',state.animate);document.addEventListener('visibilitychange',state.visibility);
  await fit();state.animate();
 }catch(error){console.warn('Atelier scene fallback:',error);if(active===state)dispose();}
}
window.MajickAtelierScene={mount,dispose,zoom(value){active?.zoom?.(value)}};
})();
