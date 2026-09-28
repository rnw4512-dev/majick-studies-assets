(()=>{
'use strict';
const VERSION='3.3.46';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PERSONALITY={
  luna:{place:'the moon window',habit:'studies the room before approaching',moment:'Velora settles beside your notes, then offers a slow, approving blink.',care:'Velora leans into your hand and returns to her watch by the window.',sigil:'☾'},
  nova:{place:'the observatory',habit:'follows moving lights and investigates discoveries',moment:'Solstice circles the telescope and trots back to see what you found.',care:'Solstice gives a bright little turn, then waits for the next adventure.',sigil:'✦'},
  ember:{place:'the rune puzzle',habit:'tests every curious object',moment:'Cascade nudges a rune into place and looks remarkably pleased.',care:'Cascade answers with a tiny spark and an eager bounce.',sigil:'◇'},
  mallow:{place:'the moonflower nook',habit:'makes a soft landing near friends',moment:'Aurelia folds her wings and curls up within reach.',care:'Aurelia relaxes beside you before drifting back to her cushion.',sigil:'♡'},
  vesper:{place:'the high library shelf',habit:'observes quietly before joining in',moment:'Vesper tilts their head at your notes and offers a gentle trill.',care:'Vesper closes their eyes for a moment, then returns to their perch.',sigil:'✧'},
  briar:{place:'the moon garden',habit:'lingers near the growing things',moment:'Briar pauses among the vines, listening before stepping closer.',care:'Briar rests their head beside you, then wanders back to the garden.',sigil:'❀'},
  zephyr:{place:'the ribbon basket',habit:'turns every hallway into an expedition',moment:'Zephyr darts past the ribbon basket and doubles back for you.',care:'Zephyr gives one delighted hop before resuming their patrol.',sigil:'✧'},
  prism:{place:'the water basin',habit:'watches reflections change',moment:'Prism follows a shimmer across the basin and waits beside it.',care:'Prism makes a small ripple and stays near your hand.',sigil:'◇'},
  rook:{place:'the strategy table',habit:'considers a move before making it',moment:'Rook studies the rune tokens as if planning three turns ahead.',care:'Rook accepts the attention with a solemn little nod.',sigil:'♟'},
  solara:{place:'the sunlit rug',habit:'welcomes anyone who comes near',moment:'Solara trots into the warmest patch of light and invites company.',care:'Solara curls into a bright, contented ball beside you.',sigil:'☀'}
};
const FALLBACK={place:'their favorite Sanctuary corner',habit:'explores at their own pace',moment:'Your Guardian comes closer to see what you are doing.',care:'Your Guardian stays beside you for a peaceful moment.',sigil:'✦'};
function persona(type){return PERSONALITY[type]||FALLBACK}
function pets(){return (window.S?.legacy?.pets||[]).filter(Boolean)}
function sceneHTML(){
  const rows=pets();if(!rows.length)return '';
  const care=window.MajickGuardianCare?.snapshot?.();
  return '<section class="lcScene" aria-label="Guardian moments"><div class="lcSceneHead"><span>✦ TONIGHT IN THE CONSERVATORY</span><p>Your Guardians have their own places and habits. Spend a moment with one whenever you like.</p></div><div class="lcSceneGrid">'+rows.map(p=>{
    const d=persona(p.type),g=care?.guardians?.[p.id];
    const last=window.S?.majickAccount?.guardianCare?.log?.find(x=>x.petId===p.id);
    const recent=last&&Date.now()-Date.parse(last.at)<15*60*1000;
    return '<article class="lcGuardianMoment" data-guardian="'+E(p.id)+'"><span class="lcSigil" aria-hidden="true">'+E(d.sigil)+'</span><div><h3>'+E(p.name)+'</h3><p>'+E(recent?d.care:d.moment)+'</p><small>Often found by '+E(d.place)+' • '+E(d.habit)+'</small></div><button type="button" data-lc-greet="'+E(p.id)+'" aria-label="Spend a moment with '+E(p.name)+'">Spend a moment</button></article>';
  }).join('')+'</div></section>';
}
function decorateCompanions(){
  const mood=document.querySelector('.lfMoodPanel');if(!mood)return;
  mood.outerHTML=sceneHTML();
  document.querySelectorAll('[data-lc-greet]').forEach(b=>b.addEventListener('click',()=>{
    const p=pets().find(x=>x.id===b.dataset.lcGreet);if(!p)return;
    window.majickCareAction?.(p.id,'affection');
    window.MajickGuardianCore?.sound?.('hello',p.type);
    setTimeout(decorateCompanions,0);
  }));
  const heading=[...document.querySelectorAll('.lfSubhead')].find(h=>h.textContent.trim()==='Egg Incubator');
  const oldGrid=heading?.nextElementSibling;
  const care=window.MajickGuardianCare;
  if(oldGrid?.classList.contains('companionGrid')&&care?.eggIncubatorHTML){
    const holder=document.createElement('div');holder.innerHTML=care.eggIncubatorHTML(care.snapshot());
    if(holder.firstElementChild)oldGrid.replaceWith(holder.firstElementChild);
  }
}
function decorateLearning(){
  const lab=document.querySelector('.learnLab');if(!lab)return;
  const nav=lab.querySelector('.learnTabs');if(!nav)return;
  if(!lab.querySelector('.lcContinue')){
    const id=window.S?.activeCourse||'D772',tutor=window.MajickCourseTutor;
    let lesson=null;try{lesson=tutor?.selectedLesson?.(id)}catch(_){}
    const card=document.createElement('section');card.className='lcContinue';
    card.innerHTML='<div><span>YOUR NEXT CLASS</span><h3>'+E(lesson?.title||'Choose a lesson in your course path')+'</h3><p>'+(lesson?'Continue the chapter, then practice what you learned.':'Open your course path to see what is ready to learn.')+'</p></div><button type="button">'+(lesson?'Continue lesson':'Open course path')+' →</button>';
    card.querySelector('button').addEventListener('click',()=>{
      if(lesson)tutor.openLesson(lesson.id,null,id);
      else tutor?.show?.('path');
    });
    nav.before(card);
  }
  if(!nav.closest('.lcToolkit')){
    const box=document.createElement('details');box.className='lcToolkit';
    const summary=document.createElement('summary');summary.textContent='Explore course tools and study modes';
    nav.before(box);box.append(summary,nav);
  }
}
function decorateVersion(){
  document.title='Majick Studies — V'+VERSION+' Living Collegium';
}
function decorate(){decorateVersion();decorateCompanions();decorateLearning()}
const previous=window.render;
if(typeof previous==='function')window.render=function(){const result=previous.apply(this,arguments);setTimeout(decorate,0);return result};
setTimeout(decorate,120);
window.MajickLivingCollegium={VERSION,persona,sceneHTML,decorate};
})();
