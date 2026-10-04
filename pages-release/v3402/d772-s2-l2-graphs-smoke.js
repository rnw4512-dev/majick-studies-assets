const fs=require('fs');
const tutor=fs.readFileSync(process.cwd()+'/pages-release/v3326/course-tutor.js','utf8');
const realm=fs.readFileSync(process.cwd()+'/pages-release/v3343/game-realm.js','utf8');
function assert(x,msg){if(!x)throw new Error(msg)}
for(const m of [
 "id:'d772-s2-l2'",
 "Choosing Graphical Displays",
 "BAR = compare categories.",
 "PIE = parts of ONE whole.",
 "Overlapping categories → avoid pie chart.",
 "Other/Unknown",
 "Histogram = quantitative distribution.",
 "Scatterplot = two quantitative variables.",
 "Line graph = trend over time.",
 "s2l2-p1","s2l2-p8",
 "OpenStax Introductory Business Statistics §1.2",
 "OpenStax Introductory Statistics 2e §1.2"
])assert(tutor.includes(m),'Lesson 2 missing '+m);
for(const m of ["v3402-d772-s2-l2-01","v3402-d772-s2-l2-06","section:'Graphical Displays'","VERSION='3.4.2-realm'","majickRealmVariety='3402'"])assert(realm.includes(m),'Realm graph practice missing '+m);
console.log('V3.4.2 D772 Section 2 Lesson 2 graph smoke passed');