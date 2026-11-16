/* Aetheria Council Chamber - illustrated PixiJS v8 scene, visual only.
 * Names/dialogue remain accessible in the existing DOM. No score or progress writes.
 */
(()=>{
'use strict';
if(window.MajickIEPVisual)return;
let loading=null,active=null,serial=0,applicationsCreated=0,sceneUpdates=0;
function library(){
 if(window.PIXI?.VERSION?.startsWith('8.'))return Promise.resolve(window.PIXI);
 if(!loading)loading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='./vendor/pixi-8.6.6.min.js';
  script.onload=()=>window.PIXI?.VERSION?.startsWith('8.')?resolve(window.PIXI):reject(new Error('Expected PixiJS v8'));
  script.onerror=()=>reject(new Error('PixiJS unavailable'));
  document.head.append(script);
 }).catch(e=>{loading=null;throw e});
 return loading;
}
function dispose(){
 const previous=active;active=null;if(!previous)return;
 previous.dead=true;
 previous.resize?.disconnect();
 previous.motion?.removeEventListener?.('change',previous.onMotion);
 document.removeEventListener('visibilitychange',previous.onMotion);
 try{previous.app?.destroy(true,{children:true,texture:false,textureSource:false})}catch(_){}
}
function stageFallback(host,speaker){
 host.innerHTML='<div class="iepSceneFallback" aria-hidden="true"><div class="iepFallbackTable">✦ Council Chamber ✦</div><div class="iepFallbackGuests">'+['Parent / guardian','Student','School representative','General education teacher'].map((role,i)=>'<div class="'+(i===speaker?'speaking':'')+'"><img alt="" loading="eager" src="./assets/iep-council/'+['parent','student','lea','teacher'][i]+'.svg">'+role+'</div>').join('')+'</div></div>';
}
// Four small illustrated emotion cues are attached to existing portraits, not extra actors.
function paintExpression(graphics,mood){
 graphics.clear().circle(0,0,17).fill(0xf9efdc).circle(0,0,17).stroke({color:0xa78856,width:2});
 graphics.circle(-6,-3,1.5).fill(0x3c2c3c).circle(6,-3,1.5).fill(0x3c2c3c);
 if(mood==='concern')graphics.moveTo(-8,-10).lineTo(-3,-8).moveTo(3,-8).lineTo(8,-10).stroke({color:0x51354c,width:2});
 if(mood==='question')graphics.moveTo(-8,-10).lineTo(-3,-11).moveTo(3,-10).lineTo(8,-7).stroke({color:0x51354c,width:2});
 if(mood==='support')graphics.moveTo(-7,6).quadraticCurveTo(0,13,7,6).stroke({color:0x5b644c,width:2});
 else if(mood==='concern')graphics.moveTo(-7,10).quadraticCurveTo(0,3,7,10).stroke({color:0x78475c,width:2});
 else graphics.moveTo(-6,8).lineTo(6,8).stroke({color:0x51354c,width:2});
}
function shapePerson(P,i){
 const root=new P.Container();
 const colors=[0x895c77,0x547a76,0x7a6a92,0x6b637f],hair=[0x241b2b,0x4b2b36,0x33293a,0x2c273c],skin=[0xb5795b,0x9e664e,0x6d443b,0xd1a184];
 const body=new P.Graphics().roundRect(-32,0,64,63,22).fill(colors[i]).roundRect(-14,4,28,20,8).fill({color:0xe5cfa5,alpha:.22});
 const neck=new P.Graphics().roundRect(-9,-8,18,17,6).fill(skin[i]);
 const face=new P.Graphics().ellipse(0,-27,22,27).fill(skin[i]);
 const hairpiece=new P.Graphics().ellipse(0,-45,24,13).fill(hair[i]).roundRect(-23,-47,10,30,5).fill(hair[i]);
 const features=new P.Graphics().circle(-8,-28,1.7).fill(0x221b27).circle(8,-28,1.7).fill(0x221b27).moveTo(-5,-15).quadraticCurveTo(0,-12,5,-15).stroke({color:0x573341,width:1.7});
 const hands=new P.Graphics().ellipse(-32,28,10,7).fill(skin[i]).ellipse(32,28,10,7).fill(skin[i]);
 root.addChild(body,neck,face,hairpiece,features,hands);
 const lamp=new P.Graphics().ellipse(0,15,43,69).stroke({color:0xf3d39b,width:3,alpha:.88});
 lamp.visible=false;root.addChild(lamp);
 const expression=new P.Graphics();expression.position.set(70,-77);expression.visible=false;root.addChild(expression);
 return {root,lamp,face,body,expression};
}
function addText(P,text,size,color){
 const node=new P.Text({text,style:{fontFamily:'Georgia, serif',fontSize:size,fill:color,align:'center'}});
 node.anchor.set(.5);return node;
}
async function sync({participants=[],speaker=0,mood='listening',active:isActive=true}={}){
 const host=document.getElementById('dmVisualStage');
 if(!host||!isActive){dispose();return}
 if(active?.host===host&&!active.dead){active.latest={participants,speaker,mood};active.update?.(active.latest);return}
 const request=++serial;dispose();
 const current={host,dead:false,ready:false,latest:{participants,speaker,mood}};
 active=current;
 stageFallback(host,speaker);
 try{
  const P=await library();
  if(current.dead||request!==serial||!host.isConnected)return;
  host.innerHTML='';
  const app=current.app=new P.Application();applicationsCreated++;
  await app.init({width:Math.max(1,host.clientWidth),height:Math.max(1,host.clientHeight),backgroundAlpha:0,antialias:true,resolution:Math.min(2,window.devicePixelRatio||1),autoDensity:true,preference:'webgl'});
  if(current.dead||request!==serial||!host.isConnected){app.destroy(true,{children:true,texture:false,textureSource:false});return}
  current.ready=true;app.canvas.setAttribute('aria-hidden','true');app.canvas.style.pointerEvents='none';host.append(app.canvas);
  const scene=new P.Container(),environment=new P.Container(),characters=new P.Container(),decor=new P.Container();
  app.stage.addChild(scene);scene.addChild(environment,characters,decor);
  // Build geometry once; move containers instead of re-triangulating Graphics each frame.
  const wall=new P.Graphics().roundRect(0,0,900,310,16).fill(0x30253d);
  const upper=new P.Graphics().roundRect(26,14,848,106,12).fill(0x41304b).roundRect(32,19,836,96,9).stroke({color:0xa7836c,width:1.3,alpha:.6});
  environment.addChild(wall,upper);
  const windowShape=new P.Graphics().roundRect(360,21,180,86,12).fill(0x1b273d).roundRect(365,26,170,75,8).stroke({color:0xe3c58d,width:2});
  const moon=new P.Graphics().circle(459,55,18).fill(0xe3c68f).circle(466,48,18).fill(0x1b273d);
  const dividers=new P.Graphics().moveTo(450,22).lineTo(450,108).moveTo(361,66).lineTo(539,66).stroke({color:0xb89a7d,width:1.4});
  environment.addChild(windowShape,moon,dividers);
  const tableShadow=new P.Graphics().ellipse(450,270,350,62).fill({color:0x130f1d,alpha:.55});
  const tabletop=new P.Graphics().ellipse(450,246,346,63).fill(0x775342).ellipse(450,235,343,59).fill(0x9c7559).ellipse(450,235,336,53).stroke({color:0xf0cf98,width:2,alpha:.8});
  decor.addChild(tableShadow,tabletop);
  const papers=new P.Graphics().roundRect(385,210,112,31,4).fill(0xe5d4b5).roundRect(399,215,84,3,1).fill(0x90786b).roundRect(399,223,76,2,1).fill(0xaa9184);
  const folder=new P.Graphics().roundRect(566,215,85,41,7).fill(0x413d5b).roundRect(577,220,60,2,1).fill(0xd2be9a);
  const mugs=new P.Graphics().ellipse(307,239,18,8).fill(0xcbb7a1).ellipse(612,253,18,8).fill(0xd9c7b0);
  decor.addChild(papers,folder,mugs);
  // One painted quill and IEP wax seal, static in the reused desktop scene.
  const stationery=new P.Graphics()
   .moveTo(462,231).quadraticCurveTo(478,213,487,194).stroke({color:0xe7d0a0,width:2.2})
   .moveTo(487,194).quadraticCurveTo(505,209,477,222).quadraticCurveTo(482,207,487,194).fill({color:0xe1c68e,alpha:.82})
   .circle(486,237,8).fill({color:0x8c4b58,alpha:.94})
   .circle(486,237,4).stroke({color:0xf5dba4,width:1.3});
  stationery.eventMode='none';decor.addChild(stationery);
  const seats=[{x:175,y:172,s:1},{x:365,y:160,s:1.02},{x:565,y:160,s:1.02},{x:752,y:172,s:1}];
  const figures=seats.map((seat,i)=>{
   const f=shapePerson(P,i);f.root.position.set(seat.x,seat.y);f.root.scale.set(seat.s);characters.addChild(f.root);
   f.lamp.visible=i===speaker;
   return f;
  });
  // Custom illustrated portraits share one consistent, original textbook-style art system.
  // Each file is authored for Aetheria and documented in the asset manifest.
  const portraitPaths=['parent','student','lea','teacher'].map(name=>'./assets/iep-council/'+name+'.svg');
  const portraitResults=await Promise.all(portraitPaths.map(path=>P.Assets.load(path).catch(()=>null)));
  if(current.dead||request!==serial||!host.isConnected)return;
  portraitResults.forEach((texture,i)=>{
   if(!texture)return;
   const figure=figures[i];
   const sprite=new P.Sprite(texture);
   sprite.anchor.set(.5,.5);
   sprite.width=142;
   sprite.height=142;
   sprite.position.set(0,-12);
   figure.root.children.forEach(child=>{if(child!==figure.lamp&&child!==figure.expression)child.visible=false});
   figure.root.addChildAt(sprite,0);
   // Speaking highlight remains above the visual portrait.
   figure.lamp.clear().roundRect(-77,-84,154,154,21).stroke({color:0xffdda2,width:3,alpha:.9});
   figure.lamp.visible=i===speaker;
  });
  const labels=seats.map((seat,i)=>{
   const who=participants[i]||{},name=String(who.name||['Family','Student','School representative','Teacher'][i]).split(' ')[0];
   const text=addText(P,name,16,i===speaker?0xffe3aa:0xe7d7d1);
   text.position.set(seat.x,seat.y+78);decor.addChild(text);return text;
  });
  const turn=addText(P,(participants[speaker]?.name||'Team member')+' is speaking',17,0xffdf9d);
  turn.position.set(450,137);decor.addChild(turn);
  const title=addText(P,'INDIVIDUALIZED EDUCATION PROGRAM · TEAM MEETING',12,0xf5d8a4);
  title.position.set(450,13);decor.addChild(title);
  const baseW=900,baseH=310;
  function fit(){if(current.dead)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);app.renderer.resize(w,h);scene.scale.set(Math.min(w/baseW,h/baseH));scene.position.set((w-baseW*scene.scale.x)/2,(h-baseH*scene.scale.y)/2)}
  current.resize=new ResizeObserver(()=>{fit();if(current.ready)app.render()});current.resize.observe(host);fit();
  // Short, restrained speaking cue: one gentle bounce as a new statement appears.
  // No looping animation, no position changes for other participants.
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  current.motion=motion;
  let speakingFigure=figures[speaker];
  let normalY=seats[speaker]?.y||160;
  let animationMs=0;
  const animate=ticker=>{
    if(current.dead||document.hidden||motion.matches||!speakingFigure){
      if(speakingFigure)speakingFigure.root.y=normalY;
      app.stop();app.render();return;
    }
    animationMs+=ticker.deltaMS;
    const progress=Math.min(1,animationMs/540);
    const wobble=Math.sin(progress*Math.PI*3)*Math.sin(progress*Math.PI)*2.4;
    speakingFigure.root.y=normalY-wobble;
    if(progress>=1){speakingFigure.root.y=normalY;app.stop();app.render();}
  };
  app.ticker.add(animate);
  current.onMotion=()=>{if(!current.dead&&current.ready){if(document.hidden||motion.matches){app.stop();if(speakingFigure)speakingFigure.root.y=normalY;}app.render()}};
  document.addEventListener('visibilitychange',current.onMotion);
  current.update=({participants:nextPeople=[],speaker:nextSpeaker=0,mood:nextMood='listening'})=>{
    sceneUpdates++;
    figures.forEach((figure,i)=>{figure.root.y=seats[i].y;figure.lamp.visible=i===nextSpeaker;figure.expression.visible=i===nextSpeaker;paintExpression(figure.expression,nextMood)});
    labels.forEach((label,i)=>{label.text=String(nextPeople[i]?.name||['Family','Student','School representative','Teacher'][i]).split(' ')[0];label.style.fill=i===nextSpeaker?0xffe3aa:0xe7d7d1});
    turn.text=(nextPeople[nextSpeaker]?.name||'Team member')+' is speaking · '+({concern:'Concern',question:'Question',support:'Reassurance',listening:'Listening'}[nextMood]||'Listening');
    speakingFigure=figures[nextSpeaker];normalY=seats[nextSpeaker]?.y||160;animationMs=0;
    if(!motion.matches&&!document.hidden)app.start();else{app.stop();app.render();}
  };
  motion.addEventListener?.('change',current.onMotion);
  current.update(current.latest);

 }catch(e){if(current.dead)return;console.warn('Council Chamber Pixi scene fallback:',e);if(active===current){try{current.app?.destroy(true,{children:true,texture:false,textureSource:false})}catch(_){}active=null;stageFallback(host,speaker)}}
}
window.MajickIEPVisual={sync,dispose,inspect:()=>({applicationsCreated,sceneUpdates,active:!!active,ready:!!active?.ready,speaker:active?.latest?.speaker}),version:'1.1-council-speaking-cue'};
})();