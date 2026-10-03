const fs=require('fs');const js=fs.readFileSync(__dirname+'/campus-runtime.js','utf8');const css=fs.readFileSync(__dirname+'/campus-runtime.css','utf8');
for(const marker of ["VERSION='3.3.61'","MajickRenderQueue","requestAnimationFrame","__v3361Queue","__v3361Portal","showPortal"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['.v3361Portal','.v3361PortalDoor','data-majick-reduce-motion=true'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.61 Campus Runtime smoke passed');