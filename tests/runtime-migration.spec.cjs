const {test,expect}=require('playwright/test');
const url=process.env.MIGRATION_URL||'http://127.0.0.1:8782';
test.use({launchOptions:{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']},reducedMotion:'reduce'});
async function boot(page){await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.MajickGrimoire&&window.MajickGuardianPresentation&&window.MajickQuestionScheduler&&window.MajickGuardianCore);}
async function book(page){await page.locator('[data-nav="livinggrimoire"]').evaluate(button=>button.click());await page.evaluate(()=>MajickRoomSections.refresh());if(await page.locator('#majickRoomSections').count()){await page.getByRole('button',{name:'Show Majick Living Grimoire',exact:true}).click();}await expect(page.locator('.v3311Book')).toBeVisible();}
async function protectedState(page){return page.evaluate(()=>JSON.stringify({answers:S.progress.D772.answers,other:S.progress.D756.answers,eggs:S.legacy.eggs,pets:S.legacy.pets.map(({id,type,name,studyXP})=>({id,type,name,studyXP})),xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,fragments:S.majickAccount.rewardCore.eggFragments,inventory:S.majickAccount.guardianInventory,bed:S.v3311.sanctuaryState,collection:S.v3311.collectionState,unknown:S.v3311.extraSavedField}));}
for(const width of [390,820,1366])test.describe(width+'px',()=>{
 test.use({viewport:{width,height:900}});
 test('legacy save, notes, bookmarks, page turns, search, speech and mini quiz',async({page})=>{
  test.setTimeout(120000);await boot(page);
  await page.evaluate(()=>{
   startD756Course();switchCourse('D772');MajickRewardCore.inventory();
   S.v3311={schemaVersion:1,grimoire:{page:1,search:'',bookmarks:['D772:s0','D756:s1'],notes:{'D772:s0':'Keep teacher\'s note <safe> ✦','D756:s1':'Keep IEP note'},remember:{'D772:s0':true},futureField:{keep:true}},guardianEvolutionState:{customLegacyEntry:{keep:true}},sanctuaryState:{bedAssignments:{west:S.legacy.pets[0].id}},collectionState:{retained:['existing']},extraSavedField:{keep:true}};
   S.v3311Page=3;S.progress.D772.answers.push({qid:'old-record',questionId:'old-record',chosen:'A',correct:false,topicId:'old-topic',keep:true});
   S.legacy.eggs=[{id:'saved-egg-1',type:'vesper',progress:4,goal:1000},{id:'saved-egg-2',type:'vesper',progress:12,goal:1000}];
   S.majickAccount.xp=9123;S.majickAccount.xpHighWater=9123;S.majickAccount.lifetimeXpHighWater=9123;S.majickAccount.crystals=234;S.majickAccount.rewardCore.eggFragments=17;
   S.courses.D772.studySections=[{id:"legacy-chapter",title:"Teacher's evidence <lesson>",summary:"Test saved source chapter",rows:[["Evidence","Study observation","Verify"]],concepts:[]}];save();
  });
  const before=await protectedState(page);await page.reload();await page.waitForFunction(()=>window.MajickGrimoire);await book(page);
  await expect(page.locator('.v3311Folio')).toContainText('2 /');await expect(page.locator('.v3311Book h3')).toHaveText("Teacher's evidence <lesson>");await expect(page.locator('.v3311Notes textarea')).toHaveValue("Keep teacher's note <safe> ✦");
  expect(await page.evaluate(()=>S.v3311.grimoire.futureField)).toEqual({keep:true});expect(await page.evaluate(()=>S.v3311.guardianEvolutionState.customLegacyEntry)).toEqual({keep:true});
  const bookmark=page.locator('.v3311PageActions button').first();await bookmark.click();await expect(bookmark).toContainText('☆');await bookmark.click();await expect(bookmark).toContainText('★');
  await page.locator('.v3311Notes textarea').fill("New note with 'quotes' and <markup> ✦");await page.locator('.v3311Notes textarea').blur();
  // Mini quiz remains feedback-only and never awards independent evidence/currency.
  const answer=await page.evaluate(()=>{const q=course().questionBank[0];return typeof q.answer==='number'?q.answer:q.options.indexOf(q.answer)});
  await page.locator('.v3311Mini button').nth(answer).click();await expect(page.locator('.v3311Mini .good')).toContainText('Correct');
  expect(await protectedState(page)).toBe(before);
  await page.evaluate(()=>{speechSynthesis.speak=u=>{window.__spoken=u.text};speechSynthesis.cancel=()=>{}});await page.locator('.v3311Book footer button').first().click();expect(await page.evaluate(()=>window.__spoken)).toContain("Teacher's evidence");
  await page.locator('.v3311Arrow').last().click();await expect(page.locator('.v3311Folio')).toContainText('3 /');
  await page.locator('.v3311BookTools input').fill("Teacher's");await page.locator('.v3311BookTools button').first().click();await expect(page.locator('.v3311Book h3')).toHaveText("Teacher's evidence <lesson>");
  await page.reload();await book(page);await expect(page.locator('.v3311BookTools input')).toHaveValue("Teacher's");await expect(page.locator('.v3311Notes textarea')).toHaveValue("New note with 'quotes' and <markup> ✦");
  await page.evaluate(()=>switchCourse('D756'));await book(page);await expect(page.locator('.v3311BookTools input')).toHaveValue('');
  await page.locator('.v3311Arrow').last().click();await expect(page.locator('.v3311Folio')).toContainText('2 /');
  await page.evaluate(()=>switchCourse('D772'));await book(page);await expect(page.locator('.v3311BookTools input')).toHaveValue("Teacher's");
  expect(await protectedState(page)).toBe(before);expect(await page.evaluate(()=>S.v3311.grimoire.bookmarks.includes('D756:s1'))).toBe(true);
  await page.screenshot({path:'work/migration-grimoire-'+width+'.png'});
 });
 test('Guardian presentation, sound preferences and no retired runtime requests',async({page})=>{
  const errors=[],retired=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/(?:v3311-main|v3311-plus|v339-main|study-ui-compat|ui-compat|v3310-sanctuary)\.js(?:\?|$)/.test(r.url()))retired.push(r.url())});
  await boot(page);const guardian=await page.evaluate(()=>({type:S.legacy.pets[0].type,html:v334Portrait(S.legacy.pets[0],'card')}));expect(guardian.html).toContain('v3317ApprovedPortrait');
  await page.evaluate(type=>MajickGuardianPresentation.openEvolution(type),guardian.type);await expect(page.locator('.v3312Tree article')).toHaveCount(5);await page.locator('.v3312Close').click();
  await page.locator('.caSoundOptions summary').click();await page.locator('.caStudyEffects').click();expect(await page.evaluate(()=>S.sound)).toBe(false);expect(await page.evaluate(()=>S.v5.settings.sounds)).toBe(false);
  await page.reload();await page.waitForFunction(()=>window.MajickStudyAudio);await page.locator('.caSoundOptions summary').click();await expect(page.locator('.caStudyEffects')).toContainText('off');await page.locator('.caSoundOptions summary').click();await page.locator('.caSoundOptions summary').click();await page.locator('.caStudyEffects').click();expect(await page.evaluate(()=>S.sound)).toBe(true);
  expect(await page.evaluate(()=>MajickStudyAudio.context()===MajickStudyAudio.context())).toBe(true);
  expect(retired).toEqual([]);expect(errors).toEqual([]);
 });
});
