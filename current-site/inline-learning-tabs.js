(()=>{'use strict';if(window.MajickInlineLessonTabs)return;
let selected='words';
function refresh(){
 const root=document.getElementById('learnInlinePractice');if(!root)return;
 const vocabulary=root.querySelector('.mliVocabularyPanel');
 const teaching=root.querySelector('.mjtCoach');
 if(!vocabulary&&!teaching)return;
 let nav=root.querySelector('.mliLessonNav');
 if(!nav){nav=document.createElement('nav');nav.className='mliLessonNav';nav.setAttribute('aria-label','Practice activities within this lesson');root.prepend(nav)}
 const tabs=[{id:'words',el:vocabulary,label:'1 · Match & fill'},{id:'apply',el:teaching,label:'2 · Apply & teach'}].filter(t=>t.el);
 if(!tabs.some(t=>t.id===selected))selected=tabs[0].id;
 nav.innerHTML=tabs.map(t=>'<button type="button" role="tab" data-panel="'+t.id+'" aria-selected="'+(t.id===selected)+'">'+t.label+'</button>').join('');
 tabs.forEach(t=>{t.el.hidden=t.id!==selected;t.el.setAttribute('role','tabpanel')});
 nav.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{
  selected=b.dataset.panel;
  tabs.forEach(t=>t.el.hidden=t.id!==selected);
  nav.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.panel===selected)));
 });
}
const style=document.createElement('style');style.textContent='.mliLessonNav{display:flex;gap:10px;flex-wrap:wrap;padding:8px 0 12px;position:relative}.mliLessonNav button{background:#493550;border:1px solid #b9a0b5;border-radius:12px;padding:11px 15px;color:#fff3df;font-weight:700;cursor:pointer}.mliLessonNav button[aria-selected=true]{background:#9b7191;border:2px solid #f3d29b}.mliLessonNav button:focus-visible{outline:3px solid #ffdd9b}.learnInlinePractice [hidden]{display:none!important}.mliVocabularyPanel{max-width:100%}.learnInlinePractice .mjtCoach{margin-top:0}@media(max-width:600px){.mliLessonNav button{flex:1;min-width:125px}}';document.head.append(style);
window.MajickInlineLessonTabs={refresh,version:'1.0'};
})();