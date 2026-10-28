(()=>{'use strict';if(window.MajickConnectedPath)return;
const lessons=[['d772-s1-l1','Sampling & populations'],['d772-s1-l2','Bias & sampling methods'],['d772-s1-l3','Misleading representations'],['d772-s1-l4','Statistical conclusions'],['d772-s2-l1','Types of data'],['d772-s2-l2','Graphs & displays'],['d772-s2-l3','Distributions'],['d772-s2-l4','Mean, median & variability'],['d772-s3-l1','Probability fundamentals'],['d772-s3-l2','Compound probability']];
const $=s=>document.querySelector(s);
function state(){return window.S||null}
function course(){return String(state()?.activeCourse||'D772')}
function rows(){return state()?.progress?.[course()]?.adaptiveSkills||{}}
function pick(){const book=rows(),need=window.MajickLearningContinuity?.skillNeeds?.()||[];const match=need.find(r=>r.lessonId);return match?.lessonId||lessons.find(([id])=>!window.MajickLearningContinuity?.masteryStatus?.(id)?.certified)?.[0]||lessons[0][0]}
function route(){return String(state()?.screen||'home').toLowerCase()}
function label(id){return lessons.find(x=>x[0]===id)?.[1]||id}
function go(room){if(typeof window.navigate==='function')window.navigate(room);schedule()}
function goTeach(id,mode){go('guide');setTimeout(()=>showTeaching(id,mode),140)}
const teaching={
'd772-s1-l1':['A population is the full group of interest. A sample is the smaller group actually observed.','Name the population first, then identify who was sampled. A large biased sample is still biased.','A school surveys 40 students out of 800. Population: 800 students; sample: 40 surveyed.'],
'd772-s1-l2':['Selection methods affect whether a sample represents its population.','Check who could be selected, who responded, and who was excluded. Convenience and voluntary response can bias results.','A survey only sent to club members cannot fairly represent every student.'],
'd772-s1-l3':['Graphs can mislead through truncated axes, uneven scales, or distorted areas.','Read axis labels, starting values, and intervals before interpreting the display.','Bars of 98 and 100 look dramatically different if the vertical axis begins at 97.'],
'd772-s1-l4':['Correlation does not by itself establish causation.','Look for confounding variables and distinguish observation from randomized experiment.','Ice cream sales and swimming incidents both rise in warm weather.'],
'd772-s2-l1':['Categorical data describe groups; quantitative data measure counts or amounts.','Ask whether arithmetic on the values would be meaningful.','Favorite subject is categorical; minutes studied is quantitative.'],
'd772-s2-l2':['Choose a graph based on variable type and the question being asked.','Bar charts compare categories; histograms group quantitative intervals; scatterplots compare two numeric variables.','A histogram displays the distribution of exam scores.'],
'd772-s2-l3':['Describe a distribution using shape, center, spread, and outliers.','Check the tail direction: right-skewed means a longer tail toward larger values.','Most incomes are moderate but a few are very high: right-skewed.'],
'd772-s2-l4':['Mean uses every value; median is the middle ordered value.','For mean, add and divide by count. For median, order first; average the two middle values if count is even.','For 2, 4, 9: mean = 5, median = 4.'],
'd772-s3-l1':['Probability is favorable outcomes divided by equally likely possible outcomes.','Define the event and sample space before counting. “At least one” includes one or more.','Rolling an even number on a fair die: 3/6 = 1/2.'],
'd772-s3-l2':['Compound probability depends on whether events are independent and whether replacement occurs.','Draw a tree or list ordered outcomes. Without replacement, update the second denominator.','Two red marbles without replacement from 3 red and 2 blue: (3/5) × (2/4) = 3/10.']};
function showTeaching(id,mode='learn'){const root=$('#content');if(!root)return;let host=root.querySelector('#majPathTeaching');if(!host){host=document.createElement('section');host.id='majPathTeaching';host.className='majPathTeaching';const panel=root.querySelector('#majConnectedPath');panel?.after(host)}const [concept,steps,example]=teaching[id]||['Read the lesson objective and identify the given information.','Explain the method before calculating.','Use a fresh independent question after guidance.'];const title=document.createElement('h3');title.textContent=(mode==='reteach'?'Teach Me Again: ':mode==='review'?'Review: ':'Learn: ')+label(id);const p=document.createElement('p');p.textContent=mode==='reteach'?steps:concept;const detail=document.createElement('p');detail.textContent=mode==='reteach'?example:steps;const b=document.createElement('button');b.type='button';b.textContent='Show worked example';b.addEventListener('click',()=>{detail.textContent=example});host.replaceChildren(title,p,detail,b);host.scrollIntoView?.({block:'nearest',behavior:'auto'})}

function render(){
 const root=$('#content');if(!root||!state())return;
 const room=route();if(!['home','mission','guide','reasoning','games','test'].includes(room)){root.querySelector(':scope > #majConnectedPath')?.remove();root.querySelector(':scope > #majPathTeaching')?.remove();return;}
 let host=root.querySelector(':scope > #majConnectedPath');
 if(!host){host=document.createElement('section');host.id='majConnectedPath';host.setAttribute('aria-label','Connected learning path');root.prepend(host)}
 const id=pick(),master=window.MajickLearningContinuity?.masteryStatus?.(id)||{},needs=window.MajickLearningContinuity?.skillNeeds?.()||[];
 const phases=[['Learn','guide'],['Review','guide'],['Guided Practice','mission'],['Independent Practice','mission'],['Exam Prep','reasoning']];
 const current={home:0,guide:0,mission:2,reasoning:4,test:4,games:3}[room]||0;
 host.replaceChildren();
 const heading=document.createElement('div');heading.className='majPathHead';
 const h=document.createElement('h2');h.textContent='Your Learning Path';const status=document.createElement('p');status.textContent=label(id)+' · '+(master.certified?'Mastered independently':needs.length?'Review recommended':'Keep learning');heading.append(h,status);host.append(heading);
 const track=document.createElement('ol');track.className='majPathSteps';
 for(let i=0;i<phases.length;i++){const li=document.createElement('li');if(i===current)li.className='is-current';const b=document.createElement('button');b.type='button';b.textContent=(i+1)+'. '+phases[i][0];b.addEventListener('click',()=>{go(phases[i][1]);if(i<2)setTimeout(()=>showTeaching(id,i===0?'learn':'review'),140)});li.append(b);track.append(li)}host.append(track);
 const actions=document.createElement('div');actions.className='majPathActions';
 function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);actions.append(b)}
 button('Continue Learning',()=>{goTeach(id,'learn')});
 button('Teach Me Again',()=>{goTeach(id,'reteach')});
 button('Practice Independently',()=>{go('mission');window.MajickWGUPractice?.startSkillRetry?.(id)});
 button('Review This Skill',()=>{goTeach(id,'review')});
 host.append(actions);
 const note=document.createElement('p');note.className='majPathNote';note.textContent='Guided work helps you learn. Only verified independent answers count toward mastery. Game rewards do not certify a skill.';host.append(note);
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;render()},80)}
document.addEventListener('click',e=>{if(e.target.closest('[data-nav],#majConnectedPath'))schedule()});
const observer=new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&!['majConnectedPath','majPathTeaching'].includes(n.id)&&!n.closest?.('#majConnectedPath,#majPathTeaching'))))schedule()});
function init(){const root=$('#content');if(root)observer.observe(root,{childList:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.MajickConnectedPath=Object.freeze({refresh:schedule});
})();