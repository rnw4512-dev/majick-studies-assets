'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert').strict;
const root=path.resolve(process.argv[2]||'current-site');
const js=fs.readFileSync(path.join(root,'collegium-commons.js'),'utf8');
const css=fs.readFileSync(path.join(root,'collegium-commons.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const five=['overview','today','review','guardians','sanctuary'];
for(const id of five){assert(js.includes("['"+id+"',"),'Missing tab: '+id);assert(js.includes("'commons-panel-'+id"),'Missing panel linkage: '+id)}
assert.equal((js.slice(js.indexOf('const TABS='),js.indexOf('let selected=')).match(/\['(?:overview|today|review|guardians|sanctuary)','/g)||[]).length,5,'Exactly five tabs');
for(const token of ["sessionStorage.getItem('majick-commons-tab')","sessionStorage.setItem('majick-commons-tab'","ArrowRight","ArrowLeft","'Home'","'End'","aria-selected","aria-controls","role','tabpanel'","data-commons-next","data-commons-previous","n!==hub","panels[classify(n)].append(n)"])
 assert(js.includes(token),'Missing Commons interaction or ownership: '+token);
for(const token of ['#241827','Cinzel','Cormorant Garamond','Inter','[hidden]','prefers-reduced-motion',':focus-visible'])
 assert(css.includes(token),'Missing theme/accessibility feature: '+token);
for(const p of ['collegium-commons.js','collegium-commons.css'])assert(html.includes(p),'Asset not loaded: '+p);
assert(!js.includes('localStorage.clear('),'Must not reset learner storage');
console.log('PASS Commons: five tabs, original DOM ownership, navigation, session retention, text theme and reduced motion');

// Exercise the actual classifier; incidental navigation copy must not decide ownership.
const vm=require('node:vm');
const classifier=js.slice(js.indexOf('function classify(node)'),js.indexOf('\n}',js.indexOf('function classify(node)'))+2);
const classify=vm.runInNewContext('('+classifier.trim()+')');
for(const [id,classes,text,expected] of [
 ['v3400DailyLoop','v3400DailyLoop','Daily Study Loop · Review · Guardian · Dorm','today'],
 ['v3377CampusDoors','v3377CampusDoors','Game Realm Practice, review & challenges · Sanctuary','overview'],
 ['mjAdaptiveMastery','','Guardian classroom example','review'],
 ['','v3327GuardianHall','Visit Sanctuary · review bond','guardians'],
 ['','v3317HomeSanctuary v3327CampusSanctuary','Guardian Sanctuary','sanctuary']
]){
 const node={id,className:classes,textContent:text,matches:selector=>selector.split(',').some(s=>s[0]==='#'?id===s.slice(1):classes.split(' ').includes(s.slice(1)))};
 assert.equal(classify(node),expected,'Component ownership: '+(id||classes));
}
console.log('PASS Commons stable component ownership despite cross-tab action labels');
