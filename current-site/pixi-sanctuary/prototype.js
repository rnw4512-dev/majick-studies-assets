/* Isolated read-only PixiJS trial. Never accesses Majick storage or writes progress. */
(async function(){
'use strict';
const names=['velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara'];
const room=document.getElementById('room'),status=document.getElementById('status');
const $=id=>document.getElementById(id);
if(!window.PIXI){status.textContent='PixiJS could not load. Check your connection and retry.';return}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let paused=reduced,stress=false,ambient=!reduced,loaded=0;
const app=new PIXI.Application({width:1200,height:700,backgroundAlpha:0,antialias:false,autoDensity:true,resolution:Math.min(devicePixelRatio||1,2),powerPreference:'low-power'});
room.appendChild(app.view);
const world=new PIXI.Container();app.stage.addChild(world);
const ground=new PIXI.Graphics();ground.beginFill(0x36243f,.85).drawEllipse(600,625,570,150).endFill();world.addChild(ground);
const dots=new PIXI.Container();world.addChild(dots);
const guardianLayer=new PIXI.Container();world.addChild(guardianLayer);
const entities=[];
let seed=12345;const rand=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
const colors=[0xe3c38c,0xc6a1f6,0x9fd2e5];
for(let i=0;i<42;i++){const star=new PIXI.Graphics();star.beginFill(colors[i%3],.22).drawCircle(0,0,1+rand()*2).endFill();star.x=30+rand()*1140;star.y=20+rand()*580;dots.addChild(star)}
function resize(){const b=room.getBoundingClientRect();const width=Math.max(240,b.width),height=Math.max(240,b.height);app.renderer.resize(Math.round(width),Math.round(height));const k=Math.min(width/1200,height/700);world.scale.set(k);world.position.set((width-1200*k)/2,(height-700*k)/2);$('viewport').textContent=Math.round(width)+' × '+Math.round(height)}
new ResizeObserver(resize).observe(room);resize();
function newTarget(e){e.tx=110+rand()*980;e.ty=355+rand()*235;e.pause=0.5+rand()*1.8}
function label(text){return new PIXI.Text(text,{fontFamily:'Georgia,serif',fontSize:21,fill:0xffe4ae,stroke:0x1b1022,strokeThickness:4,align:'center'})}
await Promise.all(names.map(async(name,i)=>{
 try{
  const texture=await PIXI.Assets.load('../assets/familiars/canon/'+name+'-guardian.webp');
  const root=new PIXI.Container();root.x=125+(i%5)*230;root.y=330+Math.floor(i/5)*210;
  const shadow=new PIXI.Graphics();shadow.beginFill(0x000000,.26).drawEllipse(0,0,65,12).endFill();root.addChild(shadow);
  const sprite=new PIXI.Sprite(texture);sprite.anchor.set(.5,1);const scale=Math.min(170/Math.max(1,texture.width),165/Math.max(1,texture.height));sprite.scale.set(scale);sprite.y=-10;root.addChild(sprite);
  const text=label(name.charAt(0).toUpperCase()+name.slice(1));text.anchor.set(.5,0);text.y=7;root.addChild(text);
  const e={root,sprite,shadow,name,tx:root.x,ty:root.y,pause:rand()*2,playing:0,phase:rand()*6.28,speed:55+rand()*30};
  sprite.eventMode='static';sprite.cursor='pointer';sprite.on('pointertap',()=>{e.playing=1.3;e.pause=1.3});
  guardianLayer.addChild(root);entities.push(e);loaded++;$('loaded').textContent=loaded+' / 10';
 }catch(err){console.warn('Guardian art unavailable:',name,err)}
}));
if(!entities.length){status.textContent='Guardian images could not load. Please check network access.';return}
status.textContent='PixiJS running · tap a Guardian to play';
$('toggle').textContent=paused?'Resume movement':'Pause movement';
$('motion').setAttribute('aria-pressed',String(ambient));$('motion').textContent='Ambient effects: '+(ambient?'on':'off');
$('toggle').onclick=()=>{paused=!paused;$('toggle').textContent=paused?'Resume movement':'Pause movement'};
$('reset').onclick=()=>entities.forEach((e,i)=>{e.root.position.set(125+(i%5)*230,330+Math.floor(i/5)*210);e.tx=e.root.x;e.ty=e.root.y;e.pause=1});
$('stress').onclick=()=>{stress=!stress;$('stress').setAttribute('aria-pressed',String(stress));$('stress').textContent='Stress test: '+(stress?'on':'off')};
$('motion').onclick=()=>{ambient=!ambient;$('motion').setAttribute('aria-pressed',String(ambient));$('motion').textContent='Ambient effects: '+(ambient?'on':'off')};
let last=performance.now(),frames=0,total=0,moving=0,elapsed=0;
app.ticker.add(()=>{
 const now=performance.now(),dt=Math.min((now-last)/1000,.06);last=now;frames++;total+=dt;elapsed+=dt;
 moving=0;
 if(!paused)for(const e of entities){
  e.phase+=dt*3;
  if(e.playing>0){e.playing-=dt;e.sprite.rotation=Math.sin(e.phase*5)*.11;e.sprite.y=-10-Math.abs(Math.sin(e.phase*5))*13;continue}
  e.sprite.rotation=0;
  if(e.pause>0){e.pause-=dt;e.sprite.y=-10+(ambient?Math.sin(e.phase)*2:0);continue}
  const dx=e.tx-e.root.x,dy=e.ty-e.root.y,dist=Math.hypot(dx,dy);
  if(dist<7){newTarget(e);continue}
  moving++;
  const step=Math.min(dist,e.speed*dt);
  e.root.x+=dx/dist*step;e.root.y+=dy/dist*step;
  e.sprite.scale.x=Math.abs(e.sprite.scale.x)*(dx<0?-1:1);
  e.sprite.y=-10+(ambient?Math.sin(e.phase*4)*5:0);
 }
 guardianLayer.children.sort((a,b)=>a.y-b.y);
 dots.visible=ambient;
 if(ambient){for(let i=0;i<dots.children.length;i++){const p=dots.children[i];p.alpha=.35+Math.sin(elapsed*1.3+i)*.2;p.y+=dt*(stress?32:5);if(p.y>650)p.y=15}}
 if(stress){for(let i=0;i<dots.children.length;i++){const p=dots.children[i];p.scale.set(2)}}else for(const p of dots.children)p.scale.set(1);
 if(total>=1){$('fps').textContent=Math.round(frames/total);$('ms').textContent=(total/frames*1000).toFixed(1)+' ms';$('moving').textContent=moving+' / '+entities.length;frames=0;total=0}
});
})();