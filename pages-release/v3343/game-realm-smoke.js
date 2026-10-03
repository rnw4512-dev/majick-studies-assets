const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/game-realm.js','utf8');
const state={answers:[],xp:0,crystals:0,realmRecords:{}};
const context={
  document:{documentElement:{dataset:{}}},
  S:{screen:'games',activeCourse:'D755'},
  session:{type:'moonword',items:[
    {term:'Sample',def:'Part of a population',choice:'Sample',ok:true},
    {term:'Sample',def:'The selected individuals',choice:'Population',ok:false},
    {term:'Population',def:'The full group',choice:null,ok:null}
  ]},
  prog:()=>state,
  questionPool:()=>[],
  resultHTML:()=>'',esc:s=>String(s),
  pickAdaptive:pool=>pool[0],
  moonwordPick:(i,v)=>{context.session.items[i].choice=v;context.session.items[i].ok=v===context.session.items[i].term},
  render:()=>{},save:()=>{},alert:()=>{},
  record:(q,chosen,correct,confidence,mode)=>state.answers.push({qid:q.id,chosen,correct,confidence,mode}),
  grantMoonlight:()=>{state.xp+=1},
  sparkle:()=>{},playChime:()=>{},setTimeout:(fn)=>{fn();return 0},
  MajickD755Retake:{BANK:[
    {id:'d1',section:1,concept:'qualitative quantitative',trap:'assessment-type',prompt:'Teacher writes descriptive interview notes.',answer:'Qualitative data',why:'Descriptive evidence is qualitative.'},
    {id:'d2',section:1,concept:'qualitative quantitative',trap:'assessment-type',prompt:'Teacher counts 12 behaviors in 20 minutes.',answer:'Quantitative data',why:'A frequency count is quantitative.'},
    {id:'d3',section:1,concept:'formal informal',trap:'assessment-type',prompt:'Psychologist follows fixed directions and standardized scoring.',answer:'Formal assessment',why:'Fixed administration is formal.'},
    {id:'d4',section:1,concept:'formal informal',trap:'assessment-type',prompt:'Teacher takes flexible notes during guided reading.',answer:'Informal assessment',why:'Flexible classroom evidence is informal.'},
    {id:'d5',section:1,concept:'assessment purpose',trap:'assessment-type',prompt:'Exit ticket changes tomorrow’s instruction.',answer:'Formative assessment',why:'It guides ongoing instruction.'},
    {id:'d6',section:1,concept:'assessment purpose',trap:'assessment-type',prompt:'Final exam evaluates learning at the end of a unit.',answer:'Summative assessment',why:'It evaluates learning at an endpoint.'},
    {id:'d7',section:1,concept:'screening child find',trap:'assessment-type',prompt:'All students take a brief fall reading check.',answer:'Universal screening',why:'All students are screened for risk.'},
    {id:'d8',section:1,concept:'screening tier movement',trap:'assessment-type',prompt:'A Tier 2 student completes a weekly fluency probe.',answer:'Progress monitoring',why:'Repeated probes track intervention response.'},
    {id:'d9',section:1,concept:'criterion cbm',trap:'assessment-type',prompt:'Student performance is compared with a national peer sample.',answer:'Norm-referenced',why:'The score is compared with a norm group.'},
    {id:'d10',section:1,concept:'criterion cbm',trap:'assessment-type',prompt:'Student performance is compared with a defined mastery standard.',answer:'Criterion-referenced',why:'The score is compared with a criterion.'},
    {id:'d11',section:1,concept:'data sources',trap:'assessment-type',prompt:'Teacher records behavior as it happens during class.',answer:'Direct observation',why:'The behavior is observed directly in real time.'},
    {id:'d12',section:1,concept:'data sources',trap:'assessment-type',prompt:'Teacher writes a narrative about a specific classroom incident.',answer:'Anecdotal record',why:'A narrative incident record is anecdotal.'}
  ]}
};
context.globalThis=context;
vm.createContext(context);vm.runInContext(src,context);

let html=context.moonwordHTML();
assert.match(html,/1\/2 used/,'Word with two clues must remain available after its first use');
assert.doesNotMatch(html,/realmWord used[^>]*><span>Sample/,'Repeated term must not be crossed off early');
context.moonwordPick(1,'Sample');html=context.moonwordHTML();
assert.match(html,/realmWord used[^>]*><span>Sample/,'Word must cross off after both correct uses');
context.session={type:'boss',questions:['q1']};
assert.equal(context.pickAdaptive([{id:'q1'},{id:'q2'}]).id,'q2','Do not repeat an in-session question when another is available');
context.session.questions=['q1','q2'];
assert.ok(context.pickAdaptive([{id:'q1'},{id:'q2'}]),'Small question pools must still work after exhaustion');

const pool=[
  {id:'a1',section:'Data Collection',prompt:'Which method uses equal selection probability?',options:['SRS','Cluster'],answer:'SRS',keyClue:'equal selection probability',why:'SRS gives equal selection probability.',difficulty:2},
  {id:'a2',section:'Data Collection',prompt:'Which study observes without imposing treatment?',options:['Observational','Experiment'],answer:'Observational',keyClue:'without imposing treatment',why:'Observational studies do not impose treatments.',difficulty:2},
  {id:'b1',section:'Bias',prompt:'Which bias comes from loaded wording?',options:['Response bias','Sampling bias'],answer:'Response bias',keyClue:'loaded wording',why:'Loaded wording creates response bias.',difficulty:3},
  {id:'b2',section:'Bias',prompt:'Which bias occurs with volunteers?',options:['Voluntary response bias','Nonresponse bias'],answer:'Voluntary response bias',keyClue:'volunteers choose themselves',why:'Volunteers self-select.',difficulty:3},
  {id:'c1',section:'Graphs',prompt:'What makes a truncated axis misleading?',options:['Exaggerates differences','Adds categories'],answer:'Exaggerates differences',keyClue:'axis does not begin at zero',why:'A truncated axis exaggerates visual differences.',difficulty:4},
  {id:'c2',section:'Graphs',prompt:'Why can 3D pie charts mislead?',options:['Perspective distorts area','They have labels'],answer:'Perspective distorts area',keyClue:'3D perspective changes apparent size',why:'Perspective changes perceived slice size.',difficulty:4}
];
context.questionPool=()=>pool;


context.S.activeCourse='D772';
const d772Pool=context.MajickGameRealm.d772RealmPool();
assert.equal(d772Pool.length,30,'D772 Realm supplement should provide 30 Section 1 scenarios including the six Lesson 3 repair items');
assert.deepEqual([...new Set(d772Pool.map(q=>q.section))].sort(),['Bias & Credibility','Conclusions','Data Collection','Misrepresentation'],'D772 Realm supplement should cover all four Section 1 domains');
assert.ok(context.MajickGameRealm.realmQuestionPool().length>=30,'D772 Realm pool should merge guaranteed scenarios with the Lesson 3 repair bank and course questions');
context.startRuneSort();
assert.equal(context.session.type,'runesort','Rune Sort should start for D772');
assert.ok(context.session.categories.some(x=>['Data Collection','Bias & Credibility','Misrepresentation','Conclusions'].includes(x)),'D772 Rune Sort should use Section 1 domain labels');

const beforeType=context.session?.type;
context.startAssessmentSigilSort();
assert.equal(context.session?.type,beforeType,'Assessment Sigil Sort must not start outside D755');
context.S.activeCourse='D755';
assert.ok(context.MajickGameRealm.assessmentSigilPool('data').length>=8,'D755 qualitative/quantitative chamber needs a deep non-repeating pool');
assert.ok(context.MajickGameRealm.assessmentSigilPool('administration').length>=6,'D755 formal/informal chamber needs a deeper pool');
assert.ok(context.MajickGameRealm.assessmentSigilPool('purpose').length>=8,'D755 formative/summative chamber needs a deep non-repeating pool');
assert.ok(context.MajickGameRealm.assessmentSigilPool('monitoring').length>=6,'D755 screening/monitoring chamber needs a deeper pool');
assert.ok(context.MajickGameRealm.assessmentSigilPool('comparison').length>=6,'D755 norm/criterion chamber needs a deeper pool');
assert.ok(context.MajickGameRealm.assessmentSigilPool('evidence').length>=6,'D755 observation/anecdotal chamber needs a deeper pool');
context.startAssessmentSigilSort();
assert.equal(context.session.type,'assessmentsigilsort','Assessment Sigil Sort should start for D755');
context.chooseAssessmentSigilFamily('purpose');
assert.equal(context.session.phase,'play','Assessment Sigil Sort should enter a selected chamber');
assert.equal(context.session.items.length,8,'Assessment Sigil Sort should run eight questions when the chamber has enough scenarios');
const sigilQ=context.session.items[0];
context.answerAssessmentSigil(sigilQ.sigilAnswer);
assert.equal(context.session.score,1,'Assessment Sigil Sort should score a correct assessment classification');
assert.equal(context.session.answered,true,'Assessment Sigil Sort should lock the answered sigil');
context.S.activeCourse='D755';

context.startRuneSort();
assert.equal(context.session.type,'runesort','Rune Sort should start its own session type');
assert.match(src,/YOUR GOAL/,'Rune Sort should explain the trial goal');
assert.match(src,/realmRunProgress/,'Featured Realm trials should include progress meters');
assert.ok(context.session.categories.length>=2,'Rune Sort needs multiple sort categories');
const firstRune=context.session.items[0];
const wrongRuneCategory=context.session.categories.find(x=>x!==firstRune.section);
context.runeSortPick(0,wrongRuneCategory);
assert.equal(context.session.items[0].ok,false,'Rune Sort should reject a wrong destination');
assert.ok(context.session.items[0].tried.includes(wrongRuneCategory),'Rune Sort should remember wrong destinations');
context.runeSortPick(0,firstRune.section);
assert.equal(context.session.items[0].ok,true,'Rune Sort should lock a correct category');
context.finishRuneSort();
assert.equal(context.session.finished,true,'Rune Sort finish should end the trial');
assert.ok(context.session.recordOutcome,'Rune Sort should retain its Realm record outcome');
assert.equal(context.session.recordOutcome.newBest,true,'First successful Rune Sort score should count as a new Realm best');

context.startOracleLens();
assert.equal(context.session.type,'oraclelens','Oracle Lens should start its own session type');
context.oracleChooseLens(context.session.correctLens);
assert.equal(context.session.lensCorrect,true,'Oracle Lens should recognize the controlling clue');
assert.equal(context.session.clarityStreak,1,'Oracle Lens should build a clarity streak');
context.oracleAnswer(context.session.current.answer);
assert.equal(context.session.answered,true,'Oracle Lens answer should resolve after a lens is chosen');
assert.ok(context.session.guardianMessage,'Oracle Lens should surface active Guardian feedback');

context.startGuardianGauntlet();
assert.equal(context.session.type,'gauntlet','Guardian Gauntlet should start its own session type');
assert.match(src,/GUARDIAN HELP/,'Guardian Gauntlet should explain Guardian help');
const hp=context.session.playerHP;
const wrong=context.session.current.options.find(x=>x!==context.session.current.answer);
context.gauntletAnswer(wrong);
assert.equal(context.session.playerHP,hp,'First Gauntlet miss should be absorbed by Guardian shield');
assert.ok(context.session.guardianMessage,'Guardian Gauntlet should surface Guardian shield feedback');
assert.equal(context.session.shieldUsed,true,'Guardian shield should be consumed on first miss');

context.startMemoryConstellation();
assert.equal(context.session.type,'constellation','Memory Constellation should start its own session type');
assert.ok(context.session.cards.length>=8,'Memory Constellation should build at least four pairs');
const p0=context.session.cards[0].pair;
const mate=context.session.cards.findIndex((c,i)=>i!==0&&c.pair===p0);
context.constellationPick(0);
context.constellationPick(mate);
assert.equal(context.session.matched,1,'Memory Constellation should lock a correct clue-answer pair');

context.startHexBreaker();
assert.equal(context.session.type,'hexbreaker','Hex Breaker should start its own session type');
context.hexJudge(context.session.claimValid?'valid':'hexed');
context.hexRepair(context.session.current.answer);
assert.equal(context.session.answered,true,'Hex Breaker should resolve after judgment and repair');
assert.ok(context.session.judgmentScore>=1,'Hex Breaker should score a correct validity judgment');
assert.equal(context.session.breakStreak,1,'Hex Breaker should build a successful break streak');


context.S.activeCourse='D772';
const reviewQueue=context.MajickGameRealm.buildD772SectionReview();
assert.equal(reviewQueue.length,12,'D772 Section 1 Review should contain 12 questions');
const reviewCounts=reviewQueue.reduce((acc,q)=>(acc[q.section]=(acc[q.section]||0)+1,acc),{});
assert.deepEqual(reviewCounts,{'Data Collection':3,'Bias & Credibility':3,'Misrepresentation':3,'Conclusions':3},'D772 review should balance three questions per Section 1 domain');
context.startD772SectionReview();
assert.equal(context.session.type,'gauntlet','D772 Section Review should reuse the Guardian Gauntlet engine');
assert.equal(context.session.reviewMode,true,'D772 Section Review should be marked as review mode');
assert.equal(context.session.limit,12,'D772 Section Review should run 12 questions');
assert.equal(context.session.questions.length,1,'D772 Section Review should begin with one queued question');

assert.equal(context.document.documentElement.dataset.majickRealmVariety,'3374','Game Realm dataset marker missing');
assert.match(src,/realmTrialGuide/,'Featured Realm clarity guide source should remain installed');
assert.match(src,/Assessment Sigil Sort/,'D755 Assessment Sigil Sort source missing');
assert.match(src,/globalThis\.S\?\.activeCourse==='D755'/,'D755 Assessment Sigil Sort must be course-gated');
console.log('GAME REALM OVERHAUL SMOKE PASSED');
console.log(JSON.stringify({answers:state.answers.length,xp:state.xp,realmRecords:Object.keys(state.realmRecords)}));