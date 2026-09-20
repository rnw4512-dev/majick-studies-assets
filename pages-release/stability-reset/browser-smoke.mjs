import { chromium } from 'playwright';

const base=process.env.MAJICK_BASE_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const fatal=[];
page.on('pageerror',e=>fatal.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')fatal.push('console: '+m.text())});

async function assert(ok,msg){if(!ok)throw new Error('BROWSER SMOKE FAILED: '+msg)}

try{
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  try{
    await page.waitForFunction(()=>typeof window.render==='function'&&!!window.MajickStateCore&&!!window.MajickGuardianRegistry,{timeout:12000});
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
  await assert(boot.version==='3.3.18-stability','wrong deployed runtime version: '+boot.version);
  await assert(boot.guardians.length>=10,'baseline Guardian registry unexpectedly shrank');

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

  // Continue this smoke from D755 so the existing Assessment course remains intact.
  await assert((await page.locator('.courseSelect').inputValue())==='D755','visible class selector did not return to D755');

  // A real correct study answer must reward the shared account and persist through reload.
  const studyReward=await page.evaluate(()=>{
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

  await page.evaluate(()=>navigate('addmaterial'));
  await page.waitForSelector('#materialFile',{timeout:10000});
  await assert(await page.locator('#materialCourse').inputValue()==='D772','Add Study Material did not default to active D772');
  const d772Notes='Statistical literacy requires checking who collected the data, why it was collected, how the sample was selected, and whether a graph fairly represents the values. A random sample reduces selection bias. The mean is sensitive to extreme values, while the median is more resistant. Probability ranges from zero to one and can be represented as a fraction, decimal, or percent.';
  await page.locator('#materialFile').setInputFiles({
    name:'D772-statistical-data-literacy-notes.txt',
    mimeType:'text/plain',
    buffer:Buffer.from(d772Notes,'utf8')
  });
  await page.locator('#materialCount').selectOption('5');
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
      bank:(S.courses?.[cid]?.questionBank||[]).filter(q=>q.sourceId===row?.id).length,
      active:row?.active!==false
    };
  });
  await assert(!!forged.id,'Notes Forge did not save a source');
  await assert(forged.courseId==='D772','uploaded D772 notes were saved under the wrong course');
  await assert(forged.questions>=5,'Notes Forge generated fewer questions than requested');
  await assert(forged.bank>=5,'Notes Forge questions were not synchronized into D772');
  await assert(forged.active,'new Notes Forge source was not active');

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
  await assert(regenerated.exists&&regenerated.questions>=5&&regenerated.bank>=5,'Notes Forge regeneration broke source synchronization');

  await page.locator(sourceSelector+' .v3315RemoveSource').click();
  await page.waitForFunction(()=>document.getElementById('materialStatus')?.textContent?.startsWith('Removed '),{timeout:8000});
  const removed=await page.evaluate(async id=>({
    row:await MajickMaterialStore.get(id),
    bank:(S.courses?.[S.activeCourse]?.questionBank||[]).filter(q=>q.sourceId===id).length
  }),forged.id);
  await assert(!removed.row&&removed.bank===0,'removing a Notes Forge source left stale source questions behind');

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
    const actions={
      feed:MajickGuardianCare.performAction(pet.petId,'feed'),
      water:MajickGuardianCare.performAction(pet.petId,'water'),
      treat:MajickGuardianCare.performAction(pet.petId,'treat'),
      groom:MajickGuardianCare.performAction(pet.petId,'groom'),
      play:MajickGuardianCare.performAction(pet.petId,'play',{itemId:favorite}),
      sleep:MajickGuardianCare.performAction(pet.petId,'sleep',{objectId:'moonstone-crystal-bed'}),
      affection:MajickGuardianCare.performAction(pet.petId,'affection')
    };
    save();
    return {
      ok:true,petId:pet.petId,favorite,purchases,
      actions:Object.fromEntries(Object.entries(actions).map(([k,v])=>[k,{ok:v.ok,favoriteBonus:v.favoriteBonus||false}])),
      snapshot:MajickGuardianCare.snapshot(),
      bed:S.v3311?.sanctuaryState?.bedAssignments?.['moonstone-crystal-bed']||null
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
  await assert(careFlow.bed===careFlow.petId,'Guardian bed assignment was not stored by pet id');

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

  // Companions must create the real Sanctuary iframe, not a dead static replacement.
  await page.evaluate(()=>{if(typeof navigate==='function')navigate('companions');else {S.screen='companions';render();}});
  await page.waitForSelector('iframe.v3317SanctuaryFrame',{timeout:15000});
  const frame=page.frames().find(f=>f.url().includes('/sanctuary/'));
  await assert(!!frame,'Sanctuary iframe did not load');
  await frame.waitForFunction(()=>typeof window.Game!=='undefined'||document.querySelector('canvas'),{timeout:20000});
  const san=await frame.evaluate(()=>({
    hasGame:typeof window.Game!=='undefined',
    hasCanvas:!!document.querySelector('canvas'),
    hasRegistry:!!window.MajickGuardianRegistry
  }));
  await assert(san.hasGame||san.hasCanvas,'Phaser Sanctuary did not initialize');
  await assert(san.hasRegistry,'Guardian registry unavailable inside Sanctuary');

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

  console.log('MAJICK BROWSER SMOKE PASSED');
  console.log(JSON.stringify({boot,san,roster:care.snapshot?.roster?.length||0,eggs:care.snapshot?.eggs?.length||0},null,2));
} finally {
  await browser.close();
}
