const fs=require('fs');const js=fs.readFileSync(__dirname+'/home-focus.js','utf8'),css=fs.readFileSync(__dirname+'/home-focus.css','utf8');
for(const m of ["VERSION='3.3.77'","compactHome","Dormitory & Sanctuary","v3377CampusDoors","window.MajickHomeFocus"])if(!js.includes(m))throw new Error('missing '+m);
for(const m of ['.v3377CampusDoors','.v3377DoorGrid','v3327HallGrid','v3327StudentRecord'])if(!css.includes(m))throw new Error('missing CSS '+m);
console.log('V3.3.77 Home Focus smoke passed');