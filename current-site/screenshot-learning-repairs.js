(()=>{'use strict';if(window.MajickScreenshotRepairs)return;
const names={'d772-s1-l1':'Sampling & populations','d772-s1-l2':'Sampling bias','d772-s1-l3':'Misleading graphs','d772-s1-l4':'Statistical conclusions','d772-s2-l1':'Types of data','d772-s2-l2':'Graphs & displays','d772-s2-l3':'Distributions','d772-s2-l4':'Mean & median','d772-s2-l4-1':'Mean & median','d772-s3-l1':'Probability','d772-s3-l2':'Compound probability','d772-s3-l2-1':'Compound probability'};
const label=id=>names[id]||id.replace(/^d772-s\d+-l\d+(?:-\d+)?$/,'this skill');
let running=false;
function fix(){
 if(running)return;running=true;
 try{
 const root=document.getElementById('app')||document.body;
 const elements=root.querySelectorAll('button');
 for(const b of elements){if(b.closest('#majConnectedPath'))continue;const old=(b.textContent||'').trim();const m=old.match(/^(Reteach|Practice again)\s+(d772-s\d+-l\d+(?:-\d+)?)$/i);if(m){const text=m[1]+' '+label(m[2]);if(text!==old){b.textContent=text;b.title='Skill: '+m[2]}}}
 const cards=root.querySelectorAll('div,section,header');
 for(const el of cards){if(el.children.length>8)continue;const txt=(el.textContent||'').trim();if(txt.length>180||!txt.includes('CAMPUS LOCATION'))continue;
 const title=[...el.querySelectorAll('*')].find(x=>x.children.length===0&&x.textContent.trim()==='Game Realm');
 if(!title)continue;
 const heading=(document.querySelector('nav [data-nav].active')?.textContent||'').toLowerCase();
 if(heading.includes('study now'))title.textContent='Study Now';else if(heading.includes('reasoning'))title.textContent='Scholar’s Trial Chamber';else if(heading.includes('home'))title.textContent='Collegium Commons';
 }
 }finally{running=false}
}
let timer;const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(fix,150)});function init(){obs.observe(document.body,{subtree:true,childList:true,characterData:false});fix()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.MajickScreenshotRepairs={refresh:fix};
})();