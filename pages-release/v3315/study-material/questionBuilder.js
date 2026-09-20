(function(){
'use strict';

const TARGET=100;
function sentenceList(text){
  return String(text||'')
    .replace(/\r/g,' ')
    .replace(/\s+/g,' ')
    .split(/(?<=[.!?])\s+/)
    .map(s=>s.trim())
    .filter(s=>s.length>=32&&s.length<=520);
}
function keyWords(text){
  const stop=new Set('the a an and or but if then than to of in on for from with by as at is are was were be been being this that these those it its their there can may might will would should could about into through during using use used which when where how why what who have has had also more most some any each other such not only very'.split(' '));
  const counts={};
  const found=String(text||'').toLowerCase().match(/[a-z][a-z-]{3,}/g)||[];
  found.forEach(w=>{if(!stop.has(w))counts[w]=(counts[w]||0)+1;});
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]||b[0].length-a[0].length).map(x=>x[0]);
}
function cap(s){return s?String(s).charAt(0).toUpperCase()+String(s).slice(1):''}
function escapeRx(s){return String(s).replace(/[.*+?^$()|[\]\\]/g,'\\$&')}
function hash(s){
  let h=2166136261;
  for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return (h>>>0).toString(36);
}
function slug(s){return String(s||'concept').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,38)||'concept'}
function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function deterministic(items,seed){
  return [...items].sort((a,b)=>hash(seed+'|'+String(a)).localeCompare(hash(seed+'|'+String(b))));
}
function vocabulary(text,limit=28){
  const out=[],seen=new Set();
  const patterns=[
    /\b([A-Z][A-Za-z -]{2,48})\s+(?:is|means|refers to|describes)\s+([^.!?]{12,220})/g,
    /\b([A-Za-z][A-Za-z -]{2,42})\s*:\s*([^\n.!?]{12,220})/g
  ];
  for(const rx of patterns){
    let m;
    while((m=rx.exec(text))&&out.length<limit){
      const term=m[1].trim(),key=term.toLowerCase();
      if(seen.has(key))continue;
      seen.add(key);
      out.push({term,definition:m[2].trim(),sourceExcerpt:m[0].trim()});
    }
  }
  const ss=sentenceList(text);
  for(const term of keyWords(text).slice(0,limit*5)){
    if(out.length>=limit||seen.has(term))continue;
    const s=ss.find(x=>new RegExp('\\b'+escapeRx(term)+'\\b','i').test(x));
    if(!s)continue;
    seen.add(term);
    out.push({term:cap(term),definition:s,sourceExcerpt:s});
  }
  return out;
}
function passages(text,sourceId){
  const ss=sentenceList(text);
  const terms=keyWords(text).slice(0,80);
  const size=ss.length<=8?3:ss.length<=20?4:5;
  const out=[];
  for(let i=0;i<ss.length;i+=size){
    const chunk=ss.slice(i,i+size);
    if(!chunk.length)continue;
    const found=terms.filter(t=>chunk.some(s=>new RegExp('\\b'+escapeRx(t)+'\\b','i').test(s))).slice(0,7);
    const title=found.length?found.slice(0,2).map(cap).join(' & '):'Course Reading '+(out.length+1);
    const textBlock=chunk.join(' ');
    out.push({
      id:'passage_'+sourceId+'_'+hash(textBlock),
      title,
      text:textBlock,
      keyTerms:found.map(cap),
      keyIdea:chunk[0],
      takeaways:chunk.slice(0,3),
      sourceId,
      sentenceStart:i,
      sentenceEnd:i+chunk.length-1
    });
  }
  return out.slice(0,18);
}
function distractorTerms(terms,answer,sentence,seed){
  const inSentence=new Set(terms.filter(t=>new RegExp('\\b'+escapeRx(t)+'\\b','i').test(sentence)));
  const pool=terms.filter(t=>t!==answer&&!inSentence.has(t));
  const out=deterministic(pool,seed).slice(0,3);
  for(const fallback of ['evidence','context','variable','pattern','sample','outcome']){
    if(out.length<3&&fallback!==answer&&!inSentence.has(fallback)&&!out.includes(fallback))out.push(fallback);
  }
  return out;
}
function distractorSentences(ss,correct,term,seed){
  const pool=ss.filter(s=>s!==correct&&!new RegExp('\\b'+escapeRx(term)+'\\b','i').test(s));
  return deterministic(pool,seed).slice(0,3);
}
function makeQ({sourceId,term,sentence,ss,terms,rigor,kind,passageId,seed}){
  const topicId='notes-'+slug(term);
  let prompt='',answer='',options=[],why='';
  const dt=distractorTerms(terms,term,sentence,seed);
  const ds=distractorSentences(ss,sentence,term,seed);
  if(kind==='cloze'){
    const blank=sentence.replace(new RegExp('\\b'+escapeRx(term)+'\\b','i'),'_____');
    if(blank===sentence||dt.length<3)return null;
    prompt='Which course term best completes this statement?\n'+blank;
    answer=cap(term); options=[answer,...dt.map(cap)];
    why='The source directly uses '+cap(term)+' in this idea: '+sentence;
  }else if(kind==='concept'){
    if(dt.length<3)return null;
    const context=sentence.replace(new RegExp('\\b'+escapeRx(term)+'\\b','ig'),'this concept');
    prompt='Which concept from your notes is most directly connected to this description?\n'+context;
    answer=cap(term); options=[answer,...dt.map(cap)];
    why=cap(term)+' is the concept linked to this description in your source: '+sentence;
  }else if(kind==='evidence'){
    if(ds.length<3)return null;
    prompt='Which statement from your course material is the strongest evidence for the concept '+cap(term)+'?';
    answer=sentence; options=[answer,...ds];
    why='This statement explicitly connects to '+cap(term)+'.';
  }else if(kind==='pair'){
    if(dt.length<3||ds.length<3)return null;
    prompt='Which concept-and-evidence pairing is correctly matched according to your notes?';
    answer=cap(term)+' — '+sentence;
    options=[answer,cap(dt[0])+' — '+ds[0],cap(dt[1])+' — '+ds[1],cap(dt[2])+' — '+ds[2]];
    why='The correct pairing keeps the concept with the statement in which your source actually explains or uses it.';
  }else return null;
  options=deterministic(options,sourceId+'|'+seed+'|'+kind);
  const difficulty=rigor<=1?'foundation':rigor===2?'understanding':rigor===3?'application':'challenge';
  const qid='notes_'+sourceId+'_'+hash(prompt+'|'+answer);
  return {
    id:qid,topicId,type:'mcq',prompt,options,answer,why,
    sourceId,sourceExcerpt:sentence,passageId,
    difficulty,rigorLevel:rigor,
    bloom:rigor===1?'remember':rigor===2?'understand':rigor===3?'apply':'analyze',
    oaStyle:rigor>=3,
    adaptive:true
  };
}
function questions(text,count,sourceId,passageRows){
  const ss=sentenceList(text);
  const terms=keyWords(text).slice(0,90);
  const pairs=[];
  ss.forEach((sentence,sentenceIndex)=>{
    let candidates=terms.filter(term=>new RegExp('\\b'+escapeRx(term)+'\\b','i').test(sentence)).slice(0,7);
    if(!candidates.length){
      const words=keyWords(sentence).slice(0,2);
      candidates=words.filter(Boolean);
    }
    candidates.forEach((term,termIndex)=>pairs.push({sentence,sentenceIndex,term,termIndex}));
  });
  const all=[],seen=new Set();
  const kinds=[
    {kind:'cloze',rigor:1},
    {kind:'concept',rigor:2},
    {kind:'evidence',rigor:3},
    {kind:'pair',rigor:4}
  ];
  for(const pair of pairs){
    const passage=(passageRows||[]).find(p=>pair.sentenceIndex>=p.sentenceStart&&pair.sentenceIndex<=p.sentenceEnd);
    for(const spec of kinds){
      const q=makeQ({
        sourceId,term:pair.term,sentence:pair.sentence,ss,terms,
        rigor:spec.rigor,kind:spec.kind,passageId:passage?.id||null,
        seed:pair.sentenceIndex+'|'+pair.termIndex
      });
      if(!q)continue;
      const sig=norm(q.prompt)+'|'+norm(q.answer);
      if(seen.has(sig))continue;
      seen.add(sig);all.push(q);
    }
  }
  const target=Math.min(120,Math.max(20,Number(count||TARGET)));
  const quotas={1:Math.round(target*.20),2:Math.round(target*.30),3:Math.round(target*.30),4:Math.round(target*.20)};
  const chosen=[];
  for(const rigor of [1,2,3,4]){
    const bucket=all.filter(q=>q.rigorLevel===rigor);
    chosen.push(...bucket.slice(0,quotas[rigor]));
  }
  if(chosen.length<target){
    const ids=new Set(chosen.map(q=>q.id));
    chosen.push(...all.filter(q=>!ids.has(q.id)).slice(0,target-chosen.length));
  }
  return chosen.slice(0,target);
}
function build(text,opts){
  opts=opts||{};
  const ss=sentenceList(text);
  const sourceId=opts.sourceId||('temp_'+Date.now());
  const count=Math.min(120,Math.max(20,Number(opts.count||opts.targetCount||TARGET)));
  const vocab=opts.vocabulary===false?[]:vocabulary(text,30);
  const passageRows=passages(text,sourceId);
  const practice=opts.practiceQuestions===false?[]:questions(text,count,sourceId,passageRows);
  const key=ss.slice(0,14);
  const explanations=opts.explanations===false?[]:key.slice(0,10).map((s,i)=>({
    concept:(vocab[i]&&vocab[i].term)||('Key Idea '+(i+1)),
    explanation:s,sourceExcerpt:s
  }));
  const misconceptionRepair=opts.misconceptionRepair===false?[]:key.slice(0,8).map((s,i)=>({
    prompt:'Misconception check '+(i+1),
    incorrectIdea:'A learner may confuse this idea with a related concept, apply it too broadly, or reverse the relationship.',
    correction:s,sourceExcerpt:s
  }));
  const review=opts.review===false?null:{
    summary:key.slice(0,6).join(' '),
    keyPoints:key.slice(0,10),
    quickRecall:vocab.slice(0,10).map(v=>'Explain '+v.term+' in your own words.')
  };
  return {
    targetCount:count,
    practiceQuestions:practice,
    passages:passageRows,
    explanations,
    vocabulary:vocab,
    misconceptionRepair,
    review,
    rigorMix:{
      foundation:practice.filter(q=>q.rigorLevel===1).length,
      understanding:practice.filter(q=>q.rigorLevel===2).length,
      application:practice.filter(q=>q.rigorLevel===3).length,
      analysis:practice.filter(q=>q.rigorLevel===4).length
    }
  };
}

window.MajickQuestionBuilder={TARGET,build,sentenceList,keyWords,vocabulary,passages};
})();