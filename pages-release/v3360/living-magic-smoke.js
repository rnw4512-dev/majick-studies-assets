const fs=require('fs');const js=fs.readFileSync(__dirname+'/living-magic.js','utf8');const css=fs.readFileSync(__dirname+'/living-magic.css','utf8');
for(const marker of ["VERSION='3.3.60'","MutationObserver","requestAnimationFrame","majickLivingMagic","majickRoomRibbon","window.MajickLivingMagic"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['content-visibility:auto','v3360Drift','data-majick-reduce-motion=true','.v3360RoomRibbon'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.60 Living Magic smoke passed');