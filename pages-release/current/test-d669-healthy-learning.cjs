'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert/strict');
const root=process.argv[2]||'current-site',context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'course-packs/d669-course.js'),'utf8'),context);
const course=JSON.parse(JSON.stringify(context.window.MajickCourseSources.D669));
const audit=JSON.parse(fs.readFileSync(path.join(__dirname,'../../docs/audits/evidence/d669-healthy-learning-20261126.json')));
const prior=new Set(audit.priorQuestionIds),old=course.questionBank.filter(q=>prior.has(q.id));
assert.equal(old.length,97);assert.equal(crypto.createHash('sha256').update(JSON.stringify(old.map(q=>Object.fromEntries(audit.protectedAnswerFields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]))))).digest('hex'),audit.priorAnswerIdentitySha256,'Preserve assessed question identity and saved-answer meaning');
assert.equal(new Set(course.questionBank.map(q=>q.id)).size,course.questionBank.length);
const added=course.questionBank.filter(q=>audit.newQuestionIds.includes(q.id));assert.equal(added.length,9);
for(const q of added){assert(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);assert.equal(q.section,'Section 3');assert.equal(q.assessment,'ungraded');assert.equal(q.sourceVerification,'source_transcribed_not_independently_verified')}
const section=course.studySections.find(s=>s.title.startsWith('Section 3:')),lesson=section.lessons.find(l=>l.title.startsWith('Lesson 3:'));
assert.equal(course.studySections.length,5);assert(['d669-s3-l3-intro','d669-s3-l3-1'].every(id=>lesson.sublessons.some(sub=>sub.id===id)));assert.match(lesson.status,/Partially supplied/);
const sel=lesson.sublessons.find(l=>l.id==='d669-s3-l3-1');assert.equal(sel.provenance.independentlyVerified,false);assert.equal(sel.quizIds.length,5);
const multi=sel.guidedPractice.find(g=>g.correctResponses);assert.equal(multi.correctResponses.length,3);assert.equal(multi.assessment,'ungraded');assert(!multi.correctResponses.some(x=>/Ignoring/.test(x)));
const review=section.lessons.flatMap(l=>l.sublessons||[]).find(l=>l.id==='d669-s3-l2-review');assert(audit.newQuestionIds.slice(0,3).every(id=>review.quizIds.includes(id)));
assert.equal(section.lessons.find(l=>l.title==='Section 3: Summary').status,'Awaiting source content');
console.log('PASS D669 supplied review, healthy-learning/SEL topics, nine ungraded questions, three correct factors and 97 prior answer identities preserved');
