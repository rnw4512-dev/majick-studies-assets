const {test,expect}=require('playwright/test');
const url=process.env.ATHENAEUM_URL||'http://127.0.0.1:8770';
test.use({launchOptions:{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']},reducedMotion:'reduce'});
async function lesson(page,id='d772-s2-l4',course='D772'){
 if(course==='D756'){
  // D756's outline has no uploaded Tutor classroom. Exercise the public practice
  // renderer inside a synthetic host after a real course switch.
  await page.evaluate(({id,course})=>{switchCourse(course);const host=document.createElement('section');host.id='qaPractice';document.querySelector('#content').replaceChildren(host);MajickYourTurn.mount(host,{id,title:'IEP team stakeholders'},course)},{id,course});
  await expect(page.locator('.mjtYourTurn .mjtHeader small')).toContainText(id);return;
 }

 await page.evaluate(({id,course})=>{switchCourse(course);MajickCourseTutor.openLesson(id,null,course)},{id,course});
 await expect(page.locator('[data-classroom-tab="turn"]')).toBeVisible();
 await page.locator('[data-classroom-tab="turn"]').click();
 await expect(page.locator('.mjtYourTurn .mjtHeader small')).toContainText(id);
 await expect(page.locator('.mjtYourTurn')).toBeVisible();
}
async function boot(page){await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.MajickYourTurn&&window.MajickWGUPractice&&window.MajickRewardCore);await page.evaluate(()=>{if(!S.courses.D756)startD756Course()});}
async function counts(page,course='D772',id='d772-s2-l4'){return page.evaluate(({course,id})=>{let p=S.progress[course],r=p.learningNeeds?.[id];return {wrong:r?.struggles||0,right:r?.successes||0,xp:p.xp||0,crystals:p.crystals||0}},{course,id});}
for(const width of [390,820,1366])test.describe(width+'px',()=>{
 test.use({viewport:{width,height:900}});
 test('distinct submissions, reload drafts, course isolation and egg balances',async({page})=>{
  await boot(page);await lesson(page);
  const protectedState=await page.evaluate(()=>{MajickRewardCore.inventory();S.majickAccount.rewardCore.eggFragments=23;S.legacy.eggs=[{id:'qa-existing-1',type:'vesper',progress:4,goal:1000},{id:'qa-existing-2',type:'briar',progress:9,goal:1000}];save();return JSON.stringify({eggs:S.legacy.eggs,crystals:S.majickAccount.crystals,chests:S.majickAccount.chests,fragments:S.majickAccount.rewardCore.eggFragments,inventory:S.majickAccount.guardianInventory,pets:S.legacy.pets.map(({id,type,name,studyXP})=>({id,type,name,studyXP}))})});
  const before=await counts(page);const check=()=>page.locator('.mjtYourTurn [data-check]').click();
  await check();await check();expect(await counts(page)).toEqual(before);
  await page.locator('.mjtYourTurn [data-number]').fill('10');await check();await check();
  expect((await counts(page)).wrong).toBe(before.wrong+1);
  await page.locator('.mjtYourTurn [data-number]').fill('12');await check();await check();
  const credited=await counts(page);expect(credited.right).toBe(before.right+1);expect(credited.xp-before.xp).toBe(3);expect(credited.crystals).toBe(before.crystals);
  await page.locator('.mjtYourTurn [data-number]').fill('13');
  await expect(page.locator('.mjtFeedback')).toBeHidden();await expect(page.locator('[data-q="0"]')).not.toContainText('✓');
  await page.reload();await lesson(page);await expect(page.locator('.mjtYourTurn [data-number]')).toHaveValue('13');
  await page.locator('.mjtYourTurn [data-number]').fill('12.0');await check();expect(await counts(page)).toEqual(credited);
  await page.locator('.mjtYourTurn [data-next]').click();await page.locator('.mjtYourTurn [data-number]').fill('9');
  await page.reload();await lesson(page);await expect(page.locator('[data-q="1"]')).toHaveAttribute('aria-current','step');await expect(page.locator('.mjtYourTurn [data-number]')).toHaveValue('9');
  const d772=await page.evaluate(()=>JSON.stringify(S.progress.D772.yourTurnPractice));
  await lesson(page,'d756-s1-l1','D756');await page.locator('.mjtYourTurn [data-pick="0"]').click();
  expect(await page.evaluate(()=>JSON.stringify(S.progress.D772.yourTurnPractice))).toBe(d772);
  await lesson(page);await expect(page.locator('.mjtYourTurn [data-number]')).toHaveValue('9');
  // Reward/journey activity metadata may advance; eggs, balances and identities must not.
  expect(await page.evaluate(()=>JSON.stringify({eggs:S.legacy.eggs,crystals:S.majickAccount.crystals,chests:S.majickAccount.chests,fragments:S.majickAccount.rewardCore.eggFragments,inventory:S.majickAccount.guardianInventory,pets:S.legacy.pets.map(({id,type,name,studyXP})=>({id,type,name,studyXP}))}))).toBe(protectedState);
 });
 test('sequence validation, actionable explanation and saved ordering',async({page})=>{
  await boot(page);await lesson(page,'d772-s1-l1');const before=await counts(page,'D772','d772-s1-l1');
  await page.locator('.mjtYourTurn [data-pick="0"]').click();await page.locator('.mjtYourTurn [data-check]').click();expect(await counts(page,'D772','d772-s1-l1')).toEqual(before);
  await page.reload();await lesson(page,'d772-s1-l1');await expect(page.locator('.mjtYourTurn [data-pick="0"]')).toBeDisabled();
  for(const i of [2,1])await page.locator('.mjtYourTurn [data-pick="'+i+'"]').click();
  await page.locator('.mjtYourTurn [data-check]').click();await expect(page.locator('.mjtFeedback')).toContainText('All district teachers');await expect(page.locator('.mjtFeedback')).toContainText('different commute times');
  await page.locator('.mjtYourTurn [data-check]').click();expect((await counts(page,'D772','d772-s1-l1')).wrong).toBe(before.wrong+1);
  await page.locator('.mjtHelp summary').click();await page.locator('.mjtYourTurn [data-clear]').click();for(const i of [2,0,1])await page.locator('.mjtYourTurn [data-pick="'+i+'"]').click();await page.locator('.mjtYourTurn [data-check]').click();
  await page.locator('.mjtYourTurn [data-undo]').click();await expect(page.locator('.mjtFeedback')).toBeHidden();await expect(page.locator('[data-q="0"]')).not.toContainText('✓');
 });
 test('all lesson tabs use the page scroll owner',async({page})=>{
  test.setTimeout(180000);await boot(page);
  const lessons=await page.evaluate(()=>MajickLessonActivities.tasks.filter(t=>t.course==='D772').map(t=>({id:t.lessonId,course:t.course})));
  for(const entry of lessons){await lesson(page,entry.id,entry.course);
   const geometries=await page.evaluate(()=>['opening','teach','visual','example','turn','workshop','review'].map(tab=>{
    document.querySelector('[data-classroom-tab="'+tab+'"]').click();
    const el=document.querySelector('.classroomStage');return {tab,height:el.clientHeight,scroll:el.scrollHeight,overflow:getComputedStyle(el).overflowY};
   }));
   for(const geometry of geometries){expect(geometry.overflow,entry.id+' '+geometry.tab).toBe('visible');expect(geometry.scroll,entry.id+' '+geometry.tab).toBeLessThanOrEqual(geometry.height+2);}
  }
  await lesson(page);await page.locator('[data-classroom-tab="visual"]').click();
  await page.locator('[aria-label="Scroll lesson down"]').click();
  expect(await page.locator('.classroomStage').evaluate(el=>el.scrollTop)).toBe(0);
  await page.screenshot({path:'work/athenaeum-'+width+'.png',fullPage:false});
 });
 test('reward math, replay safety, fragment conversion and existing eggs survive reload',async({page})=>{
  await boot(page);
  const result=await page.evaluate(()=>{
   const core=MajickRewardCore;core.inventory();
   const a=S.majickAccount;a.xp=1000;a.xpHighWater=1000;a.lifetimeXpHighWater=1000;a.crystals=50;a.rewardCore.eggFragments=25;
   S.legacy.eggs=[{id:'qa-egg-a',type:'vesper',progress:4,goal:1000},{id:'qa-egg-b',type:'briar',progress:9,goal:1000}];
   a.guardianIncubator={version:'3.4.10',focusEggId:'qa-egg-a',lastFocusAt:0};
   const ctx={key:'qa-reward-math',difficulty:4,independent:true,delayed:true,transfer:true};
   const receipt=core.award('correct-answer',ctx),after=JSON.stringify({xp:a.xp,crystals:a.crystals,eggs:S.legacy.eggs,fragments:a.rewardCore.eggFragments});
   core.award('correct-answer',ctx);const replay=after===JSON.stringify({xp:a.xp,crystals:a.crystals,eggs:S.legacy.eggs,fragments:a.rewardCore.eggFragments});
   save();return {xp:receipt.xp,crystals:receipt.crystals,fragments:receipt.eggFragments,replay,oldEggs:S.legacy.eggs.map(e=>({...e}))};
  });
  expect(result).toMatchObject({xp:41,crystals:3,fragments:0,replay:true});expect(result.oldEggs.map(e=>e.progress)).toEqual([8,9]);
  await page.evaluate(()=>MajickRewardCore.showConjuring());await page.locator('#majEggConjure [data-seal]').click();
  const converted=await page.evaluate(()=>({eggs:S.legacy.eggs,fragments:S.majickAccount.rewardCore.eggFragments,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals}));
  expect(converted.fragments).toBe(15);expect(converted.eggs.length).toBe(3);expect(converted.eggs.slice(0,2)).toEqual(result.oldEggs);expect(converted.xp).toBe(1041);expect(converted.crystals).toBe(53);
  await page.evaluate(()=>MajickRewardCore.showConjuring());await page.locator('#majEggConjure [data-seal]').click();
  converted.fragments=5;converted.eggs=await page.evaluate(()=>S.legacy.eggs);expect(converted.eggs.length).toBe(4);
  await page.evaluate(()=>MajickRewardCore.showConjuring());await expect(page.locator('#majEggConjure')).toHaveCount(0);
  await page.reload();await page.waitForFunction(()=>window.MajickRewardCore);
  await page.evaluate(()=>MajickRewardCore.award('correct-answer',{key:'qa-reward-math',difficulty:4,independent:true,delayed:true,transfer:true}));
  expect(await page.evaluate(()=>({eggs:S.legacy.eggs,fragments:S.majickAccount.rewardCore.eggFragments,xp:S.majickAccount.xp,crystals:S.majickAccount.crystals}))).toEqual(converted);
 });
});
