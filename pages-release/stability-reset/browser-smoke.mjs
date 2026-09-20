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
