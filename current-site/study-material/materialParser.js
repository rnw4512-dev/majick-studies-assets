(function(){
'use strict';
const PDF_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDF_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const MAMMOTH_SRC='https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js';

function loadScript(src,test){
  if(test()) return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const old=[...document.scripts].find(s=>s.src===src);
    if(old){old.addEventListener('load',resolve,{once:true});old.addEventListener('error',()=>reject(new Error('Could not load document reader.')),{once:true});return;}
    const s=document.createElement('script');s.src=src;s.async=true;
    s.onload=resolve;s.onerror=()=>reject(new Error('Could not load document reader. Check your connection and try again.'));
    document.head.appendChild(s);
  });
}
function clean(text){
  return String(text||'').replace(/\u0000/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{4,}/g,'\n\n\n').trim();
}
async function readPdf(file){
  await loadScript(PDF_SRC,()=>!!window.pdfjsLib);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDF_WORKER;
  const bytes=new Uint8Array(await file.arrayBuffer());
  const pdf=await window.pdfjsLib.getDocument({data:bytes}).promise;
  const pages=[];
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const c=await page.getTextContent();
    pages.push(c.items.map(x=>x.str).join(' '));
  }
  return clean(pages.join('\n\n'));
}
async function readDocx(file){
  await loadScript(MAMMOTH_SRC,()=>!!window.mammoth);
  const result=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});
  return clean(result.value);
}
async function extract(file,pastedText){
  const pasted=clean(pastedText);
  if(pasted) return {text:pasted,sourceType:'pasted-text',name:'Pasted Notes'};
  if(!file) throw new Error('Choose a file or paste notes first.');
  const ext=(file.name.split('.').pop()||'').toLowerCase();
  if(file.size>18*1024*1024) throw new Error('That file is over 18 MB. Split very large notes into smaller files first.');
  if(ext==='txt'||ext==='md') return {text:clean(await file.text()),sourceType:ext,name:file.name};
  if(ext==='pdf') return {text:await readPdf(file),sourceType:'pdf',name:file.name};
  if(ext==='docx') return {text:await readDocx(file),sourceType:'docx',name:file.name};
  throw new Error('Majick currently accepts PDF, DOCX, TXT, MD, or pasted notes.');
}
window.MajickMaterialParser={extract,clean,supported:['pdf','docx','txt','md','pasted-text']};
})();