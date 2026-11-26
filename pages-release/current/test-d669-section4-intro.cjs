'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert/strict'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(process.argv[2]||'current-site','course-packs/d669-course.js'),'utf8'),ctx);
const c=JSON.parse(JSON.stringify(ctx.window.MajickCourseSources.D669)),audit=JSON.parse(fs.readFileSync(path.join(__dirname,'../../docs/audits/evidence/d669-section4-intro-20261126.json'))),ids=new Set(audit.priorQuestionIds),prior=c.questionBank.filter(q=>ids.has(q.id));
assert.equal(prior.length,111);assert.equal(crypto.createHash('sha256').update(JSON.stringify(prior.map(q=>Object.fromEntries(audit.protectedAnswerFields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]))))).digest('hex'),audit.priorAnswerIdentitySha256);
assert.equal(new Set(c.questionBank.map(q=>q.id)).size,c.questionBank.length);
const sec=c.studySections.find(s=>s.id==='d669-section-4');assert.equal(sec.competency,'2068.1.4');assert.equal(sec.lessonCount,1);assert.match(sec.sourceCoverage,/Lessons 1\.1–1\.4.*ungraded Lesson 1 review/);
const sub=sec.lessons.flatMap(l=>l.sublessons||[l]);assert(sub.some(s=>s.id==='d669-s4-intro'));assert(sub.some(s=>s.id==='d669-s4-l1-intro'));
const poetry=sub.find(s=>s.id==='d669-s4-l1-4');
const review=sub.find(s=>s.id==='d669-s4-l1-review');
assert.deepEqual(poetry.formativeGroups.map(group=>group.questions.length),[6,9]);
assert.equal(poetry.anchorRows.length,6);
assert.deepEqual(review.formativeGroups[0].questions.map(q=>q.answer),['Character dialogue','All of the above','Metaphor']);
assert.match(review.formativeGroups[0].questions[2].prompt,/The sky was a vast, blue ocean/);
for(const group of [...poetry.formativeGroups,...review.formativeGroups]){
 for(const question of group.questions)assert((question.options||group.options).includes(question.answer));
}
assert.equal(poetry.quizIds.length,4);
for(const id of poetry.quizIds){
 const question=c.questionBank.find(q=>q.id===id);
 assert.equal(question.lessonId,poetry.id);
 assert.equal(question.official,false);
 assert(question.options.includes(question.answer));
}
const qs=c.questionBank.filter(q=>audit.newQuestionIds.includes(q.id));assert.equal(qs.length,2);assert.equal(qs[0].answer,'Narrative');assert.equal(qs[1].answer,'Providing clear and factual information about a topic');qs.forEach(q=>{assert.equal(q.section,'Section 4');assert(q.options.includes(q.answer));assert.equal(q.assessment,'ungraded');assert.equal(q.sourceVerification,'source_transcribed_not_independently_verified')});
assert.equal(c.questionBank.filter(q=>q.id.startsWith('d669-depth-20261126-')).length,10);
assert.match(c.questionBank.find(q=>q.id==='d669-s3-l1-3-transfer-1').why,/Formative assessment/);
assert.match(c.questionBank.find(q=>q.id==='d669-s3-l2-1-transfer-1').why,/Morphology/);
assert.equal(c.studySections.find(s=>s.id==='d669-section-5').lessons,undefined);
console.log('PASS supplied Section 4/Lesson 1 introductions, narrative/expository answers, one-lesson boundary and all 111 earlier answer identities preserved');
