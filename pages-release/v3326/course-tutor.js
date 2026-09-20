(function(){
'use strict';
if(!window.MajickLearningLab||!window.MajickMaterialStore)return;

const VERSION='3.3.26';
const D772_SECTION_ONE={
  id:'d772-section-1',
  title:'Section 1: Assessing Research and Data Credibility',
  lessons:[
    {id:'d772-s1-l1',number:1,title:'Understanding Data Collection Methods',short:'Data Collection',keywords:['data collection','collect data','sample','sampling','population','random sample','survey','observation','experiment','census','selected','collected'],
      goal:'Understand how data is gathered, who is represented, and how the collection method affects what the data can tell you.',
      visual:['Population','Sample / participants','Collection method','Data','What can we conclude?'],
      thinking:['Who or what is the full population?','Who was actually measured?','How were people or items selected?','What collection method was used?','Does the method fit the question being asked?'],
      traps:['Treating a sample as if it were the whole population.','Ignoring how participants were selected.','Assuming every collection method supports the same kind of conclusion.']},
    {id:'d772-s1-l2',number:2,title:'Recognizing Bias in Data Collection',short:'Bias',keywords:['bias','biased','selection bias','response bias','nonresponse','undercoverage','voluntary response','convenience','wording','leading question'],
      goal:'Identify ways the collection process can systematically push results away from an accurate picture of the population.',
      visual:['Target population','Who can be selected?','Who responds?','How questions are asked','Bias risk'],
      thinking:['Who had a real chance to be included?','Who may have been left out?','Who may choose not to respond?','Could the wording influence the response?','Would the same process systematically favor one kind of answer?'],
      traps:['Calling ordinary random variation “bias.”','Looking only at sample size and ignoring selection.','Missing bias caused by wording or nonresponse.']},
    {id:'d772-s1-l3',number:3,title:'Unveiling Data Misrepresentations',short:'Misrepresentation',keywords:['misrepresentation','misleading','graph','axis','scale','truncated','visual','chart','interval','proportion','distort','display'],
      goal:'Evaluate whether a graph, table, or numerical display represents the underlying data fairly.',
      visual:['Original data','Axes / scale / labels','Displayed visual','Reader impression','Fair or misleading?'],
      thinking:['What values are actually in the data?','Where does the axis begin?','Are intervals consistent?','Are labels and units clear?','Does the visual exaggerate or hide a difference?'],
      traps:['Trusting a graph because the numbers are technically present.','Ignoring a truncated axis or inconsistent scale.','Confusing a dramatic visual difference with a large numerical difference.']},
    {id:'d772-s1-l4',number:4,title:'Conclusions About Data Findings',short:'Conclusions',keywords:['conclusion','conclusions','causation','causal','correlation','association','generalize','inference','evidence','claim','findings','relationship','limitation'],
      goal:'Decide what conclusions the evidence actually supports and where the limits of the study matter.',
      visual:['Study design','Evidence observed','Population represented','Limits','Supported conclusion'],
      thinking:['What did the study actually observe?','Who does the sample represent?','Is this association or evidence of cause?','What limitations narrow the conclusion?','Is the claim stronger than the evidence?'],
      traps:['Turning correlation into causation.','Generalizing beyond the population represented by the sample.','Ignoring limitations when judging a claim.']},
    {id:'d772-s1-review',number:5,title:'Section 1 Review',short:'Section Review',review:true,keywords:[],
      goal:'Combine data collection, bias, representation, and conclusion skills in mixed evidence-based practice.',
      visual:['Collection','Bias','Representation','Conclusion','Credibility decision'],
      thinking:['How was the data collected?','What bias is possible?','Is the display fair?','What conclusion is supported?','What would make the evidence stronger?'],
      traps:['Solving only one part of a multi-step credibility problem.','Choosing the strongest-sounding conclusion instead of the best-supported conclusion.']}
  ]
};

const cache={};
function E(s){try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}}
function cid(){return String(window.S?.activeCourse||'D755')}
function course(id=cid()){return window.S?.courses?.[id]||{questionBank:[]}}
function prog(id=cid()){return window.S?.progress?.[id]||{answers:[]}}
function tutorState(id=cid()){
  const s=MajickLearningLab.state(id);
  s.tutor=s.tutor&&typeof s.tutor==='object'?s.tutor:{};
  s.tutor.selectedLesson=s.tutor.selectedLesson||null;
  s.tutor.openSections=s.tutor.openSections||{};
  return s.tutor;
}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function uniqText(rows,selector=x=>x){
  const out=[],seen=new Set();
  for(const row of rows||[]){
    const value=selector(row);
    const key=norm(value);
    if(!key||seen.has(key))continue;
    seen.add(key);out.push(row);
  }
  return out;
}
function sourceText(row){return (String(row?.sourceName||'')+' '+String(row?.text||'')).toLowerCase()}
function headingInfo(row){
  const raw=String(row?.sourceName||'')+'\n'+String(row?.text||'').slice(0,1600);
  const section=raw.match(/\bSection\s+(\d+)\s*[:\-–]?\s*([^\n]{0,90})/i);
  const lesson=raw.match(/\bLesson\s+(\d+)\s*[:\-–]?\s*([^\n]{0,90})/i);
  return {
    sectionNumber:section?Number(section[1]):null,
    sectionTitle:section?.[2]?.trim()||'',
    lessonNumber:lesson?Number(lesson[1]):null,
    lessonTitle:lesson?.[2]?.trim()||''
  };
}
function escRx(s){return String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function lessonById(id){return D772_SECTION_ONE.lessons.find(l=>l.id===id)||null}
function classifyD772(row){
  if(row?.learningPath?.courseId==='D772'&&(row.learningPath.lessonId||row.learningPath.multiLesson))return row.learningPath;
  const text=sourceText(row),head=headingInfo(row);
  let best=null,bestScore=0;
  for(const lesson of D772_SECTION_ONE.lessons.filter(x=>!x.review)){
    let score=0;
    if(head.lessonNumber===lesson.number)score+=12;
    if(norm(head.lessonTitle).includes(norm(lesson.short)))score+=8;
    if(text.includes(norm(lesson.title)))score+=12;
    for(const k of lesson.keywords)if(text.includes(k))score+=1;
    if(score>bestScore){bestScore=score;best=lesson}
  }
  if(!best||bestScore<2)return null;
  return {
    courseId:'D772',sectionId:D772_SECTION_ONE.id,sectionTitle:D772_SECTION_ONE.title,
    lessonId:best.id,lessonTitle:best.title,lessonNumber:best.number,confidence:bestScore>=10?'high':bestScore>=4?'medium':'low'
  };
}
function d772Segments(row){
  const raw=String(row?.text||'');
  if(!raw)return [];
  const marks=[];
  for(const lesson of D772_SECTION_ONE.lessons.filter(x=>!x.review)){
    const patterns=[
      new RegExp('\\bLesson\\s*'+lesson.number+'\\b[^\\n]{0,120}','ig'),
      new RegExp(escRx(lesson.title),'ig')
    ];
    for(const rx of patterns){
      let m;
      while((m=rx.exec(raw))){
        marks.push({at:m.index,lessonId:lesson.id,lessonTitle:lesson.title,lessonNumber:lesson.number});
        if(rx.lastIndex===m.index)rx.lastIndex++;
      }
    }
  }
  marks.sort((a,b)=>a.at-b.at);
  const unique=[];
  for(const mark of marks){
    const prev=unique[unique.length-1];
    if(prev&&prev.lessonId===mark.lessonId&&Math.abs(prev.at-mark.at)<160)continue;
    unique.push(mark);
  }
  return unique.map((mark,i)=>({...mark,text:raw.slice(mark.at,unique[i+1]?.at??raw.length)}));
}
function d772ItemText(item){
  return [item?.sourceExcerpt,item?.text,item?.keyIdea,item?.term,item?.definition,item?.explanation,item?.correction,item?.prompt,item?.why,item?.answer]
    .filter(Boolean).join(' ');
}
function scoreD772Item(text,lesson){
  const t=norm(text);
  if(!t)return 0;
  let score=0;
  if(t.includes(norm(lesson.title)))score+=20;
  if(t.includes('lesson '+lesson.number))score+=18;
  const strong={
    'd772-s1-l1':['data collection','collection method','random sample','sampling method','population','census','survey','observation','experiment'],
    'd772-s1-l2':['selection bias','response bias','nonresponse','undercoverage','voluntary response','convenience sample','leading question','biased wording','bias'],
    'd772-s1-l3':['truncated axis','misleading graph','misrepresentation','axis','scale','interval','distort','display'],
    'd772-s1-l4':['causation','causal','correlation','association','generalize','inference','supported conclusion','limitation','claim','findings']
  }[lesson.id]||lesson.keywords||[];
  for(const k of strong)if(t.includes(norm(k)))score+=k.includes(' ')?4:2;
  return score;
}
function classifyD772Item(row,item){
  if(item?.learningPathLessonId&&lessonById(item.learningPathLessonId))return item.learningPathLessonId;
  const text=d772ItemText(item),needle=norm(item?.sourceExcerpt||item?.text||'');
  const segments=d772Segments(row);
  if(needle.length>=18){
    const hit=segments.find(seg=>norm(seg.text).includes(needle.slice(0,Math.min(needle.length,180))));
    if(hit)return hit.lessonId;
  }
  let best=null,bestScore=0;
  for(const lesson of D772_SECTION_ONE.lessons.filter(x=>!x.review)){
    const score=scoreD772Item(text,lesson);
    if(score>bestScore){bestScore=score;best=lesson}
  }
  if(best&&bestScore>=3)return best.id;
  const lp=row?.learningPath;
  if(lp?.lessonId&&lessonById(lp.lessonId))return lp.lessonId;
  return null;
}
function tagD772Generated(row){
  if(!row||row.courseId!=='D772'||!row.generated)return {changed:false,lessonIds:[]};
  let changed=false;
  const buckets=['passages','vocabulary','explanations','misconceptionRepair','practiceQuestions'];
  const lessonIds=new Set();
  for(const bucket of buckets){
    for(const item of (row.generated[bucket]||[])){
      const id=classifyD772Item(row,item);
      if(!id)continue;
      const lesson=lessonById(id);lessonIds.add(id);
      if(item.learningPathLessonId!==id){item.learningPathLessonId=id;changed=true}
      if(item.learningPathLessonTitle!==lesson.title){item.learningPathLessonTitle=lesson.title;changed=true}
      if(item.learningPathSectionId!==D772_SECTION_ONE.id){item.learningPathSectionId=D772_SECTION_ONE.id;changed=true}
    }
  }
  const ids=[...lessonIds];
  if(ids.length>1){
    const next={courseId:'D772',sectionId:D772_SECTION_ONE.id,sectionTitle:D772_SECTION_ONE.title,multiLesson:true,lessonIds:ids,confidence:'item-level'};
    if(JSON.stringify(row.learningPath)!==JSON.stringify(next)){row.learningPath=next;changed=true}
  }else if(ids.length===1){
    const lesson=lessonById(ids[0]);
    const next={courseId:'D772',sectionId:D772_SECTION_ONE.id,sectionTitle:D772_SECTION_ONE.title,lessonId:lesson.id,lessonTitle:lesson.title,lessonNumber:lesson.number,confidence:'item-level'};
    if(JSON.stringify(row.learningPath)!==JSON.stringify(next)){row.learningPath=next;changed=true}
  }
  row.learningPathRepair={version:'3.3.27',mode:'item-level',lessonIds:ids,originalSourcePreserved:true};
  return {changed,lessonIds:ids};
}
function itemMatchesLesson(row,item,lessonId){
  if(row?.courseId!=='D772')return true;
  return classifyD772Item(row,item)===lessonId;
}
function classifyGeneric(row,id){
  const head=headingInfo(row);
  const sectionNo=head.sectionNumber||1;
  const title=head.lessonTitle||String(row?.sourceName||'Study Material').replace(/\.[a-z0-9]+$/i,'');
  return {
    courseId:id,sectionId:'auto-section-'+sectionNo,
    sectionTitle:head.sectionTitle?('Section '+sectionNo+': '+head.sectionTitle):('Section '+sectionNo),
    lessonId:'auto-'+sectionNo+'-'+(head.lessonNumber||norm(title).replace(/\s+/g,'-').slice(0,36)||'lesson'),
    lessonTitle:head.lessonNumber?('Lesson '+head.lessonNumber+': '+title):title,
    lessonNumber:head.lessonNumber||null,confidence:head.lessonNumber?'high':'generated'
  };
}
function classifySource(row,id=String(row?.courseId||cid())){
  if(id==='D772'){
    const fixed=classifyD772(row);
    if(fixed)return fixed;
  }
  return classifyGeneric(row,id);
}
function annotateSource(row,id=String(row?.courseId||cid())){
  if(!row)return row;
  if(id==='D772'&&row.courseId==='D772'){
    const tagged=tagD772Generated(row);
    if(tagged.lessonIds.length)return row;
  }
  const next=classifySource(row,id);
  if(next)row.learningPath=next;
  return row;
}
async function hydrate(id=cid()){
  const sourceRows=await MajickMaterialStore.list(id);
  let changed=false;
  for(const row of sourceRows){
    let rowChanged=false;
    if(id==='D772'){
      const repaired=tagD772Generated(row);
      rowChanged=repaired.changed||!row.learningPath;
      if(!row.learningPath)annotateSource(row,id);
    }else if(!row.learningPath?.lessonId){
      annotateSource(row,id);rowChanged=true;
    }
    if(rowChanged){
      try{await MajickMaterialStore.save(row);changed=true}catch(_){}
    }
  }
  cache[id]=sourceRows;
  if(changed&&id==='D772'){
    try{await MajickMaterialStore.syncQuestions(course(id),id)}catch(e){console.warn('D772 lesson bank repair',e)}
  }
  renderPath();renderTutor();
  return {rows:sourceRows,changed};
}
function rows(id=cid()){return (cache[id]||[]).filter(r=>r.active!==false)}
function dynamicSections(id,sourceRows){
  const groups={};
  for(const row of sourceRows){
    const lp=row.learningPath||classifySource(row,id);
    if(!lp)continue;
    if(id==='D772'&&lp.sectionId===D772_SECTION_ONE.id)continue;
    const key=lp.sectionId||'additional';
    groups[key]=groups[key]||{id:key,title:lp.sectionTitle||'Additional Course Material',lessons:[]};
    let lesson=groups[key].lessons.find(x=>x.id===lp.lessonId);
    if(!lesson){
      lesson={id:lp.lessonId,title:lp.lessonTitle||row.sourceName,number:lp.lessonNumber,short:lp.lessonTitle||row.sourceName,keywords:[],goal:'Learn the concepts in this uploaded course material.',visual:['Read','Explain','Practice','Apply','Review'],thinking:['What is the main idea?','What vocabulary do I need?','How would I recognize this concept in a scenario?','What mistake am I most likely to make?'],traps:['Memorizing a definition without understanding when to use it.']};
      groups[key].lessons.push(lesson);
    }
  }
  return Object.values(groups).sort((a,b)=>a.title.localeCompare(b.title)).map(sec=>({...sec,lessons:sec.lessons.sort((a,b)=>(a.number||99)-(b.number||99)||a.title.localeCompare(b.title))}));
}
function sections(id=cid()){
  const sourceRows=rows(id);
  // D772 has one official path right now: Section 1. Uploaded material is
  // sorted into these lessons; it must never create duplicate auto-sections.
  if(id==='D772')return [JSON.parse(JSON.stringify(D772_SECTION_ONE))];
  return dynamicSections(id,sourceRows);
}
function rowHasLesson(row,lessonId,id=cid()){
  if(id==='D772'){
    if(row?.learningPath?.lessonId===lessonId)return true;
    if(row?.learningPath?.lessonIds?.includes?.(lessonId))return true;
    const buckets=['passages','vocabulary','explanations','misconceptionRepair','practiceQuestions'];
    return buckets.some(bucket=>(row?.generated?.[bucket]||[]).some(item=>itemMatchesLesson(row,item,lessonId)));
  }
  const lp=row.learningPath||classifySource(row,id);
  return lp?.lessonId===lessonId;
}
function sourcesForLesson(lesson,id=cid()){
  if(lesson.review){
    const section=sections(id).find(s=>s.lessons.some(l=>l.id===lesson.id));
    const ids=new Set((section?.lessons||[]).filter(l=>!l.review).flatMap(l=>sourcesForLesson(l,id).map(r=>r.id)));
    return rows(id).filter(r=>ids.has(r.id));
  }
  return rows(id).filter(r=>rowHasLesson(r,lesson.id,id));
}
function questionsForLesson(lesson,id=cid()){
  if(id==='D772'){
    if(lesson.review){
      const sec=sections(id).find(s=>s.lessons.some(l=>l.id===lesson.id));
      const lessonIds=new Set((sec?.lessons||[]).filter(l=>!l.review).map(l=>l.id));
      return (course(id).questionBank||[]).filter(q=>lessonIds.has(q.learningPathLessonId)||lessonIds.has(classifyD772Item(rows(id).find(r=>r.id===q.sourceId),q)));
    }
    return (course(id).questionBank||[]).filter(q=>{
      if(q.learningPathLessonId===lesson.id)return true;
      const row=rows(id).find(r=>r.id===q.sourceId);
      return row?classifyD772Item(row,q)===lesson.id:false;
    });
  }
  const srcIds=new Set(sourcesForLesson(lesson,id).map(r=>r.id));
  return (course(id).questionBank||[]).filter(q=>srcIds.has(q.sourceId));
}
function answersForQuestions(qs,id=cid()){
  const ids=new Set((qs||[]).map(q=>q.id));
  return (prog(id).answers||[]).filter(a=>ids.has(a.qid));
}
function mastery(lesson,id=cid()){
  const src=sourcesForLesson(lesson,id),qs=questionsForLesson(lesson,id),answers=answersForQuestions(qs,id);
  const byId=new Map(qs.map(q=>[q.id,q]));
  const attempts=answers.length,correct=answers.filter(a=>a.correct).length;
  const accuracy=attempts?Math.round(correct/attempts*100):0;
  const recent=answers.slice(-4),recentAccuracy=recent.length?recent.filter(a=>a.correct).length/recent.length:1;
  const rigorCorrect={1:0,2:0,3:0,4:0};
  answers.filter(a=>a.correct).forEach(a=>{
    const r=Number(byId.get(a.qid)?.rigorLevel||1);
    rigorCorrect[Math.max(1,Math.min(4,r))]++;
  });
  let targetRigor=1;
  if(attempts>=2&&accuracy>=55)targetRigor=2;
  if(attempts>=4&&accuracy>=70&&rigorCorrect[2]>=1)targetRigor=3;
  if(attempts>=6&&accuracy>=82&&rigorCorrect[3]>=2)targetRigor=4;
  if(recent.length>=3&&recentAccuracy<.5)targetRigor=Math.max(1,targetRigor-1);

  let status='Not Started';
  if(src.length){
    if(!attempts)status='Learning';
    else if(recent.length>=3&&recentAccuracy<.5)status='Needs Review';
    else if(attempts>=8&&accuracy>=85&&rigorCorrect[4]>=2)status='Mastered';
    else if(attempts>=5&&accuracy>=78&&rigorCorrect[3]>=2)status='Proficient';
    else status='Developing';
  }
  if(lesson.review&&!src.length)status='Not Started';
  return {status,attempts,correct,accuracy,targetRigor,rigorCorrect,recentAccuracy,sourceCount:src.length,questionCount:qs.length};
}
function sectionProgress(section,id=cid()){
  const lessons=section.lessons.filter(l=>!l.review);
  const rows=lessons.map(l=>mastery(l,id));
  const score=s=>s.status==='Mastered'?1:s.status==='Proficient'?.82:s.status==='Developing'?.55:s.status==='Learning'?.25:s.status==='Needs Review'?.42:0;
  const pct=rows.length?Math.round(rows.reduce((n,x)=>n+score(x),0)/rows.length*100):0;
  return {pct,ready:lessons.every(l=>mastery(l,id).sourceCount>0),lessons:rows};
}
function selectedLesson(id=cid()){
  const all=sections(id).flatMap(s=>s.lessons);
  const st=tutorState(id);
  let lesson=all.find(l=>l.id===st.selectedLesson);
  if(!lesson){
    lesson=all.find(l=>mastery(l,id).sourceCount>0)||all[0]||null;
    st.selectedLesson=lesson?.id||null;
  }
  return lesson;
}
function findSectionForLesson(lesson,id=cid()){return sections(id).find(s=>s.lessons.some(l=>l.id===lesson?.id))||null}
function lessonNumberLabel(lesson){return lesson.review?'SECTION REVIEW':lesson.number?('LESSON '+lesson.number):'LESSON'}
function lessonItems(sourceRows,bucket,lesson,id=cid()){
  const out=[];
  for(const row of sourceRows){
    for(const item of (row.generated?.[bucket]||[])){
      if(id==='D772'&&!itemMatchesLesson(row,item,lesson.id))continue;
      out.push({...item,sourceName:row.sourceName,sourceId:row.id});
    }
  }
  return out;
}
function dedupePassages(sourceRows,lesson,id=cid()){
  const out=[],seen=new Set();
  for(const p of lessonItems(sourceRows,'passages',lesson,id)){
    const key=norm(p.text);
    if(!key||seen.has(key))continue;
    seen.add(key);out.push(p);
  }
  return out;
}
function dedupeVocab(sourceRows,lesson,id=cid()){
  const out=[],byTerm=new Map();
  for(const v of lessonItems(sourceRows,'vocabulary',lesson,id)){
    const key=norm(v.term);
    if(!key)continue;
    const previous=byTerm.get(key);
    if(previous===undefined){byTerm.set(key,out.length);out.push(v);continue}
    const at=Number(previous);
    if(String(v.definition||'').length>String(out[at]?.definition||'').length)out[at]=v;
  }
  return out;
}
function teachingSentences(text){
  return String(text||'')
    .replace(/\r/g,'')
    .split(/(?<=[.!?])\s+|\n+/)
    .map(x=>x.replace(/^\s*[-*•]\s*/, '').replace(/\s+/g,' ').trim())
    .filter(x=>x.length>=22);
}
function wordSet(text){return new Set(norm(text).split(' ').filter(x=>x.length>2))}
function nearDuplicateTeaching(a,b){
  const na=norm(a),nb=norm(b);
  if(!na||!nb)return false;
  if(na===nb)return true;
  if(Math.min(na.length,nb.length)>=55&&(na.includes(nb)||nb.includes(na)))return true;
  const aa=wordSet(na),bb=wordSet(nb);
  if(!aa.size||!bb.size)return false;
  let shared=0;for(const word of aa)if(bb.has(word))shared++;
  return shared/Math.min(aa.size,bb.size)>=.82;
}
function mergeLessonTeaching(sourceRows,lesson,id=cid()){
  const raw=dedupePassages(sourceRows,lesson,id);
  if(id!=='D772'||lesson.review||!raw.length)return null;
  const sentences=[];
  for(const passage of raw){
    for(const sentence of teachingSentences(passage.text)){
      const similar=sentences.findIndex(existing=>nearDuplicateTeaching(existing,sentence));
      if(similar<0)sentences.push(sentence);
      else if(sentence.length>sentences[similar].length)sentences[similar]=sentence;
    }
  }
  const sourceNames=uniqText(raw.map(p=>p.sourceName).filter(Boolean));
  const text=sentences.slice(0,22).join(' ');
  if(!text)return null;
  return {
    id:'merged-'+lesson.id,
    title:'Complete Lesson '+lesson.number+' Teaching Notes',
    text,
    sourceName:'Merged from '+sourceNames.length+' saved source'+(sourceNames.length===1?'':'s'),
    sourceNames,
    merged:true,
    originalPassageCount:raw.length
  };
}
function chapter(lesson,id=cid()){
  const sourceRows=sourcesForLesson(lesson,id);
  const passages=dedupePassages(sourceRows,lesson,id);
  const mergedTeaching=mergeLessonTeaching(sourceRows,lesson,id);
  const vocab=dedupeVocab(sourceRows,lesson,id);
  const explanations=uniqText(lessonItems(sourceRows,'explanations',lesson,id),x=>x.explanation);
  const repairs=uniqText(lessonItems(sourceRows,'misconceptionRepair',lesson,id),x=>x.correction);
  const m=mastery(lesson,id);
  return {lesson,section:findSectionForLesson(lesson,id),sourceRows,passages,mergedTeaching,vocab,explanations,repairs,mastery:m};
}
function nextStep(m){
  if(!m.sourceCount)return 'Add this lesson’s notes to unlock its tutor chapter.';
  if(!m.attempts)return 'Read the lesson, learn the vocabulary, then start Foundation practice.';
  if(m.status==='Needs Review')return 'Return to the explanation and common traps, then rebuild at a lower rigor.';
  if(m.status==='Learning')return 'Finish the lesson reading and start guided questions.';
  if(m.status==='Developing')return 'Keep practicing. Majick will increase rigor as your accuracy becomes consistent.';
  if(m.status==='Proficient')return 'Move into analysis and OA-style scenarios to prove mastery.';
  if(m.status==='Mastered')return 'Use spaced review and Section Review to keep this lesson retrieval-ready.';
  return 'Continue the learning path.';
}
function startPractice(lesson,id=cid()){
  const qs=questionsForLesson(lesson,id);
  const topics=[...new Set(qs.map(q=>q.topicId).filter(Boolean))];
  if(!topics.length){alert('Add or regenerate lesson notes first so Majick has lesson-specific questions.');return}
  const m=mastery(lesson,id);
  try{
    window.__majickTutorTarget={courseId:id,lessonId:lesson.id,rigor:m.targetRigor,at:Date.now()};
    window.session=null;
    window.startSession('topic',{label:lesson.title+' • Rigor '+m.targetRigor,topics,limit:lesson.review?15:12});
  }catch(e){console.warn('Majick Course Tutor practice',e)}
}
function statusClass(status){return norm(status).replace(/\s+/g,'-')}
function show(name){
  document.querySelectorAll('.learnPanel').forEach(p=>p.hidden=true);
  const panel=document.querySelector('.learnPanel[data-panel="'+name+'"]');if(panel)panel.hidden=false;
  document.querySelectorAll('.learnTabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-tutor-tab="'+name+'"]')?.classList.add('active');
  document.querySelector('.learnLab')?.classList.toggle('tutorFocus',name==='path'||name==='tutor');
  if(name==='path')renderPath();
  if(name==='tutor')renderTutor();
}
function renderPath(){
  const box=document.getElementById('courseTutorPath');if(!box)return;
  const id=cid(),secs=sections(id);
  const active=selectedLesson(id);
  const pathHero=id==='D772'
    ? '<div class="tutorHero tutorHeroCompact"><div><span>D772 • SECTION 1 COURSE PATH</span><h3>Four lessons. One Section 1 review.</h3><p>Choose the lesson you need. Your uploaded notes stay intact and are sorted into the correct lesson below.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>'
    : '<div class="tutorHero"><div><span>MAJICK COURSE TUTOR • '+E(id)+'</span><h3>Learn the course in order. Prove each lesson at higher rigor.</h3><p>Your uploaded notes automatically fill this path. Repeated material is deduplicated in the tutor chapter and the active question bank.</p></div><button class="btn primary" id="continueTutor">'+(active?'Continue '+E(active.short||active.title):'Open Tutor')+' →</button></div>';
  box.innerHTML=pathHero+
    secs.map(sec=>{
      const sp=sectionProgress(sec,id);
      return '<section class="pathSection"><div class="pathSectionHead"><div><span>LEARNING PATH</span><h3>'+E(sec.title)+'</h3></div><div class="pathProgress"><b>'+sp.pct+'%</b><small>'+ (sp.ready?'section material loaded':'add lesson notes as you go')+'</small></div></div><div class="pathRail">'+sec.lessons.map((lesson,i)=>{
        const m=mastery(lesson,id);
        const available=m.sourceCount>0||(lesson.review&&sp.ready);
        return '<button class="pathLesson '+statusClass(m.status)+' '+(lesson.id===active?.id?'selected':'')+'" data-tutor-lesson="'+E(lesson.id)+'"><i>'+(lesson.review?'✓':lesson.number||i+1)+'</i><div><small>'+E(lessonNumberLabel(lesson))+'</small><b>'+E(lesson.title)+'</b><span>'+E(m.status)+' • '+m.sourceCount+' source'+(m.sourceCount===1?'':'s')+' • '+m.attempts+' attempts</span></div><em>'+(available?'Open →':'Waiting for notes')+'</em></button>';
      }).join('')+'</div></section>';
    }).join('');
  document.getElementById('continueTutor')?.addEventListener('click',()=>show('tutor'));
  box.querySelectorAll('[data-tutor-lesson]').forEach(btn=>btn.addEventListener('click',()=>{
    tutorState(id).selectedLesson=btn.dataset.tutorLesson;try{save()}catch(_){}
    show('tutor');
  }));
}
function visualHtml(lesson){
  const v=lesson.visual||['Learn','Practice','Apply','Review'];
  return '<div class="tutorVisual">'+v.map((x,i)=>'<div><span>'+E(x)+'</span></div>'+(i<v.length-1?'<b>→</b>':'')).join('')+'</div>';
}
function renderTutor(){
  const box=document.getElementById('courseTutorLesson');if(!box)return;
  const id=cid(),lesson=selectedLesson(id);
  if(!lesson){box.innerHTML='<div class="learnEmpty">Add course material to begin your tutor path.</div>';return}
  const ch=chapter(lesson,id),m=ch.mastery;
  const sourceNames=uniqText(ch.sourceRows.map(r=>r.sourceName));
  const deep=ch.mergedTeaching?[ch.mergedTeaching]:ch.passages.slice(0,5);
  const sourceEvidence=deep.length?deep.map((p,i)=>'<article class="'+(p.merged?'tutorMergedTeaching':'')+'"><small>'+(p.merged?'MERGED LESSON CHAPTER • '+p.originalPassageCount+' NOTE PASSAGES REVIEWED':'READING '+(i+1)+' • '+E(p.sourceName))+'</small><h4>'+E(p.title)+'</h4><p>'+E(p.text)+'</p>'+(p.merged?'<span class="tutorMergeNote">Repeated and overlapping material was combined here. Your original uploads were not rewritten.</span>':'')+'</article>').join(''):
    '<div class="tutorLocked">Upload notes for this lesson and Majick will build its teaching chapter here.</div>';
  box.innerHTML='<div class="tutorLessonHead"><div><button class="tutorBack" id="tutorBack">← Course Path</button><span>'+E(ch.section?.title||id)+' • '+E(lessonNumberLabel(lesson))+'</span><h2>'+E(lesson.title)+'</h2><p>'+E(lesson.goal||'Learn and apply this lesson.')+'</p></div><div class="masteryBadge '+statusClass(m.status)+'"><small>MASTERY</small><b>'+E(m.status)+'</b><span>'+m.accuracy+'% • target rigor '+m.targetRigor+'</span></div></div>'+
    '<div class="tutorNext"><b>What Majick wants you to do next:</b> '+E(nextStep(m))+'</div>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>1</span><div><small>TEACH ME</small><h3>Build the idea before memorizing it</h3></div></div>'+sourceEvidence+'</section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>2</span><div><small>SEE IT</small><h3>A visual thinking path</h3></div></div>'+visualHtml(lesson)+'</section>'+
    '<div class="tutorTwoCol"><section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>3</span><div><small>VOCABULARY IN CONTEXT</small><h3>Words you need to recognize</h3></div></div>'+(ch.vocab.length?'<div class="tutorVocab">'+ch.vocab.slice(0,14).map(v=>'<details><summary>'+E(v.term)+'</summary><p>'+E(v.definition)+'</p></details>').join('')+'</div>':'<p class="tutorMuted">Vocabulary will populate from this lesson’s notes.</p>')+'</section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>4</span><div><small>HOW TO THINK THROUGH IT</small><h3>Use this when a question feels confusing</h3></div></div><ol class="thinkingSteps">'+(lesson.thinking||[]).map(x=>'<li>'+E(x)+'</li>').join('')+'</ol></section></div>'+
    '<div class="tutorTwoCol"><section class="tutorChapterBlock trapBlock"><div class="tutorBlockTitle"><span>5</span><div><small>COMMON TRAPS</small><h3>What Majick should catch you doing</h3></div></div><ul>'+[...(lesson.traps||[]),...ch.repairs.slice(0,3).map(r=>r.correction)].slice(0,6).map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></section>'+
    '<section class="tutorChapterBlock"><div class="tutorBlockTitle"><span>6</span><div><small>PROVE IT</small><h3>Adaptive lesson practice</h3></div></div><div class="proveStats"><span><b>'+m.questionCount+'</b> lesson questions</span><span><b>'+m.attempts+'</b> attempts</span><span><b>'+m.accuracy+'%</b> accuracy</span><span><b>R'+m.targetRigor+'</b> next rigor</span></div><button class="btn primary" id="tutorPractice" '+(m.questionCount?'':'disabled')+'>'+ (m.status==='Needs Review'?'Repair this lesson':'Start adaptive lesson practice')+' →</button></section></div>'+
    '<section class="tutorSources"><div><b>Source coverage</b><span>'+E(sourceNames.length?sourceNames.join(' • '):'No lesson source uploaded yet')+'</span></div><button class="tutorManageSources" id="tutorManageSources" type="button">Manage or delete source notes →</button></section>';
  document.getElementById('tutorBack')?.addEventListener('click',()=>show('path'));
  document.getElementById('tutorPractice')?.addEventListener('click',()=>startPractice(lesson,id));
  document.getElementById('tutorManageSources')?.addEventListener('click',()=>{try{navigate('addmaterial')}catch(_){}});
}
const baseRender=MajickLearningLab.render;
MajickLearningLab.render=function(){
  let h=baseRender();
  h=h.replace('<nav class="learnTabs" aria-label="Learning Lab">','<nav class="learnTabs" aria-label="Learning Lab"><button type="button" data-tutor-tab="path">Course Path</button><button type="button" data-tutor-tab="tutor">Course Tutor</button>');
  h=h.replace('<div class="learnPanels">','<div class="learnPanels"><section class="learnPanel" data-panel="path"><div id="courseTutorPath"></div></section><section class="learnPanel" data-panel="tutor" hidden><div id="courseTutorLesson"></div></section>');
  return h;
};
const baseBind=MajickLearningLab.bind;
MajickLearningLab.bind=function(){
  baseBind();
  document.querySelectorAll('[data-tutor-tab]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(b.dataset.tutorTab)}));
  setTimeout(()=>hydrate().then(()=>show('path')),30);
};
const baseRefresh=MajickLearningLab.refresh;
MajickLearningLab.refresh=function(){baseRefresh();hydrate()};
window.MajickCourseTutor={VERSION,D772_SECTION_ONE,hydrate,sections,classifySource,annotateSource,tagD772Generated,classifyD772Item,d772Segments,sourcesForLesson,questionsForLesson,mastery,sectionProgress,chapter,mergeLessonTeaching,startPractice,show,renderPath,renderTutor,selectedLesson};
})();
