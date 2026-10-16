'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.join(path.resolve(process.argv[2]||'current-site'),'generated-question-engine.js'),'utf8');
new vm.Script(src,{filename:'generated-question-engine.js'});
const rules=[
 [/skill==='boxplot'\|\|skill==='median'/,'Hands-on sorting must be limited to supported numeric skills'],
 [/ordered\.includes\(n\.index\)/,'Every duplicated data value must be selectable by distinct observation index'],
 [/given\.length===expected\.length&&given\.every/,'Every input observation must be ordered before a check passes'],
 [/data-sort-clear/,'Same-dataset clear and retry is required'],
 [/data-sort-feedback/,'Accessible feedback is required'],
 [/data-lab-repair/,'Wrong independent answer must offer guided repair'],
 [/section\.querySelector\('\[data-lab-guided\]'\)/,'Guided review must return to the existing lesson owner'],
 [/generated-lab-independent-formative/,'Independent formative response must stay in existing tracker'],
 [/skillResult\?\.\(q,correct,false,'generated-lab-independent-formative'\)/,'Formative attempt must not be marked as certified transfer']
];for(const [rx,why] of rules)assert(rx.test(src),why);
const ctx={window:{},Math,Date,Array,Object,Number,String,JSON,Set};
vm.runInNewContext(src,ctx,{filename:'generated-question-engine.js'});
for(const skill of ['boxplot','median'])for(let i=0;i<75;i++){const q=ctx.window.MajickGeneratedPractice.generate(skill,3);assert(q&&ctx.window.MajickGeneratedPractice.validate(q),'Invalid '+skill+' answer/plot');}
console.log('PASS hands-on D772: selectable observation identity, same-dataset clear, guided repair, formative mastery safety, 150 computed cases');
