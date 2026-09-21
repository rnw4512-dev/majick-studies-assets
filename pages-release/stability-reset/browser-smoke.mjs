import { chromium } from 'playwright';

const base=process.env.MAJICK_BASE_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});
const page=await context.newPage();
const lightBootRoute=async route=>{
  const req=route.request();
  const url=req.url();
  const type=req.resourceType();
  // The main smoke tests study/runtime logic first. Do not boot the 80MB+ Sanctuary
  // or decorative media until the dedicated Sanctuary section near the end.
  if(url.includes('/sanctuary/')||['image','media','font'].includes(type))return route.abort();
  return route.continue();
};
await page.route('**/*',lightBootRoute);
const fatal=[];
page.on('pageerror',e=>fatal.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')fatal.push('console: '+m.text())});

async function assert(ok,msg){if(!ok)throw new Error('BROWSER SMOKE FAILED: '+msg)}

try{
  await page.goto(base,{waitUntil:'commit',timeout:15000});
  try{
    await page.waitForFunction(()=>typeof window.render==='function'&&!!window.MajickStateCore&&!!window.MajickGuardianRegistry&&!!window.MajickWGUPractice,{timeout:30000});
  }catch(e){
    const diag=await page.evaluate(()=>({
      readyState:document.readyState,
      hasS:!!window.S,
      hasRender:typeof window.render,
      hasState:!!window.MajickStateCore,
      hasRegistry:!!window.MajickGuardianRegistry,
      scripts:[...document.scripts].map(x=>x.src||'[inline]').slice(-30),
      bodyText:(document.body?.innerText||'').slice(0,1200)
    })).catch(()=>({evaluateFailed:true}));
    console.error('BOOT DIAGNOSTICS',JSON.stringify(diag,null,2));
    console.error('BROWSER ERRORS',fatal.join('\n'));
    throw e;
  }

  const boot=await page.evaluate(()=>({
    title:document.title,
    hasRender:typeof render==='function',
    hasState:!!window.MajickStateCore,
    hasRegistry:!!window.MajickGuardianRegistry,
    guardians:window.MajickGuardianRegistry?.all?.().map(x=>x.type)||[],
    version:document.documentElement.dataset.majickVersion||''
  }));
  await assert(boot.hasRender,'render() unavailable after boot');
  await assert(boot.hasState,'MajickStateCore unavailable after boot');
  await assert(boot.hasRegistry,'Guardian registry unavailable after boot');
  await assert(boot.version==='3.3.33-wgu-practice-lab','wrong deployed runtime version: '+boot.version);
  await assert(boot.guardians.length>=10,'baseline Guardian registry unexpectedly shrank');
  await page.waitForSelector('.v3327Home',{timeout:10000});
  await assert(await page.locator('.v3327PortalHero').count()===1,'Moonlit Collegium did not render on the first app load');
  const firstHeroLayout=await page.evaluate(()=>{
    const hero=document.querySelector('.v3327PortalHero')?.getBoundingClientRect();
    const copy=document.querySelector('.v3327HeroCopy')?.getBoundingClientRect();
    const seal=document.querySelector('.v3327RegistrarSeal')?.getBoundingClientRect();
    return hero&&copy&&seal?{heroWidth:hero.width,copyWidth:copy.width,copyX:copy.x,sealX:seal.x}:null;
  });
  await assert(firstHeroLayout&&firstHeroLayout.copyWidth>firstHeroLayout.heroWidth*.55,'Moonlit Collegium hero copy is squeezed into the seal column');
  await assert(firstHeroLayout.sealX>firstHeroLayout.copyX,'Arcane Registrar seal is not positioned beside the course introduction');

  console.log('SMOKE CHECKPOINT: boot/home passed');
  const balanceRecovery=await page.evaluate(()=>{
    // Create the exact affected ownership signature without adding any unowned Guardian.
    S.legacy=S.legacy||{};
    S.legacy.pets=[
      {id:'pet_velora',type:'luna',name:'Velora',bond:122,level:8},
      {id:'pet_solstice',type:'nova',name:'Solstice',bond:78,level:5}
    ];
    S.legacy.activePetId='pet_velora';
    S.legacy.eggs=[{id:'egg_ember',type:'ember',progress:19,goal:20,source:'study'}];
    S.majickAccount={xp:0,crystals:0,chests:0,schemaVersion:2};
    const account=MajickStateCore.ensureAccount();
    const first={xp:account.xp,crystals:account.crystals,marker:!!account.balanceRecoveryV3322?.applied};
    account.crystals=91;
    account.xp=3991;
    MajickStateCore.ensureAccount();
    const second={xp:account.xp,crystals:account.crystals};
    account.xp=4000;
    account.crystals=150;
    save();
    return {first,second};
  });
  await assert(balanceRecovery.first.xp===4000&&balanceRecovery.first.crystals===150,'lost account balance was not restored');
  await assert(balanceRecovery.first.marker,'one-time balance recovery marker missing');
  await assert(balanceRecovery.second.xp===3991&&balanceRecovery.second.crystals===91,'recovery refilled after the one-time repair');

  const hatchedMerge=await page.evaluate(()=>{
    S.legacy.pets=[
      {id:'pet_velora',type:'luna',name:'Velora',bond:122,level:8},
      {id:'pet_solstice',type:'nova',name:'Solstice',bond:78,level:5},
      {id:'pet_cascade',type:'ember',name:'Cascade',bond:5,level:1}
    ];
    S.legacy.eggs=[{id:'stale_ember',type:'ember',progress:20,goal:20}];
    S.legacy.activePetId='pet_cascade';
    S.majickAccount={xp:321,crystals:64,chests:0,schemaVersion:3};
    const a=MajickStateCore.ensureAccount();
    const first={xp:a.xp,crystals:a.crystals,marker:!!a.progressMergeV3323?.applied,eggs:S.legacy.eggs.map(e=>e.type)};
    a.xp+=17;
    MajickStateCore.ensureAccount();
    return {first,after:a.xp,roster:S.legacy.pets.map(p=>p.type)};
  });
  await assert(hatchedMerge.first.xp===4321,'historical 4000 XP was not merged with post-loss XP after Cascade hatched');
  await assert(hatchedMerge.first.crystals===64,'current nonzero crystal balance was changed during XP merge');
  await assert(hatchedMerge.first.marker,'V3.3.23 progress merge marker missing');
  await assert(!hatchedMerge.first.eggs.includes('ember'),'Cascade remained in the egg list after hatch reconciliation');
  await assert(hatchedMerge.after===4338,'new XP after the merge did not continue accumulating normally');
  await assert(hatchedMerge.roster.includes('luna')&&hatchedMerge.roster.includes('nova')&&hatchedMerge.roster.includes('ember'),'hatched Guardian roster was not preserved');

  // Recreate the exact class-progress failure that previously required Reload.
  const repaired=await page.evaluate(()=>{
    const cid=S.activeCourse;
    S.progress=S.progress||{};
    S.progress[cid]=undefined;
    window.MajickStateCore.normalizeAll();
    const p=prog();
    return !!p && Number.isFinite(Number(p.xp)) && Number.isFinite(Number(p.crystals)) && Array.isArray(p.answers);
  });
  await assert(repaired,'undefined active-course progress was not repaired synchronously');

  // Lifetime XP must recover the highest legitimate saved total and never decrease.
  const xpHighWater=await page.evaluate(()=>{
    const original={
      account:JSON.parse(JSON.stringify(S.majickAccount||{})),
      active:S.activeCourse
    };
    const cid=S.activeCourse;
    const row=S.progress[cid]||{};
    Object.defineProperty(row,'xp',{value:4987,writable:true,configurable:true,enumerable:true});
    S.progress[cid]=row;
    S.majickAccount.xp=7;
    S.majickAccount.xpHighWater=0;
    S.majickAccount.lifetimeXpHighWater=0;
    const recovered=MajickStateCore.ensureAccount();
    const afterRecovery=Number(recovered.xp||0);
    const p=MajickStateCore.normalizeProgressRow(S.progress[cid],cid);
    S.progress[cid]=p;
    p.xp=3;
    const afterLowerWrite=Number(MajickStateCore.ensureAccount().xp||0);
    S.majickAccount=original.account;
    S.activeCourse=original.active;
    MajickStateCore.normalizeAll();
    return {afterRecovery,afterLowerWrite};
  });
  await assert(xpHighWater.afterRecovery===4987,'XP high-water repair did not restore the higher persisted total');
  await assert(xpHighWater.afterLowerWrite===4987,'a stale lower course XP value reduced lifetime Majick XP');

  // Study Now must render after a deliberately damaged progress row.
  await page.evaluate(()=>{
    const cid=S.activeCourse;
    S.progress[cid]=undefined;
    if(typeof navigate==='function')navigate('mission');
    else {S.screen='mission';render();}
  });
  await page.waitForTimeout(500);
  const snag=await page.locator('#v3317RuntimeNotice').count();
  await assert(snag===0,'Study Now produced the runtime snag notice');

  // The actual class selector must expose both official WGU courses and toggle them.
  await page.evaluate(()=>{S.screen='home';render();});
  await page.waitForSelector('.courseSelect',{timeout:10000});
  const courseOptions=await page.locator('.courseSelect option').evaluateAll(opts=>opts.map(o=>({value:o.value,text:o.textContent})));
  await assert(courseOptions.some(o=>o.value==='D755'&&o.text.includes('Assessment for Special Education')),'D755 missing from visible class selector');
  await assert(courseOptions.some(o=>o.value==='D772'&&o.text.includes('Statistical Data Literacy')),'D772 missing from visible class selector');

  await page.locator('.courseSelect').selectOption('D772');
  await page.waitForFunction(()=>window.S?.activeCourse==='D772',{timeout:8000});
  await page.locator('.courseSelect').selectOption('D755');
  await page.waitForFunction(()=>window.S?.activeCourse==='D755',{timeout:8000});

  // Home must feel like a magical college portal, with academics and Guardian life both first-class.
  await page.evaluate(()=>{S.screen='home';render();});
  await page.waitForSelector('.v3327Home',{timeout:10000});
  const collegiateHome=await page.evaluate(()=>({
    version:window.MajickCollegeDashboard?.VERSION||null,
    hero:document.querySelector('.v3327PortalHero')?.innerText||'',
    academic:!!document.querySelector('.v3327AcademicHall'),
    guardian:!!document.querySelector('.v3327GuardianHall'),
    sanctuary:!!document.querySelector('.v3327CampusSanctuary iframe'),
    guardianCards:document.querySelectorAll('.v3327GuardianCard').length,
    record:document.querySelector('.v3327StudentRecord')?.innerText||''
  }));
  await assert(collegiateHome.version==='3.3.27','Moonlit Collegium home runtime missing');
  await assert(/MOONLIT COLLEGIUM/i.test(collegiateHome.hero),'Home is missing the magical-college identity');
  await assert(collegiateHome.academic&&collegiateHome.guardian&&collegiateHome.sanctuary,'Home does not give academics and Guardian life equal presence');
  await assert(collegiateHome.guardianCards===3,'Home Guardian House does not match the three owned Guardians');
  await assert(/ACADEMIC RECORD/i.test(collegiateHome.record)&&/MAJICK RECORD/i.test(collegiateHome.record),'Home does not separate academic and Majick progress');

  // Universal Back navigation must remember the previous screen without creating a dead-end loop.
  await assert(await page.locator('#majickBackButton').count()===0,'Back button should stay out of the way on Home');
  await page.evaluate(()=>{sessionStorage.removeItem('majick_nav_stack_v3329');navigate('guide')});
  await page.waitForSelector('#majickBackButton',{timeout:8000});
  await assert(await page.locator('#majickBackButton').isVisible(),'Universal Back button is not visible away from Home');
  await page.locator('#majickBackButton').click();
  await page.waitForFunction(()=>window.S?.screen==='home',{timeout:8000});
  await assert(await page.locator('#majickBackButton').count()===0,'Back button did not clear after returning Home');

  // Continue this smoke from D755 so the existing Assessment course remains intact.
  await assert((await page.locator('.courseSelect').inputValue())==='D755','visible class selector did not return to D755');

  console.log('SMOKE CHECKPOINT: account/navigation passed');

  // Real Study Guide and Grimoire buttons must be clickable, not blocked by Sanctuary layers.
  await page.evaluate(()=>navigate('guide'));
  await page.waitForSelector('.studyCard button',{timeout:10000});
  await page.locator('.studyCard button').first().click();
  await page.waitForFunction(()=>window.S?.screen==='mission'&&typeof session!=='undefined'&&!!session,null,{timeout:8000});
  const guideClick=await page.evaluate(()=>({screen:S.screen,mode:session?.mode||null,label:session?.label||null}));
  await assert(guideClick.screen==='mission','Study Guide practice button did not open practice');

  await page.evaluate(()=>{
    switchCourse('D755');
    const c=course();
    const q=(c.questionBank||[])[0];
    const p=prog();
    if(q){
      p.answers.push({qid:q.id,topicId:q.topicId,chosen:'__wrong__',correct:false,difficulty:q.difficulty||1,ts:Date.now()});
      p.grimoire=p.grimoire||{};
      p.grimoire[q.id]={qid:q.id,topicId:q.topicId,repaired:false};
    }
    session=null;navigate('grimoire');
  });
  await page.waitForSelector('.sectionTitle button',{timeout:10000});
  const raidBtn=page.getByRole('button',{name:/Fight My Mistakes/i});
  await assert(await raidBtn.count()===1,'Grimoire raid button missing');
  await raidBtn.click();
  await page.waitForFunction(()=>window.S?.screen==='mission'&&typeof session!=='undefined'&&!!session,null,{timeout:8000});
  const grimoireClick=await page.evaluate(()=>({screen:S.screen,mode:session?.mode||null}));
  await assert(grimoireClick.screen==='mission','Grimoire practice button did not open repair practice');

  // Learn Mode must work for every class and keep learning state course-specific.
  await page.evaluate(()=>{switchCourse('D755');navigate('learninglab');});
  await page.waitForSelector('.learnLab[data-course="D755"]',{timeout:10000});
  const d755Learn=await page.evaluate(()=>MajickLearningLab.model('D755'));
  await assert(d755Learn.vocab.length>=8,'D755 Learn Mode has no usable vocabulary');
  await assert(d755Learn.lessons.length>=2,'D755 Learn Mode has no usable explanations');
  await page.locator('[data-learn-tab="vocab"]').click();
  await page.waitForSelector('.vocabCard',{timeout:8000});
  await page.locator('#learnStartVocabGame').click();
  await page.waitForSelector('[data-vocab-answer]',{timeout:8000});
  const gameCorrect=await page.evaluate(()=>MajickLearningLab.gameSnapshot()?.current?.correct);
  await assert(!!gameCorrect,'D755 vocab game did not start');
  await page.locator('[data-vocab-answer]').filter({hasText:gameCorrect}).first().click();
  await page.waitForTimeout(100);

  await page.evaluate(()=>{switchCourse('D772');navigate('learninglab');});
  await page.waitForSelector('.learnLab[data-course="D772"]',{timeout:10000});
  const d772Learn=await page.evaluate(()=>MajickLearningLab.model('D772'));
  const planRuntime=await page.evaluate(()=>({ok:!!window.MajickLearningPlan,version:window.MajickLearningPlan?.VERSION||null,tutor:window.MajickCourseTutor?.VERSION||null}));
  await assert(planRuntime.ok&&planRuntime.version==='3.3.24','Adaptive Learning Plan runtime missing');
  await assert(planRuntime.tutor==='3.3.32','Majick Course Tutor runtime missing or stale: '+planRuntime.tutor);
  await assert(d772Learn.vocab.some(v=>v.term.toLowerCase()==='mean'),'D772 Learn Mode missing statistics vocabulary');
  await assert(d772Learn.lessons.length>=5,'D772 Learn Mode missing visual starter lessons');
  const toolCheck=await page.evaluate(()=>({
    calc:MajickLearningLab.calculateExpression('(12+8)/4'),
    stats:MajickLearningLab.stats([12,14,14,18,22]),
    probability:MajickLearningLab.probability(2,6)
  }));
  await assert(toolCheck.calc.ok&&toolCheck.calc.value===5,'Learning Lab calculator failed');
  await assert(toolCheck.stats.ok&&toolCheck.stats.mean===16&&toolCheck.stats.median===14,'D772 stats lab failed');
  await assert(toolCheck.probability.ok&&toolCheck.probability.fraction==='1/3','D772 probability lab failed');

  const isolatedLearning=await page.evaluate(()=>{
    MajickLearningLab.setScratchpad('D755','D755_ONLY');
    MajickLearningLab.setScratchpad('D772','D772_ONLY');
    return {d755:MajickLearningLab.state('D755').scratch,d772:MajickLearningLab.state('D772').scratch};
  });
  await assert(isolatedLearning.d755==='D755_ONLY'&&isolatedLearning.d772==='D772_ONLY','Learning Lab state crossed courses');

  // A real correct study answer must reward the shared account and persist through reload.
  // D772 is intentionally blank until the learner uploads material, so seed one
  // browser-only regression question instead of treating an empty new course as broken.
  const studyReward=await page.evaluate(()=>{
    const c=course();
    c.questionBank=Array.isArray(c.questionBank)?c.questionBank:[];
    if(!c.questionBank.length){
      c.questionBank.push({
        id:'__browser_reward_check',
        topicId:'browser-regression',
        type:'mcq',
        prompt:'Which value is the median of 2, 4, 9?',
        options:['2','4','5','9'],
        answer:'4',
        why:'The ordered middle value is 4.'
      });
    }
    const before={
      xp:Number(MajickStateCore.ensureAccount()?.xp||0),
      crystals:Number(MajickStateCore.ensureAccount()?.crystals||0),
      answers:Number(prog()?.answers?.length||0)
    };
    startAdaptive();
    const q=session?.current;
    if(!q)return {ok:false,before};
    answerQ(q.answer);
    return {
      ok:true,
      before,
      after:{
        xp:Number(MajickStateCore.ensureAccount()?.xp||0),
        crystals:Number(MajickStateCore.ensureAccount()?.crystals||0),
        answers:Number(prog()?.answers?.length||0)
      },
      reward:{...(session?.reward||{})},
      qid:q.id
    };
  });
  await assert(studyReward.ok,'Smart Mission could not produce a question');
  await assert(studyReward.after.answers===studyReward.before.answers+1,'correct study answer was not recorded');
  await assert(studyReward.after.xp>studyReward.before.xp,'correct study answer did not award Majick XP');
  await assert(studyReward.after.crystals>studyReward.before.crystals,'correct study answer did not award Moon Crystals');

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.render==='function'&&!!window.MajickStateCore&&!!window.MajickGuardianRegistry,{timeout:15000});
  const rewardPersist=await page.evaluate(()=>({
    xp:Number(MajickStateCore.ensureAccount()?.xp||0),
    crystals:Number(MajickStateCore.ensureAccount()?.crystals||0),
    answers:Number(prog()?.answers?.length||0)
  }));
  await assert(rewardPersist.xp===studyReward.after.xp,'study XP did not survive reload');
  await assert(rewardPersist.crystals===studyReward.after.crystals,'Moon Crystals did not survive reload');
  await assert(rewardPersist.answers===studyReward.after.answers,'study answer history did not survive reload');

  // D772 must be pre-seeded and Notes Forge must accept a real uploaded notes file.
  const d772Ready=await page.evaluate(()=>{
    const before=S.activeCourse;
    const d=S.courses?.D772;
    if(!d)return {ok:false,before};
    switchCourse('D772');
    return {ok:true,before,active:S.activeCourse,title:S.courses.D772?.title||''};
  });
  await assert(d772Ready.ok,'D772 was not seeded into Majick Studies');
  await assert(d772Ready.active==='D772'&&d772Ready.title==='Statistical Data Literacy','D772 course metadata is wrong');

  console.log('SMOKE CHECKPOINT: learning/practice passed');
  await page.evaluate(()=>navigate('addmaterial'));
  await page.waitForSelector('#materialFile',{timeout:10000});
  await assert(await page.locator('#materialCourse').inputValue()==='D772','Add Study Material did not default to active D772');
  const d772Notes='Section 1: Assessing Research and Data Credibility. Lesson 1: Understanding Data Collection Methods. A population is the entire group that a research question is about. A sample is the smaller group actually observed or measured. A census collects information from every member of the population. A random sample uses chance so members of the population have a fair opportunity to be selected. A survey asks people to report information or opinions. An observation records what happens without assigning a treatment. An experiment deliberately applies a condition or treatment so outcomes can be compared. The collection method must match the research question. Researchers should identify who collected the data and why it was collected. They should also examine how the sample was selected before deciding what the data can represent. A larger sample does not automatically repair a poor selection method. The population, sample, and collection method work together to determine which conclusions the data can support.';
  await page.locator('#materialFile').setInputFiles({
    name:'D772-statistical-data-literacy-notes.txt',
    mimeType:'text/plain',
    buffer:Buffer.from(d772Notes,'utf8')
  });
  await assert(await page.locator('#materialCount').count()===0,'Notes Forge still asks for a manual question count');
  await page.locator('#materialForgeBtn').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.includes('Study material saved'),{timeout:12000});

  const forged=await page.evaluate(async()=>{
    const cid=S.activeCourse;
    const rows=await MajickMaterialStore.list(cid);
    const row=rows[0]||null;
    return {
      courseId:cid,
      id:row?.id||null,
      questions:row?.generated?.practiceQuestions?.length||0,
      passages:row?.generated?.passages?.length||0,
      target:row?.settings?.targetCount||0,
      rigor:[1,2,3,4].map(r=>(row?.generated?.practiceQuestions||[]).filter(q=>Number(q.rigorLevel||1)===r).length),
      bank:(S.courses?.[cid]?.questionBank||[]).filter(q=>q.sourceId===row?.id).length,
      active:row?.active!==false
    };
  });
  await assert(!!forged.id,'Notes Forge did not save a source');
  await assert(forged.courseId==='D772','uploaded D772 notes were saved under the wrong course');
  await assert(forged.target===100,'Notes Forge did not default to the 100-question adaptive target');
  await assert(forged.questions>=40,'Notes Forge did not build a sufficiently deep adaptive candidate bank');
  await assert(forged.passages>=1,'Notes Forge did not create Read & Learn passages');
  await assert(forged.rigor[2]>0&&forged.rigor[3]>0,'Notes Forge did not include application/analysis rigor');
  await assert(forged.bank>=40&&forged.bank<=110,'Notes Forge did not synchronize a bounded adaptive course bank');
  await assert(forged.active,'new Notes Forge source was not active');

  // D772 repair: one mixed upload may contain several lessons, but the original source
  // remains untouched while generated content is sorted to its correct lesson.
  const mixedRepair=await page.evaluate(async()=>{
    const mixedText=[
      'Section 1: Assessing Research and Data Credibility',
      'Lesson 1: Understanding Data Collection Methods',
      'A population is the entire group of interest. A sample is a subset selected from the population. Data collection methods include surveys, observations, and experiments.',
      'Lesson 2: Recognizing Bias in Data Collection',
      'Selection bias occurs when the method of choosing participants systematically favors some members of the population. Nonresponse and leading wording can also bias results.'
    ].join('\n');
    const row=MajickMaterialStore.newRecord({courseId:'D772',sourceName:'D772 Section 1 combined lessons.txt',sourceType:'txt',text:mixedText});
    row.generated={
      passages:[
        {id:'mix_passage_l1',text:'A population is the entire group of interest. A sample is a subset selected from the population.',sourceExcerpt:'A population is the entire group of interest. A sample is a subset selected from the population.'},
        {id:'mix_passage_l2',text:'Selection bias occurs when the method of choosing participants systematically favors some members of the population.',sourceExcerpt:'Selection bias occurs when the method of choosing participants systematically favors some members of the population.'}
      ],
      vocabulary:[
        {term:'Population',definition:'The entire group of interest.',sourceExcerpt:'A population is the entire group of interest.'},
        {term:'Selection bias',definition:'A systematic problem in how participants are chosen.',sourceExcerpt:'Selection bias occurs when the method of choosing participants systematically favors some members of the population.'}
      ],
      explanations:[],
      misconceptionRepair:[],
      practiceQuestions:[
        {id:'notes_mix_l1',topicId:'notes-population',type:'mcq',prompt:'What is a population?',options:['Entire group','Sample','Bias','Axis'],answer:'Entire group',why:'Population is the entire group.',sourceExcerpt:'A population is the entire group of interest.',rigorLevel:1,difficulty:'foundation'},
        {id:'notes_mix_l2',topicId:'notes-bias',type:'mcq',prompt:'Which situation shows selection bias?',options:['Systematic selection problem','Random sample','Census','Fair graph'],answer:'Systematic selection problem',why:'Selection bias comes from the selection method.',sourceExcerpt:'Selection bias occurs when the method of choosing participants systematically favors some members of the population.',rigorLevel:2,difficulty:'understanding'}
      ]
    };
    await MajickMaterialStore.save(row);
    const p=prog();
    p.answers.push({qid:'notes_mix_l2',topicId:'notes-bias',chosen:'Systematic selection problem',correct:true,difficulty:'understanding',ts:Date.now()});
    await MajickCourseTutor.hydrate('D772');
    const repaired=await MajickMaterialStore.get(row.id);
    const l1=MajickCourseTutor.D772_SECTION_ONE.lessons.find(l=>l.id==='d772-s1-l1');
    const l2=MajickCourseTutor.D772_SECTION_ONE.lessons.find(l=>l.id==='d772-s1-l2');
    const c1=MajickCourseTutor.chapter(l1,'D772');
    const c2=MajickCourseTutor.chapter(l2,'D772');
    const answerPreserved=p.answers.some(a=>a.qid==='notes_mix_l2'&&a.correct);
    const result={
      id:row.id,
      originalText:repaired.text===mixedText,
      multi:repaired.learningPath?.multiLesson===true,
      lessonIds:repaired.learningPath?.lessonIds||[],
      l1HasPopulation:c1.passages.some(x=>x.id==='mix_passage_l1'),
      l1HasBias:c1.passages.some(x=>x.id==='mix_passage_l2'),
      l2HasBias:c2.passages.some(x=>x.id==='mix_passage_l2'),
      l2HasPopulation:c2.passages.some(x=>x.id==='mix_passage_l1'),
      answerPreserved,
      repair:repaired.learningPathRepair
    };
    await MajickMaterialStore.remove(row.id);
    await MajickMaterialStore.syncQuestions(course('D772'),'D772');
    return result;
  });
  await assert(mixedRepair.originalText,'D772 repair changed the original uploaded source');
  await assert(mixedRepair.multi&&mixedRepair.lessonIds.includes('d772-s1-l1')&&mixedRepair.lessonIds.includes('d772-s1-l2'),'mixed D772 source was not recognized as multi-lesson');
  await assert(mixedRepair.l1HasPopulation&&!mixedRepair.l1HasBias,'Lesson 1 Tutor still contains Lesson 2 bias passage');
  await assert(mixedRepair.l2HasBias&&!mixedRepair.l2HasPopulation,'Lesson 2 Tutor still contains Lesson 1 population passage');
  await assert(mixedRepair.answerPreserved,'D772 note repair erased existing answer history');
  await assert(mixedRepair.repair?.originalSourcePreserved===true,'D772 repair did not record source preservation');

  const sourcePath=await page.evaluate(async id=>{
    const row=await MajickMaterialStore.get(id);
    return row?.learningPath||null;
  },forged.id);
  await assert(
    sourcePath?.lessonId==='d772-s1-l1'||sourcePath?.lessonIds?.includes?.('d772-s1-l1'),
    'D772 mixed statistics notes lost their Lesson 1 data-collection placement'
  );

  await page.evaluate(()=>navigate('learninglab'));
  await page.waitForSelector('[data-tutor-tab="path"]',{timeout:10000});
  const d772Path=await page.evaluate(()=>({
    sections:MajickCourseTutor.sections('D772').map(s=>({id:s.id,title:s.title,lessons:s.lessons.map(x=>x.title)})),
    reviewMeta:MajickCourseTutor.D772_SECTION_ONE.lessons.find(x=>x.review)||null,
    contentCount:Object.keys(MajickCourseTutor.D772_SECTION_ONE_CONTENT||{}).length,
    hasSection2:MajickCourseTutor.sections('D772').some(s=>/Section\\s*2/i.test(s.title||''))
  }));
  await assert(d772Path.sections.length===1,'D772 must have exactly one canonical section; Section 2 or duplicate auto-sections were created');
  await assert(d772Path.sections[0].id==='d772-section-1'&&d772Path.sections[0].title==='Section 1: Assessing Research and Data Credibility','D772 canonical Section 1 metadata is wrong');
  await assert(d772Path.sections[0].lessons.join('|')==='Understanding Data Collection Methods|Recognizing Bias in Data Collection|Unveiling Data Misrepresentations|Conclusions About Data Findings|Section 1: Summary and Test','D772 Section 1 learning path order is wrong');
  await assert(d772Path.sections[0].lessons.length===5,'D772 Section 1 must contain four lessons plus one Summary/Test');
  await assert(d772Path.reviewMeta?.number==null&&d772Path.reviewMeta?.title==='Section 1: Summary and Test','Section 1 review was incorrectly numbered as Lesson 5');
  await assert(!d772Path.hasSection2,'D772 incorrectly exposes a Section 2');
  await assert(d772Path.contentCount===5,'built-in D772 Section 1 master content is incomplete');

  console.log('SMOKE CHECKPOINT: notes forge/D772 repair passed');
  const d772QuestionQuality=await page.evaluate(async()=>{
    const built=MajickQuestionBuilder.d772Questions('smoke-d772');
    await MajickMaterialStore.syncQuestions(S.courses.D772,'D772');
    const bank=S.courses.D772.questionBank||[];
    const bad=/according to your notes|from your notes|concept-and-evidence pairing|concept and evidence pairing|strongest evidence for the concept|best completes this statement/i;
    return {
      builtCount:built.length,
      builtBad:built.filter(q=>bad.test(q.prompt||'')).length,
      rationaleMissing:built.filter(q=>!/What WGU is testing:/i.test(q.why||'')||!/Clue to notice:/i.test(q.why||'')).length,
      styleBad:built.filter(q=>q.questionStyle!=='wgu-course-scenario').length,
      missingWguTerms:built.filter(q=>!q.wguTerm||!/WGU terminology:/i.test(q.why||'')||!/WGU clue to notice:/i.test(q.why||'')).length,
      forbiddenLanguage:built.flatMap(q=>[...(q.options||[]),q.answer||'']).filter(x=>/convenience bias|randomized controlled trial|double-blind study|open-label|cluster randomized|loaded wording|cluster bias|nonlinear only|^positive$|^negative$|^cluster$|^stratified$|^systematic$|^simple random$|causal effect/i.test(String(x))).length,
      hasCoreWguTerms:['Random sampling vs. randomization','Perceived lack of anonymity','Statistical significance','Association vs. causal relationship','Confounding variable','Positive correlation','Negative correlation','Outlier'].every(term=>built.some(q=>String(q.wguTerm||'').includes(term))),
      bankCount:bank.length,
      bankBad:bank.filter(q=>bad.test(q.prompt||'')).length,
      nonCurated:bank.filter(q=>!String(q.id||'').startsWith('d772_wgu_')).length,
      visualCount:built.filter(q=>!!q.visual).length,
      missingChoiceCoach:built.filter(q=>!(q.options||[]).every(o=>typeof q.choiceCoach?.[o]==='string'&&q.choiceCoach[o].length>20)).length
    };
  });
  await assert(d772QuestionQuality.builtCount>=40,'D772 curated WGU-style bank is too small');
  await assert(d772QuestionQuality.builtBad===0&&d772QuestionQuality.bankBad===0,'D772 still contains note-matching/meta questions');
  await assert(d772QuestionQuality.rationaleMissing===0,'D772 rationales do not explain what WGU is testing and the clue to notice');
  await assert(d772QuestionQuality.missingWguTerms===0,'D772 questions are missing official WGU terminology labels');
  await assert(d772QuestionQuality.forbiddenLanguage===0,'D772 answer choices drifted away from WGU course terminology');
  await assert(d772QuestionQuality.hasCoreWguTerms,'D772 core WGU terminology set is incomplete');
  await assert(d772QuestionQuality.styleBad===0&&d772QuestionQuality.nonCurated===0,'D772 active bank is not exclusively the curated WGU concept/scenario bank');
  await assert(d772QuestionQuality.bankCount===d772QuestionQuality.builtCount,'D772 active bank does not match the curated bank');
  await assert(d772QuestionQuality.visualCount>=7,'D772 visual graph questions are missing');
  await assert(d772QuestionQuality.missingChoiceCoach===0,'D772 answer choices are missing why-not coaching');

  const wguPractice=await page.evaluate(()=>{
    const version=window.MajickWGUPractice?.VERSION||null;
    MajickWGUPractice.startOA();
    const ids=(session?.questions||[]).map(q=>q.id);
    const lessons=[...new Set((session?.questions||[]).map(q=>q.learningPathLessonId))];
    const html=sessionHTML();
    const firstTwo=(session?.questions||[]).slice(0,2);
    session={
      type:'test',
      opts:{label:'Section 1 OA Simulation',limit:2,hideMeta:true,kind:'d772-section1-oa'},
      index:2,score:1,questions:firstTwo,current:firstTwo[1],answered:false,confidence:'sure',
      review:[
        {q:firstTwo[0],chosen:firstTwo[0]?.answer,correct:true},
        {q:firstTwo[1],chosen:firstTwo[1]?.options?.find(x=>x!==firstTwo[1]?.answer)||'',correct:false}
      ],
      start:Date.now(),finished:true,pendingChoice:null
    };
    const result=resultHTML();
    session=null;
    return {
      version,
      count:ids.length,
      unique:new Set(ids).size,
      lessonCount:lessons.length,
      kind:'d772-section1-oa',
      hasSubmit:/v3333Submit/.test(html),
      hasNoHints:/No hints or lesson labels/.test(html),
      leaksClue:/Clue Charm|Crystal confidence|WGU clue to notice/i.test(html),
      hasReadiness:/Section 1 Practice Readiness by Lesson/.test(result)&&/Concepts to Review/.test(result)
    };
  });
  await assert(wguPractice.version==='3.3.33','WGU Practice Lab runtime missing');
  await assert(wguPractice.count===30&&wguPractice.unique===30,'Section 1 OA simulation did not build 30 unique questions');
  await assert(wguPractice.lessonCount===4,'Section 1 OA simulation did not mix all four lessons');
  await assert(wguPractice.hasSubmit&&wguPractice.hasNoHints&&!wguPractice.leaksClue,'OA simulation does not use a clean WGU-style submit surface');
  await assert(wguPractice.hasReadiness,'OA simulation result is missing lesson/concept readiness');
  await page.evaluate(()=>navigate('learninglab'));
  await page.waitForSelector('#courseTutorPath .pathSection',{timeout:10000});
  await assert(await page.locator('#courseTutorPath .pathSection').count()===1,'D772 Course Path rendered repeated/extra sections');
  await assert(await page.getByText('Section 1: Assessing Research and Data Credibility',{exact:true}).count()>=1,'D772 Section 1 path is not visible');
  await page.getByText('Understanding Data Collection Methods',{exact:true}).first().click();
  await page.waitForSelector('#courseTutorLesson .tutorChapterBlock',{timeout:10000});
  const tutorDepth=await page.evaluate(()=>{
    const lesson=MajickCourseTutor.selectedLesson('D772');
    const c=MajickCourseTutor.chapter(lesson,'D772');
    return {lesson:lesson?.id,sources:c.sourceRows.length,official:!!c.official,officialTopics:c.official?.teach?.length||0,passages:c.passages.length,merged:!!c.mergedTeaching,mergedTitle:c.mergedTeaching?.title||'',vocab:c.vocab.length,status:c.mastery.status,target:c.mastery.targetRigor};
  });
  await assert(tutorDepth.lesson==='d772-s1-l1'&&tutorDepth.official&&tutorDepth.officialTopics>=4,'Course Tutor did not open the built-in D772 Lesson 1 master notes');
  await assert(tutorDepth.passages>=1&&tutorDepth.vocab>=1,'Course Tutor did not build deep lesson teaching content');
  await assert(tutorDepth.merged&&/Complete Lesson 1 Teaching Notes/.test(tutorDepth.mergedTitle),'D772 Lesson 1 was not combined into one complete teaching chapter');
  await assert(await page.locator('#courseTutorLesson .tutorOfficialTeaching').count()===1,'D772 Lesson 1 master teaching block did not render exactly once');
  await assert(tutorDepth.status==='Learning'&&tutorDepth.target===1,'new lesson did not begin at Learning / foundation rigor');

  // Majick Tutor must provide four in-page help actions grounded in the current lesson.
  await assert(await page.locator('[data-tutor-help]').count()===4,'Majick Tutor is missing one or more contextual help actions');
  await page.locator('[data-tutor-help="simple"]').click();
  await page.waitForSelector('#tutorAssistPanel:not([hidden])',{timeout:5000});
  await assert(/four questions|full group/i.test(await page.locator('#tutorAssistPanel').innerText()),'Explain Simpler did not render Lesson 1 guidance');
  await page.locator('#tutorAssistClose').click();

  await page.locator('[data-tutor-help="example"]').click();
  await assert(/5,000 teachers|stratified/i.test(await page.locator('#tutorAssistPanel').innerText()),'Give Me an Example did not render the Lesson 1 scenario');
  await page.locator('#tutorAssistClose').click();

  await page.locator('[data-tutor-help="quiz"]').click();
  await page.waitForSelector('[data-tutor-quick-choice="2"]',{timeout:5000});
  await page.locator('[data-tutor-quick-choice="2"]').click();
  await assert(/Correct/i.test(await page.locator('.tutorQuickFeedback').innerText()),'Quiz Me on This Page did not score the built-in quick check');
  await page.locator('#tutorAssistClose').click();

  await page.locator('[data-tutor-help="mistakes"]').click();
  await assert((await page.locator('#tutorAssistPanel').innerText()).length>40,'Related Mistakes did not render a repair surface');
  await page.locator('#tutorAssistClose').click();

  // When Tutor is open, universal Back should return to Course Path before leaving Learning Lab.
  await page.waitForSelector('#majickBackButton',{timeout:5000});
  await page.locator('#majickBackButton').click();
  await assert(await page.locator('.learnPanel[data-panel="path"]:not([hidden])').count()===1,'Back from Tutor did not return to Course Path');
  await page.getByText('Understanding Data Collection Methods',{exact:true}).first().click();
  await page.waitForSelector('#courseTutorLesson .tutorChapterBlock',{timeout:5000});

  const tutorGrowth=await page.evaluate(()=>{
    const lesson=MajickCourseTutor.selectedLesson('D772');
    const qs=MajickCourseTutor.questionsForLesson(lesson,'D772');
    const p=prog();
    const r4=qs.filter(q=>Number(q.rigorLevel||1)===4).slice(0,2);
    const r3=qs.filter(q=>Number(q.rigorLevel||1)===3).slice(0,3);
    const base=qs.filter(q=>!r4.includes(q)&&!r3.includes(q)).slice(0,4);
    const chosen=[...r4,...r3,...base];
    chosen.forEach(q=>p.answers.push({qid:q.id,topicId:q.topicId,chosen:q.answer,correct:true,difficulty:q.difficulty,ts:Date.now()}));
    const high=MajickCourseTutor.mastery(lesson,'D772');
    chosen.slice(0,3).forEach(q=>p.answers.push({qid:q.id,topicId:q.topicId,chosen:'__wrong__',correct:false,difficulty:q.difficulty,ts:Date.now()+1}));
    const repair=MajickCourseTutor.mastery(lesson,'D772');
    return {high,repair};
  });
  await assert(tutorGrowth.high.targetRigor>=3,'correct lesson answers did not increase target rigor');
  await assert(['Proficient','Mastered'].includes(tutorGrowth.high.status),'correct higher-rigor answers did not improve lesson mastery');
  await assert(tutorGrowth.repair.status==='Needs Review'&&tutorGrowth.repair.targetRigor<tutorGrowth.high.targetRigor,'recent wrong answers did not trigger a repair loop');

  await page.locator('[data-plan-tab="read"]').click();
  await page.waitForSelector('.coursePassage',{timeout:10000});
  const learningDepth=await page.evaluate(()=>({
    passages:MajickLearningPlan.passageList('D772').length,
    questions:MajickLearningPlan.profile('D772').questions.length,
    recommendation:MajickLearningPlan.recommendation('D772')
  }));
  await assert(learningDepth.passages>=1,'Read & Learn did not expose generated passages');
  await assert(learningDepth.questions>=40,'Learning Plan did not see the adaptive question bank');
  await assert(!!learningDepth.recommendation,'Learning Plan produced no next-step recommendation');
  await page.evaluate(()=>navigate('addmaterial'));

  const d772LeakCheck=await page.evaluate(async id=>{
    const otherId=Object.keys(S.courses||{}).find(cid=>cid!=='D772')||null;
    const other=otherId?S.courses[otherId]:null;
    const otherRows=otherId?await MajickMaterialStore.list(otherId):[];
    return {
      otherId,
      bank:(other?.questionBank||[]).filter(q=>q.sourceId===id).length,
      sources:otherRows.filter(row=>row.id===id).length
    };
  },forged.id);
  await assert(!!d772LeakCheck.otherId,'no second course exists for D772 isolation test');
  await assert(d772LeakCheck.bank===0&&d772LeakCheck.sources===0,'D772 uploaded notes leaked into another course');

  const sourceSelector='[data-source="'+forged.id+'"]';
  await page.locator(sourceSelector+' .v3315ToggleSource').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.startsWith('Paused '),{timeout:8000});
  const paused=await page.evaluate(async id=>{
    const row=await MajickMaterialStore.get(id);
    return {active:row?.active!==false,bank:(S.courses?.[S.activeCourse]?.questionBank||[]).filter(q=>q.sourceId===id).length};
  },forged.id);
  await assert(!paused.active&&paused.bank===0,'pausing a Notes Forge source did not remove its questions');

  await page.locator(sourceSelector+' .v3315ToggleSource').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.startsWith('Activated '),{timeout:8000});
  const activated=await page.evaluate(async id=>{
    const row=await MajickMaterialStore.get(id);
    return {active:row?.active!==false,bank:(S.courses?.[S.activeCourse]?.questionBank||[]).filter(q=>q.sourceId===id).length};
  },forged.id);
  await assert(activated.active&&activated.bank>=5,'reactivating a Notes Forge source did not restore its questions');

  await page.locator(sourceSelector+' .v3315RegenerateSource').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.includes('Regenerated '),{timeout:10000});
  const regenerated=await page.evaluate(async id=>{
    const row=await MajickMaterialStore.get(id);
    return {exists:!!row,questions:row?.generated?.practiceQuestions?.length||0,bank:(S.courses?.[S.activeCourse]?.questionBank||[]).filter(q=>q.sourceId===id).length};
  },forged.id);
  await assert(regenerated.exists&&regenerated.questions>=40&&regenerated.bank>=40,'Notes Forge regeneration broke adaptive source synchronization');

  const duplicateCleanup=await page.evaluate(async id=>{
    const row=await MajickMaterialStore.get(id);
    const copy=JSON.parse(JSON.stringify(row));
    copy.id=id+'_duplicate_copy';
    copy.sourceName=row.sourceName+' duplicate copy';
    copy.createdAt=new Date(Date.now()+1000).toISOString();
    await MajickMaterialStore.save(copy);
    await AddStudyMaterialPage.refreshLibrary();
    return {copyId:copy.id,answersBefore:prog().answers.length};
  },forged.id);
  await assert(await page.locator('.v3315DuplicateBadge').count()===1,'exact duplicate upload was not identified in My Study Sources');
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('.v3315DeleteDuplicates').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.startsWith('Deleted 1 duplicate source copy'),{timeout:8000});
  const duplicateRemoved=await page.evaluate(async ({id,copyId,answersBefore})=>({
    original:!!(await MajickMaterialStore.get(id)),
    copy:await MajickMaterialStore.get(copyId),
    answersBefore,
    answersAfter:prog().answers.length,
    bank:(S.courses?.[S.activeCourse]?.questionBank||[]).filter(q=>q.sourceId===id).length
  }),{id:forged.id,copyId:duplicateCleanup.copyId,answersBefore:duplicateCleanup.answersBefore});
  await assert(duplicateRemoved.original&&!duplicateRemoved.copy,'duplicate cleanup did not preserve the original source and delete only the later copy');
  await assert(duplicateRemoved.answersAfter===duplicateRemoved.answersBefore&&duplicateRemoved.bank>=40,'duplicate cleanup erased answer history or failed to rebuild the active question bank');

  const answersBeforeDelete=await page.evaluate(()=>prog().answers.length);
  page.once('dialog',dialog=>dialog.accept());
  await page.locator(sourceSelector+' .v3315RemoveSource').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.startsWith('Deleted '),{timeout:8000});
  const removed=await page.evaluate(async id=>({
    row:await MajickMaterialStore.get(id),
    bank:(S.courses?.[S.activeCourse]?.questionBank||[]).filter(q=>q.sourceId===id).length,
    answers:prog().answers.length
  }),forged.id);
  await assert(!removed.row&&removed.bank===0,'removing a Notes Forge source left stale source questions behind');
  await assert(removed.answers===answersBeforeDelete,'deleting a Notes Forge source erased answer history');

  // WGU courses must keep academic data separate while account rewards stay shared.
  const courseIsolation=await page.evaluate(()=>{
    let originalId=Object.keys(S.courses||{}).find(cid=>cid!=='D772');
    if(!originalId){
      MajickCourseManager.createCourse('TEST101','Isolation Test Course');
      originalId='TEST101';
    }
    switchCourse(originalId);
    const originalCourse=S.courses[originalId];
    const accountBefore={
      xp:Number(MajickStateCore.ensureAccount()?.xp||0),
      crystals:Number(MajickStateCore.ensureAccount()?.crystals||0)
    };

    S.v3311=S.v3311||{};
    S.v3311.grimoire=S.v3311.grimoire||{page:0,bookmarks:[],notes:{},remember:{},search:''};
    S.v3311.grimoire.notes=S.v3311.grimoire.notes||{};
    S.v3311.grimoire.notes.__courseIsolation='ORIGINAL_ONLY';
    save();

    if(!S.courses.D772){
      MajickCourseManager.createCourse('D772','Statistical Data Literacy');
    }else{
      switchCourse('D772');
    }
    MajickStateCore.normalizeAll();

    const d=prog();
    d.streak=7;
    d.answers.push({qid:'__d772_isolation_answer',correct:true,ts:Date.now()});
    S.courses.D772.questionBank=S.courses.D772.questionBank||[];
    S.courses.D772.questionBank.push({
      id:'__d772_isolation_question',
      topicId:'uploaded-notes',
      type:'mcq',
      prompt:'D772 isolation marker',
      options:['A','B','C','D'],
      answer:'A',
      sourceId:'__course_isolation'
    });
    S.v3311=S.v3311||{};
    S.v3311.grimoire={page:2,bookmarks:['__d772'],notes:{__courseIsolation:'D772_ONLY'},remember:{},search:'probability'};
    save();

    const d772BeforeSwitch={
      streak:d.streak,
      answer:d.answers.some(x=>x.qid==='__d772_isolation_answer'),
      question:S.courses.D772.questionBank.some(x=>x.id==='__d772_isolation_question'),
      note:S.v3311?.grimoire?.notes?.__courseIsolation||null
    };
    const accountMid={
      xp:Number(MajickStateCore.ensureAccount()?.xp||0),
      crystals:Number(MajickStateCore.ensureAccount()?.crystals||0)
    };

    switchCourse(originalId);
    MajickStateCore.normalizeAll();
    const originalP=prog();
    const originalAfter={
      id:S.activeCourse,
      title:S.courses[S.activeCourse]?.title||'',
      streak:Number(originalP.streak||0),
      leakedAnswer:originalP.answers.some(x=>x.qid==='__d772_isolation_answer'),
      leakedQuestion:(S.courses[S.activeCourse]?.questionBank||[]).some(x=>x.id==='__d772_isolation_question'),
      note:S.v3311?.grimoire?.notes?.__courseIsolation||null,
      xp:Number(MajickStateCore.ensureAccount()?.xp||0),
      crystals:Number(MajickStateCore.ensureAccount()?.crystals||0)
    };

    switchCourse('D772');
    MajickStateCore.normalizeAll();
    const d772After={
      streak:Number(prog().streak||0),
      answer:prog().answers.some(x=>x.qid==='__d772_isolation_answer'),
      question:(S.courses.D772?.questionBank||[]).some(x=>x.id==='__d772_isolation_question'),
      note:S.v3311?.grimoire?.notes?.__courseIsolation||null,
      xp:Number(MajickStateCore.ensureAccount()?.xp||0),
      crystals:Number(MajickStateCore.ensureAccount()?.crystals||0)
    };

    // Return to the original course so the rest of the smoke stays on its starting class.
    switchCourse(originalId);

    return {originalId,originalTitle:originalCourse?.title||'',accountBefore,accountMid,originalAfter,d772BeforeSwitch,d772After};
  });

  await assert(courseIsolation.originalAfter.id===courseIsolation.originalId,'course switch did not return to the original class');
  await assert(!courseIsolation.originalAfter.leakedAnswer,'D772 answer history leaked into the original course');
  await assert(!courseIsolation.originalAfter.leakedQuestion,'D772 question bank leaked into the original course');
  await assert(courseIsolation.originalAfter.note==='ORIGINAL_ONLY','original Grimoire state was not restored by course');
  await assert(courseIsolation.d772BeforeSwitch.streak===7&&courseIsolation.d772After.streak===7,'D772 class streak did not remain course-specific');
  await assert(courseIsolation.d772After.answer&&courseIsolation.d772After.question,'D772 academic data did not survive a course switch');
  await assert(courseIsolation.d772After.note==='D772_ONLY','D772 Grimoire state did not survive a course switch');
  await assert(courseIsolation.accountBefore.xp===courseIsolation.accountMid.xp&&courseIsolation.accountMid.xp===courseIsolation.d772After.xp,'Majick XP changed merely from switching courses');
  await assert(courseIsolation.accountBefore.crystals===courseIsolation.accountMid.crystals&&courseIsolation.accountMid.crystals===courseIsolation.d772After.crystals,'Moon Crystals changed merely from switching courses');

  console.log('SMOKE CHECKPOINT: D772 tutor/question quality passed');

  // Guardian care must be a functional loop, not decorative buttons.
  const careFlow=await page.evaluate(()=>{
    const initial=MajickGuardianCare.snapshot();
    const pet=initial.roster[0];
    if(!pet)return {ok:false,reason:'no owned Guardian'};
    const account=MajickStateCore.ensureAccount();
    account.crystals=200;
    account.guardianInventory={};
    account.guardianOwned=['starter-ribbon-toy'];
    const g=MajickGuardianCare.state(pet.petId);
    Object.assign(g,{hunger:40,hydration:40,energy:40,fun:40,grooming:40,affection:40,affectionCooldownUntil:0});
    const favorite=MajickGuardianCare.snapshot().guardians[pet.petId]?.favoriteItem;
    const catalog=MajickGuardianCare.catalog;
    const ids=['moonberry-meal','starlight-treat','moon-silver-brush'];
    if(favorite&&catalog.some(x=>x.id===favorite))ids.push(favorite);
    const purchases=[];
    for(const id of ids){
      const before=MajickGuardianCare.snapshot().crystals;
      const item=catalog.find(x=>x.id===id);
      const result=MajickGuardianCare.buy(id);
      const after=MajickGuardianCare.snapshot().crystals;
      purchases.push({id,cost:item?.cost||0,ok:result.ok,before,after});
    }
    const feed=MajickGuardianCare.performAction(pet.petId,'feed',{objectId:'guardian-food-bowl'});
    const water=MajickGuardianCare.performAction(pet.petId,'water',{objectId:'guardian-water-basin'});
    const treat=MajickGuardianCare.performAction(pet.petId,'treat',{objectId:'guardian-treat-jar'});
    const groom=MajickGuardianCare.performAction(pet.petId,'groom',{objectId:'guardian-brush'});
    const play=MajickGuardianCare.performAction(pet.petId,'play',{itemId:favorite,objectId:'guardian-toy-basket'});
    const sleepFirst=MajickGuardianCare.performAction(pet.petId,'sleep',{objectId:'moonstone-crystal-bed'});
    const sleepMove=MajickGuardianCare.performAction(pet.petId,'sleep',{objectId:'amethyst-crystal-bed'});
    const sleep=MajickGuardianCare.performAction(pet.petId,'sleep',{objectId:'moonstone-crystal-bed'});
    const affection=MajickGuardianCare.performAction(pet.petId,'affection');
    const actions={feed,water,treat,groom,play,sleep,affection};
    save();
    return {
      ok:true,petId:pet.petId,favorite,purchases,
      actions:Object.fromEntries(Object.entries(actions).map(([k,v])=>[k,{ok:v.ok,favoriteBonus:v.favoriteBonus||false,travelObject:v.travelObject||null}])),
      sleepMoveOk:!!sleepFirst.ok&&!!sleepMove.ok&&!!sleep.ok,
      snapshot:MajickGuardianCare.snapshot(),
      bed:S.v3311?.sanctuaryState?.bedAssignments?.['moonstone-crystal-bed']||null,
      otherBed:S.v3311?.sanctuaryState?.bedAssignments?.['amethyst-crystal-bed']||null
    };
  });
  await assert(careFlow.ok,'no owned Guardian was available for care testing');
  for(const purchase of careFlow.purchases){
    await assert(purchase.ok,'Guardian Boutique purchase failed for '+purchase.id);
    await assert(purchase.after===purchase.before-purchase.cost,'Guardian Boutique charged the wrong amount for '+purchase.id);
  }
  for(const [action,result] of Object.entries(careFlow.actions)){
    await assert(result.ok,'Guardian care action failed: '+action);
  }
  await assert(careFlow.actions.play.favoriteBonus===true,'owned favorite item did not trigger the Guardian bond bonus');
  await assert(careFlow.actions.feed.travelObject==='guardian-food-bowl','feeding did not route the Guardian to the food bowl');
  await assert(careFlow.actions.play.travelObject==='guardian-toy-basket','play did not route the Guardian to the toy area');
  await assert(careFlow.sleepMoveOk,'Guardian could not move between Sanctuary beds');
  await assert(careFlow.bed===careFlow.petId,'Guardian bed assignment was not stored by pet id');
  await assert(careFlow.otherBed===null,'moving beds left a stale double assignment');

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.render==='function'&&!!window.MajickGuardianCare&&!!window.MajickStateCore,{timeout:15000});
  const carePersist=await page.evaluate(({petId,favorite})=>({
    bed:S.v3311?.sanctuaryState?.bedAssignments?.['moonstone-crystal-bed']||null,
    brush:MajickGuardianCare.snapshot().owned.includes('moon-silver-brush'),
    favorite:MajickGuardianCare.snapshot().owned.includes(favorite),
    meal:Number(MajickGuardianCare.snapshot().inventory['moonberry-meal']||0),
    treat:Number(MajickGuardianCare.snapshot().inventory['starlight-treat']||0),
    bond:Number(MajickGuardianCare.snapshot().guardians[petId]?.bond||0)
  }),{petId:careFlow.petId,favorite:careFlow.favorite});
  await assert(carePersist.bed===careFlow.petId,'Guardian bed assignment did not survive reload');
  await assert(carePersist.brush,'Grooming brush ownership did not survive reload');
  await assert(carePersist.favorite,'Guardian favorite-item ownership did not survive reload');
  await assert(carePersist.meal===2&&carePersist.treat===2,'consumable Guardian inventory did not persist expected quantities');
  await assert(carePersist.bond>0,'Guardian bond progress did not survive reload');

  console.log('SMOKE CHECKPOINT: guardian care passed');

  // Companions must create the real Sanctuary iframe, not a dead static replacement.
  // Heavy media was intentionally blocked during academic/runtime checks; enable it now.
  await page.unroute('**/*',lightBootRoute);
  await page.evaluate(()=>{if(typeof navigate==='function')navigate('companions');else {S.screen='companions';render();}});
  await page.waitForSelector('.majCareDock',{timeout:10000});
  const careDock=await page.evaluate(()=>({
    rosterButtons:document.querySelectorAll('.majCareDockPet').length,
    detailsVisible:!!document.querySelector('.majGuardianCare'),
    dockTop:document.querySelector('.majCareDock')?.getBoundingClientRect().top||0,
    sanctuaryTop:document.querySelector('.phase4Wrap')?.getBoundingClientRect().top||0
  }));
  await assert(careDock.rosterButtons===3,'compact care dock does not match the current three hatched Guardians');
  await assert(!careDock.detailsVisible,'full Guardian care panel should be collapsed by default');
  await assert(careDock.dockTop<=careDock.sanctuaryTop,'Take Care dock is still below the Sanctuary');
  await page.waitForSelector('iframe.v3317SanctuaryFrame',{timeout:15000});
  const frame=page.frames().find(f=>f.url().includes('/sanctuary/')&&f.url().includes('context=companions'));
  await assert(!!frame,'Sanctuary iframe did not load');
  await frame.waitForFunction(()=>typeof window.Game!=='undefined'||document.querySelector('canvas'),{timeout:20000});
  await frame.waitForFunction(()=>window.MajickSanctuaryLife?.VERSION==='3.3.20',{timeout:12000});
  await frame.waitForFunction(()=>window.MajickSanctuaryCustomize?.VERSION==='3.3.21',{timeout:12000});
  await frame.waitForFunction(()=>window.MajickSanctuaryRecovery?.VERSION==='3.3.22',{timeout:12000});
  await frame.waitForFunction(()=>window.MajickGuardianVisualAuthority?.VERSION==='3.3.25',{timeout:12000});
  await frame.waitForFunction(()=>!!window.majickPhaserGame?.scene?.getScene?.('Game'),{timeout:20000});
  await frame.waitForFunction(()=>Number(window.majickPhaserGame?.scene?.getScene?.('Game')?.v3317CareState?.roster?.length||0)>0,{timeout:12000});
  const san=await frame.evaluate(()=>({
    hasGame:typeof window.Game!=='undefined',
    hasCanvas:!!document.querySelector('canvas'),
    hasRegistry:!!window.MajickGuardianRegistry,
    sanctuaryLife:window.MajickSanctuaryLife?.VERSION||null,
    sanctuaryCustomize:window.MajickSanctuaryCustomize?.VERSION||null,
    sanctuaryRecovery:window.MajickSanctuaryRecovery?.VERSION||null,
    guardianVisualAuthority:window.MajickGuardianVisualAuthority?.VERSION||null
  }));
  await assert(san.hasGame||san.hasCanvas,'Phaser Sanctuary did not initialize');
  await assert(san.hasRegistry,'Guardian registry unavailable inside Sanctuary');
  await assert(san.sanctuaryLife==='3.3.20','Sanctuary Home runtime did not load');
  await assert(san.sanctuaryCustomize==='3.3.21','Sanctuary Customization runtime did not load');
  await assert(san.sanctuaryRecovery==='3.3.22','Sanctuary Recovery runtime did not load');
  await assert(san.guardianVisualAuthority==='3.3.25','Guardian Visual Authority runtime did not load');

  await frame.waitForTimeout(1200);
  const visualAuthority=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    scene.v3325SyncOwnedVisuals?.();
    scene.v3317UpdateGuardianVisuals?.();
    return window.MajickGuardianVisualAuthority.inspect(scene);
  });
  await assert(visualAuthority.owned.length===3,'Guardian visual authority did not preserve the three owned Guardians');
  await assert(visualAuthority.visuals.luna.count===1,'Velora has duplicate visible Phaser layers');
  await assert(visualAuthority.visuals.nova.count===1,'Solstice has duplicate visible Phaser layers');
  await assert(visualAuthority.visuals.ember.count===1,'Cascade has duplicate visible Phaser layers');
  await assert(visualAuthority.visuals.mallow.count===0,'unowned Aurelia is still visible in the Sanctuary');
  await assert(visualAuthority.totalVisible===3,'Sanctuary renders more visible Guardian layers than the owned roster');
  await assert(visualAuthority.visuals.ember.height<=238,'Cascade Apprentice visual is oversized');
  await assert(visualAuthority.visuals.luna.height<=288&&visualAuthority.visuals.nova.height<=288,'evolved Guardian visuals are oversized');

  const ownedVisibility=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    scene.v3322SyncOwnedGuardians?.();
    scene.v3322DockGuardianHome?.();
    return window.MajickSanctuaryRecovery.inspect(scene);
  });
  await assert(ownedVisibility.owned.length===3&&ownedVisibility.owned.includes('luna')&&ownedVisibility.owned.includes('nova')&&ownedVisibility.owned.includes('ember'),'Sanctuary owned roster is not the real three hatched Guardians');
  await assert(ownedVisibility.visible.ember.controller||ownedVisibility.visible.ember.walk||ownedVisibility.visible.ember.action,'hatched Cascade/ember is not visible in Sanctuary');
  await assert(!ownedVisibility.visible.mallow.controller&&!ownedVisibility.visible.mallow.walk&&!ownedVisibility.visible.mallow.action,'unowned Aurelia/mallow is visible in Sanctuary');
  await assert(
    ownedVisibility.hud?.screenX>ownedVisibility.hud?.viewportWidth*.5&&ownedVisibility.hud?.screenY<=100,
    'Guardian Home panel was not moved to the upper-right'
  );

  const sanctuaryHome=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    scene.v3320ApplyCareSnapshot?.(scene.v3317CareState);
    const food=scene.getObjectInteractionDef?.('guardian-food-bowl');
    const movable=(scene.decorItems||[]).find(x=>!!(x.getData?.('objectId')||x.getData?.('decorId')));
    if(movable){movable.x=427;movable.y=773}
    const snapped=scene.v3320SnapDecorItem?.(movable);
    return {
      inspect:window.MajickSanctuaryLife.inspect(scene),
      food:{id:food?.id||null,mode:food?.mode||null,x:food?.x||0,y:food?.y||0},
      snapped
    };
  });
  await assert(sanctuaryHome.inspect.hud,'Guardian Home HUD did not initialize');
  await assert(sanctuaryHome.inspect.guardianLabels>=1,'moving Guardian has no visible identity/needs label');
  await assert(Object.keys(sanctuaryHome.inspect.badges||{}).length>=6,'care furniture status badges did not initialize');
  await assert(sanctuaryHome.food.id==='guardian-food-bowl'&&sanctuaryHome.food.mode==='delight','food bowl is not a physical Guardian interaction target');
  await assert(sanctuaryHome.snapped?.x%20===0&&sanctuaryHome.snapped?.y%20===0,'edit-mode furniture snapping is not active');

  const customizationBefore=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    scene.v3321ApplyFurnitureVisibility?.();
    scene.v3321BuildRoomZones?.();
    return window.MajickSanctuaryCustomize.inspect(scene);
  });
  await assert(customizationBefore.owned>=15,'existing Sanctuary furniture was not migrated as owned');
  await assert(customizationBefore.managerButton,'Furniture manager button did not initialize');
  await assert(customizationBefore.zones,'Sanctuary room zones did not initialize');
  await assert(customizationBefore.nooks>=1,'Guardian personal nook was not created from the real roster/bed state');

  const storeResult=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    const r=scene.v3321SetPlaced?.('guardian-toy-basket',false);
    const item=(scene.decorItems||[]).find(x=>(x.getData?.('objectId')||x.getData?.('decorId'))==='guardian-toy-basket');
    return {r,visible:item?.visible!==false,inspect:window.MajickSanctuaryCustomize.inspect(scene)};
  });
  await assert(storeResult.r?.ok&&storeResult.visible===false&&storeResult.inspect.stored>=1,'storing owned Sanctuary furniture failed');
  await page.waitForFunction(()=>S?.majickAccount?.sanctuaryFurniture?.stored?.includes('guardian-toy-basket'),{timeout:5000});

  const placeAndPreset=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    const placed=scene.v3321SetPlaced?.('guardian-toy-basket',true);
    const preset=scene.v3321ApplyPreset?.('cozy-dorm');
    const desk=(scene.decorItems||[]).find(x=>(x.getData?.('objectId')||x.getData?.('decorId'))==='moonlit-study-desk');
    const saved=scene.readSavedDecorPosition?.('moonlit-study-desk');
    return {placed,preset,desk:{x:desk?.x,y:desk?.y,visible:desk?.visible},saved,inspect:window.MajickSanctuaryCustomize.inspect(scene)};
  });
  await assert(placeAndPreset.placed?.ok&&placeAndPreset.inspect.stored===0,'placing stored Sanctuary furniture failed');
  await assert(placeAndPreset.preset?.ok&&placeAndPreset.inspect.preset==='cozy-dorm','Cozy Dorm preset failed');
  await assert(placeAndPreset.desk.visible&&placeAndPreset.saved?.x===1100&&placeAndPreset.saved?.y===780,'Cozy Dorm layout did not persist its study-zone placement');
  await page.waitForFunction(()=>!S?.majickAccount?.sanctuaryFurniture?.stored?.includes('guardian-toy-basket')&&S?.majickAccount?.sanctuaryFurniture?.preset==='cozy-dorm',{timeout:5000});

  // Sanctuary edit positions must be backed by persistent layout storage.
  const layoutWrite=await frame.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    if(!scene||typeof scene.saveDecorPosition!=='function'||typeof scene.readSavedDecorPosition!=='function')return {ok:false};
    scene.saveDecorPosition('arcane-stacks',432,777);
    return {ok:true,saved:scene.readSavedDecorPosition('arcane-stacks')};
  });
  await assert(layoutWrite.ok&&layoutWrite.saved?.x===432&&layoutWrite.saved?.y===777,'Sanctuary furniture position did not save through the Game scene');

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.render==='function'&&!!window.MajickStateCore,{timeout:15000});
  await page.evaluate(()=>navigate('companions'));
  await page.waitForSelector('iframe.v3317SanctuaryFrame',{timeout:15000});
  const frameReloaded=page.frames().find(f=>f.url().includes('/sanctuary/'));
  await assert(!!frameReloaded,'Sanctuary iframe did not reload');
  await frameReloaded.waitForFunction(()=>!!window.majickPhaserGame?.scene?.getScene?.('Game'),{timeout:20000});
  const layoutPersist=await frameReloaded.evaluate(()=>{
    const scene=window.majickPhaserGame?.scene?.getScene?.('Game');
    const saved=scene?.readSavedDecorPosition?.('arcane-stacks');
    return {saved};
  });
  await assert(layoutPersist.saved?.x===432&&layoutPersist.saved?.y===777,'Sanctuary furniture position did not survive reload');

  // Care model must remain roster-driven and future-Guardian capable.
  const care=await page.evaluate(()=>({
    hasCare:!!window.MajickGuardianCare,
    snapshot:window.MajickGuardianCare?.snapshot?.(),
    register:typeof window.MajickGuardianRegistry?.register
  }));
  await assert(care.hasCare,'Guardian care module unavailable');
  await assert(Array.isArray(care.snapshot?.roster),'Guardian care roster is not an array');
  await assert(Array.isArray(care.snapshot?.eggs),'Guardian egg incubator state is not an array');
  await assert(care.register==='function','future Guardian registration API unavailable');

  // Ignore non-fatal missing optional resource errors, but no JS page errors are allowed.
  const jsFatal=fatal.filter(x=>!x.includes('Failed to load resource')&&!x.includes('404'));
  await assert(jsFatal.length===0,jsFatal.join(' | '));

  console.log('SMOKE CHECKPOINT: sanctuary passed');
  console.log('MAJICK BROWSER SMOKE PASSED');
  console.log(JSON.stringify({boot,san,roster:care.snapshot?.roster?.length||0,eggs:care.snapshot?.eggs?.length||0},null,2));
} finally {
  await browser.close();
}
