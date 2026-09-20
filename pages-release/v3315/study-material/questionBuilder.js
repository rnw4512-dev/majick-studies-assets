(function(){
'use strict';

function sentenceList(text){
  return String(text||'')
    .replace(/\s+/g,' ')
    .split(/(?<=[.!?])\s+/)
    .map(s=>s.trim())
    .filter(s=>s.length>=45&&s.length<=420);
}
function keyWords(text){
  const stop=new Set('the a an and or but if then than to of in on for from with by as at is are was were be been being this that these those it its their there can may might will would should could about into through during using use used which when where how why what who'.split(' '));
  const counts={};
  const found=String(text||'').toLowerCase().match(/[a-z][a-z-]{3,}/g)||[];
  found.forEach(w=>{if(!stop.has(w))counts[w]=(counts[w]||0)+1;});
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
}
function cap(s){return s?String(s).charAt(0).toUpperCase()+String(s).slice(1):''}
function escapeRx(s){return String(s).replace(/[.*+?^$()|[\]\\]/g,'\\$&')}

function vocabulary(text,limit){
  const out=[],seen=new Set();
  const patterns=[
    /\b([A-Z][A-Za-z -]{2,40})\s+(?:is|means|refers to)\s+([^.!?]{12,180})/g,
    /\b([A-Za-z][A-Za-z -]{2,35})\s*:\s*([^\n.!?]{12,180})/g
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
  if(out.length<limit){
    const top=keyWords(text).slice(0,limit*3);
    for(const term of top){
      if(out.length>=limit||seen.has(term))continue;
      const s=sentenceList(text).find(x=>x.toLowerCase().includes(term));
      if(!s)continue;
      seen.add(term);
      out.push({term:cap(term),definition:s,sourceExcerpt:s});
    }
  }
  return out;
}

function questions(text,count,sourceId){
  const ss=sentenceList(text);
  const terms=keyWords(text).slice(0,40);
  const out=[];
  for(let i=0;i<ss.length&&out.length<count;i++){
    const s=ss[(i*3)%ss.length];
    const candidates=terms.filter(t=>s.toLowerCase().includes(t)).sort((a,b)=>b.length-a.length);
    const answer=candidates[0];
    if(!answer)continue;
    const distractors=terms.filter(t=>t!==answer&&!s.toLowerCase().includes(t)).slice(i%8,(i%8)+3);
    ['evidence','variable','context'].forEach(x=>{if(distractors.length<3&&!distractors.includes(x))distractors.push(x);});
    const blank=s.replace(new RegExp('\\b'+escapeRx(answer)+'\\b','i'),'_____');
    const choices=[cap(answer),...distractors.slice(0,3).map(cap)];
    choices.sort((a,b)=>((a.length+i*5)%13)-((b.length+i*5)%13));
    out.push({
      id:'notes_'+sourceId+'_'+out.length,
      topicId:'uploaded-notes',
      type:'mcq',
      prompt:'Based on your study material, which term best completes this statement?\n'+blank,
      options:choices,
      answer:cap(answer),
      why:'Your source says: '+s,
      sourceId,
      sourceExcerpt:s,
      difficulty:out.length<Math.ceil(count/3)?'foundation':out.length<Math.ceil(count*2/3)?'application':'challenge'
    });
  }
  return out;
}

function build(text,opts){
  opts=opts||{};
  const ss=sentenceList(text);
  const sourceId=opts.sourceId||('temp_'+Date.now());
  const count=Math.min(25,Math.max(5,Number(opts.count||10)));
  const vocab=opts.vocabulary===false?[]:vocabulary(text,Math.min(12,Math.max(5,count)));
  const practice=opts.practiceQuestions===false?[]:questions(text,count,sourceId);
  const key=ss.slice(0,8);
  const explanations=opts.explanations===false?[]:key.slice(0,6).map((s,i)=>({
    concept:(vocab[i]&&vocab[i].term)||('Key Idea '+(i+1)),
    explanation:s,
    sourceExcerpt:s
  }));
  const misconceptionRepair=opts.misconceptionRepair===false?[]:key.slice(0,5).map((s,i)=>({
    prompt:'Misconception check '+(i+1),
    incorrectIdea:'A learner may overgeneralize, reverse, or confuse this idea with a related concept.',
    correction:s,
    sourceExcerpt:s
  }));
  const review=opts.review===false?null:{
    summary:key.slice(0,4).join(' '),
    keyPoints:key.slice(0,7),
    quickRecall:vocab.slice(0,6).map(v=>'Explain '+v.term+' in your own words.')
  };
  return {practiceQuestions:practice,explanations,vocabulary:vocab,misconceptionRepair,review};
}

window.MajickQuestionBuilder={build};
})();