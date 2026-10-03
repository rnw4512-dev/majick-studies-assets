const fs=require('fs');const js=fs.readFileSync(__dirname+'/sanctuary-dorm.js','utf8');const css=fs.readFileSync(__dirname+'/sanctuary-dorm.css','utf8');
for(const marker of ["VERSION='3.3.77'","Your Study Alcove","Guardian Care Station","Shared Commons","Rest Loft","YOUR DORMITORY & GUARDIAN SANCTUARY","v3357BuildDormIdentity","window.MajickSanctuaryDorm"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['GUARDIAN RESIDENCE','canvas{box-shadow'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.57 Sanctuary Dorm smoke passed');