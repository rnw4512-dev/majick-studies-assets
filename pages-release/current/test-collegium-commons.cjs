'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert').strict;
const root=path.resolve(process.argv[2]||'current-site');
const js=fs.readFileSync(path.join(root,'collegium-commons.js'),'utf8');
const css=fs.readFileSync(path.join(root,'collegium-commons.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const five=['overview','today','review','guardians','sanctuary'];
for(const id of five){assert(js.includes("['"+id+"',"),'Missing tab: '+id);assert(js.includes("commons-panel-"+id),'Missing panel linkage: '+id)}
assert.equal((js.match(/\['(?:overview|today|review|guardians|sanctuary)','/g)||[]).length,5,'Exactly five tabs');
for(const token of ["sessionStorage.getItem('majick-commons-tab')","sessionStorage.setItem('majick-commons-tab'","ArrowRight","ArrowLeft","'Home'","'End'","aria-selected","aria-controls","role','tabpanel'","data-commons-next","data-commons-previous","n!==hub","panels[classify(n)].append(n)"])
 assert(js.includes(token),'Missing Commons interaction or ownership: '+token);
for(const token of ['#241827','Cinzel','Cormorant Garamond','Inter','[hidden]','prefers-reduced-motion',':focus-visible'])
 assert(css.includes(token),'Missing theme/accessibility feature: '+token);
for(const p of ['collegium-commons.js','collegium-commons.css'])assert(html.includes(p),'Asset not loaded: '+p);
assert(!js.includes('localStorage.clear('),'Must not reset learner storage');
console.log('PASS Commons: five tabs, original DOM ownership, navigation, session retention, text theme and reduced motion');
