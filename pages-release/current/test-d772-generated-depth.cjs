'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.resolve(process.argv[2]||'current-site','generated-question-engine.js'),'utf8');
const win={};vm.runInNewContext(src,{window:win,Math,Date,Array,Object,Number,String,JSON,Set}, {filename:'generated-question-engine.js'});
const api=win.MajickGeneratedPractice;assert(api);
const skills=['mean','median','boxplot','histogram','scatterplot','probability'];
let count=0;for(const skill of skills)for(const difficulty of [1,2,3])for(let i=0;i<40;i++){
 const q=api.generate(skill,difficulty);
 assert(q,'Failed generating '+skill);
 assert(api.validate(q),'Dataset/answer mismatch '+skill+': '+JSON.stringify(q.data));
 assert.equal(q.options.length,4);
 assert.equal(new Set(q.options).size,4);
 assert(q.visualHtml.includes('<svg'));
 assert(q.sourceLabel.includes('NOT OFFICIAL WGU'),'Generated source must not impersonate WGU');
 assert(/Which|What/i.test(q.prompt),'Missing OA-style single-best answer prompt');
 count++;
}
for(let i=0;i<42;i++){
 const q=api.probabilityCase(i,i%2===1);
 assert(q&&api.validate(q),'Invalid probability dataset at '+i);
}
console.log('PASS generated D772 question audit: '+count+' fresh draws + 42 probability cases, numeric consistency, distinct options, visual and provenance');
