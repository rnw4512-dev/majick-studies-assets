'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const checks=[
 ['solution-engine.js',[/data-clear/,/Resubmit answer/,/delete a\.focus/,/delete a\.order/,/st\.error=true/,/data-reset/]],
 ['your-turn-practice.js',[/data-clear/,/Resubmit answer/,/s\.answers\[idx\]=/,/s\.revealed\[idx\]=false/,/data-next/]],
 ['inline-lesson-practice.js',[/Clear answers/,/Resubmit answers/,/data-reset/,/data-check/]],
 ['probability-workshop.js',[/data-prob-clear/,/probabilityDraft\(kind,cleared\)/,/if\(t\.submitted\)return/,/data-prob-fresh/,/data-prob-next/]]
];
for(const [filename,rules] of checks){const src=read(filename);new vm.Script(src,{filename});for(const rule of rules)assert(rule.test(src),filename+' missing '+rule);}
assert(!/window\.S\s*=|window\.S\.progress\s*=/.test(read('probability-workshop.js')),'UI adapter must not overwrite global learner state');
console.log('PASS Phase 5 retry controls: syntax, scoped clear/resubmit, no replaced probability grading, and existing fresh-retry path');
