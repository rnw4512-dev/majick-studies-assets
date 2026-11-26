/* Visual-only acceptance: run against the existing app, in an isolated browser save. */
'use strict';
const {chromium}=require('playwright');
const {PNG}=require('pngjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const url=process.env.COLLEGIUM_URL||'http://127.0.0.1:8765';
const out=process.env.COLLEGIUM_QA_DIR||'/tmp/collegium-visual-qa';
const widths=[390,820,1366],rooms=['mission','learninglab','reasoning'];
const report={checks:[],contrast:[],errors:[]};
function lum(rgb){const v=rgb.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722}
function ratio(a,b){const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
async function go(page,room){await page.evaluate(r=>navigate(r),room);await page.waitForTimeout(450)}
async function contrast(page,selector,label){
 const loc=page.locator(selector).filter({visible:true}).first();
 assert(await loc.count(),'Required visible surface missing: '+label);
 await loc.evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(100);
 await page.evaluate(()=>document.fonts.ready);
 let items,shot,stable=false;
 for(let attempt=0;attempt<3&&!stable;attempt++){
 items=await page.evaluate(selector=>{
  const root=[...document.querySelectorAll(selector)].find(e=>e.checkVisibility());
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),items=[];let n;
  while(n=walker.nextNode()){
   const el=n.parentElement;if(!n.textContent.trim()||el.closest('[hidden],svg,option,script,style'))continue;
   const s=getComputedStyle(el);if(s.visibility!=='visible'||!el.checkVisibility())continue;
   const range=document.createRange();range.selectNode(n);
   const exposed=(r,f)=>{const hit=document.elementFromPoint(r.x+r.width*f,r.y+r.height/2);return hit&&(hit===el||el.contains(hit))};
   const rects=[...range.getClientRects()].filter(r=>r.width>4&&r.height>4&&r.x>0&&r.y>100&&r.right<innerWidth&&r.bottom<innerHeight).filter(r=>exposed(r,.5)).map(r=>({x:r.x,y:r.y,w:r.width,h:r.height,fractions:[.15,.5,.85].filter(f=>exposed(r,f))}));
   if(!rects.length)continue;
   let opacity=1;for(let e=el;e;e=e.parentElement)opacity*=+getComputedStyle(e).opacity;
   items.push({text:n.textContent.trim().slice(0,75),color:s.webkitTextFillColor||s.color,size:parseFloat(s.fontSize),weight:parseFloat(s.fontWeight),opacity,rects,disabled:!!el.closest(':disabled')});
  }
  // Capture geometry and suppress glyph paint in one browser task. Lazy room
  // renders may replace a node between tasks; detect that before using pixels.
  const painted=[...document.querySelectorAll('#content,#content *')].map(e=>({e,style:e.getAttribute('style')}));
  window.__polishPaint={painted,nodes:[...root.querySelectorAll('*')],root,geometry:JSON.stringify(root.getBoundingClientRect()),scroll:[scrollX,scrollY]};
  for(const {e} of painted){e.style.setProperty('color','transparent','important');e.style.setProperty('-webkit-text-fill-color','transparent','important');e.style.setProperty('text-shadow','none','important')}
    window.__polishPaint.observer=new MutationObserver(()=>{window.__polishPaint.changed=true});
  window.__polishPaint.observer.observe(document.querySelector('#content'),{childList:true,subtree:true,characterData:true});
  return items;
 },selector);
 try{shot=PNG.sync.read(await page.screenshot())}finally{stable=await page.evaluate(()=>{const p=window.__polishPaint;p.observer.disconnect();const stable=!p.changed&&p.root.isConnected&&p.nodes.every(e=>e.isConnected)&&p.geometry===JSON.stringify(p.root.getBoundingClientRect())&&p.scroll[0]===scrollX&&p.scroll[1]===scrollY;for(const {e,style} of p.painted){if(style===null)e.removeAttribute('style');else e.setAttribute('style',style)}delete window.__polishPaint;return stable})}
 if(!stable)await page.waitForTimeout(150);
 }
 assert(stable,'Reading surface changed while sampling contrast: '+label);
 let minimum=Infinity,count=0;const failures=[];
 for(const item of items){
  if(item.disabled)continue; // Inactive controls are exempt; tested separately for visible disabled styling.
  const rgba=item.color.match(/[\d.]+/g)?.map(Number);if(!rgba)continue;
  const alpha=(rgba[3]??1)*item.opacity,required=item.size>=24||(item.size>=18.66&&item.weight>=700)?3:4.5;
  let worst=Infinity;
  for(const r of item.rects)for(const fraction of r.fractions){
   const x=Math.floor(r.x+r.w*fraction),y=Math.floor(r.y+r.h*.5),i=(y*shot.width+x)*4,bg=[...shot.data.subarray(i,i+3)];
   const fg=rgba.slice(0,3).map((v,j)=>v*alpha+bg[j]*(1-alpha));worst=Math.min(worst,ratio(fg,bg));
  }
  minimum=Math.min(minimum,worst);count++;
  if(worst+.01<required)failures.push({text:item.text,ratio:+worst.toFixed(2),required});
 }
 report.contrast.push({label,count,minimum:+minimum.toFixed(2),occludedSamples:items.reduce((n,item)=>n+item.rects.reduce((m,r)=>m+3-r.fractions.length,0),0),failures});
 assert(count>0,'No contrast samples: '+label);
 assert.equal(failures.length,0,'Contrast: '+label+' '+JSON.stringify(failures));
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>report.errors.push(e.message));
  // Compare the same mounted app before and after adding only the visual stylesheet.
  await page.route('**/enchanted-collegium.css*',r=>r.abort());
  await page.goto(url);await page.waitForFunction(()=>typeof navigate==='function'&&typeof switchCourse==='function');
  await page.waitForTimeout(1000);await page.evaluate(()=>switchCourse('D772'));await go(page,'reasoning');
  await page.unroute('**/enchanted-collegium.css*');
  const stylesheet=await (await page.request.get(url+'/enchanted-collegium.css')).text();
  // Fetch before sampling, then apply and compare atomically. Unrelated lazy room
  // renders must not land between the two sides of a CSS-only state assertion.
  const [before,after]=await page.evaluate(css=>{const snapshot=()=>({state:JSON.stringify(S),controls:document.querySelectorAll('#content button,#content input,#content select').length,progress:[...document.querySelectorAll('#content progress')].map(e=>[e.value,e.max,e.getAttribute('aria-label')])});const before=snapshot(),style=document.createElement('style');style.textContent=css;document.head.append(style);return [before,snapshot()]},stylesheet);
  assert.deepEqual(after,before,'Stylesheet must not change state, controls, or progress values');report.checks.push('CSS application preserves complete S state, control count and progress value/max/label');
  // An overlapping floating control is not the background of the text beneath
  // it. Exercise that boundary, then prove real low-contrast copy still fails.
  await page.evaluate(()=>{const root=document.createElement('div');root.id='polishContrastFixture';root.style.cssText='position:fixed;left:20px;top:200px;width:260px;height:24px;background:#fff!important;z-index:100000';const text=document.createElement('span');text.textContent='Clear reading stays on paper';text.style.cssText='color:#222!important;-webkit-text-fill-color:#222!important;font:14px/20px monospace!important;white-space:nowrap';const cover=document.createElement('div');cover.style.cssText='position:absolute;right:0;top:0;width:40%;height:100%;background:#000;z-index:2';root.append(text,cover);document.querySelector('#content').append(root)});
  try{
   await contrast(page,'#polishContrastFixture','partially covered reading fixture');
   assert(report.contrast.at(-1).occludedSamples>0,'Fixture must exercise an actually covered sample');
   await page.evaluate(()=>{const e=document.querySelector('#polishContrastFixture');e.lastElementChild.remove();e.firstElementChild.style.setProperty('color','#eee','important');e.firstElementChild.style.setProperty('-webkit-text-fill-color','#eee','important')});
   await assert.rejects(()=>contrast(page,'#polishContrastFixture','deliberately unreadable fixture'),/Contrast:/);
   report.contrast.pop(); // The expected negative case is not an app failure.
  }finally{await page.evaluate(()=>document.querySelector('#polishContrastFixture')?.remove())}
  report.checks.push('Contrast sampler excludes covered pixels and still rejects genuinely low-contrast text');
  for(const width of widths){
   await page.setViewportSize({width,height:1000});
   for(const room of rooms){
    await go(page,room);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Overflow '+room+' '+width);
    if(room==='mission'){
     const tab=page.getByRole('tab',{name:'Guided Practice',exact:true});await tab.click();
     assert.equal(await tab.getAttribute('aria-selected'),'true');await page.getByRole('tab',{name:'Skill Library',exact:true}).click();
     await contrast(page,'.v346StudyTab:not([hidden])','study copy '+width);
     await contrast(page,'.v3333Scope','study card '+width);
    }else if(room==='learninglab'){
     const selection=await page.evaluate(()=>{const root=document.querySelector('.courseLessonNavigator'),selected=root.querySelector('button[aria-pressed=true]'),other=root.querySelector('button[aria-pressed=false]');return {selected:getComputedStyle(selected).backgroundColor,other:getComputedStyle(other).backgroundColor}});
     assert.notEqual(selection.selected,selection.other,'Selected lesson navigation must remain visibly distinct');
     await contrast(page,'.courseLessonNavigator','learning navigator '+width);
     await page.locator('#hubOpenLesson').click();
     await page.getByRole('tab',{name:'Teach',exact:true}).click();
     await contrast(page,'.classroomStage','lesson reading '+width);
     assert.equal(await page.getByRole('tab',{name:'Teach',exact:true}).getAttribute('aria-selected'),'true');
    }else{
     await contrast(page,'.majMixedExam','trial prompt '+width);
     const choice=page.locator('.majExamChoice input').first();await choice.check();assert(await choice.isChecked());
     await page.getByRole('button',{name:'Clear selection',exact:true}).click();assert.equal(await page.locator('.majExamChoice input:checked').count(),0);
     await choice.focus();await page.keyboard.press('Tab');
     const focus=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,style:s.outlineStyle,width:parseFloat(s.outlineWidth)}});
     assert(focus.style!=='none'&&focus.width>=2,'Visible keyboard focus');
    }
    report.checks.push(room+' '+width+': no overflow, rendered contrast and interaction');
   }
  }
  for(const width of widths){
   await page.setViewportSize({width,height:1000});
   for(const room of ['home','guide','games','analytics','vault','sources','journal']){
    await go(page,room);
    const visible=await page.evaluate(()=>({width:innerWidth,screen:S.screen,overflow:document.documentElement.scrollWidth>innerWidth+2,content:document.querySelector('#content').textContent.trim().length}));
    assert.equal(visible.screen,room);assert(visible.content>20);assert(!visible.overflow,'Expanded room overflow '+room+' '+width);
   }
  }
  report.checks.push('Expanded shared-card edges: seven remaining routes at all three widths, original rooms mount without overflow');
  await page.setViewportSize({width:1366,height:1000});await go(page,'reasoning');
  await page.locator('.majExamChoice input').first().check();await page.getByRole('button',{name:'Check answer',exact:true}).click();
  assert(await page.locator('.majExamFeedback').isVisible());await contrast(page,'.majExamFeedback','submitted trial feedback');
  await page.getByRole('button',{name:'Guided Reasoning',exact:false}).click();assert.equal(await page.locator('.mjReasoningTabs button[aria-pressed="true"]').count(),1);
  report.checks.push('Trial selection, clear, submit feedback and guided-mode switch');
  // Test presentation receipt handling with a fake receipt in this isolated test save.
  const saved=await page.evaluate(()=>JSON.stringify(S));
  await page.evaluate(()=>document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'polish-unverified',type:'lesson',verified:false}})));
  assert.equal(await page.locator('.majick-ceremony').count(),0);
  await page.evaluate(()=>document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'polish-verified',type:'lesson',verified:true}})));
  assert.equal(await page.locator('.majick-ceremony__emblem').evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await page.evaluate(()=>JSON.stringify(S)),saved,'Presentation receipt must not award progress');
  await page.getByRole('button',{name:'Skip / Close',exact:true}).click();assert.equal(await page.locator('.majick-ceremony').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'polish-animated',type:'lesson',verified:true}})));
  assert.equal(await page.locator('.majick-ceremony__emblem').evaluate(e=>getComputedStyle(e).animationIterationCount),'1');
  await page.waitForTimeout(800);assert.equal(await page.locator('.majick-ceremony__emblem').evaluate(e=>e.getAnimations().length),0);
  await page.getByRole('button',{name:'Skip / Close',exact:true}).click();
  await page.evaluate(()=>{document.documentElement.dataset.majickReduceMotion='true';document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'polish-app-reduced',type:'lesson',verified:true}}))});
  assert.equal(await page.locator('.majick-ceremony__emblem').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.getByRole('button',{name:'Skip / Close',exact:true}).click();
  await page.evaluate(()=>delete document.documentElement.dataset.majickReduceMotion);
  report.checks.push('Unverified receipts ignored; reduced motion static; finite success feedback; no reward writes');
  assert.equal(report.errors.length,0,'Browser exceptions: '+report.errors.join('; '));
  console.log('PASS '+report.checks.length+' visual acceptance checks; '+report.contrast.length+' rendered contrast samples');
 }finally{fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2)+'\n');await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
