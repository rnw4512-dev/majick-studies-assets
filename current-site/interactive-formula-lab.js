(()=>{'use strict';if(window.MajickFormulaLab)return;
const lessons=[
{title:'Mean',values:[62,70,76,82,90],fields:[['Sum',380],['Count',5],['Mean',76]],formula:'Mean = sum / count'},
{title:'Median',values:[4,7,9,12,13,17],fields:[['Middle left',9],['Middle right',12],['Median',10.5]],formula:'Median = (middle left + middle right) / 2'},
{title:'Probability without replacement',values:[5,3],fields:[['First green',5],['First total',8],['Second green',4],['Second total',7],['Probability (decimal)',0.3571]],formula:'Probability = (5 / 8) x (4 / 7)'}
];
let idx=0;
const html=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function show(){const t=lessons[idx];let el=document.getElementById('majickFormulaLab');if(!el){el=document.createElement('dialog');el.id='majickFormulaLab';document.body.append(el)}
el.innerHTML='<h2>Formula Laboratory: '+html(t.title)+'</h2><p>Given values: '+t.values.join(', ')+'</p><p>'+html(t.formula)+'</p><p>Enter each part of the formula, then solve.</p>'+t.fields.map((f,i)=>'<label style="display:block;margin:12px 0">'+html(f[0])+' <input type="number" step="any" data-step="'+i+'"></label>').join('')+'<p id="majickFormulaFeedback" role="status"></p><button data-check>Check my steps</button> <button data-next>Next problem</button> <button data-close>Close</button>';
el.querySelector('[data-check]').onclick=()=>{const inputs=[...el.querySelectorAll('[data-step]')],correct=inputs.map((x,i)=>x.value!==''&&Math.abs(Number(x.value)-t.fields[i][1])<0.00015);el.querySelector('#majickFormulaFeedback').textContent=correct.every(Boolean)?'All steps correct!':correct.map((v,i)=>t.fields[i][0]+': '+(v?'Correct':'Try again')).join(' | ')};
el.querySelector('[data-next]').onclick=()=>{idx=(idx+1)%lessons.length;show()};el.querySelector('[data-close]').onclick=()=>el.close();if(!el.open)el.showModal()}
function mount(){const active=window.S?.activeCourse==='D772';let b=document.getElementById('majickFormulaLaunch');if(!active){b?.remove();return}if(!b){b=document.createElement('button');b.id='majickFormulaLaunch';b.textContent='Formula Laboratory';b.style.cssText='position:fixed;bottom:72px;right:18px;z-index:1200;padding:10px;border-radius:18px;background:#382840;color:#fff3d8';b.onclick=show;document.body.append(b)}}
let old=window.render;if(typeof old==='function')window.render=function(){const result=old.apply(this,arguments);setTimeout(mount,0);return result};setTimeout(mount,300);window.MajickFormulaLab={open:show,refresh:mount};
})();