// Majick Studies V3.3.22 — MAIN UI RECOVERY
(function(){
'use strict';
const VERSION='3.3.22';

function installStyles(){
  if(document.getElementById('v3322RecoveryStyles'))return;
  const s=document.createElement('style');
  s.id='v3322RecoveryStyles';
  s.textContent=`
    .phase4Wrap,.v3317HomeSanctuary{position:relative!important;z-index:0!important;isolation:isolate!important;contain:layout paint!important}
    .phase4Frame,.v3317SanctuaryFrame{position:relative!important;z-index:0!important;max-width:100%!important;pointer-events:auto!important}
    #content>.sectionTitle,#content>.grid,#content>.card,#content>.grimoireEntry,
    .studyCard,.grimoireEntry,.majCareDock{position:relative;z-index:3}
    .studyCard button,.grimoireEntry button,.sectionTitle button,.majCareDock button{position:relative;z-index:8;pointer-events:auto!important}
    .v3317HomeSanctuary+*,.phase4Wrap+*{position:relative;z-index:2}
  `;
  document.head.appendChild(s);
}

const originalPractice=window.practiceTopics;
window.practiceTopics=function(topics){
  const clean=(Array.isArray(topics)?topics:[topics]).filter(Boolean).map(String);
  try{
    if(typeof window.startSession==='function'){
      window.session=null;
      return window.startSession(clean.length?'topic':'mixed',{
        label:clean.length?'Topic Practice':'Mixed Practice',
        topics:clean,
        limit:12
      });
    }
  }catch(e){console.warn('V3.3.22 topic practice recovery',e)}
  return typeof originalPractice==='function'?originalPractice(clean):undefined;
};

const originalRaid=window.startGrimoireRaid;
window.startGrimoireRaid=function(){
  try{
    let topics=[];
    if(typeof window.mistakeEntries==='function'){
      topics=[...new Set((window.mistakeEntries()||[]).slice(0,8).map(x=>x?.a?.topicId).filter(Boolean))];
    }
    if(typeof window.startSession==='function'){
      window.session=null;
      return window.startSession(topics.length?'grimoire':'mixed',{
        label:topics.length?'Mistake Grimoire Raid':'Mixed Repair Practice',
        topics,
        limit:12
      });
    }
  }catch(e){console.warn('V3.3.22 Grimoire recovery',e)}
  return typeof originalRaid==='function'?originalRaid():undefined;
};

installStyles();
window.MajickRecoveryUI={
  VERSION,
  inspect(){
    return {
      version:VERSION,
      styles:!!document.getElementById('v3322RecoveryStyles'),
      practice:typeof window.practiceTopics==='function',
      grimoire:typeof window.startGrimoireRaid==='function'
    };
  }
};
})();