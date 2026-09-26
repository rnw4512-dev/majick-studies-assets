const fs=require('fs');
const vm=require('vm');
function assert(x,msg){if(!x)throw new Error(msg)}
const src=fs.readFileSync(process.cwd()+'/pages-release/v3342/study-progress-bridge.js','utf8');

const account={xp:4987,crystals:200,studyProgressBridge:null};
const S={
 activeCourse:'D755',
 legacy:{
   activePetId:'p1',
   pets:[
     {id:'p1',type:'luna',name:'Velora',studyXP:20,totalStudyXP:20,bond:10},
     {id:'p2',type:'ember',name:'Cascade',studyXP:10,totalStudyXP:10,bond:6}
   ],
   eggs:[{id:'egg1',type:'nova',progress:2,goal:50}]
 },
 courses:{
   D755:{questionBank:[
     {id:'d755_wgu_a',topicId:'s1-data-sources',difficulty:4,answer:'A'},
     {id:'d755_wgu_b',topicId:'s2-eligibility',difficulty:3,answer:'B'}
   ]},
   D772:{questionBank:[{id:'d772_q1',topicId:'d772-s1-l1',difficulty:3,answer:'A'}]}
 },
 progress:{
   D755:{
     xp:0,crystals:0,answers:[],
     d755Retake:{
       responses:{'s1-data-sources:check':{choice:'A',correct:true,at:1001}},
       diagnostic:{startedAt:2000,answers:[
         {id:'d755_wgu_a',chosen:'A',correct:true,at:2001},
         {id:'d755_wgu_b',chosen:'C',correct:false,at:2002}
       ]},
       mock:null,
       sectionChecks:{s1:{at:3000,answers:[{id:'d755_wgu_a',chosen:'A',correct:true,at:3001}]}}
     }
   },
   D772:{
     xp:0,crystals:0,answers:[],
     learnModeV3338:{
       responses:{'d772-concept:check':{choice:'A',correct:true,at:4001}},
       checkpoints:{'d772-s1-l1':{at:5000,answers:[{qid:'d772_q1',chosen:'A',correct:true,at:5001}]}}
     }
   }
 },
 majickAccount:account
};

let saves=0;
const ctx={
 console,Date,Math,JSON,
 S,
 document:{documentElement:{dataset:{}}},
 setTimeout(fn){fn();return 1},
 clearTimeout(){},
 save(){saves++},
 rewardToast(){},
 MajickStateCore:{ensureAccount(){return account}},
 MajickGuardianCare:{snapshot(){return {focusPetId:'p1'}}},
 record(q,chosen,correct){S.progress[S.activeCourse].answers.push({qid:q.id,topicId:q.topicId,correct,chosen})}
};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'study-progress-bridge.js'});

const M=ctx.MajickStudyProgress;
assert(M&&M.VERSION==='3.3.42','Study Progress bridge version missing');
assert(ctx.document.documentElement.dataset.majickStudyProgress==='3.3.42','Study Progress dataset missing');

const first=M.inspect();
assert(first.reconciledCount===6,'Expected six previously uncredited study answers');
assert(S.progress.D755.answers.length===4,'D755 historical answers were not copied to canonical progress');
assert(S.progress.D772.answers.length===2,'D772 historical answers were not copied to canonical progress');
assert(S.legacy.pets[0].studyXP>20,'Active Guardian did not receive historical study XP');
assert(S.legacy.pets[1].studyXP>10,'Other Guardian did not receive shared historical study XP');
assert(S.legacy.eggs[0].progress>2,'Egg moonlight did not receive historical correct-answer credit');
assert(account.xp===4987,'Guardian reconciliation changed lifetime Majick XP');

const before={
 p1:S.legacy.pets[0].studyXP,p2:S.legacy.pets[1].studyXP,
 egg:S.legacy.eggs[0].progress,d755:S.progress.D755.answers.length,d772:S.progress.D772.answers.length,
 count:M.inspect().reconciledCount
};
const second=M.reconcileHistorical();
assert(second.credited===0,'Historical reconciliation double-credited saved answers');
assert(S.legacy.pets[0].studyXP===before.p1&&S.legacy.pets[1].studyXP===before.p2,'Reload reconciliation changed Guardian XP twice');
assert(S.legacy.eggs[0].progress===before.egg,'Reload reconciliation changed egg moonlight twice');
assert(S.progress.D755.answers.length===before.d755&&S.progress.D772.answers.length===before.d772,'Reload reconciliation duplicated canonical answers');

const newEvt={key:'D755:new-answer:9999',course:'D755',source:'d755-learn',qid:'new-q',topicId:'s1-mtss',correct:true,difficulty:4,chosen:'A',answer:'A',at:9999};
assert(M.creditAnswer(newEvt)===true,'New cross-engine answer was not credited');
assert(M.creditAnswer(newEvt)===false,'New answer was double-credited');
assert(S.progress.D755.answers.some(a=>a.qid==='new-q'&&a.guardianBridge),'New answer missing from canonical Game Realm history');

console.log('V3.3.42 STUDY PROGRESS BRIDGE SMOKE PASSED');
console.log(JSON.stringify({
 version:M.VERSION,
 reconciled:first.reconciledCount,
 p1StudyXP:S.legacy.pets[0].studyXP,
 p2StudyXP:S.legacy.pets[1].studyXP,
 eggMoonlight:S.legacy.eggs[0].progress,
 d755Answers:S.progress.D755.answers.length,
 d772Answers:S.progress.D772.answers.length,
 accountXP:account.xp,
 saves
}));
