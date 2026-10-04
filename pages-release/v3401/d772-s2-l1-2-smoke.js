const fs=require('fs');
const src=fs.readFileSync(process.cwd()+'/pages-release/v3326/course-tutor.js','utf8');
function assert(x,msg){if(!x)throw new Error(msg)}
const sec1=src.indexOf('const D772_SECTION_ONE=');
const sec2=src.indexOf('const D772_SECTION_TWO=');
const content2=src.indexOf('const D772_SECTION_TWO_CONTENT=');
assert(sec1>=0&&sec2>sec1&&content2>sec2,'D772 section boundaries missing');
const beforeSection2=src.slice(sec1,sec2);
assert(!beforeSection2.includes("d772-s2-l1-2"),'Lesson 1.2 leaked into Section 1');
const section2Meta=src.slice(sec2,content2);
assert(section2Meta.includes("id:'d772-s2-l1-2'"),'Lesson 1.2 metadata missing from Section 2');
assert(section2Meta.includes("parentLessonId:'d772-s2-l1'"),'Lesson 1.2 parent link missing');
assert(section2Meta.includes("number:1.2"),'Lesson 1.2 number missing');
for(const m of [
 "ROLE ≠ DATA TYPE",
 "Does X help explain, predict, or influence Y?",
 "Categorical variable",
 "Quantitative variable",
 "Explanatory variable",
 "Response variable",
 "I Teach • Two labels can describe the same variable",
 "We Do • Guided example",
 "s2l12-p1","s2l12-p8",
 "lessonExperienceHtml","bindLessonExperience",
 "pathSublesson",
 "OpenStax Statistics • Ch. 1 Key Terms"
])assert(src.includes(m),'Lesson 1.2 missing '+m);
const parentContentStart=src.indexOf("'d772-s2-l1':{",content2);
const subContentStart=src.indexOf("'d772-s2-l1-2':{",content2);
assert(parentContentStart>=0&&subContentStart>parentContentStart,'Lesson 1 parent/sublesson content ordering missing');
const parentContent=src.slice(parentContentStart,subContentStart);
assert(!parentContent.includes("{title:'Explanatory variable'"),'Parent Lesson 1 duplicates explanatory-variable teaching');
assert(!parentContent.includes("{title:'Response variable'"),'Parent Lesson 1 duplicates response-variable teaching');
console.log('V3.4.1 D772 Section 2 Lesson 1.2 smoke passed');