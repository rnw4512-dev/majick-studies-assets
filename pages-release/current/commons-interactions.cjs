'use strict';
const assert=require('node:assert/strict');
module.exports=async function({ev,waitFor,call,sleep}){
 async function home(tab){await ev('navigate("home")');await waitFor('!!document.querySelector("#majCommonsHub")');await ev('document.querySelector("[data-commons-tab='+tab+']").click()')}
 async function click(selector){await ev('(()=>{const b=document.querySelector('+JSON.stringify(selector)+');if(!b||!b.getClientRects().length)throw Error("Missing visible action: '+selector.replace(/"/g,'')+'");b.click()})()')}
 const routes=[
  ['overview','.v3327HeroActions .v3327Primary','learninglab'],
  ['overview','.v3327HeroActions button[onclick*="mission"]','mission'],
  ['overview','.v3327HeroActions button[onclick*="grimoire"]','grimoire'],
  ['overview','.v3327HeroActions button[onclick*="addmaterial"]','addmaterial'],
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
 // Exercise every current sidebar destination and every campus-tools action.
 await home('overview');
 const navigation=await ev('[...document.querySelectorAll(".nav button[data-nav]")].map(b=>b.dataset.nav)');
 assert(navigation.length>=10,'Expected existing app navigation');
 for(const route of navigation){await click('.nav button[data-nav="'+route+'"]');await waitFor('S.screen==='+JSON.stringify(route));assert((await ev('document.querySelector("#content").textContent.trim().length'))>0,'Empty app screen '+route)}
 await home('overview');
 const tools=await ev('[...document.querySelectorAll("#v3377CampusDoors details [data-go]")].map(b=>b.dataset.go)');
 for(const route of tools){await home('overview');await ev('document.querySelector("#v3377CampusDoors details").open=true');await click('#v3377CampusDoors [data-go="'+route+'"]');await waitFor('S.screen==='+JSON.stringify(route))}
 const quickRoutes=['learninglab','guide','analytics','vault'];
 for(const route of quickRoutes){await home('overview');await ev('document.querySelector(".majCommonsRecordShelf").open=true');await click('.v3327QuickLinks button[onclick*="'+route+'"]');await waitFor('S.screen==='+JSON.stringify(route))}
 console.log('PASS every current sidebar destination, campus tools and expanded Student Record navigation');
 console.log('PASS Commons existing Learn, Study Now, Grimoire, Realm, Guardian, Sanctuary, material, daily-loop and Memory Quest actions');
 await home('guardians');
 const eggs=await ev('MajickGuardianCare.snapshot().eggs');
 assert.equal(await ev('document.querySelectorAll("#commons-panel-guardians .majEggFocus").length'),eggs.length,'All real eggs must appear in Guardians');
 if(eggs.length){await click('#commons-panel-guardians .majEggFocus');await waitFor('document.querySelector("#commons-panel-guardians .majEggFocus[aria-pressed=true]")');}
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
  if(course==='D756')await ev('startD756Course();navigate("home")');
  await ev('(()=>{const s=document.querySelector(".top select");s.value='+JSON.stringify(course)+';s.dispatchEvent(new Event("change",{bubbles:true}))})()');await waitFor('!!document.querySelector("#majCommonsHub")');
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
 // Exercise the existing Phaser furniture controls and the parent persistence bridge.
 await home('sanctuary');
 await waitFor('!!document.querySelector(".v3317SanctuaryFrame")?.contentWindow?.majickPhaserGame?.scene?.getScene("Game")?.v3321FurnitureButton?.active');
 const storedBefore=await ev('document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame.scene.getScene("Game").v3321FurnitureState.stored.slice()');
 await ev('(()=>{const s=document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame.scene.getScene("Game");s.v3321FurnitureButton.emit("pointerup");const b=s.v3321FurnitureManager.list.find(n=>n.text==="STORE");if(!b)throw Error("No placed furniture action");b.emit("pointerup")})()');
 const stored=await ev('document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame.scene.getScene("Game").v3321FurnitureState.stored.slice()');
 assert.equal(stored.length,storedBefore.length+1);const item=stored.find(id=>!storedBefore.includes(id));
 await waitFor('S.majickAccount.sanctuaryFurniture.stored.includes('+JSON.stringify(item)+')');
 await call('Page.reload',{ignoreCache:true});await waitFor('!!document.querySelector(".v3317SanctuaryFrame")?.contentWindow?.majickPhaserGame?.scene?.getScene("Game")?.v3321FurnitureButton?.active');
 await waitFor('document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame.scene.getScene("Game").v3321FurnitureState.stored.includes('+JSON.stringify(item)+')');
 await ev('(()=>{const s=document.querySelector(".v3317SanctuaryFrame").contentWindow.majickPhaserGame.scene.getScene("Game");s.v3321FurnitureButton.emit("pointerup");const id='+JSON.stringify(item)+',name=document.querySelector(".v3317SanctuaryFrame").contentWindow.MajickSanctuaryCustomize.manifestObjects(s).find(x=>x.id===id).displayName,row=s.v3321FurnitureManager.list.find(n=>n.text===name);const b=s.v3321FurnitureManager.list.find(n=>n.text==="PLACE"&&Math.abs(n.y-row.y)<10);if(!b)throw Error("Missing stored item PLACE control");b.emit("pointerup")})()');
 await waitFor('!S.majickAccount.sanctuaryFurniture.stored.includes('+JSON.stringify(item)+')');
 console.log('PASS Sanctuary furniture STORE/PLACE handlers, parent save bridge and actual reload');

};
