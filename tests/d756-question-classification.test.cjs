// Instructor-specific scoring regression: no simulated XP, no real student data modified.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../current-site/d756-task2-meeting.js'),'utf8');
const start=source.indexOf('function indicators(a){');
const end=source.indexOf('\nfunction activeScene(){',start);
assert(start>=0&&end>start,'Question scorer block must be found in existing D756 module');
const ctx={
  peopleNow:()=>[['Elena Kahale','Parent'],['Angela Madina','Student'],['Mr. Mehta','LEA'],['Mr. Moore','English teacher']],
  s:{records:[]},
  norm:t=>t.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
};
const {indicators,contextualClarification,meter}=vm.runInNewContext(source.slice(start,end)+'\n({indicators,contextualClarification,meter})',ctx);
test('specific input questions are credited and the person addressed first responds',()=>{
 assert.equal(indicators('Mr. Moore, how is Angela doing in class?').input,true);
 assert.equal(indicators('Mr. Moore, how is Angela doing in class?').who[0],3);
 assert.equal(indicators('Elena, what do you think about Angela’s reading goal?').who[0],0);
 assert.equal(indicators('Angela, what supports do you prefer for writing assignments?').who[0],1);
 assert.equal(indicators('Elena, what concerns would you share about career transition planning?').input,true);
});
test('generic invitations are not input or clarification, even when they contain question marks',()=>{
 for(const a of ['Does anyone have questions?','Does anyone have anything to add?','Elena, what do you think?','Team, what ideas would you like to share?']){
  assert.equal(indicators(a).input,false,a);
  assert.equal(indicators(a).clarify,false,a);
 }
});
test('clarification requires a question grounded in the actual stakeholder statement',()=>{
 const statement='At home, getting started is difficult. Can we coordinate a routine?';
 assert.equal(contextualClarification('Elena, when you say getting started is difficult, what does that look like at home?',statement),true);
 assert.equal(contextualClarification('Elena, does anyone have any questions?',statement),false);
 assert.equal(contextualClarification('Could you clarify?',statement),false);
 assert.equal(contextualClarification('Elena, what specifically do you mean by college?',statement),false);
 assert.equal(contextualClarification('Elena, when you say getting started is difficult, what does that look like at home?',''),false);
});
test('meeting compass counts contextual clarifications separately from substantive input',()=>{
 ctx.s.records=[
  {answer:'Elena, what concerns would you share about classroom support?',valid:true,clarifyingFollowUp:false},
  {answer:'Elena, when you say getting started is difficult, what does that look like at home?',valid:true,clarifyingFollowUp:true},
  {answer:'Does anyone have any questions?',valid:true,clarifyingFollowUp:false}
 ];
 const result=meter();
 assert.equal(result.input,1);
 assert.equal(result.clarify,1);
 assert.equal(result.stakeholders,1);
});
