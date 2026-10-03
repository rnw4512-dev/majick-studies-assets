const fs=require('fs');const js=fs.readFileSync(__dirname+'/d772-hall-map.js','utf8');const css=fs.readFileSync(__dirname+'/d772-hall-map.css','utf8');
for(const marker of ["VERSION='3.3.58'","d772-s1-l1","d772-s1-l2","d772-s1-l3","d772-s1-l4","d772-s1-review","v3358HallMap","window.MajickD772HallMap"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['.v3358HallMap','.v3358Corridor','.v3358Door'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.58 D772 Hall Map smoke passed');