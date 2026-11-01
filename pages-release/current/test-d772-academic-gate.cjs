'use strict';
// Deterministic release gate. Reports coverage gaps without awarding mastery or mutating progress.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site');
const src=fs.readFileSync(path.join(root,'generated-question-engine.js'),'utf8');
const repairSrc=fs.readFileSync(path.join(root,'question-repair.js'),'utf8');
const win={};
const doc={addEventListener(){}};
const context={window:win,document:doc,Math,Date,Array,Object,Number,String,JSON,Set,console};
vm.runInNewContext(src,context,{filename:'generated-question-engine.js'});
vm.runInNewContext(repairSrc,context,{filename:'question-repair.js'});
const gen=win.MajickGeneratedPractice,repair=win.MajickQuestionRepair;
assert(gen&&repair,'Shared generator and repair APIs required');
const skills=['mean','median','boxplot','histogram','scatterplot','probability'];
const issues=[],summary={};
for(const skill of skills){
 const seen=new Map(),stats={questions:0,missingDistractorRationales:0,keyConflicts:0,invalid:0,missingFreshTransfers:0};
 for(let i=0;i<30;i++){
  const q=gen.generate(skill,1+i%3);stats.questions++;
  if(!q||!gen.validate(q)){stats.invalid++;issues.push({skill,kind:'invalid-key',sample:i});continue}
  const options=q.options||[],answer=String(q.answer);
  if(!options.map(String).includes(answer)){stats.invalid++;issues.push({skill,kind:'key-not-in-options',sample:i});continue}
  const id=repair.evidenceKey(q);
  if(id!=null)seen.set(id,true);
  for(let j=0;j<options.length;j++){
   if(String(options[j])===answer)continue;
   const m=repair.specificRepair(q,options[j]);
   if(m.answerKeyConflict){stats.keyConflicts++;issues.push({skill,kind:'key-conflict',sample:i,choice:j})}
   const rationale=q.choiceCoach?.[options[j]]||q.choiceCoach?.[j]||q.distractorRationales?.[options[j]]||q.distractorRationales?.[j];
   if(!rationale){stats.missingDistractorRationales++;if(stats.missingDistractorRationales<=3)issues.push({skill,kind:'missing-distractor-explanation',sample:i,choice:j})}
  }
 }
 if(seen.size<2){stats.missingFreshTransfers++;issues.push({skill,kind:'no-distinct-evidence-transfer'})}
 summary[skill]={...stats,distinctEvidence:seen.size};
}
const report={gate:'D772 deterministic academic coverage',generatedAt:new Date().toISOString(),summary,issues};
const out=process.env.D772_AUDIT_REPORT||'d772-academic-audit.json';
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
console.log('Academic coverage report: '+out);
const failures=Object.values(summary).reduce((n,x)=>n+x.invalid+x.keyConflicts+x.missingFreshTransfers+x.missingDistractorRationales,0);
assert.equal(failures,0,'D772 academic gate found '+failures+' issues; see '+out);
