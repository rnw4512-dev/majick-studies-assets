/* Capture the same isolated course state with / without the visual-only sheet. */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'before';
if(!['before','after'].includes(phase))throw Error('Expected before or after');
const output=process.env.COLLEGIUM_CAPTURE_DIR||path.resolve(__dirname,'../../docs/audits/enchanted-collegium');
const url=process.env.COLLEGIUM_URL||'http://127.0.0.1:8765';
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  // Keep the existing randomly ordered practice deck comparable between captures.
  await page.addInitScript(()=>{let seed=772;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}});
  if(phase==='before')await page.route('**/enchanted-collegium.css*',route=>route.abort());
  await page.goto(url);await page.waitForFunction(()=>typeof switchCourse==='function');
  await page.waitForTimeout(1600);await page.evaluate(()=>switchCourse('D772'));
  for(const width of [390,820,1366]){
   await page.setViewportSize({width,height:1000});
   for(const room of ['mission','learninglab','reasoning']){
    await page.evaluate(room=>navigate(room),room);await page.waitForTimeout(650);
    const selector=room==='mission'?'.v3333MissionHead':room==='learninglab'?'.courseLessonNavigator>small':'.mjReasoningPage';
    await page.locator(selector).first().evaluate(el=>{el.style.scrollMarginTop='110px';el.scrollIntoView({block:'start'})});
    await page.waitForTimeout(100);
    await page.screenshot({path:path.join(output,`${phase}-${room}-${width}.png`)});
    console.log(phase,room,width,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,buttons:document.querySelectorAll('#content button').length})));
    if(room==='learninglab'){
     await page.locator('#hubOpenLesson').click();
     await page.getByRole('tab',{name:'Teach',exact:true}).click();
     await page.locator('.classroomStage').evaluate(el=>el.scrollIntoView({block:'center'}));
     await page.screenshot({path:path.join(output,`${phase}-learninglab-reading-${width}.png`)});
    }
   }
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
