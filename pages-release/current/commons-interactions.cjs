'use strict';
const assert=require('node:assert/strict');
module.exports=async function({ev,waitFor,call,sleep}){
 async function home(tab){await ev('navigate("home")');await waitFor('!!document.querySelector("#majCommonsHub")');await ev('document.querySelector("[data-commons-tab='+tab+']").click()')}
 async function click(selector){await ev('(()=>{const b=document.querySelector('+JSON.stringify(selector)+');if(!b||!b.getClientRects().length)throw Error("Missing visible action: '+selector.replace(/"/g,'')+'");b.click()})()')}
 const routes=[
  ['overview','.v3327HeroActions .v3327Primary','learninglab'],
  ['overview','.v3327HeroActions button[onclick*="mission"]','mission'],
  ['overview','#v3377CampusDoors [data-go="livinggrimoire"]','livinggrimoire'],
  ['overview','#v3377CampusDoors [data-go="games"]','games'],
  ['overview','#v3377CampusDoors [data-go="companions"]','companions'],
  ['guardians','.v3327GuardianHall .v3327TextBtn','companions'],
  ['sanctuary','.v3327CampusSanctuary .v3327TextBtn','companions'],
  ['sanctuary','.phase4Actions button[onclick*="addmaterial"]','addmaterial'],
  ['today','[data-v3400-next]','learninglab'],
  ['review','[data-v3400-memory]','learninglab']
 ];
 for(const [tab,selector,screen] of routes){await home(tab);await click(selector);await waitFor('S.screen==='+JSON.stringify(screen));assert((await ev('document.querySelector("#content").textContent.trim().length'))>20,'Empty destination '+screen)}
 console.log('PASS Commons existing Learn, Study Now, Grimoire, Realm, Guardian, Sanctuary, material, daily-loop and Memory Quest actions');
 // All original questions remain browsable; guided errors never certify mastery.
 await home('review');await ev('document.querySelector("#mjPreassessmentReview details").open=true');
 await ev('const s=document.querySelector("#mjPaOriginal");s.value="49";s.dispatchEvent(new Event("change",{bubbles:true}))');
 assert((await ev('document.querySelector("[data-mj-pa-source]").textContent')).includes('49'));
 const q=await ev('MajickD772PreassessmentReview.questions[Number(document.querySelector("#mjPaPracticeTopic").value)]');
 await click('[data-mj-pa-check]');assert((await ev('document.querySelector("[data-mj-pa-feedback]").textContent')).includes('Choose an answer'));
 await ev('document.querySelectorAll("input[name=mjPaPracticeChoice]")['+((q.correct+1)%q.choices.length)+'].click()');await click('[data-mj-pa-check]');
 assert((await ev('document.querySelector("[data-mj-pa-feedback]").textContent')).includes('Not yet.'));
 await ev('document.querySelectorAll("input[name=mjPaPracticeChoice]")['+q.correct+'].click()');await click('[data-mj-pa-check]');
 assert((await ev('document.querySelector("[data-mj-pa-feedback]").textContent')).includes('Correct.'));
 const oldIndex=await ev('document.querySelector("#mjPaPracticeTopic").value');await click('[data-mj-pa-next]');assert.notEqual(await ev('document.querySelector("#mjPaPracticeTopic").value'),oldIndex);
 // Real adaptive diagnostic miss -> repair -> fresh independent miss -> repair -> independent + transfer.
 const aq=()=>ev('(()=>{const a=MajickD772AdaptiveMastery,t=a.topics.find(t=>t.id===document.querySelector("#mjAdaptiveTopic").value),c=a.cycle(t);return a.pick(t,c.stage,c)})()');
 async function answer(correct){const q=await aq();const index=correct?q.correct:(q.correct+1)%q.choices.length;await ev('document.querySelectorAll("input[name=mjAdaptiveChoice]")['+index+'].click();document.querySelector("[data-am-work] button").click()');return q.id}
 const first=await answer(false);assert((await ev('document.querySelector("[data-am-work]").textContent')).includes('Guided misconception repair'));
 await click('[data-am-work] button');const independent=await answer(false);assert.notEqual(first,independent);assert((await ev('document.querySelector("[data-am-work]").textContent')).includes('Guided misconception repair'));
 await click('[data-am-work] button');const repaired=await answer(true),transfer=await answer(true);assert.notEqual(repaired,transfer);
 assert((await ev('document.querySelector("[data-am-work]").textContent')).includes('Teach it back'));
 await click('[data-am-work] button');assert((await ev('document.querySelector("[data-am-status]").textContent')).includes('100 characters'));
 await ev('(()=>{const ta=document.querySelector("[data-am-work] textarea");ta.value="The sample excludes part of the population. I would model representative sampling using all classroom groups, compare the biased sample, and ask students to explain a fresh case independently.";const values=["misconception","model-and-recheck","new-case"];document.querySelectorAll("[data-am-work] select").forEach((s,i)=>{s.value=values[i]})})()');
 await click('[data-am-work] button');assert((await ev('document.querySelector("[data-am-work]").textContent')).includes('awaiting review'));
 const d772=await ev('JSON.stringify(S.progress.D772)');
 for(const course of ['D755','D756','D772']){
  await ev(course==='D756'?'startD756Course();navigate("home")':'switchCourse('+JSON.stringify(course)+');navigate("home")');await waitFor('!!document.querySelector("#majCommonsHub")');
  assert.equal(await ev('S.activeCourse'),course);
  assert.equal(await ev('JSON.stringify(S.progress.D772)'),d772,'D772 academic state changed on course switch '+course);
  assert.equal(await ev('!!document.querySelector("#mjPreassessmentReview")'),course==='D772','D772 panels leaked across courses');
 }
 await call('Page.reload',{ignoreCache:true});await waitFor('!!window.MajickD772AdaptiveMastery&&!!document.querySelector("#majCommonsHub")');assert.equal(await ev('JSON.stringify(S.progress.D772)'),d772,'Review evidence lost on reload');
 console.log('PASS Commons wrong-answer feedback, guided retry, fresh adaptive cases, teaching evidence, D755/D756 isolation and actual reload');
 // Use the real care button; care cannot silently award academic XP or crystals.
 await home('guardians');await click('.v3327GuardianHall .v3327TextBtn');await waitFor('S.screen==="companions"');
 const careBefore=await ev('JSON.stringify({xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,eggs:S.majickAccount.eggs,progress:S.progress})');
 await click('.majCareDock button[onclick*=water]');await sleep(150);
 assert.equal(await ev('JSON.stringify({xp:S.majickAccount.xp,crystals:S.majickAccount.crystals,eggs:S.majickAccount.eggs,progress:S.progress})'),careBefore,'Care changed academic progress or currency/egg state');
 const world=await ev('JSON.stringify({guardianCare:S.majickAccount.guardianCare,inventory:S.majickAccount.inventory,legacy:S.legacy})');
 await call('Page.reload',{ignoreCache:true});await waitFor('!!window.MajickGuardianCare&&S.screen==="companions"');await sleep(250);
 assert.equal(await ev('JSON.stringify({guardianCare:S.majickAccount.guardianCare,inventory:S.majickAccount.inventory,legacy:S.legacy})'),world,'Care/world state lost after reload');
 console.log('PASS real Guardian water action and persisted care/world data without academic/currency changes');
};
