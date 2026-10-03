const fs=require('fs');const js=fs.readFileSync(__dirname+'/section-intake-shortcuts.js','utf8'),css=fs.readFileSync(__dirname+'/section-intake-shortcuts.css','utf8');
for(const marker of ["VERSION='3.3.71'","majick_d772_material_section","openMaterials","materialSection","v3371AddMaterials","window.MajickSectionIntakeShortcuts"])if(!js.includes(marker))throw new Error('missing '+marker);
for(const marker of ['.v3371AddMaterials'])if(!css.includes(marker))throw new Error('missing CSS '+marker);
console.log('V3.3.71 Section Intake Shortcuts smoke passed');