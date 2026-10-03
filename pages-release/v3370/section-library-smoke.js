const fs=require('fs');const js=fs.readFileSync(__dirname+'/../v3315/study-material/AddStudyMaterialPage.js','utf8');const css=fs.readFileSync(__dirname+'/section-library.css','utf8');
for(const marker of ["function sourceRowHtml","function sectionLibraryHtml","v3370SectionShelf","data-section-shelf","D772_SECTIONS"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['.v3370SectionShelf','.v3370ShelfEmpty'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.70 D772 section library smoke passed');