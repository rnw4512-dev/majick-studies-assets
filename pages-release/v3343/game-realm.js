/* Majick Game Realm Overhaul — distinct mechanics, Guardian integration, readability, and variety. */
(()=>{
  'use strict';

  const VERSION='3.3.52-realm';
  const normalize=v=>String(v||'').trim().toLocaleLowerCase();
  const E=v=>{try{return esc(String(v??''))}catch(_){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}};
  const shuffleCopy=a=>{
    const out=[...(a||[])];
    for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
    return out;
  };
  const percent=(n,d)=>Math.round((Number(n||0)/Math.max(1,Number(d||0)))*100);

  function guardian(){
    try{
      const p=globalThis.MajickGuardianCore?.activePet?.()||globalThis.activePet?.();
      const m=globalThis.MajickGuardianCore?.meta?.(p)||null;
      if(m)return m;
      return p?{name:p.name||'Guardian',type:p.type,icon:'✦',image:'',role:'Study Guardian',personality:'ready to help',accent:'#b79ad9',hue:0}:null;
    }catch(_){return null}
  }
  function guardianReact(kind,meta={}){
    try{globalThis.MajickGuardianCore?.react?.(kind,{realm:true,...meta})}catch(_){}
  }
  function recordRealm(id,score,total,won=false){
    try{
      const p=prog();p.realmRecords=p.realmRecords||{};
      const row=p.realmRecords[id]||{plays:0,best:0,wins:0,last:0};
      row.plays=Number(row.plays||0)+1;
      row.last=total?score/total:0;
      row.best=Math.max(Number(row.best||0),row.last);
      if(won)row.wins=Number(row.wins||0)+1;
      row.at=Date.now();
      p.realmRecords[id]=row;
      save?.();
    }catch(_){}
  }
  function addReward(label,xp=0,cr=0){
    try{
      const p=prog();
      p.xp=Number(p.xp||0)+Number(xp||0);
      p.crystals=Number(p.crystals||0)+Number(cr||0);
      save?.();
      if(typeof rewardToast==='function')rewardToast('✨ '+xp+' XP'+(cr?' • 💎 '+cr:''),label);
    }catch(_){}
  }
  function recordAnswer(q,chosen,correct,mode){
    try{record?.(q,chosen,correct,'sure',mode)}catch(_){}
    if(correct){
      try{grantMoonlight?.(q)}catch(_){}
      try{sparkle?.(true);playChime?.(true)}catch(_){}
      guardianReact('correct',{mode,qid:q?.id});
    }else{
      try{playChime?.(false)}catch(_){}
    }
  }

  /* Question-repeat protection. */
  const originalPick=pickAdaptive;
  pickAdaptive=function(pool=questionPool()){
    if(!Array.isArray(pool)||!pool.length)return originalPick(pool);
    const played=new Set((session?.questions||[]).map(q=>typeof q==='string'?q:q?.id));
    const fresh=pool.filter(q=>!played.has(q.id));
    if(fresh.length)pool=fresh;
    const recent=new Set((prog().answers||[]).slice(-20).map(a=>a.qid));
    const lessRecent=pool.filter(q=>!recent.has(q.id));
    return originalPick(lessRecent.length?lessRecent:pool);
  };

  /* Moon Crystal Words readability + correct crossing-off behavior. */
  const originalMoonwordPick=moonwordPick;
  moonwordPick=function(i,value){
    if(!session||session.type!=='moonword'||!session.items?.[i])return;
    return originalMoonwordPick(i,value);
  };
  moonwordHTML=function(){
    if(session?.finished)return resultHTML();
    const items=session?.items||[];
    const words=[...new Map(items.map(x=>[normalize(x.term),x.term])).values()];
    const required=new Map(),used=new Map();
    items.forEach(x=>{
      const key=normalize(x.term);required.set(key,(required.get(key)||0)+1);
      if(x.ok&&normalize(x.choice)===key)used.set(key,(used.get(key)||0)+1);
    });
    const bank=words.map(w=>{
      const key=normalize(w),done=used.get(key)||0,total=required.get(key)||1;
      return '<li class="realmWord '+(done>=total?'used':'')+'"><span>'+E(w)+'</span><small>'+(done>=total?'Used':total>1?(done+'/'+total+' used'):'Available')+'</small></li>';
    }).join('');
    const clues=items.map((x,i)=>{
      const options=words.map(w=>'<option value="'+E(w)+'" '+(x.choice===w?'selected':'')+'>'+E(w)+'</option>').join('');
      return '<div class="realmClue"><label for="realmClue'+i+'"><b>'+(i+1)+'. '+E(x.def)+'</b></label><select id="realmClue'+i+'" onchange="moonwordPick('+i+',this.value)"><option value="">Choose a word...</option>'+options+'</select>'+(x.choice?'<div class="'+(x.ok?'strong':'weak')+'">'+(x.ok?'✓ Correct':'Try again')+'</div>':'')+'</div>';
    }).join('');
    return '<div class="qwrap realmMoonword"><div class="qtop"><span class="qbadge">🧩 Moon Crystal Words</span><b>'+items.filter(x=>x.ok).length+'/'+items.length+'</b></div><div class="card"><p>Match each clue. A word is crossed off when all its clues are correct.</p><h3>Word bank</h3><ul class="realmWordBank" aria-label="Available crossword words">'+bank+'</ul>'+clues+'<button class="btn violet" style="margin-top:12px" onclick="finishMoonword()">Finish</button></div></div>';
  };

  function guardianBanner(message){
    const g=guardian();if(!g)return '';
    return '<aside class="realmGuardianBanner" style="--guardian-accent:'+E(g.accent||'#b79ad9')+'">'+
      (g.image?'<img src="'+E(g.image)+'" alt="'+E(g.name)+'" style="filter:hue-rotate('+Number(g.hue||0)+'deg)">':'<span>'+E(g.icon||'✦')+'</span>')+
      '<div><small>YOUR REALM PARTNER</small><b>'+E(g.name)+'</b><em>'+E(g.role||g.species||'Study Guardian')+'</em><p>'+E(message||g.personality||'Ready for the next trial.')+'</p></div></aside>';
  }
  function bestText(id){
    try{
      const r=prog().realmRecords?.[id];
      return r?.plays?Math.round(Number(r.best||0)*100)+'% best':'New';
    }catch(_){return 'New'}
  }
  function gameCard(icon,title,desc,action,tag='NEW TRIAL'){
    return '<button type="button" class="realmTrialCard" onclick="'+action+'"><span class="realmTrialIcon">'+icon+'</span><small>'+E(tag)+'</small><h3>'+E(title)+'</h3><p>'+E(desc)+'</p><b>Enter trial →</b></button>';
  }

  /* New Game Realm hub, while preserving every classic game. */
  const baseGamesHTML=typeof gamesHTML==='function'?gamesHTML:null;
  if(baseGamesHTML){
    gamesHTML=function(){
      const g=guardian();
      return '<div class="realmHub">'+
        '<section class="realmHero"><div><small>THE MAJICK GAME REALM</small><h2>Train the skill, not just the answer.</h2><p>Featured trials now use different mechanics. Your active Guardian joins the run, and question repetition is suppressed until the pool needs to recycle.</p></div>'+
        (g?'<div class="realmHeroGuardian" style="--guardian-accent:'+E(g.accent||'#b79ad9')+'">'+(g.image?'<img src="'+E(g.image)+'" alt="'+E(g.name)+'" style="filter:hue-rotate('+Number(g.hue||0)+'deg)">':'<span>'+E(g.icon||'✦')+'</span>')+'<div><small>ENTERING WITH</small><b>'+E(g.name)+'</b><em>'+E(g.personality||g.role||'Study Guardian')+'</em></div></div>':'')+
        '</section>'+
        '<div class="realmStats"><span>ᚱ '+E(bestText('runesort'))+' Rune Sort</span><span>◉ '+E(bestText('oraclelens'))+' Oracle Lens</span><span>♛ '+E(bestText('gauntlet'))+' Gauntlet</span><span>✧ '+E(bestText('constellation'))+' Constellation</span><span>⬡ '+E(bestText('hexbreaker'))+' Hex Breaker</span></div>'+
        '<div class="realmFeaturedGrid">'+
          gameCard('ᚱ','Rune Sort','Sort real course prompts into the correct sections. Pattern recognition without another answer-card loop.','startRuneSort()')+
          gameCard('◉','Oracle Lens','Identify the controlling clue first, then answer through that clue.','startOracleLens()')+
          gameCard('♛','Guardian Gauntlet','A multi-round boss run with hearts, boss HP, combos, and one Guardian shield.','startGuardianGauntlet()')+
          gameCard('✧','Memory Constellation','Match controlling clues to the correct answers and build a glowing constellation.','startMemoryConstellation()')+
          gameCard('⬡','Hex Breaker','Judge a claim, expose the misconception, and repair it with the correct concept.','startHexBreaker()')+
        '</div>'+
        '<details class="realmClassic"><summary><span>Classic Trials</span><small>All previous Game Realm modes are still available</small></summary><div class="realmClassicBody">'+baseGamesHTML()+'</div></details>'+
      '</div>';
    };
  }

  /* ---------- Rune Sort ---------- */
  function buildRuneSort(){
    const pool=(typeof questionPool==='function'?questionPool():[]).filter(q=>q?.prompt&&q?.section);
    const groups=new Map();
    pool.forEach(q=>{
      const key=String(q.section||'').trim();if(!key)return;
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(q);
    });
    const categories=shuffleCopy([...groups.entries()].filter(([,rows])=>rows.length>=2)).slice(0,4).map(([name])=>name);
    if(categories.length<2)return null;
    const items=[];
    categories.forEach(cat=>shuffleCopy(groups.get(cat)).slice(0,2).forEach(q=>items.push({id:q.id,prompt:q.prompt,section:cat,choice:null,ok:null,rewarded:false})));
    return {categories,items:shuffleCopy(items).slice(0,8)};
  }
  globalThis.startRuneSort=function(){
    const built=buildRuneSort();
    if(!built){try{alert('Rune Sort needs at least two course sections with enough questions. Try another Realm for this course.')}catch(_){}return}
    session={type:'runesort',opts:{label:'Rune Sort'},categories:built.categories,items:built.items,score:0,finished:false};
    if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.runeSortPick=function(i,cat){
    if(!session||session.type!=='runesort'||session.finished)return;
    const x=session.items?.[i];if(!x)return;
    x.choice=cat;x.ok=normalize(cat)===normalize(x.section);
    if(x.ok&&!x.rewarded){x.rewarded=true;session.score++;guardianReact('correct',{mode:'runesort',qid:x.id})}
    render?.();
  };
  globalThis.finishRuneSort=function(){
    if(!session||session.type!=='runesort')return;
    session.finished=true;
    const total=session.items.length,score=session.items.filter(x=>x.ok).length;
    session.score=score;recordRealm('runesort',score,total,score===total);
    if(score>=Math.ceil(total*.75)){addReward('Rune Sort cleared',12,1);guardianReact('concept',{mode:'runesort'})}
    render?.();
  };
  function runeSortHTML(){
    if(session.finished)return realmResultHTML('Rune Sort','runesort',session.score,session.items.length,session.score===session.items.length,'You sorted '+session.score+' of '+session.items.length+' runes correctly.');
    const done=session.items.filter(x=>x.ok).length;
    return '<div class="qwrap realmMode realmRuneSort">'+
      '<div class="realmWorldTag"><small>LOCATION</small><b>Runestone Atrium</b><span>Ancient sorting runes drift through a moonlit collegiate hall.</span></div>'+
      guardianBanner('Sort the runes. I will react when the pattern clicks.')+
      '<div class="qtop"><span class="qbadge">ᚱ Rune Sort</span><b>'+done+'/'+session.items.length+' locked</b></div>'+
      '<div class="card"><p>Choose the section each prompt belongs to. Correct runes lock into place.</p>'+
      '<div class="realmSortBoard">'+session.items.map((x,i)=>'<article class="realmSortRune '+(x.ok?'locked':x.choice?'miss':'')+'"><b>'+E(x.prompt)+'</b><div class="realmSortChoices">'+session.categories.map(cat=>'<button '+(x.ok?'disabled':'')+' onclick="runeSortPick('+i+','+JSON.stringify(cat)+')">'+E(cat)+'</button>').join('')+'</div>'+(x.choice?'<small class="'+(x.ok?'strong':'weak')+'">'+(x.ok?'✓ Rune locked':'Not this section — try again')+'</small>':'')+'</article>').join('')+'</div>'+
      '<button class="btn violet" onclick="finishRuneSort()">Finish Rune Sort</button></div></div>';
  }

  /* ---------- Oracle Lens ---------- */
  function nextOracle(){
    const pool=(typeof questionPool==='function'?questionPool():[]).filter(q=>q?.prompt&&q?.options?.length>=2);
    const q=pickAdaptive(pool);if(!q)return false;
    const otherClues=shuffleCopy(pool.filter(x=>x.id!==q.id&&x.keyClue).map(x=>x.keyClue)).slice(0,2);
    const correctClue=q.keyClue||q.distractorCoach||('Focus on the exact task in: '+q.prompt);
    const lenses=shuffleCopy([correctClue,...otherClues]).slice(0,3);
    while(lenses.length<3)lenses.push('A related detail that does not control the answer.');
    session.current=q;session.correctLens=correctClue;session.lenses=lenses;session.lensChoice=null;session.lensCorrect=false;session.chosen=null;session.answered=false;session.round++;
    return true;
  }
  globalThis.startOracleLens=function(){
    session={type:'oraclelens',opts:{label:'Oracle Lens'},round:0,limit:8,score:0,clarity:0,finished:false,questions:[]};
    nextOracle();if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.oracleChooseLens=function(value){
    if(!session||session.type!=='oraclelens'||session.answered)return;
    session.lensChoice=value;session.lensCorrect=normalize(value)===normalize(session.correctLens);
    if(session.lensCorrect)session.clarity++;
    render?.();
  };
  globalThis.oracleAnswer=function(chosen){
    if(!session||session.type!=='oraclelens'||session.answered||!session.lensChoice)return;
    const q=session.current,correct=chosen===q.answer;
    session.chosen=chosen;session.answered=true;session.score+=correct?1:0;session.questions.push(q.id);
    recordAnswer(q,chosen,correct,'oraclelens');
    render?.();
  };
  globalThis.oracleNext=function(){
    if(!session||session.type!=='oraclelens')return;
    if(session.round>=session.limit){
      session.finished=true;
      recordRealm('oraclelens',session.score,session.limit,session.score===session.limit);
      if(session.score>=6){addReward('Oracle Lens cleared',15,1);guardianReact('concept',{mode:'oraclelens'})}
    }else nextOracle();
    render?.();
  };
  function oracleHTML(){
    if(session.finished)return realmResultHTML('Oracle Lens','oraclelens',session.score,session.limit,session.score===session.limit,'You answered '+session.score+'/'+session.limit+' correctly and found '+session.clarity+' controlling clues.');
    const q=session.current;
    return '<div class="qwrap realmMode realmOracle">'+
      '<div class="realmWorldTag"><small>LOCATION</small><b>Oracle Observatory</b><span>Celestial lenses and suspended constellations reveal the clue that matters most.</span></div>'+
      guardianBanner('Find what actually controls the answer before you commit.')+
      '<div class="qtop"><span class="qbadge">◉ Oracle Lens</span><b>Round '+session.round+'/'+session.limit+'</b></div>'+
      '<div class="card"><div class="tiny">'+E(q.section||'Mixed')+' • Difficulty '+Number(q.difficulty||1)+'</div><div class="question">'+E(q.prompt)+'</div>'+
      '<h3>1. Which clue should the Oracle focus on?</h3><div class="realmLensChoices">'+session.lenses.map(l=>'<button class="'+(session.lensChoice===l?(session.lensCorrect?'correct':'selected'):'')+'" '+(session.answered?'disabled':'')+' onclick="oracleChooseLens('+JSON.stringify(l)+')">'+E(l)+'</button>').join('')+'</div>'+
      (session.lensChoice?'<p class="'+(session.lensCorrect?'strong':'weak')+'">'+(session.lensCorrect?'✦ Lens aligned. Now answer through that clue.':'That clue is related, but another clue controls the answer more directly.')+'</p>':'')+
      '<h3>2. Choose the best answer.</h3><div class="options">'+q.options.map(o=>'<button class="opt '+(session.answered?(o===q.answer?'correct':o===session.chosen?'wrong':''):'')+'" '+(!session.lensChoice||session.answered?'disabled':'')+' onclick="oracleAnswer('+JSON.stringify(o)+')">'+E(o)+'</button>').join('')+'</div>'+
      (session.answered?'<div class="realmOracleFeedback"><b class="'+(session.chosen===q.answer?'strong':'weak')+'">'+(session.chosen===q.answer?'✓ Correct':'Not quite')+'</b><p>'+E(q.why||q.distractorCoach||'Use the controlling clue to discriminate between close options.')+'</p><button class="btn violet" onclick="oracleNext()">Next lens →</button></div>':'')+
      '</div></div>';
  }


  /* ---------- Memory Constellation ---------- */
  function buildConstellation(){
    const pool=(typeof questionPool==='function'?questionPool():[]).filter(q=>q?.prompt&&q?.answer);
    const chosen=shuffleCopy(pool).slice(0,6);
    if(chosen.length<4)return null;
    const cards=[];
    chosen.forEach((q,i)=>{
      const clue=String(q.keyClue||q.prompt||'').trim();
      cards.push({id:'c'+i+'a',pair:i,kind:'clue',text:clue,qid:q.id,matched:false});
      cards.push({id:'c'+i+'b',pair:i,kind:'answer',text:String(q.answer),qid:q.id,matched:false});
    });
    return shuffleCopy(cards);
  }
  globalThis.startMemoryConstellation=function(){
    const cards=buildConstellation();
    if(!cards){try{alert('Memory Constellation needs at least four usable course questions. Try another Realm for this course.')}catch(_){}return}
    session={type:'constellation',opts:{label:'Memory Constellation'},cards,open:[],matched:0,moves:0,finished:false,score:0};
    if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.constellationPick=function(i){
    if(!session||session.type!=='constellation'||session.finished)return;
    const card=session.cards?.[i];if(!card||card.matched||session.open.includes(i)||session.open.length>=2)return;
    session.open.push(i);
    if(session.open.length===2){
      session.moves++;
      const [a,b]=session.open.map(x=>session.cards[x]);
      if(a.pair===b.pair&&a.kind!==b.kind){
        a.matched=b.matched=true;
        session.matched++;
        session.score++;
        session.open=[];
        guardianReact('correct',{mode:'constellation',qid:a.qid});
        if(session.matched>=session.cards.length/2){
          session.finished=true;
          const total=session.cards.length/2;
          const efficiency=Math.max(1,total*2-session.moves+total);
          recordRealm('constellation',efficiency,total*2,true);
          addReward('Memory Constellation completed',16,1);
          guardianReact('concept',{mode:'constellation'});
        }
      }else{
        setTimeout(()=>{
          if(session?.type==='constellation'){session.open=[];render?.()}
        },650);
      }
    }
    render?.();
  };
  function constellationHTML(){
    const total=session.cards.length/2;
    if(session.finished)return realmResultHTML('Memory Constellation','constellation',session.matched,total,true,'You linked all '+total+' concept pairs in '+session.moves+' moves.');
    return '<div class="qwrap realmMode realmConstellation">'+
      '<div class="realmWorldTag"><small>LOCATION</small><b>Constellation Garden</b><span>Memory stars bloom across a midnight garden as each concept finds its pair.</span></div>'+
      guardianBanner('Find the clue that belongs with its answer. I will light each star when you connect them.')+
      '<div class="qtop"><span class="qbadge">✧ Memory Constellation</span><b>'+session.matched+'/'+total+' stars linked • '+session.moves+' moves</b></div>'+
      '<div class="card"><p>Turn over two cards. Match a controlling clue with its correct answer.</p>'+
      '<div class="realmConstellationGrid">'+session.cards.map((c,i)=>{
        const open=session.open.includes(i)||c.matched;
        return '<button class="realmStarCard '+(open?'open ':'')+(c.matched?'matched':'')+'" '+(c.matched?'disabled':'')+' onclick="constellationPick('+i+')" aria-label="'+E(open?c.text:'Hidden constellation card')+'">'+
          '<span class="realmStarFront">✦</span><span class="realmStarBack"><small>'+E(c.kind==='clue'?'CLUE':'ANSWER')+'</small><b>'+E(c.text)+'</b></span></button>';
      }).join('')+'</div></div></div>';
  }

  /* ---------- Hex Breaker ---------- */
  function nextHex(){
    const pool=(typeof questionPool==='function'?questionPool():[]).filter(q=>q?.prompt&&q?.options?.length>=2&&q?.answer);
    const q=pickAdaptive(pool);if(!q)return false;
    const wrongs=q.options.filter(o=>o!==q.answer);
    const makeValid=Math.random()<.35||!wrongs.length;
    const claim=makeValid?q.answer:wrongs[Math.floor(Math.random()*wrongs.length)];
    session.current=q;
    session.claim=claim;
    session.claimValid=claim===q.answer;
    session.judgment=null;
    session.repair=null;
    session.answered=false;
    session.round++;
    session.questions.push(q.id);
    return true;
  }
  globalThis.startHexBreaker=function(){
    session={type:'hexbreaker',opts:{label:'Hex Breaker'},round:0,limit:8,score:0,judgmentScore:0,repairScore:0,finished:false,questions:[]};
    nextHex();if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.hexJudge=function(value){
    if(!session||session.type!=='hexbreaker'||session.answered)return;
    session.judgment=value;
    render?.();
  };
  globalThis.hexRepair=function(value){
    if(!session||session.type!=='hexbreaker'||session.answered||session.judgment==null)return;
    const q=session.current;
    const judgedValid=session.judgment==='valid';
    const judgmentCorrect=judgedValid===session.claimValid;
    let repairCorrect=true;
    if(!session.claimValid)repairCorrect=value===q.answer;
    session.repair=value;
    session.answered=true;
    if(judgmentCorrect)session.judgmentScore++;
    if(repairCorrect)session.repairScore++;
    if(judgmentCorrect&&repairCorrect)session.score++;
    recordAnswer(q,session.claimValid?session.claim:value,judgmentCorrect&&repairCorrect,'hexbreaker');
    render?.();
  };
  globalThis.hexNext=function(){
    if(!session||session.type!=='hexbreaker')return;
    if(session.round>=session.limit){
      session.finished=true;
      recordRealm('hexbreaker',session.score,session.limit,session.score===session.limit);
      if(session.score>=6){addReward('Hex Breaker cleared',18,1);guardianReact('concept',{mode:'hexbreaker'})}
    }else nextHex();
    render?.();
  };
  function hexBreakerHTML(){
    if(session.finished)return realmResultHTML('Hex Breaker','hexbreaker',session.score,session.limit,session.score===session.limit,'You fully broke '+session.score+'/'+session.limit+' hexes. Judgment: '+session.judgmentScore+'/'+session.limit+' • Repairs: '+session.repairScore+'/'+session.limit+'.');
    const q=session.current;
    const judgementCorrect=session.judgment!=null&&((session.judgment==='valid')===session.claimValid);
    return '<div class="qwrap realmMode realmHexBreaker">'+
      '<div class="realmWorldTag"><small>LOCATION</small><b>Hexed Archive</b><span>Corrupted scrolls pulse between shadowed shelves until you expose the faulty claim.</span></div>'+
      guardianBanner('Do not trust every glowing claim. Decide whether it is sound before you repair it.')+
      '<div class="qtop"><span class="qbadge">⬡ Hex Breaker</span><b>Hex '+session.round+'/'+session.limit+'</b></div>'+
      '<div class="card"><div class="tiny">'+E(q.section||'Mixed')+' • '+E(q.prompt)+'</div>'+
      '<div class="realmHexClaim"><small>ENCHANTED CLAIM</small><blockquote>'+E(session.claim)+'</blockquote></div>'+
      '<h3>1. Is this claim valid or hexed?</h3><div class="realmHexJudge">'+
        '<button class="'+(session.judgment==='valid'?'selected':'')+'" '+(session.answered?'disabled':'')+' onclick="hexJudge(\\'valid\\')">✓ Valid</button>'+
        '<button class="'+(session.judgment==='hexed'?'selected':'')+'" '+(session.answered?'disabled':'')+' onclick="hexJudge(\\'hexed\\')">⬡ Hexed</button></div>'+
      (session.judgment!=null?'<p class="'+(judgementCorrect?'strong':'weak')+'">'+(judgementCorrect?'Your diagnosis is on target.':'The claim is '+(session.claimValid?'valid':'hexed')+'.')+'</p>':'')+
      (!session.claimValid&&session.judgment!=null?
        '<h3>2. Break the hex: choose the correct repair.</h3><div class="realmHexRepairs">'+q.options.map(o=>'<button '+(session.answered?'disabled':'')+' onclick="hexRepair('+JSON.stringify(o)+')">'+E(o)+'</button>').join('')+'</div>':
        session.claimValid&&session.judgment!=null&&!session.answered?'<button class="btn violet" onclick="hexRepair('+JSON.stringify(q.answer)+')">Seal this valid claim ✦</button>':'')+
      (session.answered?'<div class="realmHexFeedback"><b class="'+(session.score>=session.round?'strong':'')+'">'+(judgementCorrect&&((session.claimValid)||(session.repair===q.answer))?'✦ Hex broken':'Review the repair')+'</b><p>'+E(q.why||q.distractorCoach||'Compare the claim with the exact concept the question is testing.')+'</p><button class="btn violet" onclick="hexNext()">Next hex →</button></div>':'')+
      '</div></div>';
  }

  /* ---------- Guardian Gauntlet ---------- */
  function nextGauntlet(){
    const pool=(typeof questionPool==='function'?questionPool({hard:true}):[]).filter(q=>q?.prompt&&q?.options?.length>=2);
    if(!pool.length)return false;
    const q=pickAdaptive(pool);session.current=q;session.answered=false;session.chosen=null;session.questions.push(q.id);session.round++;return true;
  }
  globalThis.startGuardianGauntlet=function(){
    const g=guardian();
    session={type:'gauntlet',opts:{label:'Guardian Gauntlet'},round:0,limit:12,score:0,combo:0,playerHP:5,bossHP:100,shield:true,shieldUsed:false,finished:false,won:false,questions:[],guardianName:g?.name||'Guardian'};
    nextGauntlet();if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.gauntletAnswer=function(chosen){
    if(!session||session.type!=='gauntlet'||session.answered)return;
    const q=session.current,correct=chosen===q.answer;
    session.chosen=chosen;session.answered=true;
    if(correct){
      session.score++;session.combo++;
      const dmg=10+Math.min(10,Number(q.difficulty||1)*2)+Math.min(6,session.combo);
      session.bossHP=Math.max(0,session.bossHP-dmg);
    }else{
      session.combo=0;
      if(session.shield&&!session.shieldUsed){session.shieldUsed=true;guardianReact('care',{mode:'gauntlet',shield:true})}
      else session.playerHP=Math.max(0,session.playerHP-1);
    }
    recordAnswer(q,chosen,correct,'gauntlet');
    if(session.bossHP<=0){session.finished=true;session.won=true;recordRealm('gauntlet',session.score,session.round,true);addReward('Guardian Gauntlet victory',24,2);guardianReact('mastery',{mode:'gauntlet'})}
    else if(session.playerHP<=0||session.round>=session.limit){session.finished=true;session.won=session.bossHP<=0;recordRealm('gauntlet',session.score,session.round,session.won);if(session.score>=7)addReward('Guardian Gauntlet run',14,1)}
    render?.();
  };
  globalThis.gauntletNext=function(){
    if(!session||session.type!=='gauntlet'||session.finished)return;
    nextGauntlet();render?.();
  };
  function gauntletHTML(){
    if(session.finished)return realmResultHTML('Guardian Gauntlet','gauntlet',session.score,Math.max(1,session.round),session.won,session.won?(session.guardianName+' helped you break the boss ward.'):'The boss ward held this time. Your run still added practice data.');
    const q=session.current;
    return '<div class="qwrap realmMode realmGauntlet">'+
      '<div class="realmWorldTag"><small>LOCATION</small><b>Guardian Trial Arena</b><span>A warded dueling chamber where your Guardian fights beside you against a living boss sigil.</span></div>'+
      guardianBanner(session.shieldUsed?'The shield is spent. I am still with you.':'I can absorb one missed answer for you this run.')+
      '<div class="qtop"><span class="qbadge">♛ Guardian Gauntlet</span><div><span class="hearts">'+('💗'.repeat(session.playerHP))+'</span> <span class="comboGlow">✦ x'+Math.max(1,session.combo)+'</span></div></div>'+
      '<div class="realmBossHUD"><div><b>Boss Ward</b><div class="bossBar"><i style="width:'+session.bossHP+'%"></i></div><small>'+session.bossHP+'% remaining</small></div><span class="realmShield '+(session.shieldUsed?'spent':'ready')+'">'+(session.shieldUsed?'◇ Shield spent':'◇ Guardian shield ready')+'</span></div>'+
      '<div class="card"><div class="tiny">'+E(q.section||'Mixed')+' • Difficulty '+Number(q.difficulty||1)+' • Round '+session.round+'/'+session.limit+'</div><div class="question">'+E(q.prompt)+'</div>'+
      '<div class="options">'+q.options.map(o=>'<button class="opt '+(session.answered?(o===q.answer?'correct':o===session.chosen?'wrong':''):'')+'" '+(session.answered?'disabled':'')+' onclick="gauntletAnswer('+JSON.stringify(o)+')">'+E(o)+'</button>').join('')+'</div>'+
      (session.answered?'<div class="realmGauntletFeedback"><p class="'+(session.chosen===q.answer?'strong':'weak')+'">'+(session.chosen===q.answer?'Direct hit! The boss ward cracked.':session.shieldUsed&&session.playerHP===5?'Your Guardian blocked that hit.':'The boss struck back.')+'</p><p>'+E(q.why||'Review the controlling clue before the next round.')+'</p>'+(session.finished?'':'<button class="btn violet" onclick="gauntletNext()">Next round →</button>')+'</div>':'')+
      '</div></div>';
  }

  function realmResultHTML(title,id,score,total,won,detail){
    const acc=percent(score,total),g=guardian();
    return '<div class="qwrap realmMode realmResult">'+
      '<section class="realmResultHero"><small>'+(won?'TRIAL CLEARED':'TRIAL COMPLETE')+'</small><h2>'+E(title)+'</h2><div class="realmResultScore">'+score+'/'+total+' <span>'+acc+'%</span></div><p>'+E(detail)+'</p>'+
      (g?'<p class="realmResultGuardian">'+E(g.name)+' • '+E(g.personality||g.role||'Realm partner')+'</p>':'')+
      '<div class="heroBtns"><button class="btn primary" onclick="'+(id==='runesort'?'startRuneSort()':id==='oraclelens'?'startOracleLens()':id==='constellation'?'startMemoryConstellation()':id==='hexbreaker'?'startHexBreaker()':'startGuardianGauntlet()')+'">Play again</button><button class="btn secondary" onclick="session=null;navigate(\'games\')">Back to Game Realm</button></div></section></div>';
  }

  const baseSessionHTML=typeof sessionHTML==='function'?sessionHTML:null;
  if(baseSessionHTML){
    sessionHTML=function(){
      if(session?.type==='runesort')return runeSortHTML();
      if(session?.type==='oraclelens')return oracleHTML();
      if(session?.type==='constellation')return constellationHTML();
      if(session?.type==='hexbreaker')return hexBreakerHTML();
      if(session?.type==='gauntlet')return gauntletHTML();
      return baseSessionHTML();
    };
  }

  globalThis.MajickGameRealm={
    VERSION,
    guardian,
    buildRuneSort,
    buildConstellation,
    inspect(){
      return {
        version:VERSION,
        active:session?.type||null,
        guardian:guardian()?.name||null,
        records:prog()?.realmRecords||{}
      };
    }
  };
  document.documentElement.dataset.majickRealmVariety='3352';
})();