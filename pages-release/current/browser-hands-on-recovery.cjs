'use strict';
const assert=require('node:assert/strict');
module.exports=async({ev,call,waitFor})=>{
 const snapshot=await ev(`(()=>{
  if(!window.MajickGeneratedPractice?.mountLab||!window.MajickLearningContinuity)throw Error('Missing existing Learn Lab owners');
  const before=JSON.stringify({account:S.majickAccount,legacy:S.legacy,other:S.progress?.D756});
  const original=S.activeCourse;
  S.activeCourse='D772';
  const root=document.createElement('div');root.id='handsOnBrowserFixture';document.body.append(root);
  MajickGeneratedPractice.mountLab(root,'D772 Section 2 Lesson 4 median');
  const lesson=root.querySelector('.majickGeneratedLab');
  if(!lesson||!lesson.querySelector('[data-sort-pool]'))throw Error('Median hands-on component did not mount');
  const key=lesson.dataset.lessonKey;
  const lab=lesson;
  const q=lab.querySelector('[data-lab-independent]');
  const visual=q.querySelector('figure')?.outerHTML;
  const vals=[...lab.querySelectorAll('[data-sort-pool] button')];
  if(!vals.length)throw Error('No physical sortable buttons');
  // A wrong answer is evaluated using the existing DOM handlers.
  const input=q.querySelector('[data-lab-field="independent"]');
  input.value='not-a-valid-answer';
  input.dispatchEvent(new Event('input',{bubbles:true}));
  q.querySelector('[data-lab-submit]').click();
  const wrong=q.querySelector('[data-lab-independent-feedback]')?.textContent;
  const repair=q.querySelector('[data-lab-repair]');
  if(!wrong?.includes('Not yet')||!repair)throw Error('Wrong answer not recorded or repair unavailable');
  const record=S.progress.D772.learningNeeds?.['d772-s2-l4-1'];
  if(!record?.struggles)throw Error('Learning need was not stored');
  const firstAttempts=S.progress.D772.adaptiveSkills?.['d772-s2-l4-1']?.attempts?.length||0;
  repair.click();
  if(!q.querySelector('[data-lab-independent-feedback]')?.textContent.includes('earlier attempt is saved'))throw Error('Repair did not navigate to guided method');
  // Real click sequence, then fresh dataset; never replay an old answer.
  const first=lab.querySelector('[data-sort-pool] button:not(:disabled)');
  first.click();
  if(!lab.querySelector('[data-sort-built]').textContent.includes('Ordered observations:'))throw Error('Sorting click ignored');
  lab.querySelector('[data-sort-clear]').click();
  if([...lab.querySelectorAll('[data-sort-pool] button:disabled')].length)throw Error('Clear did not re-enable observations');
  lab.querySelector('[data-lab-new]').click();
  const next=lab.querySelector('[data-lab-independent]');
  const nextVisual=next.querySelector('figure')?.outerHTML;
  if(!nextVisual||nextVisual===visual)throw Error('Fresh problem reused the same plotted data');
  if(next.querySelector('[data-lab-submit]').disabled)throw Error('Fresh submission disabled');
  const progress=S.progress.D772.adaptiveSkills?.['d772-s2-l4-1'];
  if(progress?.masteryCertified)throw Error('Formative correction falsely certified mastery');
  // Preserve unrelated state, and verify course isolation.
  S.activeCourse='D756';
  const isolated=JSON.stringify({account:S.majickAccount,legacy:S.legacy,other:S.progress?.D756})===before;
  if(!isolated)throw Error('Guardian/account/other-course state changed');
  S.activeCourse=original;
  root.remove();
  window.save?.();
  return {wrong,firstAttempts,need:record.struggles,isolated,lesson:key,worldBefore:before};
 })()`);
 assert(snapshot.firstAttempts>=1,'Formative error must contribute an adaptive attempt');
 assert(snapshot.isolated,'Guardian and D756 state must not mutate');
 await call('Page.reload',{ignoreCache:true});
 await waitFor('!!window.MajickLearningContinuity&&!!S.progress?.D772');
 const persisted=await ev(`(()=>{
   const row=S.progress.D772.adaptiveSkills?.['d772-s2-l4-1'];
   const need=S.progress.D772.learningNeeds?.['d772-s2-l4-1'];
   return {attempts:row?.attempts?.length||0,need:need?.struggles||0,mastery:!!row?.masteryCertified};
 })()`);
 assert(persisted.attempts>=snapshot.firstAttempts,'Reload erased corrected attempt');
 assert(persisted.need>=snapshot.need,'Reload erased misconception');
 assert.equal(persisted.mastery,false,'Assisted formative practice certified mastery');
 const worldAfter=await ev('JSON.stringify({account:S.majickAccount,legacy:S.legacy,other:S.progress?.D756})');
 assert.equal(worldAfter,snapshot.worldBefore,'Reload altered Guardian/account, Sanctuary legacy, or D756 records');
 console.log('PASS real browser D772: wrong answer → guided repair → sortable reset → fresh problem → course isolation → saved reload; guardian/account unchanged');
};
