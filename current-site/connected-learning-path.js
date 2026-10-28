(()=>{'use strict';if(window.MajickConnectedPath)return;
const lessons=[['d772-s1-l1','Sampling & populations'],['d772-s1-l2','Bias & sampling methods'],['d772-s1-l3','Misleading representations'],['d772-s1-l4','Statistical conclusions'],['d772-s2-l1','Types of data'],['d772-s2-l2','Graphs & displays'],['d772-s2-l3','Distributions'],['d772-s2-l4','Mean, median & variability'],['d772-s3-l1','Probability fundamentals'],['d772-s3-l2','Compound probability']];
const $=s=>document.querySelector(s);
function state(){return window.S||null}
function course(){return String(state()?.activeCourse||'D772')}
function rows(){return state()?.progress?.[course()]?.adaptiveSkills||{}}
function pick(){const book=rows(),need=window.MajickLearningContinuity?.skillNeeds?.()||[];const match=need.find(r=>r.lessonId);return match?.lessonId||lessons.find(([id])=>!window.MajickLearningContinuity?.masteryStatus?.(id)?.certified)?.[0]||lessons[0][0]}
function route(){return String(state()?.screen||'home').toLowerCase()}
function label(id){return lessons.find(x=>x[0]===id)?.[1]||id}
function go(room){if(typeof window.navigate==='function')window.navigate(room)}
function render(){
 const root=$('#content');if(!root||!state())return;
 const room=route();if(!['home','mission','guide','reasoning','games','test'].includes(room))return;
 let host=root.querySelector(':scope > #majConnectedPath');
 if(!host){host=document.createElement('section');host.id='majConnectedPath';host.setAttribute('aria-label','Connected learning path');root.prepend(host)}
 const id=pick(),master=window.MajickLearningContinuity?.masteryStatus?.(id)||{},needs=window.MajickLearningContinuity?.skillNeeds?.()||[];
 const phases=[['Learn','guide'],['Review','guide'],['Guided Practice','mission'],['Independent Practice','mission'],['Exam Prep','reasoning']];
 const current={home:0,guide:0,mission:2,reasoning:4,test:4,games:3}[room]||0;
 host.replaceChildren();
 const heading=document.createElement('div');heading.className='majPathHead';
 const h=document.createElement('h2');h.textContent='Your Learning Path';const status=document.createElement('p');status.textContent=label(id)+' · '+(master.certified?'Mastered independently':needs.length?'Review recommended':'Keep learning');heading.append(h,status);host.append(heading);
 const track=document.createElement('ol');track.className='majPathSteps';
 for(let i=0;i<phases.length;i++){const li=document.createElement('li');if(i===current)li.className='is-current';const b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+phases[i][0];b.addEventListener('click',()=>go(phases[i][1]));li.append(b);track.append(li)}host.append(track);
 const actions=document.createElement('div');actions.className='majPathActions';
 function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);actions.append(b)}
 button('Continue Learning',()=>go(current<2?'mission':current===2?'reasoning':'guide'));
 button('Teach Me Again',()=>{const lc=window.MajickLearningContinuity;lc?.skillReview?.(id);go('guide');const tutor=window.MajickCourseTutor;if(tutor?.openLesson)tutor.openLesson(id,'simpler',course())});
 button('Practice Independently',()=>{go('mission');window.MajickWGUPractice?.startSkillRetry?.(id)});
 host.append(actions);
 const note=document.createElement('p');note.className='majPathNote';note.textContent='Guided work helps you learn. Only verified independent answers count toward mastery. Game rewards do not certify a skill.';host.append(note);
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;render()},80)}
document.addEventListener('click',e=>{if(e.target.closest('[data-nav],#majConnectedPath'))schedule()});
const observer=new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&n.id!=='majConnectedPath'&&!n.closest?.('#majConnectedPath'))))schedule()});
function init(){const root=$('#content');if(root)observer.observe(root,{childList:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.MajickConnectedPath=Object.freeze({refresh:schedule});
})();