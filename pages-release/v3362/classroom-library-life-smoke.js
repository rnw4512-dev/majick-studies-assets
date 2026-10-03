const fs=require('fs');const js=fs.readFileSync(__dirname+'/classroom-library-life.js','utf8');const css=fs.readFileSync(__dirname+'/classroom-library-life.css','utf8');
for(const marker of ["VERSION='3.3.62'","v3362BoardRunes","v3362Bookmark","MajickRenderQueue","window.MajickClassroomLibraryLife"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['v3362Candle','v3362RuneWake','v3362PageShimmer','v3362ShelfGlint','--maj-space-5'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.62 Classroom Library Life smoke passed');