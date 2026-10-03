const fs=require('fs'),vm=require('vm'),assert=require('assert');
const js=fs.readFileSync(__dirname+'/d772-section-readiness.js','utf8'),css=fs.readFileSync(__dirname+'/d772-section-readiness.css','utf8');
for(const marker of ["VERSION='3.3.69'","MajickMaterialStore","d772-s1","d772-s2","d772-s3","window.MajickD772SectionReadiness"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['.v3369SourceStatus','.has-sources','materials received'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
const ctx={window:{S:{activeCourse:'D772'},MajickMaterialStore:{list:async()=>[
 {sectionId:'d772-s1'},{sectionId:'d772-s2'},{learningPath:{sectionId:'d772-s2'}},{sectionId:'d772-s3'}
]}},document:{documentElement:{dataset:{}},querySelectorAll:()=>[]},setTimeout(){},Date,console};
vm.createContext(ctx);vm.runInContext(js,ctx);
ctx.window.MajickD772SectionReadiness.counts(true).then(r=>{
 assert.equal(r.counts['d772-s1'],1);assert.equal(r.counts['d772-s2'],2);assert.equal(r.counts['d772-s3'],1);
 console.log('V3.3.69 D772 section readiness smoke passed');
}).catch(e=>{console.error(e);process.exitCode=1});