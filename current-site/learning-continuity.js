(()=>{'use strict';if(window.MajickLearningContinuity)return;
const RULES={
 D772:[
 [/population|sample|sampling|survey|experiment|observational|random/i,'d772-s1-l1'],
 [/bias|response|voluntary|convenience|nonresponse|non-response|loaded question/i,'d772-s1-l2'],
 [/mislead|visual distortion|axis|scale|falsif|misrepresent/i,'d772-s1-l3'],
 [/conclusion|significance|causation|generaliz|correlation|evidence/i,'d772-s1-l4'],
 [/categorical|quantitative|variable|type of data/i,'d772-s2-l1'],
 [/graph|histogram|bar chart|scatterplot|plot|display/i,'d772-s2-l2'],
 [/skew|distribution|unimodal|bimodal|outlier|symmetr|spread/i,'d772-s2-l3'],
 [/mean|median|mode|standard deviation|variance|quartile|five.number|box plot|descriptive/i,'d772-s2-l4'],
 [/theoretical|empirical|sample space|probability basics/i,'d772-s3-l1'],
 [/independent|dependent|disjoint|complement|union|intersection/i,'d772-s3-l2'],
 [/probability|chance|odds|replacement|random event/i,'d772-s3-l3']
 ],
 D756:[
 [/iep team|stakeholder|participants|evaluation team/i,'d756-s1-l1'],
 [/responsive|communicat|listen|consensus/i,'d756-s1-l2'],
 [/family|colleague|collaboration|advocacy|resources/i,'d756-s2-l1'],
 [/cultural|linguistic|language access|interpret/i,'d756-s2-l2'],
 [/create.*iep|writing.*iep|develop.*iep/i,'d756-s3-l1'],
 [/plaafp|present level|annual goal|measurab|baseline/i,'d756-s3-l2'],
 [/service|support|lre|least restrictive|progress monitor/i,'d756-s3-l3'],
 [/transition|postsecondary|vocational/i,'d756-s3-l4']
 ]
};
const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function course(){return String(window.S?.activeCourse||'')}
function identify(terms='',courseId=course()){
 const text=String(terms||'');
 const rule=(RULES[courseId]||[]).find(([regex])=>regex.test(text));
 return rule?.[1]||null;
}
function record({courseId=course(),lessonTitle='',term='',correct=false,activity='vocab'}={}){
 if(!window.S?.progress?.[courseId]||courseId!==course())return null;
 const p=S.progress[courseId];p.learningNeeds=p.learningNeeds||{};
 const explicit=[term,lessonTitle].map(v=>String(v||'').trim().toLowerCase()).find(v=>/^(?:d772-s[123]-l[1-4]|d756-s[123]-l[1-4])(?:-[1-9][0-9]*)?$/.test(v));
 const exact=explicit||null;
 const lessonId=exact||identify(lessonTitle+' '+term,courseId);
 if(!lessonId)return null;const old=p.learningNeeds[lessonId]||{struggles:0,successes:0,activities:[],updated:0,lessonId};
 if(correct){old.successes=(old.successes||0)+1}else old.struggles=(old.struggles||0)+1;
 if(!old.activities.includes(activity))old.activities.push(activity);
 old.updated=Date.now();p.learningNeeds[lessonId]=old;
 try{if(typeof save==='function')save()}catch(_){}
 return {lessonId,...old};
}
function needs(courseId=course()){
 const p=window.S?.progress?.[courseId];
 return Object.values(p?.learningNeeds||{}).filter(x=>x.struggles>x.successes).sort((a,b)=>(b.struggles-b.successes)-(a.struggles-a.successes)||b.updated-a.updated);
}
function recommend(courseId=course()){return needs(courseId)[0]||null}
function learned({courseId=course(),lessonId,independent=false}={}){
 if(!independent||!lessonId||!window.S?.progress?.[courseId])return;
 const row=S.progress[courseId].learningNeeds?.[lessonId];if(!row)return;
 row.successes=Math.max(row.successes||0,row.struggles||0);row.updated=Date.now();
 try{if(typeof save==='function')save()}catch(_){}
}
function skillResult(q,correct,assisted=false,origin='practice'){
 const id=String(q?.learningPathLessonId||q?.lessonId||'')||identify([q?.prompt,q?.section,q?.wguTerm].join(' '));
 const p=window.S?.progress?.[course()];if(!p||!id)return null;
 const book=p.adaptiveSkills||(p.adaptiveSkills={});
 const row=book[id]||(book[id]={lessonId:id,attempts:[],cycles:0,status:'practice',errors:[]});
 row.attempts.push({correct:!!correct,assisted:!!assisted,origin,time:Date.now()});
 row.attempts=row.attempts.slice(-5);
 if(!correct)row.errors.push({prompt:String(q?.prompt||'').slice(0,240),answer:String(q?.answer||''),kind:/mean|median|probability|calculate/i.test(q?.prompt||'')?'calculation-or-formula':/graph|histogram|plot|chart/i.test(q?.prompt||'')?'visual-interpretation':'concept-or-misconception'});
 row.errors=row.errors.slice(-8);
 const count=row.attempts.length,wrong=row.attempts.filter(x=>!x.correct).length,independent=row.attempts.filter(x=>x.correct&&!x.assisted).length;
 if((count>=3&&wrong>=2)||(count===5&&independent<4))row.status='review-needed';
 if(count===5&&independent>=4)row.status='ready-for-teachback';
 row.updated=Date.now();try{window.save?.()}catch(_){}
 return row;
}
function skillNeeds(){return Object.values(window.S?.progress?.[course()]?.adaptiveSkills||{}).filter(x=>x.status==='review-needed')}
function skillReview(id){
 const row=window.S?.progress?.[course()]?.adaptiveSkills?.[id];if(!row)return;
 const styles=['explain','simpler','example','quiz'];
 row.status='reviewing';row.method=styles[row.cycles%styles.length];row.cycles++;row.attempts=[];
 try{window.save?.()}catch(_){}
 window.MajickCourseTutor?.openLesson?.(id,row.method,course());
}
function skillRetry(id){
 const row=window.S?.progress?.[course()]?.adaptiveSkills?.[id];if(!row)return;
 row.status='retry';row.attempts=[];try{window.save?.()}catch(_){}
 window.MajickWGUPractice?.startSkillRetry?.(id);
}
window.MajickLearningContinuity={version:'1.1',identify,record,needs,recommend,learned,skillResult,skillNeeds,skillReview,skillRetry};
})();