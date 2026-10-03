const fs=require('fs');const js=fs.readFileSync(__dirname+'/mobile-cleanup.js','utf8');const css=fs.readFileSync(__dirname+'/mobile-cleanup.css','utf8');
for(const marker of ["VERSION='3.3.65'","MajickRenderQueue","v3365RepeatedHeading","majickMobileClean","window.MajickMobileCleanup"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['@media(max-width:700px)','@media(max-width:430px)','.v3358Door','.v3341GuardianHero','.lcComfortChoices'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.65 Mobile Cleanup smoke passed');