/* Majick Game Realm Overhaul — distinct mechanics, Guardian integration, readability, and variety. */
(()=>{
  'use strict';

  const VERSION='3.3.55-realm';
  const normalize=v=>String(v||'').trim().toLocaleLowerCase();
  const E=v=>{try{return esc(String(v??''))}catch(_){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}};
  const shuffleCopy=a=>{
    const out=[...(a||[])];
    for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
    return out;
  };
  const percent=(n,d)=>Math.round((Number(n||0)/Math.max(1,Number(d||0)))*100);

  function categoryLabel(value){
    const raw=String(value??'').trim();
    if(/^\d+$/.test(raw))return 'Section '+raw;
    if(/^section\s*\d+$/i.test(raw))return raw.replace(/^section\s*/i,'Section ');
    return raw||'Course Section';
  }

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
  function guardianLine(kind,detail=''){
    const g=guardian(),name=g?.name||'Your Guardian';
    const lines={
      correct:[
        name+' sparks with approval — that one landed.',
        name+' brightens beside you. Keep the pattern going.',
        name+' reacts instantly: strong read.'
      ],
      miss:[
        name+' stays close. Use the clue and try the next move.',
        name+' steadies the trial — one miss does not break the run.',
        name+' watches the pattern with you. Re-read what controls the answer.'
      ],
      streak:[
        name+' is glowing now — your streak is building.',
        name+' leans into the momentum. Keep it going.',
        name+' is fully locked in with you.'
      ],
      shield:[
        name+' throws up a ward and blocks the hit!',
        name+' jumps between you and the boss sigil — shield used.',
        name+' catches the strike before it reaches you.'
      ],
      finish:[
        name+' celebrates the completed trial with you.',
        name+' settles beside the finished sigil — run complete.',
        name+' gives one last bright reaction as the trial closes.'
      ]
    };
    const list=lines[kind]||lines.correct;
    const seed=(Number(session?.round||session?.moves||session?.score||0)+String(name).length)%list.length;
    return list[seed]+(detail?' '+detail:'');
  }
  function recordRealm(id,score,total,won=false){
    try{
      const p=prog();p.realmRecords=p.realmRecords||{};
      const row=p.realmRecords[id]||{plays:0,best:0,wins:0,last:0};
      const previousBest=Number(row.best||0);
      row.plays=Number(row.plays||0)+1;
      row.last=total?score/total:0;
      row.best=Math.max(previousBest,row.last);
      if(won)row.wins=Number(row.wins||0)+1;
      row.at=Date.now();
      p.realmRecords[id]=row;
      save?.();
      return {previousBest,best:row.best,newBest:row.last>previousBest&&row.last>0,plays:row.plays,wins:row.wins};
    }catch(_){return null}
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


  function realmScene(kind){
    const map={
      runesort:{place:'Runestone Atrium',subtitle:'Ancient sorting runes drift through a moonlit collegiate hall.',icon:'ᚱ',
        art:'<div class="realmSceneArt runeArt"><span class="pillar p1">ᚱ</span><span class="pillar p2">ᚾ</span><span class="pillar p3">ᛟ</span><span class="floorRune">✦</span><i class="floatRune r1">ᚨ</i><i class="floatRune r2">ᛃ</i><i class="floatRune r3">ᛗ</i></div>'},
      assessmentsigilsort:{place:'Hall of Assessment Sigils',subtitle:'Four enchanted gates test whether you can read what kind of assessment a scenario describes.',icon:'✥',
        art:'<div class="realmSceneArt assessmentSigilArt"><span class="sigilGate g1">Q</span><span class="sigilGate g2">F</span><span class="sigilGate g3">Σ</span><span class="sigilGate g4">M</span><i class="sigilSpark s1">✦</i><i class="sigilSpark s2">✧</i><i class="sigilSpark s3">⋆</i></div>'},
      oraclelens:{place:'Oracle Observatory',subtitle:'Celestial lenses and suspended constellations reveal the clue that matters most.',icon:'◉',
        art:'<div class="realmSceneArt oracleArt"><span class="bigLens"></span><span class="scopeArm"></span><i class="star s1">✦</i><i class="star s2">✧</i><i class="star s3">✦</i><i class="star s4">✧</i><span class="orbit o1"></span><span class="orbit o2"></span></div>'},
      constellation:{place:'Constellation Garden',subtitle:'Memory stars bloom across a midnight garden as each concept finds its pair.',icon:'✧',
        art:'<div class="realmSceneArt gardenArt"><span class="moonDisc"></span><i class="vine v1"></i><i class="vine v2"></i><i class="flower f1">✦</i><i class="flower f2">✧</i><i class="flower f3">✦</i><span class="starPath sp1"></span><span class="starPath sp2"></span></div>'},
      hexbreaker:{place:'Hexed Archive',subtitle:'Corrupted scrolls pulse between shadowed shelves until you expose the faulty claim.',icon:'⬡',
        art:'<div class="realmSceneArt archiveArt"><span class="shelf sh1"></span><span class="shelf sh2"></span><span class="scroll sc1">≋</span><span class="scroll sc2">≋</span><span class="curseSigil">⬡</span><i class="ember e1">✦</i><i class="ember e2">✧</i></div>'},
      gauntlet:{place:'Guardian Trial Arena',subtitle:'A warded dueling chamber where your Guardian fights beside you against a living boss sigil.',icon:'♛',
        art:'<div class="realmSceneArt arenaArt"><span class="arenaRing ar1"></span><span class="arenaRing ar2"></span><span class="bossSigil">♛</span><i class="arenaSpark a1">✦</i><i class="arenaSpark a2">✦</i><i class="arenaSpark a3">✧</i></div>'}
    };
    const m=map[kind]||map.runesort;
    return '<section class="realmScene realmScene-'+kind+'">'+
      '<div class="realmSceneCopy"><small>MAGICAL LOCATION</small><h2>'+E(m.icon)+' '+E(m.place)+'</h2><p>'+E(m.subtitle)+'</p></div>'+
      m.art+
    '</section>';
  }

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
  function realmRecord(id){
    try{return prog()?.realmRecords?.[id]||null}catch(_){return null}
  }
  function realmProgressHTML(){
    const trials=[
      ['runesort','ᚱ','Rune Sort'],
      ['oraclelens','◉','Oracle Lens'],
      ['gauntlet','♛','Gauntlet'],
      ['constellation','✧','Constellation'],
      ['hexbreaker','⬡','Hex Breaker']
    ];
    const cleared=trials.filter(([id])=>Number(realmRecord(id)?.wins||0)>0).length;
    return '<section class="realmProgressMap"><div class="realmProgressHead"><div><small>REALM PATH</small><b>'+cleared+'/5 trials cleared</b></div><span>'+Math.round((cleared/5)*100)+'%</span></div>'+
      '<div class="realmProgressTrack"><i style="width:'+((cleared/5)*100)+'%"></i></div>'+
      '<div class="realmProgressNodes">'+trials.map(([id,icon,name])=>{
        const r=realmRecord(id),won=Number(r?.wins||0)>0,best=r?.plays?Math.round(Number(r.best||0)*100):0;
        return '<div class="'+(won?'cleared':'')+'"><span>'+icon+'</span><b>'+E(name)+'</b><small>'+(won?'CLEARED • '+best+'% BEST':r?.plays?best+'% BEST':'UNEXPLORED')+'</small></div>';
      }).join('')+'</div></section>';
  }
  function bossPhase(hp){
    const n=Number(hp||0);
    if(n>70)return {name:'Warding Phase',className:'phase-one',line:'The boss sigil is fully shielded.'};
    if(n>35)return {name:'Fracture Phase',className:'phase-two',line:'Cracks are spreading through the ward.'};
    return {name:'Final Phase',className:'phase-three',line:'The sigil is unstable — finish the trial.'};
  }
  function trialProgress(kind){
    let current=0,total=1,label='Progress';
    if(kind==='runesort'){current=(session?.items||[]).filter(x=>x.ok).length;total=Math.max(1,session?.items?.length||1);label='Runes locked'}
    else if(kind==='assessmentsigilsort'){current=Number(session?.index||0)+(session?.answered?1:0);total=Math.max(1,session?.items?.length||1);label='Assessment sigils solved'}
    else if(kind==='oraclelens'){current=Math.max(0,Number(session?.round||1)-1)+(session?.answered?1:0);total=Math.max(1,Number(session?.limit||8));label='Lenses completed'}
    else if(kind==='constellation'){current=Number(session?.matched||0);total=Math.max(1,(session?.cards?.length||2)/2);label='Stars linked'}
    else if(kind==='hexbreaker'){current=Math.max(0,Number(session?.round||1)-1)+(session?.answered?1:0);total=Math.max(1,Number(session?.limit||8));label='Hexes examined'}
    else if(kind==='gauntlet'){current=Math.max(0,100-Number(session?.bossHP||100));total=100;label='Boss ward broken'}
    const pct=Math.max(0,Math.min(100,Math.round((current/total)*100)));
    return '<div class="realmRunProgress" aria-label="'+E(label)+' '+pct+' percent"><div><small>'+E(label)+'</small><b>'+pct+'%</b></div><div class="realmRunProgressBar"><i style="width:'+pct+'%"></i></div></div>';
  }
  function trialGuide(kind){
    const guides={
      runesort:{goal:'Sort each prompt into the course section it belongs to.',win:'Lock as many runes as you can.',help:'Your Guardian reacts when a pattern clicks.'},
      assessmentsigilsort:{goal:'Read the D755 scenario and choose the assessment gate it belongs to.',win:'Clear every scenario in the selected assessment chamber.',help:'Your Guardian reacts to each correct classification.'},
      oraclelens:{goal:'Find the clue that actually controls the answer.',win:'Align the lens, then answer through that clue.',help:'Your Guardian tracks your clarity streak.'},
      constellation:{goal:'Match each clue card with its correct answer card.',win:'Connect every pair into one constellation.',help:'Your Guardian celebrates each linked star.'},
      hexbreaker:{goal:'Decide whether the glowing claim is valid or hexed.',win:'Repair the hex with the correct concept.',help:'Your Guardian tracks your break streak.'},
      gauntlet:{goal:'Answer correctly to damage the boss ward.',win:'Break the ward before your hearts run out.',help:'Your Guardian can block one missed answer.'}
    };
    const g=guides[kind]||guides.runesort;
    return '<section class="realmTrialGuide" aria-label="How this trial works">'+
      '<div><small>YOUR GOAL</small><b>'+E(g.goal)+'</b></div>'+
      '<div><small>HOW TO WIN</small><b>'+E(g.win)+'</b></div>'+
      '<div><small>GUARDIAN HELP</small><b>'+E(g.help)+'</b></div>'+
    '</section>';
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
        realmProgressHTML()+
        '<div class="realmStats"><span>ᚱ '+E(bestText('runesort'))+' Rune Sort</span><span>◉ '+E(bestText('oraclelens'))+' Oracle Lens</span><span>♛ '+E(bestText('gauntlet'))+' Gauntlet</span><span>✧ '+E(bestText('constellation'))+' Constellation</span><span>⬡ '+E(bestText('hexbreaker'))+' Hex Breaker</span></div>'+
        '<div class="realmFeaturedGrid">'+
          gameCard('ᚱ','Rune Sort','Sort D772 prompts into Data Collection, Bias & Credibility, Misrepresentation, and Conclusions when D772 is active.','startRuneSort()')+
          (globalThis.S?.activeCourse==='D755'?gameCard('✥','Assessment Sigil Sort','Sort D755 scenarios through Qualitative/Quantitative, Formal/Informal, Formative/Summative, Norm/Criterion, Screening/Monitoring, or Observation/Anecdotal gates.','startAssessmentSigilSort()','D755 TRIAL'):'')+
          gameCard('◉','Oracle Lens','Identify the controlling statistical clue first, then answer through that clue.','startOracleLens()')+
          gameCard('♛','Guardian Gauntlet','A multi-round boss run with hearts, boss HP, combos, and one Guardian shield.','startGuardianGauntlet()')+
          gameCard('✧','Memory Constellation','Match controlling clues to the correct answers and build a glowing constellation.','startMemoryConstellation()')+
          gameCard('⬡','Hex Breaker','Judge a statistical claim, expose the misconception, and repair it with the correct concept.','startHexBreaker()')+
        '</div>'+
        '<details class="realmClassic"><summary><span>Classic Trials</span><small>All previous Game Realm modes are still available</small></summary><div class="realmClassicBody">'+baseGamesHTML()+'</div></details>'+
      '</div>';
    };
  }

  /* ---------- D755 Assessment Sigil Sort ---------- */
  /* V3.3.53: clear, non-ambiguous D755 assessment-identification scenarios.
     These supplement the course bank so the Realm can train longer without recycling. */
  const ASSESSMENT_SIGIL_SUPPLEMENT=[
    {id:'v3353-data-01',trap:'assessment-type',concept:'qualitative quantitative',prompt:'A school psychologist interviews a student about what reading feels like, records the student’s descriptions of frustration, and looks for themes in the responses. What kind of data is being collected?',answer:'Qualitative',why:'The evidence is descriptive and focuses on experiences and qualities rather than numerical scores.'},
    {id:'v3353-data-02',trap:'assessment-type',concept:'qualitative quantitative',prompt:'A teacher records the number of correctly read words per minute for each student during a fluency probe. What kind of data is this?',answer:'Quantitative',why:'Words correct per minute is numerical data that can be counted and compared.'},
    {id:'v3353-data-03',trap:'assessment-type',concept:'qualitative quantitative',prompt:'An evaluator reviews open-ended parent comments describing when a child becomes overwhelmed during homework. What kind of data is this?',answer:'Qualitative',why:'Open-ended descriptions provide narrative information about patterns and experiences.'},
    {id:'v3353-data-04',trap:'assessment-type',concept:'qualitative quantitative',prompt:'A behavior specialist graphs how many times a student leaves their seat during each 30-minute observation. What kind of data is this?',answer:'Quantitative',why:'The behavior is being expressed as a numerical frequency.'},
    {id:'v3353-data-05',trap:'assessment-type',concept:'qualitative quantitative',prompt:'A teacher writes detailed notes about the strategies a student uses while solving unfamiliar math problems. What kind of data is this?',answer:'Qualitative',why:'The notes describe characteristics of the student’s approach instead of producing a numeric score.'},
    {id:'v3353-data-06',trap:'assessment-type',concept:'qualitative quantitative',prompt:'A progress report shows that a student answered 18 of 25 comprehension questions correctly. What kind of data is this?',answer:'Quantitative',why:'The result is expressed numerically as a count of correct responses.'},

    {id:'v3353-admin-01',trap:'assessment-type',concept:'formal informal',prompt:'A teacher uses a published achievement test with standardized directions, fixed timing, and scoring rules. Which administration type best describes it?',answer:'Formal',why:'Predetermined directions, timing, and scoring rules are features of formal assessment.'},
    {id:'v3353-admin-02',trap:'assessment-type',concept:'formal informal',prompt:'During a reading group, a teacher asks follow-up questions, changes the prompts based on student responses, and takes quick notes. Which administration type best describes this?',answer:'Informal',why:'The teacher is using flexible, instruction-embedded procedures rather than a fixed standardized format.'},
    {id:'v3353-admin-03',trap:'assessment-type',concept:'formal informal',prompt:'An evaluator follows the exact manual for a norm-referenced cognitive assessment and scores responses according to published rules. Which administration type is this?',answer:'Formal',why:'Following standardized procedures and scoring rules makes this a formal assessment.'},
    {id:'v3353-admin-04',trap:'assessment-type',concept:'formal informal',prompt:'A teacher listens to a student read a classroom passage and jots down miscues without using a standardized script or fixed scoring protocol. Which administration type is this?',answer:'Informal',why:'The observation is flexible and classroom-based rather than administered under standardized procedures.'},

    {id:'v3353-purpose-01',trap:'assessment-type',concept:'assessment purpose',prompt:'Halfway through a unit, a teacher gives a short exit ticket and changes tomorrow’s lesson after seeing a common misconception. What is the primary assessment purpose?',answer:'Formative',why:'The assessment occurs during learning and is used immediately to adjust instruction.'},
    {id:'v3353-purpose-02',trap:'assessment-type',concept:'assessment purpose',prompt:'At the end of a semester, students take a final exam used to evaluate what they learned across the course. What is the primary assessment purpose?',answer:'Summative',why:'The assessment evaluates learning at a defined endpoint.'},
    {id:'v3353-purpose-03',trap:'assessment-type',concept:'assessment purpose',prompt:'A teacher checks student responses after a mini-lesson and reteaches the concept before moving on. What is the primary assessment purpose?',answer:'Formative',why:'The information is being used during instruction to guide the next teaching move.'},
    {id:'v3353-purpose-04',trap:'assessment-type',concept:'assessment purpose',prompt:'A district gives an end-of-year assessment to summarize student achievement after instruction is complete. What is the primary assessment purpose?',answer:'Summative',why:'The measure summarizes achievement after a period of instruction.'},
    {id:'v3353-purpose-05',trap:'assessment-type',concept:'assessment purpose',prompt:'A special educator gives a brief probe every Friday and changes the intervention when the student’s trend line is not improving. What is the primary assessment purpose?',answer:'Formative',why:'Repeated results are being used to adjust instruction while learning is still occurring.'},
    {id:'v3353-purpose-06',trap:'assessment-type',concept:'assessment purpose',prompt:'After completing a six-week instructional unit, a teacher gives a unit test that contributes to the final grade. What is the primary assessment purpose?',answer:'Summative',why:'The test judges learning after the instructional period has ended.'},

    {id:'v3353-monitor-01',trap:'assessment-type',concept:'screening tier movement',prompt:'At the beginning of the year, every student in the grade completes the same brief reading measure to identify who may need additional support. What is this?',answer:'Universal Screening',why:'Universal screening is given broadly to identify students who may be at risk and need further support.'},
    {id:'v3353-monitor-02',trap:'assessment-type',concept:'screening tier movement',prompt:'A student receiving Tier 2 reading intervention completes a brief probe each week so the team can see whether the intervention is working. What is this?',answer:'Progress Monitoring',why:'Progress monitoring repeatedly measures response to an intervention over time.'},
    {id:'v3353-monitor-03',trap:'assessment-type',concept:'screening tier movement',prompt:'All kindergarten students complete a short early-literacy check in September to flag possible risk. What is this?',answer:'Universal Screening',why:'The measure is administered to all students to identify who may need more support.'},
    {id:'v3353-monitor-04',trap:'assessment-type',concept:'screening tier movement',prompt:'A team graphs a student’s weekly math-fluency scores during an intervention and compares the trend with the goal line. What is this?',answer:'Progress Monitoring',why:'Repeated data are being used to judge growth and intervention response.'},

    {id:'v3353-compare-01',trap:'assessment-type',concept:'criterion cbm',prompt:'A student’s score is interpreted by comparing it with the performance of a representative national peer group. Which type of interpretation is this?',answer:'Norm-Referenced',why:'Norm-referenced interpretation compares a student with other people in a norm group.'},
    {id:'v3353-compare-02',trap:'assessment-type',concept:'criterion cbm',prompt:'A student must correctly identify 90% of taught sight words to meet the instructional mastery standard. Which type of interpretation is this?',answer:'Criterion-Referenced',why:'Criterion-referenced interpretation compares performance with a predetermined standard.'},
    {id:'v3353-compare-03',trap:'assessment-type',concept:'criterion cbm',prompt:'A reading score is reported as the student’s percentile rank compared with same-age peers. Which type of interpretation is this?',answer:'Norm-Referenced',why:'Percentile rank locates performance relative to a norm group.'},
    {id:'v3353-compare-04',trap:'assessment-type',concept:'criterion cbm',prompt:'A student is considered proficient after demonstrating every required step on a task-analysis checklist. Which type of interpretation is this?',answer:'Criterion-Referenced',why:'The student is being compared with defined performance criteria rather than with peers.'},

    {id:'v3353-evidence-01',trap:'assessment-type',concept:'data sources',prompt:'A teacher watches a student during independent work and records each instance of task refusal as it happens. Which data source is this?',answer:'Direct Observation',why:'The teacher is recording behavior while directly watching it occur.'},
    {id:'v3353-evidence-02',trap:'assessment-type',concept:'data sources',prompt:'After class, a teacher writes a brief narrative describing a notable conflict between two students and the events surrounding it. Which data source is this?',answer:'Anecdotal Record',why:'An anecdotal record is a brief narrative account of a significant observed event.'},
    {id:'v3353-evidence-03',trap:'assessment-type',concept:'data sources',prompt:'An observer uses a timer and records whether a student is on task at each 30-second interval during math. Which data source is this?',answer:'Direct Observation',why:'The observer is systematically recording behavior in real time.'},
    {id:'v3353-evidence-04',trap:'assessment-type',concept:'data sources',prompt:'A paraprofessional writes a short dated note describing what happened before and after a student unexpectedly left the classroom. Which data source is this?',answer:'Anecdotal Record',why:'The note is a narrative record of a specific event rather than a structured live measurement system.'}
  ];

  const ASSESSMENT_SIGIL_FAMILIES={
    data:{label:'Qualitative vs Quantitative',left:'Qualitative',right:'Quantitative',concept:/qualitative quantitative/i,
      map:a=>/qualitative/i.test(a)&&!/quantitative/i.test(a)?'Qualitative':/quantitative/i.test(a)&&!/qualitative/i.test(a)?'Quantitative':null},
    administration:{label:'Formal vs Informal',left:'Formal',right:'Informal',concept:/formal informal/i,
      map:a=>/\binformal\b/i.test(a)?'Informal':/\bformal\b/i.test(a)?'Formal':null},
    purpose:{label:'Formative vs Summative',left:'Formative',right:'Summative',concept:/assessment purpose/i,
      map:a=>/formative/i.test(a)?'Formative':/summative/i.test(a)?'Summative':null},
    monitoring:{label:'Screening vs Progress Monitoring',left:'Universal Screening',right:'Progress Monitoring',concept:/screening|tier movement/i,
      map:a=>/universal screening/i.test(a)?'Universal Screening':/progress monitoring/i.test(a)?'Progress Monitoring':null},
    comparison:{label:'Norm-Referenced vs Criterion-Referenced',left:'Norm-Referenced',right:'Criterion-Referenced',concept:/criterion cbm/i,
      map:a=>/norm-referenced/i.test(a)?'Norm-Referenced':/criterion-referenced/i.test(a)?'Criterion-Referenced':null},
    evidence:{label:'Direct Observation vs Anecdotal Record',left:'Direct Observation',right:'Anecdotal Record',concept:/data sources/i,
      map:a=>/^direct observation$/i.test(a)?'Direct Observation':/^anecdotal record$/i.test(a)?'Anecdotal Record':null}
  };
  function assessmentSigilPool(key){
    const cfg=ASSESSMENT_SIGIL_FAMILIES[key];
    const courseBank=Array.isArray(globalThis.MajickD755Retake?.BANK)?globalThis.MajickD755Retake.BANK:[];
    const bank=[...courseBank,...ASSESSMENT_SIGIL_SUPPLEMENT];
    if(!cfg)return [];
    const seen=new Set();
    return shuffleCopy(bank.filter(q=>q?.trap==='assessment-type'&&cfg.concept.test(String(q.concept||''))&&cfg.map(String(q.answer||'')))
      .filter(q=>{
        const signature=normalize(String(q.prompt||''))+'|'+normalize(String(q.answer||''));
        if(!signature||seen.has(signature))return false;
        seen.add(signature);return true;
      })
      .map(q=>({...q,sigilAnswer:cfg.map(String(q.answer||''))})));
  }
  globalThis.startAssessmentSigilSort=function(){
    if(globalThis.S?.activeCourse!=='D755'){
      try{alert('Assessment Sigil Sort is a D755-only Realm trial. Switch to Assessment for Special Education first.')}catch(_){}
      return;
    }
    session={type:'assessmentsigilsort',opts:{label:'Assessment Sigil Sort'},phase:'choose',family:null,items:[],index:0,score:0,answered:false,choice:null,finished:false,questions:[]};
    if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.chooseAssessmentSigilFamily=function(key){
    if(!session||session.type!=='assessmentsigilsort'||!ASSESSMENT_SIGIL_FAMILIES[key])return;
    const items=assessmentSigilPool(key).slice(0,8);
    if(items.length<2){try{alert('This assessment chamber needs more D755 scenarios. Choose another chamber.')}catch(_){}return}
    session.family=key;session.items=items;session.index=0;session.score=0;session.phase='play';session.answered=false;session.choice=null;session.finished=false;
    render?.();
  };
  globalThis.answerAssessmentSigil=function(value){
    if(!session||session.type!=='assessmentsigilsort'||session.phase!=='play'||session.answered)return;
    const q=session.items?.[session.index];if(!q)return;
    const correct=normalize(value)===normalize(q.sigilAnswer);
    session.choice=value;session.answered=true;session.questions.push(q.id);
    if(correct){session.score++;session.guardianMessage=guardianLine(session.score>=3?'streak':'correct')}
    else session.guardianMessage=guardianLine('miss');
    recordAnswer(q,value,correct,'assessmentsigilsort');
    render?.();
  };
  globalThis.nextAssessmentSigil=function(){
    if(!session||session.type!=='assessmentsigilsort'||!session.answered)return;
    if(session.index>=session.items.length-1){
      session.finished=true;session.phase='result';
      session.recordOutcome=recordRealm('assessmentsigilsort',session.score,session.items.length,session.score===session.items.length);
      guardianReact('concept',{mode:'assessmentsigilsort'});
    }else{
      session.index++;session.answered=false;session.choice=null;
    }
    render?.();
  };
  function assessmentSigilHTML(){
    if(session.finished)return realmResultHTML('Assessment Sigil Sort','assessmentsigilsort',session.score,session.items.length,session.score===session.items.length,'You classified '+session.score+' of '+session.items.length+' D755 assessment scenarios correctly.');
    if(session.phase==='choose'){
      return '<div class="qwrap realmMode realmAssessmentSigil">'+realmScene('assessmentsigilsort')+guardianBanner('Choose the assessment distinction you want to train.')+
        '<div class="qtop"><span class="qbadge">✥ Assessment Sigil Sort</span><b>D755 only</b></div>'+
        trialGuide('assessmentsigilsort')+
        '<div class="card"><h3>Choose an assessment chamber</h3><p>Each chamber trains one distinction with clear D755-style scenarios. Runs now pull up to 8 questions before recycling.</p><div class="assessmentSigilChambers">'+
        Object.entries(ASSESSMENT_SIGIL_FAMILIES).map(([key,cfg])=>'<button type="button" onclick="chooseAssessmentSigilFamily(\''+E(key)+'\')"><span>✥</span><b>'+E(cfg.label)+'</b><small>'+assessmentSigilPool(key).length+' scenarios available</small></button>').join('')+
        '</div></div></div>';
    }
    const q=session.items[session.index],cfg=ASSESSMENT_SIGIL_FAMILIES[session.family];
    return '<div class="qwrap realmMode realmAssessmentSigil">'+realmScene('assessmentsigilsort')+guardianBanner(session.guardianMessage||'Read the scenario carefully. Decide which sigil gate it belongs to.')+
      '<div class="qtop"><span class="qbadge">✥ '+E(cfg.label)+'</span><b>'+(session.index+1)+' / '+session.items.length+'</b></div>'+trialProgress('assessmentsigilsort')+trialGuide('assessmentsigilsort')+
      '<div class="card assessmentSigilCard"><small>D755 • WHAT TYPE OF ASSESSMENT IS THIS?</small><div class="question">'+E(q.prompt)+'</div>'+
      '<div class="assessmentSigilGates">'+[cfg.left,cfg.right].map(v=>'<button type="button" '+(session.answered?'disabled':'')+' class="'+(session.answered?(normalize(v)===normalize(q.sigilAnswer)?'correct':normalize(v)===normalize(session.choice)?'wrong':''):'')+'" onclick="answerAssessmentSigil(\''+E(v)+'\')"><span>✥</span><b>'+E(v)+'</b></button>').join('')+'</div>'+
      (session.answered?'<div class="realmSigilFeedback '+(normalize(session.choice)===normalize(q.sigilAnswer)?'strong':'weak')+'"><b>'+(normalize(session.choice)===normalize(q.sigilAnswer)?'✓ Sigil aligned':'✕ Wrong gate')+'</b><p>'+E(q.why||'Use the assessment purpose and administration clues in the scenario.')+'</p><button class="btn violet" onclick="nextAssessmentSigil()">'+(session.index<session.items.length-1?'Next sigil →':'See result →')+'</button></div>':'')+
      '</div></div>';
  }


  /* ---------- D772 Realm Training ---------- */
  /* V3.3.55: guaranteed Section 1 practice depth for the active Statistical Data Literacy course. */
  const D772_REALM_SUPPLEMENT=[
    {id:'v3355-d772-l1-01',section:'Data Collection',prompt:'A district wants the average commute time for all 4,200 employees and surveys 350 randomly selected employees. The 350 employees are the…',options:['Population','Sample','Parameter','Statistic'],answer:'Sample',keyClue:'the smaller group actually surveyed',why:'The sample is the subset of the population that actually provides data.',difficulty:1},
    {id:'v3355-d772-l1-02',section:'Data Collection',prompt:'The 350 surveyed employees have an average commute of 31 minutes. The 31-minute value is a…',options:['Parameter','Statistic','Population','Variable'],answer:'Statistic',keyClue:'the number describes the sample',why:'A numerical summary calculated from a sample is a statistic.',difficulty:1},
    {id:'v3355-d772-l1-03',section:'Data Collection',prompt:'A district randomly selects 20 students from every grade level. Which sampling method is used?',options:['Cluster sampling','Stratified sampling','Systematic sampling','Convenience sampling'],answer:'Stratified sampling',keyClue:'some students are selected from every subgroup',why:'Stratified sampling takes some individuals from each subgroup.',difficulty:2},
    {id:'v3355-d772-l1-04',section:'Data Collection',prompt:'A researcher randomly chooses four classrooms and surveys every student in those classrooms. Which method is used?',options:['Stratified sampling','Cluster sampling','Simple random sample','Systematic sampling'],answer:'Cluster sampling',keyClue:'whole selected groups are included',why:'Cluster sampling selects some natural groups and includes everyone in those selected groups.',difficulty:2},
    {id:'v3355-d772-l1-05',section:'Data Collection',prompt:'Researchers record students’ usual sleep hours and exam scores without changing anyone’s sleep. What type of study is this?',options:['Experiment','Observational study','Double-blind study','Systematic sample'],answer:'Observational study',keyClue:'no treatment or condition is assigned',why:'Researchers only observe naturally occurring values, so the study is observational.',difficulty:2},
    {id:'v3355-d772-l1-06',section:'Data Collection',prompt:'Researchers randomly place participants into a treatment group or a placebo group. What design feature is being used?',options:['Random sampling','Randomization','Convenience sampling','Nonresponse'],answer:'Randomization',keyClue:'participants are assigned to groups by chance',why:'Randomization determines which treatment group study participants enter.',difficulty:2},

    {id:'v3355-d772-l2-01',section:'Bias & Credibility',prompt:'A city estimates adult exercise habits by surveying only people leaving a fitness center. What is the main problem?',options:['Sampling bias','Placebo effect','Replication','Randomization'],answer:'Sampling bias',keyClue:'the selected group systematically overrepresents exercisers',why:'The sampling method does not fairly represent all adults.',difficulty:2},
    {id:'v3355-d772-l2-02',section:'Bias & Credibility',prompt:'A website asks visitors to click a link if they want to rate a controversial new policy. Which problem is most likely?',options:['Voluntary response bias','Nonresponse bias','Cluster sampling','Blinding'],answer:'Voluntary response bias',keyClue:'people choose themselves to participate',why:'People with especially strong opinions are often more likely to volunteer.',difficulty:2},
    {id:'v3355-d772-l2-03',section:'Bias & Credibility',prompt:'A researcher selects 500 people for a survey, but many selected people never respond and the nonresponders differ from responders. What bias is this?',options:['Nonresponse bias','Convenience bias','Self-interest bias','Sampling-frame error'],answer:'Nonresponse bias',keyClue:'selected people fail to respond',why:'Nonresponse bias occurs when selected nonresponders differ systematically from responders.',difficulty:2},
    {id:'v3355-d772-l2-04',section:'Bias & Credibility',prompt:'“Responsible parents support the safer school schedule. Do you support it?” What is the clearest problem with this question?',options:['Loaded wording','Cluster sampling','Random assignment','Replication'],answer:'Loaded wording',keyClue:'the wording pressures respondents toward one answer',why:'The question frames one response as more responsible, which can influence answers.',difficulty:2},
    {id:'v3355-d772-l2-05',section:'Bias & Credibility',prompt:'Employees are asked about their supervisor while their names appear on the form. Several may hide criticism because they fear being identified. This is primarily…',options:['Response bias','Sampling bias','Random variation','Stratified sampling'],answer:'Response bias',keyClue:'fear of identification can change the answers given',why:'Perceived lack of anonymity can cause inaccurate responses.',difficulty:3},
    {id:'v3355-d772-l2-06',section:'Bias & Credibility',prompt:'A company pays for research on its own product. Which conclusion is most appropriate?',options:['The study must be false','The potential conflict of interest should increase scrutiny','The sample is automatically random','The result is automatically statistically significant'],answer:'The potential conflict of interest should increase scrutiny',keyClue:'the sponsor has something to gain from a favorable result',why:'Self-interest is a credibility concern, but it does not automatically prove the findings are false.',difficulty:3},

    {id:'v3355-d772-l3-01',section:'Misrepresentation',prompt:'A bar chart showing values from 96 to 100 starts its vertical axis at 95, making a small difference look huge. What makes the graph misleading?',options:['Truncated axis exaggerates the visual difference','The graph has too many labels','The categories are alphabetical','The sample is stratified'],answer:'Truncated axis exaggerates the visual difference',keyClue:'the vertical scale begins close to the observed values instead of zero',why:'A truncated axis can visually magnify a modest numerical difference.',difficulty:2},
    {id:'v3355-d772-l3-02',section:'Misrepresentation',prompt:'A picture graph doubles both the height and width of an icon to represent twice as many people. Why can this exaggerate the change?',options:['The icon area grows by more than two times','The icon has a label','The graph uses categories','The values are quantitative'],answer:'The icon area grows by more than two times',keyClue:'both dimensions are enlarged',why:'Increasing both height and width increases area, making the visual increase larger than the numerical increase.',difficulty:3},
    {id:'v3355-d772-l3-03',section:'Misrepresentation',prompt:'Why can a 3-D pie chart make equal or similar slices appear different in size?',options:['Perspective distorts apparent area','Pie charts cannot show percentages','3-D graphs have no categories','The mean changes'],answer:'Perspective distorts apparent area',keyClue:'slices closer to the viewer can look larger',why:'The viewing angle can distort the apparent sizes of slices.',difficulty:2},
    {id:'v3355-d772-l3-04',section:'Misrepresentation',prompt:'A company tests a hair-growth product on only six people and advertises that it works for everyone. What is the clearest concern?',options:['The tiny sample cannot support such a broad generalization','Six is always statistically significant','The result proves causation','A small sample eliminates random variation'],answer:'The tiny sample cannot support such a broad generalization',keyClue:'only six participants are used to make a claim about everyone',why:'Very small samples are vulnerable to random variation and cannot justify sweeping population claims.',difficulty:2},
    {id:'v3355-d772-l3-05',section:'Misrepresentation',prompt:'A result is statistically significant. Which statement is still NOT guaranteed?',options:['The effect is practically important','The result was unlikely under the statistical model','A statistical test was used','The data produced evidence against chance alone'],answer:'The effect is practically important',keyClue:'statistical significance and practical importance answer different questions',why:'A statistically significant effect can still be too small to matter in practice.',difficulty:3},
    {id:'v3355-d772-l3-06',section:'Misrepresentation',prompt:'A researcher changes recorded values to make the results fit the desired conclusion. This is best described as…',options:['Falsification','Replication','Blinding','Randomization'],answer:'Falsification',keyClue:'existing research data are deliberately altered',why:'Falsification manipulates the research record or data rather than honestly reporting what occurred.',difficulty:2},

    {id:'v3355-d772-l4-01',section:'Conclusions',prompt:'A study finds that students who sleep more tend to have higher grades, but researchers did not assign sleep amounts. Which conclusion is justified?',options:['Sleep and grades are associated','More sleep definitely causes higher grades','Grades cause sleep','The relationship proves a treatment effect'],answer:'Sleep and grades are associated',keyClue:'no treatment was assigned',why:'Observational evidence can show association but does not by itself establish causation.',difficulty:2},
    {id:'v3355-d772-l4-02',section:'Conclusions',prompt:'Which design feature most directly supports a causal conclusion in an experiment?',options:['Random assignment to treatment groups','A voluntary response sample','A larger bar chart','A convenience sample'],answer:'Random assignment to treatment groups',keyClue:'treatment groups are created by chance',why:'Random assignment helps balance lurking variables across experimental groups and supports causal inference.',difficulty:3},
    {id:'v3355-d772-l4-03',section:'Conclusions',prompt:'Which feature most directly supports generalizing results from a sample to a larger population?',options:['Random sampling from the target population','Random assignment after selection','A placebo alone','A 3-D graph'],answer:'Random sampling from the target population',keyClue:'the sample is selected in a way intended to represent the population',why:'Random sampling supports population generalization when the sample adequately represents the target population.',difficulty:3},
    {id:'v3355-d772-l4-04',section:'Conclusions',prompt:'Researchers randomly assign volunteers to two treatments but recruit the volunteers through a convenience sample. What is the strongest conclusion?',options:['The treatment comparison may support causation for participants, but broad population generalization is limited','The result automatically represents all adults','Random assignment guarantees a representative sample','No causal comparison is possible'],answer:'The treatment comparison may support causation for participants, but broad population generalization is limited',keyClue:'random assignment is strong, but selection into the study is not representative',why:'Random assignment helps causal inference; convenience recruitment limits generalizability.',difficulty:4},
    {id:'v3355-d772-l4-05',section:'Conclusions',prompt:'A study reports a relationship between two variables. Before saying one variable caused the other, what should you check first?',options:['Whether the study actually imposed and randomized a treatment','Whether the graph uses purple','Whether the sample mean is an integer','Whether the title sounds scientific'],answer:'Whether the study actually imposed and randomized a treatment',keyClue:'causal conclusions depend on study design, not just association',why:'Causation requires stronger design evidence than a simple observed relationship.',difficulty:3},
    {id:'v3355-d772-l4-06',section:'Conclusions',prompt:'Which statement best follows the rule “the claim cannot be stronger than the evidence”?',options:['State only the conclusion the study design and data support','Always use causal language','Generalize every sample result to everyone','Ignore sampling limitations if the p-value is small'],answer:'State only the conclusion the study design and data support',keyClue:'match the wording of the conclusion to the strength of the evidence',why:'Sound conclusions respect the limits of sampling, design, and analysis.',difficulty:2}
  ];

  function realmQuestionPool(opts){
    const base=(typeof questionPool==='function'?questionPool(opts):[])||[];
    if(globalThis.S?.activeCourse!== 'D772')return base;
    const seen=new Set(),out=[];
    for(const q of [...base,...D772_REALM_SUPPLEMENT]){
      if(!q?.prompt||!q?.answer)continue;
      const key=normalize(q.prompt)+'|'+normalize(q.answer);
      if(seen.has(key))continue;
      seen.add(key);out.push(q);
    }
    return out;
  }

  /* ---------- Rune Sort ---------- */
  function buildRuneSort(){
    const pool=realmQuestionPool().filter(q=>q?.prompt&&q?.section);
    const groups=new Map();
    pool.forEach(q=>{
      const key=String(q.section||'').trim();if(!key)return;
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(q);
    });
    const categories=shuffleCopy([...groups.entries()].filter(([,rows])=>rows.length>=2)).slice(0,4).map(([name])=>name);
    if(categories.length<2)return null;
    const items=[];
    categories.forEach(cat=>shuffleCopy(groups.get(cat)).slice(0,2).forEach(q=>items.push({id:q.id,prompt:q.prompt,section:cat,choice:null,ok:null,rewarded:false,attempts:0,tried:[]})));
    return {categories,categoryLabels:Object.fromEntries(categories.map(c=>[c,categoryLabel(c)])),items:shuffleCopy(items).slice(0,8)};
  }
  globalThis.startRuneSort=function(){
    const built=buildRuneSort();
    if(!built){try{alert('Rune Sort needs at least two course sections with enough questions. Try another Realm for this course.')}catch(_){}return}
    session={type:'runesort',opts:{label:'Rune Sort'},categories:built.categories,categoryLabels:built.categoryLabels||{},items:built.items,score:0,finished:false};
    if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.runeSortPick=function(i,cat){
    if(!session||session.type!=='runesort'||session.finished)return;
    const x=session.items?.[i];if(!x)return;
    x.choice=cat;x.ok=normalize(cat)===normalize(x.section);
    x.attempts=Number(x.attempts||0)+1;
    x.tried=Array.isArray(x.tried)?x.tried:[];
    if(!x.ok&&!x.tried.includes(cat))x.tried.push(cat);
    if(x.ok&&!x.rewarded){
      x.rewarded=true;session.score++;guardianReact('correct',{mode:'runesort',qid:x.id});
      session.guardianMessage=guardianLine(session.score>=3?'streak':'correct');
    }else if(!x.ok) session.guardianMessage=guardianLine('miss');
    render?.();
  };
  globalThis.finishRuneSort=function(){
    if(!session||session.type!=='runesort')return;
    session.finished=true;
    const total=session.items.length,score=session.items.filter(x=>x.ok).length;
    session.score=score;session.recordOutcome=recordRealm('runesort',score,total,score===total);
    if(score>=Math.ceil(total*.75)){addReward('Rune Sort cleared',12,1);guardianReact('concept',{mode:'runesort'})}
    render?.();
  };
  function runeSortHTML(){
    if(session.finished)return realmResultHTML('Rune Sort','runesort',session.score,session.items.length,session.score===session.items.length,'You sorted '+session.score+' of '+session.items.length+' runes correctly.');
    const done=session.items.filter(x=>x.ok).length;
    return '<div class="qwrap realmMode realmRuneSort">'+realmScene('runesort')+guardianBanner(session.guardianMessage||'Sort the runes. I will react when the pattern clicks.')+
      '<div class="qtop"><span class="qbadge">ᚱ Rune Sort</span><b>'+done+'/'+session.items.length+' locked</b></div>'+trialProgress('runesort')+trialGuide('runesort')+
      '<div class="card"><div class="realmSortLegend"><small>SORT DESTINATIONS</small><div>'+session.categories.map(cat=>'<span><i>ᚱ</i>'+E(session.categoryLabels?.[cat]||categoryLabel(cat))+'</span>').join('')+'</div></div><p>Choose which course section each prompt belongs to. Correct runes lock into place.</p>'+
      '<div class="realmSortBoard">'+session.items.map((x,i)=>'<article class="realmSortRune '+(x.ok?'locked':x.choice?'miss':'')+'"><b>'+E(x.prompt)+'</b><div class="realmSortChoices">'+session.categories.map(cat=>{
          const tried=(x.tried||[]).includes(cat);
          return '<button '+(x.ok||tried?'disabled':'')+' class="'+(tried?'tried':'')+'" data-cat="'+E(cat)+'" onclick="runeSortPick('+i+',this.dataset.cat)">'+E(session.categoryLabels?.[cat]||categoryLabel(cat))+(tried?' ✕':'')+'</button>';
        }).join('')+'</div>'+(x.choice?'<small class="'+(x.ok?'strong':'weak')+'">'+(x.ok?'✓ Rune locked':'That destination is sealed for this rune. Try another.')+'</small>':'')+
        (!x.ok&&Number(x.attempts||0)>=2?'<div class="realmRuneHint">✦ Hint: compare the prompt to the <b>'+E(session.categoryLabels?.[x.section]||categoryLabel(x.section))+'</b> concepts you have studied.</div>':'')+'</article>').join('')+'</div>'+
      '<button class="btn violet" onclick="finishRuneSort()">Finish Rune Sort</button></div></div>';
  }

  /* ---------- Oracle Lens ---------- */
  function nextOracle(){
    const pool=realmQuestionPool().filter(q=>q?.prompt&&q?.options?.length>=2);
    const q=pickAdaptive(pool);if(!q)return false;
    const otherClues=shuffleCopy(pool.filter(x=>x.id!==q.id&&x.keyClue).map(x=>x.keyClue)).slice(0,2);
    const correctClue=q.keyClue||q.distractorCoach||('Focus on the exact task in: '+q.prompt);
    const lenses=shuffleCopy([correctClue,...otherClues]).slice(0,3);
    while(lenses.length<3)lenses.push('A related detail that does not control the answer.');
    session.current=q;session.correctLens=correctClue;session.lenses=lenses;session.lensChoice=null;session.lensCorrect=false;session.chosen=null;session.answered=false;session.round++;
    return true;
  }
  globalThis.startOracleLens=function(){
    session={type:'oraclelens',opts:{label:'Oracle Lens'},round:0,limit:8,score:0,clarity:0,clarityStreak:0,bestClarityStreak:0,finished:false,questions:[]};
    nextOracle();if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.oracleChooseLens=function(value){
    if(!session||session.type!=='oraclelens'||session.answered)return;
    session.lensChoice=value;session.lensCorrect=normalize(value)===normalize(session.correctLens);
    if(session.lensCorrect){
      session.clarity++;
      session.clarityStreak=Number(session.clarityStreak||0)+1;
      session.bestClarityStreak=Math.max(Number(session.bestClarityStreak||0),session.clarityStreak);
    }else session.clarityStreak=0;
    render?.();
  };
  globalThis.oracleAnswer=function(chosen){
    if(!session||session.type!=='oraclelens'||session.answered||!session.lensChoice)return;
    const q=session.current,correct=chosen===q.answer;
    session.chosen=chosen;session.answered=true;session.score+=correct?1:0;session.questions.push(q.id);
    recordAnswer(q,chosen,correct,'oraclelens');
    session.guardianMessage=guardianLine(correct?(session.clarityStreak>=2?'streak':'correct'):'miss');
    render?.();
  };
  globalThis.oracleNext=function(){
    if(!session||session.type!=='oraclelens')return;
    if(session.round>=session.limit){
      session.finished=true;
      session.recordOutcome=recordRealm('oraclelens',session.score,session.limit,session.score===session.limit);
      if(session.score>=6){addReward('Oracle Lens cleared',15,1);guardianReact('concept',{mode:'oraclelens'})}
    }else nextOracle();
    render?.();
  };
  function oracleHTML(){
    if(session.finished)return realmResultHTML('Oracle Lens','oraclelens',session.score,session.limit,session.score===session.limit,'You answered '+session.score+'/'+session.limit+' correctly and found '+session.clarity+' controlling clues.');
    const q=session.current;
    return '<div class="qwrap realmMode realmOracle">'+realmScene('oraclelens')+guardianBanner(session.guardianMessage||'Find what actually controls the answer before you commit.')+
      '<div class="qtop"><span class="qbadge">◉ Oracle Lens</span><div class="realmMiniHUD"><span>Round '+session.round+'/'+session.limit+'</span><span>Clarity ✦ '+session.clarityStreak+'</span></div></div>'+trialProgress('oraclelens')+trialGuide('oraclelens')+
      '<div class="card"><div class="tiny">'+E(q.section||'Mixed')+' • Difficulty '+Number(q.difficulty||1)+'</div><div class="question">'+E(q.prompt)+'</div>'+
      '<h3>1. Which clue should the Oracle focus on?</h3><div class="realmLensChoices">'+session.lenses.map(l=>'<button class="'+(session.lensChoice===l?(session.lensCorrect?'correct':'selected'):'')+'" '+(session.answered?'disabled':'')+' data-lens="'+E(l)+'" onclick="oracleChooseLens(this.dataset.lens)">'+E(l)+'</button>').join('')+'</div>'+
      (session.lensChoice?'<p class="'+(session.lensCorrect?'strong':'weak')+'">'+(session.lensCorrect?'✦ Lens aligned. Now answer through that clue.':'That clue is related, but another clue controls the answer more directly.')+'</p>':'')+
      '<h3>2. Choose the best answer.</h3><div class="options">'+q.options.map(o=>'<button class="opt '+(session.answered?(o===q.answer?'correct':o===session.chosen?'wrong':''):'')+'" '+(!session.lensChoice||session.answered?'disabled':'')+' data-answer="'+E(o)+'" onclick="oracleAnswer(this.dataset.answer)">'+E(o)+'</button>').join('')+'</div>'+
      (session.answered?'<div class="realmOracleFeedback"><b class="'+(session.chosen===q.answer?'strong':'weak')+'">'+(session.chosen===q.answer?'✓ Correct':'Not quite')+'</b><p>'+E(q.why||q.distractorCoach||'Use the controlling clue to discriminate between close options.')+'</p><button class="btn violet" onclick="oracleNext()">Next lens →</button></div>':'')+
      '</div></div>';
  }


  /* ---------- Memory Constellation ---------- */
  function buildConstellation(){
    const pool=realmQuestionPool().filter(q=>q?.prompt&&q?.answer);
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
  function updateConstellationLinks(){
    if(!session||session.type!=='constellation'||typeof document==='undefined')return;
    const grid=document.querySelector?.('.realmConstellationGrid');
    const layer=document.querySelector?.('.realmConstellationLinks');
    if(!grid||!layer||typeof grid.getBoundingClientRect!=='function')return;
    const gridRect=grid.getBoundingClientRect();
    const links=Array.isArray(session.links)?session.links:[];
    layer.innerHTML=links.map(link=>{
      const aEl=grid.querySelector?.('[data-card-index="'+link.a+'"]');
      const bEl=grid.querySelector?.('[data-card-index="'+link.b+'"]');
      if(!aEl||!bEl)return '';
      const a=aEl.getBoundingClientRect(),b=bEl.getBoundingClientRect();
      const x1=(a.left-gridRect.left)+(a.width/2),y1=(a.top-gridRect.top)+(a.height/2);
      const x2=(b.left-gridRect.left)+(b.width/2),y2=(b.top-gridRect.top)+(b.height/2);
      const dx=x2-x1,dy=y2-y1,len=Math.max(1,Math.sqrt(dx*dx+dy*dy));
      const sparkle1=.28,sparkle2=.62;
      const sx1=x1+dx*sparkle1,sy1=y1+dy*sparkle1,sx2=x1+dx*sparkle2,sy2=y1+dy*sparkle2;
      return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" pathLength="1" class="realmConstellationLine newlyDrawn"></line>'+
        '<circle cx="'+x1+'" cy="'+y1+'" r="7" class="realmConstellationNode"></circle>'+
        '<circle cx="'+x2+'" cy="'+y2+'" r="7" class="realmConstellationNode"></circle>'+
        '<circle cx="'+sx1+'" cy="'+sy1+'" r="3.5" class="realmConstellationSparkle sparkOne"></circle>'+
        '<circle cx="'+sx2+'" cy="'+sy2+'" r="2.8" class="realmConstellationSparkle sparkTwo"></circle>';
    }).join('');
  }
  function showConstellationCompletion(){
    if(typeof document==='undefined')return;
    const wrap=document.querySelector?.('.realmConstellationWrap');
    if(!wrap)return;
    wrap.classList.add('complete');
    const finale=document.createElement('div');
    finale.className='realmConstellationFinale';
    finale.innerHTML='<span class="finalStar fs1">✦</span><span class="finalStar fs2">✧</span><span class="finalStar fs3">✦</span><span class="finalStar fs4">✧</span><span class="finalStar fs5">✦</span><span class="finalStar fs6">✧</span><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="12,72 28,34 48,58 66,24 86,44 70,78 42,82 12,72" class="realmFinalConstellationLine"></polyline></svg><b>CONSTELLATION COMPLETE</b>';
    wrap.appendChild(finale);
    globalThis.setTimeout?.(()=>finale.classList.add('show'),30);
  }
  function renderKeepScroll(){
    const w=globalThis.window||globalThis;
    const y=Number(w?.scrollY||w?.pageYOffset||0);
    render?.();
    const after=()=>{
      try{w?.scrollTo?.(0,y)}catch(_){}
      updateConstellationLinks();
    };
    if(typeof globalThis.requestAnimationFrame==='function')globalThis.requestAnimationFrame(after);
    else after();
  }
  globalThis.startMemoryConstellation=function(){
    const cards=buildConstellation();
    if(!cards){try{alert('Memory Constellation needs at least four usable course questions. Try another Realm for this course.')}catch(_){}return}
    session={type:'constellation',opts:{label:'Memory Constellation'},cards,open:[],matched:0,moves:0,finished:false,score:0,busy:false,links:[],burst:[]};
    if(globalThis.S)S.screen='mission';
    renderKeepScroll();
  };
  globalThis.constellationPick=function(i){
    if(!session||session.type!=='constellation'||session.finished||session.busy)return;
    const card=session.cards?.[i];
    if(!card||card.matched||session.open.includes(i)||session.open.length>=2)return;
    session.open.push(i);
    if(session.open.length===1){renderKeepScroll();return}

    session.moves++;
    session.busy=true;
    const [aIndex,bIndex]=session.open;
    const a=session.cards[aIndex],b=session.cards[bIndex];
    const isMatch=a.pair===b.pair&&a.kind!==b.kind;

    if(isMatch){
      a.matched=b.matched=true;
      session.matched++;
      session.score++;
      session.links.push({a:aIndex,b:bIndex,pair:a.pair});
      session.burst=[aIndex,bIndex];
      session.open=[];
      session.busy=false;
      guardianReact('correct',{mode:'constellation',qid:a.qid});
      session.guardianMessage=guardianLine(session.matched>=3?'streak':'correct');

      if(session.matched>=session.cards.length/2){
        const total=session.cards.length/2;
        const efficiency=Math.max(1,total*2-session.moves+total);
        session.recordOutcome=recordRealm('constellation',efficiency,total*2,true);
        addReward('Memory Constellation completed',16,1);
        guardianReact('concept',{mode:'constellation'});
        session.completing=true;
      }

      renderKeepScroll();

      if(session.completing){
        setTimeout(()=>{
          if(session?.type==='constellation'){
            showConstellationCompletion();
            setTimeout(()=>{
              if(session?.type==='constellation'){
                session.finished=true;
                session.completing=false;
                renderKeepScroll();
              }
            },1500);
          }
        },220);
      }else{
        setTimeout(()=>{
          if(session?.type==='constellation'){
            session.burst=[];
            renderKeepScroll();
          }
        },900);
      }
      return;
    }

    renderKeepScroll();
    setTimeout(()=>{
      if(session?.type==='constellation'){
        session.open=[];
        session.busy=false;
        renderKeepScroll();
      }
    },3000);
  };
  function constellationHTML(){
    const total=session.cards.length/2;
    if(session.finished)return realmResultHTML('Memory Constellation','constellation',session.matched,total,true,'You linked all '+total+' concept pairs in '+session.moves+' moves.');
    return '<div class="qwrap realmMode realmConstellation">'+realmScene('constellation')+guardianBanner(session.guardianMessage||'Find the clue that belongs with its answer. Matched stars will stay connected.')+
      '<div class="qtop"><span class="qbadge">✧ Memory Constellation</span><b>'+session.matched+'/'+total+' stars linked • '+session.moves+' moves</b></div>'+trialProgress('constellation')+trialGuide('constellation')+
      '<div class="card"><p>Turn over two cards. Match a <b>CLUE</b> with its correct <b>ANSWER</b>. If they do not match, both cards stay open for about 3 seconds so you can read them.</p>'+
      '<div class="realmConstellationWrap"><svg class="realmConstellationLinks" aria-hidden="true"></svg>'+
      '<div class="realmConstellationGrid">'+session.cards.map((c,i)=>{
        const open=session.open.includes(i)||c.matched;
        const burst=(session.burst||[]).includes(i);
        return '<button class="realmStarCard '+(open?'open ':'')+(c.matched?'matched ':'')+(burst?'burst':'')+'" data-card-index="'+i+'" '+(c.matched?'disabled':'')+' onclick="constellationPick('+i+')" aria-label="'+E(open?c.text:'Hidden constellation card')+'">'+
          '<span class="realmStarFront">✦</span><span class="realmStarBack"><small>'+E(c.kind==='clue'?'CLUE':'ANSWER')+'</small><b>'+E(c.text)+'</b></span>'+
          '<span class="realmStarBurst" aria-hidden="true">✦ ✧ ✦</span></button>';
      }).join('')+'</div></div></div></div>';
  }

  /* ---------- Hex Breaker ---------- */
  function nextHex(){
    const pool=realmQuestionPool().filter(q=>q?.prompt&&q?.options?.length>=2&&q?.answer);
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
    session={type:'hexbreaker',opts:{label:'Hex Breaker'},round:0,limit:8,score:0,judgmentScore:0,repairScore:0,breakStreak:0,bestBreakStreak:0,finished:false,questions:[]};
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
    if(judgmentCorrect&&repairCorrect){
      session.score++;
      session.breakStreak=Number(session.breakStreak||0)+1;
      session.bestBreakStreak=Math.max(Number(session.bestBreakStreak||0),session.breakStreak);
    }else session.breakStreak=0;
    const fullyCorrect=judgmentCorrect&&repairCorrect;
    recordAnswer(q,session.claimValid?session.claim:value,fullyCorrect,'hexbreaker');
    session.guardianMessage=guardianLine(fullyCorrect?(session.breakStreak>=2?'streak':'correct'):'miss');
    render?.();
  };
  globalThis.hexNext=function(){
    if(!session||session.type!=='hexbreaker')return;
    if(session.round>=session.limit){
      session.finished=true;
      session.recordOutcome=recordRealm('hexbreaker',session.score,session.limit,session.score===session.limit);
      if(session.score>=6){addReward('Hex Breaker cleared',18,1);guardianReact('concept',{mode:'hexbreaker'})}
    }else nextHex();
    render?.();
  };
  function hexBreakerHTML(){
    if(session.finished)return realmResultHTML('Hex Breaker','hexbreaker',session.score,session.limit,session.score===session.limit,'You fully broke '+session.score+'/'+session.limit+' hexes. Judgment: '+session.judgmentScore+'/'+session.limit+' • Repairs: '+session.repairScore+'/'+session.limit+'.');
    const q=session.current;
    const judgementCorrect=session.judgment!=null&&((session.judgment==='valid')===session.claimValid);
    return '<div class="qwrap realmMode realmHexBreaker">'+realmScene('hexbreaker')+guardianBanner(session.guardianMessage||'Do not trust every glowing claim. Decide whether it is sound before you repair it.')+
      '<div class="qtop"><span class="qbadge">⬡ Hex Breaker</span><div class="realmMiniHUD"><span>Hex '+session.round+'/'+session.limit+'</span><span>Break streak ✦ '+session.breakStreak+'</span></div></div>'+trialProgress('hexbreaker')+trialGuide('hexbreaker')+
      '<div class="card"><div class="tiny">'+E(q.section||'Mixed')+' • '+E(q.prompt)+'</div>'+
      '<div class="realmHexClaim"><small>ENCHANTED CLAIM</small><blockquote>'+E(session.claim)+'</blockquote></div>'+
      '<h3>1. Is this claim valid or hexed?</h3><div class="realmHexJudge">'+
        '<button class="'+(session.judgment==='valid'?'selected':'')+'" '+(session.answered?'disabled':'')+' onclick="hexJudge(&quot;valid&quot;)">✓ Valid</button>'+
        '<button class="'+(session.judgment==='hexed'?'selected':'')+'" '+(session.answered?'disabled':'')+' onclick="hexJudge(&quot;hexed&quot;)">⬡ Hexed</button></div>'+
      (session.judgment!=null?'<p class="'+(judgementCorrect?'strong':'weak')+'">'+(judgementCorrect?'Your diagnosis is on target.':'The claim is '+(session.claimValid?'valid':'hexed')+'.')+'</p>':'')+
      (!session.claimValid&&session.judgment!=null?
        '<h3>2. Break the hex: choose the correct repair.</h3><div class="realmHexRepairs">'+q.options.map(o=>'<button '+(session.answered?'disabled':'')+' data-repair="'+E(o)+'" onclick="hexRepair(this.dataset.repair)">'+E(o)+'</button>').join('')+'</div>':
        session.claimValid&&session.judgment!=null&&!session.answered?'<button class="btn violet" data-repair="'+E(q.answer)+'" onclick="hexRepair(this.dataset.repair)">Seal this valid claim ✦</button>':'')+
      (session.answered?'<div class="realmHexFeedback"><b class="'+(session.score>=session.round?'strong':'')+'">'+(judgementCorrect&&((session.claimValid)||(session.repair===q.answer))?'✦ Hex broken':'Review the repair')+'</b><p>'+E(q.why||q.distractorCoach||'Compare the claim with the exact concept the question is testing.')+'</p><button class="btn violet" onclick="hexNext()">Next hex →</button></div>':'')+
      '</div></div>';
  }

  /* ---------- Guardian Gauntlet ---------- */
  function nextGauntlet(){
    const pool=realmQuestionPool({hard:true}).filter(q=>q?.prompt&&q?.options?.length>=2);
    if(!pool.length)return false;
    const q=pickAdaptive(pool);session.current=q;session.answered=false;session.chosen=null;session.questions.push(q.id);session.round++;return true;
  }
  globalThis.startGuardianGauntlet=function(){
    const g=guardian();
    session={type:'gauntlet',opts:{label:'Guardian Gauntlet'},round:0,limit:12,score:0,combo:0,maxCombo:0,playerHP:5,bossHP:100,shield:true,shieldUsed:false,finished:false,won:false,questions:[],guardianName:g?.name||'Guardian'};
    nextGauntlet();if(globalThis.S)S.screen='mission';render?.();
  };
  globalThis.gauntletAnswer=function(chosen){
    if(!session||session.type!=='gauntlet'||session.answered)return;
    const q=session.current,correct=chosen===q.answer;
    session.chosen=chosen;session.answered=true;
    if(correct){
      session.score++;session.combo++;session.maxCombo=Math.max(Number(session.maxCombo||0),session.combo);
      session.guardianMessage=guardianLine(session.combo>=3?'streak':'correct');
      const dmg=10+Math.min(10,Number(q.difficulty||1)*2)+Math.min(6,session.combo);
      session.bossHP=Math.max(0,session.bossHP-dmg);
    }else{
      session.combo=0;
      if(session.shield&&!session.shieldUsed){
        session.shieldUsed=true;guardianReact('care',{mode:'gauntlet',shield:true});
        session.guardianMessage=guardianLine('shield');
      } else {
        session.playerHP=Math.max(0,session.playerHP-1);
        session.guardianMessage=guardianLine('miss');
      }
    }
    recordAnswer(q,chosen,correct,'gauntlet');
    if(session.bossHP<=0){session.finished=true;session.won=true;session.recordOutcome=recordRealm('gauntlet',session.score,session.round,true);addReward('Guardian Gauntlet victory',24,2);guardianReact('mastery',{mode:'gauntlet'})}
    else if(session.playerHP<=0||session.round>=session.limit){session.finished=true;session.won=session.bossHP<=0;session.recordOutcome=recordRealm('gauntlet',session.score,session.round,session.won);if(session.score>=7)addReward('Guardian Gauntlet run',14,1)}
    render?.();
  };
  globalThis.gauntletNext=function(){
    if(!session||session.type!=='gauntlet'||session.finished)return;
    nextGauntlet();render?.();
  };
  function gauntletHTML(){
    if(session.finished)return realmResultHTML('Guardian Gauntlet','gauntlet',session.score,Math.max(1,session.round),session.won,session.won?(session.guardianName+' helped you break the boss ward.'):'The boss ward held this time. Your run still added practice data.');
    const q=session.current,phase=bossPhase(session.bossHP);
    return '<div class="qwrap realmMode realmGauntlet '+phase.className+'">'+realmScene('gauntlet')+guardianBanner(session.guardianMessage||(session.shieldUsed?'The shield is spent. I am still with you.':'I can absorb one missed answer for you this run.'))+
      '<div class="qtop"><span class="qbadge">♛ Guardian Gauntlet</span><div><span class="hearts">'+('💗'.repeat(session.playerHP))+'</span> <span class="comboGlow">✦ x'+Math.max(1,session.combo)+'</span></div></div>'+trialProgress('gauntlet')+trialGuide('gauntlet')+
      '<div class="realmBossHUD"><div><div class="realmBossPhase"><small>'+E(phase.name)+'</small><b>Boss Ward</b><em>'+E(phase.line)+'</em></div><div class="bossBar"><i style="width:'+session.bossHP+'%"></i></div><small>'+session.bossHP+'% remaining</small></div><span class="realmShield '+(session.shieldUsed?'spent':'ready')+'">'+(session.shieldUsed?'◇ Shield spent':'◇ Guardian shield ready')+'</span></div>'+
      '<div class="card"><div class="tiny">'+E(q.section||'Mixed')+' • Difficulty '+Number(q.difficulty||1)+' • Round '+session.round+'/'+session.limit+'</div><div class="question">'+E(q.prompt)+'</div>'+
      '<div class="options">'+q.options.map(o=>'<button class="opt '+(session.answered?(o===q.answer?'correct':o===session.chosen?'wrong':''):'')+'" '+(session.answered?'disabled':'')+' data-answer="'+E(o)+'" onclick="gauntletAnswer(this.dataset.answer)">'+E(o)+'</button>').join('')+'</div>'+
      (session.answered?'<div class="realmGauntletFeedback"><p class="'+(session.chosen===q.answer?'strong':'weak')+'">'+(session.chosen===q.answer?'Direct hit! The boss ward cracked.':session.shieldUsed&&session.playerHP===5?'Your Guardian blocked that hit.':'The boss struck back.')+'</p><p>'+E(q.why||'Review the controlling clue before the next round.')+'</p>'+(session.finished?'':'<button class="btn violet" onclick="gauntletNext()">Next round →</button>')+'</div>':'')+
      '</div></div>';
  }

  function realmResultStats(id){
    if(!session)return [];
    if(id==='assessmentsigilsort')return [['Sigils aligned',session.score+'/'+(session.items?.length||0)],['Chamber',ASSESSMENT_SIGIL_FAMILIES[session.family]?.label||'Assessment types'],['Guardian reactions',session.questions?.length||0]];
    if(id==='runesort'){
      const attempts=(session.items||[]).reduce((n,x)=>n+Number(x.attempts||0),0);
      return [['Runes locked',session.score+'/'+(session.items?.length||0)],['Total attempts',attempts],['First-try locks',(session.items||[]).filter(x=>x.ok&&Number(x.attempts||0)===1).length]];
    }
    if(id==='oraclelens')return [['Answers',session.score+'/'+session.limit],['Clues aligned',session.clarity+'/'+session.limit],['Best clarity streak',session.bestClarityStreak||0]];
    if(id==='constellation')return [['Pairs linked',session.matched+'/'+(session.cards?.length/2||0)],['Moves',session.moves],['Glowing links',session.links?.length||0]];
    if(id==='hexbreaker')return [['Hexes broken',session.score+'/'+session.limit],['Correct judgments',session.judgmentScore+'/'+session.limit],['Best break streak',session.bestBreakStreak||0]];
    return [['Boss damage',Math.max(0,100-Number(session.bossHP||0))+'%'],['Best combo','x'+Math.max(1,Number(session.maxCombo||0))],['Hearts left',session.playerHP||0]];
  }
  function realmResultHTML(title,id,score,total,won,detail){
    const acc=percent(score,total),g=guardian(),outcome=session?.recordOutcome||null,stats=realmResultStats(id);
    return '<div class="qwrap realmMode realmResult">'+
      '<section class="realmResultHero">'+
      (outcome?.newBest?'<div class="realmNewBest">✦ NEW REALM BEST ✦</div>':'')+
      '<small>'+(won?'TRIAL CLEARED':'TRIAL COMPLETE')+'</small><h2>'+E(title)+'</h2><div class="realmResultScore">'+score+'/'+total+' <span>'+acc+'%</span></div><p>'+E(detail)+'</p>'+
      '<div class="realmResultStats">'+stats.map(([label,value])=>'<div><small>'+E(label)+'</small><b>'+E(value)+'</b></div>').join('')+'</div>'+
      (g?'<div class="realmResultGuardian">'+(g.image?'<img src="'+E(g.image)+'" alt="'+E(g.name)+'" style="filter:hue-rotate('+Number(g.hue||0)+'deg)">':'<span>'+E(g.icon||'✦')+'</span>')+'<div><b>'+E(g.name)+'</b><p>'+E(guardianLine('finish'))+'</p></div></div>':'')+
      '<div class="heroBtns"><button class="btn primary" onclick="'+(id==='assessmentsigilsort'?'startAssessmentSigilSort()':id==='runesort'?'startRuneSort()':id==='oraclelens'?'startOracleLens()':id==='constellation'?'startMemoryConstellation()':id==='hexbreaker'?'startHexBreaker()':'startGuardianGauntlet()')+'">Play again</button><button class="btn secondary" onclick="session=null;navigate(\'games\')">Back to Game Realm</button></div></section></div>';
  }

  const baseSessionHTML=typeof sessionHTML==='function'?sessionHTML:null;
  if(baseSessionHTML){
    sessionHTML=function(){
      if(session?.type==='assessmentsigilsort')return assessmentSigilHTML();
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
    realmQuestionPool,
    d772RealmPool:()=>D772_REALM_SUPPLEMENT.slice(),
    assessmentSigilPool,
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
  document.documentElement.dataset.majickRealmVariety='3355';
})();