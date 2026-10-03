const fs=require('fs');const js=fs.readFileSync(__dirname+'/focus-feedback.js','utf8');const css=fs.readFileSync(__dirname+'/focus-feedback.css','utf8');
for(const marker of ["VERSION='3.3.63'","Focus layout","v3363ArcaneState","v3363GuardianNod","v3363SectionMoment","MajickRenderQueue","window.MajickFocusFeedback"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['data-majick-focus=true','v3363Load','v3363Constellation','.v3363GuardianNod'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.63 Focus Feedback smoke passed');