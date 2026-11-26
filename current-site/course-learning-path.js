/* Course Learning Path, single owner, replaces previously cached D772-only script. Do not touch learning records. */
(()=>{'use strict';
if(window.MajickCourseLearningPath)return;
const KEY='aetheria-learning-path-current-v2';
const VERSION='4.0.0';
const COURSE_STAGE={home:0,guide:0,learninglab:0,mission:1,'hands-on':1,reasoning:3,test:3,games:2};
const STAGES=['Learn the source','Practice with support','Try independently','Prepare for OA / assessment'];
let selections={};try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))selections=v}catch(_){}
let pending=false,expanded=false,lastSignature='';
const state=()=>window.S||{};
const course=()=>String(document.querySelector('.courseSelect')?.value||state().activeCourse||'').trim().toUpperCase();
const screen=()=>String(state().screen||'home').toLowerCase();
const $=s=>document.querySelector(s);
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(selections))}catch(_){}};

function sourceRows(cid){
 const c=window.MajickCourseManager?.COURSE_CATALOG?.[cid]||state().courses?.[cid];
 return (c?.studySections||[]).flatMap((sec,si)=>(sec.lessons?.length?sec.lessons:[{title:sec.title,status:'outline only'}]).flatMap((l,li)=>(l.sublessons?.length?l.sublessons:[l]).map((sub,ti)=>({id:sub.id||'section-'+si+'-lesson-'+li+'-topic-'+ti,section:sec.title,lesson:l.title,sub,course:c}))));
}

const olderGames={"d669-s1-l1-1":["Instructional approach sorter",["Whole language","Balanced literacy","Structured literacy"],[["Explicitly teach sound–letter relationships in planned order",2],["Emphasize meaning and context",0],["Combine some phonics with meaningful texts",1]],["A child with dyslexia needs a planned foundational skills lesson. Which approach best matches?",2]],"d669-s1-l1-2":["Structured literacy laboratory",["Explicit","Systematic and cumulative","Diagnostic"],[["Teacher models how to blend",0],["New patterns build on previously taught ones",1],["Teacher adjusts instruction after analyzing errors",2]],["A teacher changes the next lesson after checking decoding errors. Which principle?",2]],"d669-s1-l1-3":["Standards decoder",["Skill","Content","Expected demonstration"],[["Blend",0],["Words with four or five phonemes",1],["Read the word by combining its sounds",2]],["In ‘identify the main idea’, what is ‘identify’?",0]],"d669-s1-l1-4":["Curriculum planner",["Goal","Instruction","Assessment"],[["Students will identify a main idea",0],["Model finding supporting details",1],["Students independently identify the main idea in a new passage",2]],["Which category is a new passage used to check mastery?",2]],"d669-s1-l2-1":["RICH classroom builder",["Relevance","Inclusive","Creative","Hands-on"],[["Texts match literacy goals",0],["Books represent varied communities",1],["Invite original story endings",2],["Students manipulate word tiles",3]],["A library includes books reflecting varied family experiences. Which RICH feature?",1]],"d669-s1-l2-2":["Sound mapping studio",["Auditory","Visual","Kinesthetic/tactile"],[["Hear /ch/ in a spoken word",0],["Compare printed words",1],["Trace letters in shaving cream",2]],["A learner traces ch while saying its sound. Which added modality is tracing?",2]],"d669-s2-l2-1":["Five pillars sorter",["Phonemic awareness","Phonics","Fluency","Vocabulary","Comprehension"],[["Blend spoken sounds without letters",0],["Match letters to sounds",1],["Repeated accurate reading",2],["Explore word meanings",3],["Identify a passage’s main idea",4]],["Students infer why a character acted from text evidence. Which pillar?",4]],"d669-s2-l2-2":["Reading rope builder",["Language comprehension","Word recognition"],[["Background knowledge",0],["Decoding",1],["Vocabulary",0],["Phonological awareness",1],["Verbal reasoning",0]],["A student understands read-alouds but struggles to decode print. Which strand needs investigation?",1]],"d669-s2-l2-3":["POSSUM word investigator",["Phonology","Orthography","Syntax","Semantics","Understanding","Morphology"],[["Speech sounds",0],["Written spelling",1],["Sentence structure",2],["Word meaning",3],["Meaning in context",4],["Meaningful word parts",5]],["Identify the prefix and root of replay. Which focus?",5]]};
function olderGame(box,id){
 const spec=olderGames[id];if(!spec)return;
 const [title,options,items,transfer]=spec;
 const panel=document.createElement('details');const header=document.createElement('summary');header.textContent=title+' · Interactive practice';panel.append(header);
 const visual=document.createElement('div');visual.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin:10px 0';
 options.forEach((o,i)=>{const tile=document.createElement('span');tile.textContent=o;tile.style.cssText='border:2px solid #79638c;border-radius:8px;padding:8px;background:#fff;color:#352846';visual.append(tile)});panel.append(visual);
 let index=0;const prompt=document.createElement('p'),buttons=document.createElement('div'),feedback=document.createElement('p');feedback.setAttribute('role','status');panel.append(prompt,buttons,feedback);
 const next=document.createElement('button');next.type='button';next.textContent='Next challenge';panel.append(next);
 function draw(){const row=items[index];prompt.textContent='Challenge '+(index+1)+' of '+items.length+': '+row[0];buttons.replaceChildren();feedback.textContent='';next.disabled=true;options.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.addEventListener('click',()=>{const ok=i===row[1];feedback.textContent=ok?'Correct — '+row[0]+' matches '+o+'.':'Try again. Compare the clue with the lesson definitions.';next.disabled=!ok;});buttons.append(b)})}
 next.addEventListener('click',()=>{index=(index+1)%items.length;draw()});draw();box.append(panel);
 const independent=document.createElement('details'),h=document.createElement('summary');h.textContent='Independent transfer check (no hints)';independent.append(h);
 const question=document.createElement('p');question.textContent=transfer[0];independent.append(question);
 let selected=-1,submitted=false;const result=document.createElement('p');result.setAttribute('role','status');
 const submit=document.createElement('button');submit.type='button';submit.textContent='Submit answer';submit.disabled=true;
 const choices=options.map((o,i)=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(submitted)return;selected=i;choices.forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)));submit.disabled=false});independent.append(b);return b});
 submit.addEventListener('click',()=>{if(submitted||selected<0)return;submitted=true;choices.forEach(b=>b.disabled=true);submit.disabled=true;result.textContent=(selected===transfer[1]?'Correct. ':'Incorrect. ' )+'Best answer: '+options[transfer[1]]+'. Review the lesson and attempt a fresh example later. This check does not certify mastery.'});independent.append(submit,result);box.append(independent);
}


const anchorCharts={"d669-s1-l1-1":[["👂","Whole language","Meaning and context"],["📚","Balanced literacy","Some phonics plus meaningful text"],["🔤","Structured literacy","Explicit, systematic language instruction"]],"d669-s1-l1-2":[["🗣","Phonology","Speech sounds"],["🔤","Sound-symbol","Connect speech and print"],["🧩","Syllables and morphology","Word parts and meaningful units"],["📝","Syntax and semantics","Sentence structure and meaning"],["🎯","Instruction","Explicit, systematic and cumulative, diagnostic"]],"d669-s1-l1-3":[["🎯","Skill","Blend"],["🔤","Content","Words with four or five phonemes"],["📖","Evidence","Blend sounds to read words"]],"d669-s1-l1-4":[["📅","Plan","Prioritize standards"],["🎯","Teach","Sequence aligned lessons"],["📋","Check","Assess the actual skill"],["🔁","Adjust","Use evidence to plan next steps"]],"d669-s1-l2-1":[["🎯","R — Relevance","Aligned to goals"],["📚","I — Inclusive","Varied perspectives"],["💡","C — Creative","Ideas and critical thinking"],["🧩","H — Hands-on","Meaningful participation"]],"d669-s1-l2-2":[["👂","Auditory","Hear /ch/"],["👁","Visual","Compare printed words"],["✋","Kinesthetic/tactile","Trace ch"]],"d669-s2-l2-1":[["👂","Phonemic awareness","Spoken sounds only"],["🔤","Phonics","Sounds plus print"],["📖","Fluency","Accuracy, rate, prosody"],["💬","Vocabulary","Word meanings"],["💡","Comprehension","Construct meaning"]],"d669-s2-l2-2":[["💬","Language comprehension","Background knowledge, vocabulary, language structures, reasoning, literacy knowledge"],["🔤","Word recognition","Phonological awareness, decoding, familiar word recognition"],["📖","Skilled reading","Both strands work together"]],"d669-s2-l2-3":[["👂","P — Phonology","Sounds"],["🔤","O — Orthography","Spelling"],["📝","S — Syntax","Sentence structure"],["💬","S — Semantics","Meaning"],["💡","U — Understanding","Understand in context"],["🧩","M — Morphology","Meaningful word parts"]],"d669-s2-phonics-detail":[["🔤","Closed","cat"],["🔤","Open","me"],["🔤","Vowel-consonant-e","race"],["🔤","Vowel team","boat"],["🔤","R-controlled","car"],["🔤","Consonant-le","table"]],"d669-s2-l3-7":[["🎯","Accuracy","Correct words"],["⏱","Rate","Appropriate pace"],["💬","Prosody","Expression and phrasing"],["📖","Purpose","Support comprehension"]]};
// Reuse the existing chart cards with approved artwork instead of glyphs.
const chartArtwork={'👂':'assets/licensed/images/runestones.webp','🗣':'assets/licensed/images/runestones.webp','🧩':'assets/licensed/images/runestones.webp','🎯':'assets/licensed/skill-17.webp','📅':'assets/licensed/milestones/hourglass.png','📋':'assets/licensed/skill-03.webp','🔁':'assets/licensed/skill-08.webp','💡':'assets/licensed/crystal-yellow.webp','💬':'assets/licensed/skill-03.webp','👁':'assets/licensed/crystal-blue.webp','✋':'assets/licensed/skill-14.webp','⏱':'assets/licensed/milestones/hourglass.png'};
anchorCharts['d669-s3-l3-1']=[['assets/licensed/milestones/star.png','Self-Awareness','Recognize your emotions, strengths and limitations.'],['assets/licensed/milestones/hourglass.png','Self-Management','Regulate emotions, thoughts and behavior.'],['assets/licensed/milestones/heart.png','Social Awareness','Understand and empathize with diverse people.'],['assets/licensed/rings/ouroboros.webp','Relationship Skills','Communicate, cooperate and resolve conflict.'],['assets/licensed/skill-17.webp','Responsible Decision-Making','Make ethical, constructive choices.']];
anchorCharts['d669-s3-l3-2']=[['assets/rewards/solstice/items/astronomy-book-stack.webp','Mirrors','See your own experiences reflected in a text.'],['assets/licensed/crystal-blue.webp','Windows','Learn about other people’s lives and experiences.'],['assets/licensed/rings/ouroboros.webp','Cultural intelligence','Understand cultural contexts with respect and adaptability.'],['assets/licensed/skill-17.webp','Thoughtful selection','Consider authorship, portrayal, ideas and language.']];
anchorCharts['d669-s3-l3-summary']=[['assets/licensed/milestones/heart.png','SEL','Emotional regulation, empathy and communication.'],['assets/rewards/solstice/items/astronomy-book-stack.webp','Representation','Inclusive texts can support identity and belonging.'],['assets/licensed/plants/flowers.webp','Learning environment','Resources, tailored instruction and engagement.']];
anchorCharts['d669-s3-competency-self-check']=[['assets/licensed/images/runestones.webp','Oral communication','Speaking, listening and spoken responses.'],['assets/rewards/solstice/items/astronomy-book-stack.webp','Print communication','Reading and writing in print.'],['assets/licensed/skill-03.webp','Digital communication','Recording, sharing, collaboration and feedback.']];
anchorCharts['d669-s4-intro']=[['assets/rewards/solstice/items/astronomy-book-stack.webp','Fiction','Often characters, plot and setting.'],['assets/licensed/crystal-blue.webp','Nonfiction','Facts, information and logical organization.'],['assets/licensed/rings/ouroboros.webp','Poetry','May use rhythm, rhyme and expressive language.']];
anchorCharts['d669-s4-l1-intro']=anchorCharts['d669-s4-intro'];
function anchorChart(box,sub){
 const rows=anchorCharts[sub.id]||(sub.keyIdeas||[]).map((t,i)=>['📘','Key idea '+(i+1),t]);if(!rows.length)return;
 const figure=document.createElement('figure');figure.className='majPathAnchor';figure.style.cssText='margin:12px 0;padding:14px;border:1px solid #ae9abb;border-radius:14px;background:#fffaf0;color:#30233f';
 const title=document.createElement('figcaption');title.textContent='Study anchor chart · '+sub.title;title.style.cssText='font-weight:800;font-size:1.08rem;margin-bottom:10px';figure.append(title);
 const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,155px),1fr));gap:9px';
 rows.forEach(([pic,label,detail],i)=>{const tile=document.createElement('div');tile.style.cssText='padding:12px;border:1px solid #b6a4c4;border-radius:10px;background:'+['#e6efe5','#f2e8f5','#f8efd9','#e5edf7'][i%4]+';color:#30233f';const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.style.cssText='display:block;min-height:46px';const art=document.createElement('img');art.src=pic.startsWith('assets/')?pic:chartArtwork[pic]||'assets/rewards/solstice/items/astronomy-book-stack.webp';art.alt='';art.width=40;art.height=40;art.loading='lazy';art.decoding='async';art.style.cssText='display:block;object-fit:contain;margin-bottom:6px';icon.append(art);const h=document.createElement('strong');h.textContent=label;const p=document.createElement('p');p.textContent=detail;p.style.margin='6px 0 0';tile.append(icon,h,p);grid.append(tile)});figure.append(grid);
 const foot=document.createElement('p');foot.textContent='Simplified Aetheria study aid based on supplied WGU lesson material.';foot.style.cssText='font-size:.8rem;margin:10px 0 0';figure.append(foot);box.append(figure);
}

function sourcePanel(body,item){
 if(item.kind==='document'){const box=document.createElement('section');box.className='majPathEvidence';box.dataset.sourceDocument=item.locator.id;body.append(box);window.MajickCourseSourceReader.render(box,item.locator);return;}
 const row=sourceRows(course()).find(r=>r.id===item.locator);if(!row)return;
 const sub=row.sub,box=document.createElement('section');box.className='majPathEvidence';box.style.padding='12px';
 function line(tag,value){const el=document.createElement(tag);el.textContent=value;box.append(el);return el}
 line('h3',row.section+' · '+sub.title);
 const ideas=[...(sub.keyIdeas||[]),...(sub.summary?[sub.summary]:[])];
 if(!ideas.length){line('p','Source material not yet supplied for this topic.');body.append(box);return}
 anchorChart(box,sub);const detail=document.createElement('details');const heading=document.createElement('summary');heading.textContent='Detailed lesson notes';detail.append(heading);ideas.forEach(t=>{const p=document.createElement('p');p.textContent=t;detail.append(p)});box.append(detail);
 if(sub.visual?.src){const img=document.createElement('img');img.src=sub.visual.src;img.alt=sub.visual.alt||'Course diagram';img.loading='lazy';img.style.cssText='max-width:100%;height:auto;display:block;margin:10px auto';box.append(img);const a=line('a',sub.visual.alt||'Open source diagram');a.href=sub.visual.src;a.target='_blank';a.rel='noopener noreferrer'}
 const bank=row.course.questionBank||[],ids=new Set(sub.quizIds||[]);
 const qs=bank.filter(q=>ids.has(q.id));
 const guided=Array.isArray(sub.guidedPractice)?sub.guidedPractice:sub.guidedPractice?[sub.guidedPractice]:[];
 guided.forEach(g=>{line('p','Guided activity: '+(typeof g==='string'?g:g.prompt||'Review the source'));if(g.status)line('p',g.status)});
 const suppliedReferences=Array.isArray(sub.references)?sub.references:sub.references?[sub.references]:[];
 const references=suppliedReferences.map((ref,i)=>typeof ref==='string'?{title:'Open supplied lesson reference '+(i+1),url:ref}:ref).filter(ref=>ref&&/^https?:\/\//.test(ref.url||''));
 if(references.length){line('h4','Supplied lesson references');references.forEach(ref=>{const a=line('a',ref.title||'Open supplied lesson reference');a.href=ref.url;a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='display:block;min-height:44px;box-sizing:border-box;padding:8px 0;overflow-wrap:anywhere;text-decoration:underline;color:#3b3050!important;-webkit-text-fill-color:#3b3050!important'})}
 if(qs.length){line('h4','Practice this exact topic');qs.forEach(q=>{const d=document.createElement('details');const h=document.createElement('summary');h.textContent=q.prompt;d.append(h);const feedback=document.createElement('p');feedback.setAttribute('role','status');(q.options||[]).forEach(o=>{const b=document.createElement('button');b.type='button';b.textContent=o;b.addEventListener('click',()=>{feedback.textContent=(o===q.answer?'Correct. ':'Try again. ')+(q.why||'Review the lesson.');});d.append(b)});d.append(feedback);box.append(d)});}
 else line('p','Topic-specific scored practice is not yet linked. Review the lesson and supplied activities above.');
 if(sub.id==='d669-s2-l3-7'){const b=line('button','Open fluency visual games');b.type='button';b.addEventListener('click',()=>{window.navigate?.('learninglab');setTimeout(()=>document.querySelector('[aria-label="Fluency visual games"]')?.scrollIntoView({block:'start'}),250)})}
 olderGame(box,sub.id);
 line('p','These checks are formative; independent mastery and fresh transfer require separate evidence.');
 body.append(box);
}

function catalog(cid){
 const result=[],seen=new Set();
 function add(id,title,kind,detail='',loc=null){
  title=clean(title);id=clean(id);if(!id||!title)return;
  const k=(kind==='source'?'source:':'lesson:')+id.toLowerCase();
  if(seen.has(k))return;seen.add(k);
  result.push({id,title,kind,detail:clean(detail),locator:loc});
 }
 const rows=sourceRows(cid);
 if(rows.length){rows.forEach(r=>add('topic:'+r.id,r.section.replace(/:.*$/,'')+' · '+r.sub.title,'topic',r.sub.status||'',r.id));}
 (window.MajickCourseSources?.documents?.[cid]||[]).forEach(d=>add('document:'+d.id,'Supplied reference · '+d.title,'document',d.status,d));
 // Reuse authoritative, source-backed packs instead of hard-coding a course.
 const packs=Object.values(window.MajickCourseActivityPlayer?.packs||{}).filter(p=>String(p.courseId||'').toUpperCase()===cid);
 packs.forEach(p=>add('pack:'+p.id,p.title,'source',p.summary,p.id));
 // Existing curriculum activities are lesson-level classroom application tasks.
 const tasks=(window.MajickLessonActivities?.tasks||[]).filter(t=>String(t.course||'').toUpperCase()===cid);
 tasks.forEach(t=>{const code=String(t.lessonId||'').match(/-l(\d+)-(\d+)$/);const hasSource=code&&packs.some(p=>p.id==='lesson-'+Number(code[1])+'-'+Number(code[2]));if(!hasSource)add('task:'+t.id,t.title,'task',t.objective,t.lessonId)});
 // Lessons shown in the existing Learning Lab, including notes the user added.
 const model=window.MajickLearningLab;
 try{(model?.lessons?.(cid)||[]).forEach((l,i)=>add('lab:'+i,l.title||('Lesson '+(i+1)),'lab',l.source||'',i))}catch(_){}
 // When structured topics are absent, derive practice groups from the existing bank.
 if(!rows.length){
 const model=state().courses?.[cid]||window.MajickCourseManager?.COURSE_CATALOG?.[cid]||{};
 const groups=new Map();for(const q of model.questionBank||[]){const key=q.learningPathLessonId||q.lessonId||q.topicId||q.conceptId||q.sectionId||q.section;if(!key)continue;const k=String(key);if(!groups.has(k))groups.set(k,model.concepts?.find(x=>x.id===k)?.title||q.lessonTitle||q.section||k.replace(/[-_]/g,' '))}
 for(const [id,title] of groups)add('skill:'+id,title,'skill','Course question bank',id);
 }
 // When a course has no authored lesson catalog, use a transparent course overview.
 if(!result.length){
  const c=state().courses?.[cid];
  if(c?.title)add('overview',c.title+' — Course overview','overview','Add course sources or open the course question bank');
 }
 return result;
}
function topicEvidence(cid,items){
 const rows=sourceRows(cid),bank=state().courses?.[cid]?.questionBank||window.MajickCourseManager?.COURSE_CATALOG?.[cid]?.questionBank||[];
 const answers=state().progress?.[cid]?.answers||[],ledger=state().majickAccount?.rewardCore?.ledger||{};
 const rowMap=new Map(rows.map(r=>[r.id,r])),byTopic=new Map();
 for(const a of answers){const id=String(a.qid||a.id||'');if(id){if(!byTopic.has(id))byTopic.set(id,[]);byTopic.get(id).push(a)}}
 return items.filter(x=>x.kind==='topic'||x.kind==='skill').map(item=>{
  const row=rowMap.get(item.locator),sub=row?.sub||{},ids=new Set(sub.quizIds||[]);
  for(const q of bank)if(q.learningPathLessonId===item.locator||q.lessonId===item.locator||q.topicId===item.locator||q.conceptId===item.locator||q.sectionId===item.locator||q.section===item.locator)ids.add(q.id||q.qid);
  const records=[...ids].flatMap(id=>byTopic.get(String(id))||[]).sort((a,b)=>(Number(a.at)||0)-(Number(b.at)||0));
  const independent=records.filter(a=>a.assisted===false),latest=new Map(independent.map(a=>[String(a.qid||a.id),a]));
  const hits=[...latest.values()].filter(a=>a.correct).length,total=latest.size,rate=total?hits/total:0;
  const mastered=Boolean(ledger['concept:'+cid+':'+item.locator]||ledger['lesson:'+cid+':'+item.locator]);
  const proficient=total>=3&&rate>=.8;
  const weak=total>0&&rate<.8;
  const supplied=Boolean(sub.keyIdeas?.length||sub.summary||ids.size);
  const lastCorrect=Math.max(0,...independent.filter(a=>a.correct).map(a=>Number(a.at)||0));
  const scheduled=(state().progress?.[cid]?.spacedQueue||[]).filter(x=>[item.locator,'adaptive:'+item.locator].includes(x.topicId)).map(x=>Number(x.dueAt)).filter(Number.isFinite);
  const dueAt=scheduled.length?Math.min(...scheduled):lastCorrect?lastCorrect+2*86400000:0;
  return {item,mastered,proficient,weak,supplied,total,hits,available:ids.size,dueAt};
 });
}
function recommendation(cid,items=catalog(cid)){
 const evidence=topicEvidence(cid,items),usable=evidence.filter(x=>x.supplied);
 const next=usable.find(x=>!x.mastered&&!x.proficient);
 const weak=usable.filter(x=>x.weak&&!x.mastered).sort((a,b)=>a.hits/a.total-b.hits/b.total)[0];
 const due=usable.filter(x=>(x.mastered||x.proficient)&&x.dueAt>0&&x.dueAt<=Date.now()).sort((a,b)=>a.dueAt-b.dueAt);
 return {next:next?.item||null,weak:weak?.item||null,review:due[0]?.item||null,reviewCount:due.length,evidence};
}
let manualChoice={};
function current(cid,items){
 if(!items.length)return null;
 const rec=recommendation(cid,items),found=items.find(x=>x.id===selections[cid]);
 if(rec.evidence.length){
  if(manualChoice[cid]&&found)return found;
  return rec.next||rec.review||found||items[0];
 }
 if(found)return found;
 const labIndex=Number(state().majickLearningLab?.[cid]?.lessonIndex);
 if(screen()==='learninglab'&&Number.isInteger(labIndex)&&labIndex>0){const match=items.find(x=>x.id==='lab:'+labIndex);if(match)return match}
 return items[0];
}
function stage(){
 const room=screen();
 if(room==='learninglab'){
  const panel=$('.learnPanel:not([hidden])')?.dataset.panel;
  if(panel==='practice')return 1;
  if(panel==='mastery')return 2;
  return 0;
 }
 return COURSE_STAGE[room]??0;
}
function progressFor(cid,item){
 const evidence=topicEvidence(cid,[item]).find(Boolean);if(evidence)return (evidence.mastered?'Mastered':evidence.proficient?'Proficient · review later':evidence.weak?'Needs reinforcement':evidence.total?'Developing':'No independent evidence yet')+' · '+evidence.hits+'/'+evidence.total+' distinct independent questions correct';
 const p=window.MajickStudyObservatory;
 if(item?.kind==='source'&&p?.summary){
  try{const summary=p.summary(cid),row=summary.skills?.find(x=>x.id===item.locator);
   if(row)return row.unique+' of '+row.total+' sourced checks solved · '+row.attempts+' recent checks';}catch(_){}
 }
 const courseProgress=state().progress?.[cid];
 const answers=(courseProgress?.answers||[]).length;
 return answers?answers+' recorded course answers (not lesson-specific mastery)':'No scored lesson evidence yet';
}
function practiceTopic(item){
 if(!item)return;
 const cid=course(),model=state().courses?.[cid]||window.MajickCourseManager?.COURSE_CATALOG?.[cid],bank=model?.questionBank||[];
 if(item.kind!=='topic'){if(item.kind==='skill'){window.navigate?.('learninglab');setTimeout(()=>window.MajickLearningLab?.showTab?.('practice',item.locator),200)}else navigateTo(item);return}
 const row=sourceRows(cid).find(r=>r.id===item.locator);if(!row)return;
 const section=String(row.section).match(/Section\s+(\d+)/i)?.[1],lesson=String(row.lesson).match(/Lesson\s+(\d+)/i)?.[1];
 const lessonId=section&&lesson?cid.toLowerCase()+'-s'+section+'-l'+lesson:'';
 const ids=new Set(row.sub.quizIds||[]);
 const keys=q=>[q.learningPathLessonId,q.lessonId,q.topicId,q.conceptId].map(v=>String(v??''));
 let matched=bank.filter(q=>ids.has(q.id)||keys(q).includes(row.id)||String(q.id||'').startsWith(row.id+'-'));
 if(!matched.length&&lessonId)matched=bank.filter(q=>keys(q).includes(lessonId)||String(q.id||'').startsWith(lessonId+'-'));
 const exact=matched.length>0;
 if(!exact&&section)matched=bank.filter(q=>String(q.section||q.sectionId||'').match(/(?:section[\s_-]*|(?:^|[-_])s)(\d+)/i)?.[1]===section);
 window.navigate?.('learninglab');
 setTimeout(()=>{window.MajickLearningLab?.showTab?.('practice',matched.map(q=>String(q.id||q.qid)));const panel=document.getElementById('learnPractice');if(panel){const note=document.createElement('p');note.textContent=exact?'Practice: '+row.sub.title:'Section '+section+' review — exact-topic questions are not linked yet.';panel.prepend(note);panel.scrollIntoView?.({block:'start',behavior:'auto'})}},250);
}
function navigateTo(item){
 if(!item)return;
 if(item.kind==='skill'){window.navigate?.('learninglab');setTimeout(()=>window.MajickLearningLab?.showTab?.('practice',item.locator),180);return;}
 if(item.kind==='topic'||item.kind==='document'){expanded=true;const host=$('#majConnectedPath');if(host)host.dataset.signature='';render();document.querySelector('#majConnectedPath details')?.setAttribute('open','');return;}else if(item.kind==='source'){
  window.navigate?.('learninglab');
  setTimeout(()=>{
   const el=[...document.querySelectorAll('[data-cap-pack]')].find(x=>x.dataset.capPack===item.locator);
   if(el){el.open=true;el.scrollIntoView?.({block:'start',behavior:'auto'})}
  },180);
 }else if(item.kind==='lab'){
  const st=window.MajickLearningLab?.state?.(course());
  if(st&&Number.isInteger(item.locator))st.lessonIndex=item.locator;
  window.navigate?.('learninglab');
  setTimeout(()=>{window.MajickLearningLab?.showTab?.('learn');window.MajickLearningLab?.refresh?.()},120);
 }else window.navigate?.('mission');
 schedule();
}
function render(){
 const root=$('#content'),cid=course(),room=screen();
 if(!root||!cid||!['home','mission','guide','learninglab','reasoning','test','games','hands-on'].includes(room)){
  root?.querySelector(':scope > #majConnectedPath')?.remove();return;
 }
 // The previous UI can survive an SPA re-render. Keep exactly one path container.
 const duplicates=[...document.querySelectorAll('#majConnectedPath')];
 for(const extra of duplicates.slice(1))extra.remove();
 const list=catalog(cid),item=current(cid,list);
 if(!item){root.querySelector(':scope > #majConnectedPath')?.remove();return}
 const idx=stage(),key=cid+'|'+room+'|'+item.id+'|'+idx+'|'+list.map(x=>x.id).join(',')+'|'+progressFor(cid,item);
 const host=root.querySelector(':scope > #majConnectedPath')||document.createElement('section');
 if(!host.isConnected){host.id='majConnectedPath';host.setAttribute('aria-label','Course and lesson learning path');root.prepend(host)}
 if(host.dataset.signature===key&&host.querySelector('.majPathSummary')?.textContent?.includes('Path v4.0'))return;
 const prior=host.querySelector('details');if(prior)expanded=prior.open;
 host.dataset.signature=key;host.replaceChildren();
 const details=document.createElement('details');details.className='majPathDisclosure';details.open=expanded;
 details.addEventListener('toggle',()=>{expanded=details.open});
 const summary=document.createElement('summary');summary.className='majPathSummary';
 summary.textContent='✦ '+cid+' · '+item.title+' · '+STAGES[idx]+' · Path v4.0';details.append(summary);
 const body=document.createElement('div');body.className='majPathBody';details.append(body);
 const h=document.createElement('h2');h.textContent='Your Learning Path';body.append(h);
 const currentLine=document.createElement('p');currentLine.textContent=(state().courses?.[cid]?.title||cid)+' · Current topic: '+item.title;body.append(currentLine);
 if(item.detail){const d=document.createElement('p');d.textContent=item.detail;body.append(d)}
 const progress=document.createElement('p');progress.className='majPathEvidence';progress.textContent=progressFor(cid,item);body.append(progress);
 const label=document.createElement('label');label.className='majPathSelectLabel';label.textContent='Choose your lesson or topic';label.htmlFor='majPathLessonSelect';body.append(label);
 const select=document.createElement('select');select.id='majPathLessonSelect';select.className='majPathLessonSelect';
 list.forEach(o=>{const opt=document.createElement('option');opt.value=o.id;opt.textContent=o.title;opt.selected=o.id===item.id;select.append(opt)});
 select.addEventListener('change',()=>{selections[cid]=select.value;manualChoice[cid]=true;save();host.dataset.signature='';render()});body.append(select);if(item.kind==='topic'||item.kind==='document')sourcePanel(body,item);
 const steps=document.createElement('ol');steps.className='majPathSteps';
 STAGES.forEach((name,i)=>{const li=document.createElement('li');if(idx===i)li.className='is-current';const button=document.createElement('button');button.type='button';button.textContent=(i+1)+'. '+name;button.setAttribute('aria-current',idx===i?'step':'false');button.addEventListener('click',()=>{if(i===0)navigateTo(current(cid,catalog(cid)));else if(i===1)practiceTopic(current(cid,catalog(cid)));else window.navigate?.(i===2?'hands-on':'reasoning');schedule()});li.append(button);steps.append(li)});
 body.append(steps);
 const actions=document.createElement('div');actions.className='majPathActions';
 function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',fn);actions.append(b)}
 button('Open current topic',()=>navigateTo(current(cid,catalog(cid))));
 button('Practice this topic',()=>practiceTopic(current(cid,catalog(cid))));
 button('Hands-on scenarios',()=>window.navigate?.('hands-on'));
 body.append(actions);
 const note=document.createElement('p');note.className='majPathNote';note.textContent='The path follows your course and selected topic. Practice counts are not WGU certification or verified independent mastery.';body.append(note);
 const rec=recommendation(cid,list);
 if(rec.evidence.length){
  const quick=document.createElement('div');quick.className='majPathActions';quick.style.padding='8px 16px';
  const addQuick=(label,target)=>{if(!target)return;const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>{selections[cid]=target.id;manualChoice[cid]=true;expanded=true;save();host.dataset.signature='';render();navigateTo(target)});quick.append(b)};
  addQuick('Continue learning',rec.next);addQuick('Strengthen weak skill',rec.weak);addQuick('Review due ('+rec.reviewCount+')',rec.review);
  const all=document.createElement('button');all.type='button';all.textContent='Whole course practice';all.addEventListener('click',()=>{window.navigate?.('learninglab');setTimeout(()=>window.MajickLearningLab?.showTab?.('practice'),200)});quick.append(all);
  host.append(quick);
 }
 host.append(details);
}
function schedule(){if(pending)return;pending=true;setTimeout(()=>{pending=false;render()},80)}
function detectSourceClick(e){
 const header=e.target.closest('[data-cap-pack]>summary');
 if(!header)return;
 const block=header.parentElement,selected='pack:'+block.dataset.capPack,cid=course();
 if(selected&&catalog(cid).some(x=>x.id===selected)){selections[cid]=selected;save();schedule()}
}
document.addEventListener('click',e=>{
 detectSourceClick(e);
 const b=e.target.closest('button');
 if(b?.id==='learnNextLesson'||b?.id==='learnPrevLesson'){setTimeout(()=>{const cid=course(),idx=Number(state().majickLearningLab?.[cid]?.lessonIndex)||0,which='lab:'+idx;if(catalog(cid).some(x=>x.id===which)){selections[cid]=which;save()}schedule()},60)}
 if(b?.hasAttribute('data-nav')||b?.hasAttribute('data-learn-tab')||b?.hasAttribute('data-cap-answer'))setTimeout(schedule,30);
});
document.addEventListener('change',e=>{if(e.target?.matches?.('.courseSelect,[data-course],#majPathLessonSelect'))schedule()});
document.addEventListener('majick:sourced-practice',e=>{const d=e.detail||{};if(d.courseId&&d.lessonId){selections[String(d.courseId).toUpperCase()]='pack:'+d.lessonId;save();schedule()}});
document.addEventListener('majick:hands-on-practice',schedule);
document.addEventListener('majick:verified-study-answer',()=>{manualChoice[course()]=false;schedule()});
let lastContext='';
function checkContext(){
 const cid=course(),room=screen(),idx=Number(state().majickLearningLab?.[cid]?.lessonIndex)||0;
 const sig=cid+'|'+room+'|'+idx;
 if(sig!==lastContext){lastContext=sig;schedule()}
}
function init(){
 const queue=window.MajickRenderQueue;
 if(queue?.register){queue.register('course-learning-path',schedule,115);queue.schedule()}
 else{const root=$('#content');if(root){
  new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&n.id!=='majConnectedPath'&&!n.closest?.('#majConnectedPath'))) || (root.querySelector('#majConnectedPath')&&!root.querySelector('#majConnectedPath .majPathSummary')?.textContent?.includes('Path v4.0')))schedule()}).observe(root,{childList:true,subtree:true});
 }
 }
 checkContext();schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
setInterval(checkContext,1200);
function openItem(itemId,id){const cid=String(id||course()).toUpperCase(),target=catalog(cid).find(x=>x.id===itemId);if(!target)return false;selections[cid]=target.id;manualChoice[cid]=true;expanded=true;save();if(screen()!=='learninglab')window.navigate?.('learninglab');setTimeout(()=>{render();navigateTo(target)},180);return true}
window.MajickCourseLearningPath=Object.freeze({VERSION,openItem,openRecommended:(id)=>{const cid=String(id||course()).toUpperCase(),rec=recommendation(cid),target=rec.next||rec.weak||rec.review;if(!target)return false;selections[cid]=target.id;manualChoice[cid]=true;expanded=true;if(screen()==='home')window.navigate?.('learninglab');setTimeout(()=>{render();navigateTo(target)},180);return true},recommendation:(id)=>recommendation(String(id||course()).toUpperCase()),refresh:schedule,catalog:(id)=>catalog(String(id||course()).toUpperCase()),current:()=>current(course(),catalog(course()))});
window.MajickConnectedPath=window.MajickCourseLearningPath;
})();
