/* Lazy reference reader for supplied course JSON. No scoring or learner-state writes. */
(()=>{'use strict';
const cache=new Map();
const metadata=new Set(['id','type','schema_version','course_id','section_id','review_status','source_status','difficulty','game_modes','competency_tags']);
const title=key=>String(key).replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
function text(tag,value){const el=document.createElement(tag);el.textContent=String(value);return el}
function field(host,key,value){
 if(metadata.has(key))return;
 if(value===null||value===undefined)return;
 if(Array.isArray(value)){
  const list=document.createElement('ol');
  value.forEach(item=>{
   const li=document.createElement('li');
   if(item&&typeof item==='object'&&item.prompt){
    li.append(text('p',item.prompt));
    if(Array.isArray(item.options)){const options=document.createElement('ul');item.options.forEach(o=>options.append(text('li',typeof o==='object'?o.text:o)));li.append(options);}
    const guidance=document.createElement('details');guidance.append(text('summary','Source answer and explanation'));
    const ids=item.correct_option_ids||[item.correct_option_id];
    const answers=(item.options||[]).filter(o=>typeof o==='object'&&ids.includes(o.id)).map(o=>o.text);
    if(answers.length)guidance.append(text('p',answers.join('; ')));
    for(const [k,v] of Object.entries(item))if(!['prompt','options','correct_option_id','correct_option_ids'].includes(k))field(guidance,k,v);
    li.append(guidance);
   }else if(item&&typeof item==='object')Object.entries(item).forEach(([k,v])=>field(li,k,v));
   else li.append(text('p',item));list.append(li);
  });
  host.append(list);
 }else if(typeof value==='object'){
  for(const [k,v] of Object.entries(value))field(host,k,v);
 }else{
  const p=document.createElement('p');p.append(text('strong',title(key)+': '));
  if(typeof value==='string'&&/^https:\/\//.test(value)){const a=text('a',value);a.href=value;a.target='_blank';a.rel='noopener noreferrer';p.append(a)}else p.append(document.createTextNode(String(value)));
  host.append(p);
 }
}
async function render(host,record){
 host.replaceChildren(text('p','Loading supplied course reference…'));host.setAttribute('aria-busy','true');
 try{
  const data=cache.get(record.path)||await fetch(record.path+(record.path.includes('?')?'&':'?')+'v='+encodeURIComponent(window.MAJICK_RELEASE||'source')).then(r=>{if(!r.ok)throw Error('Reference unavailable');return r.json()});
  cache.set(record.path,data);if(!host.isConnected)return;
  host.replaceChildren(text('h3',data.title||record.title),text('p',record.source),text('p','Source status: '+record.status.replace(/_/g,' ')+'. This is guided reference material, not independent mastery evidence.'));
  for(const [key,value] of Object.entries(data)){
   if(metadata.has(key)||['title','source'].includes(key))continue;
   if(value&&typeof value==='object'){
    const details=document.createElement('details');details.append(text('summary',title(key)));field(details,key,value);host.append(details);
   }else field(host,key,value);
  }
 }catch(error){
  if(!host.isConnected)return;host.replaceChildren(text('p','The supplied reference could not load. Your progress is unchanged.'));
  const retry=text('button','Retry reference');retry.type='button';retry.onclick=()=>render(host,record);host.append(retry);
 }finally{host.removeAttribute('aria-busy')}
}
window.MajickCourseSourceReader=Object.freeze({render});
})();
