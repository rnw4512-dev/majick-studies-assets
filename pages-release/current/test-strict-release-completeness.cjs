'use strict';
/** Majick Studies strict release-completeness audit.
 * A passing normal CI suite is not equivalent to final artwork/character certification.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'current-site');
const problems=[],passes=[];
const exists=p=>fs.existsSync(path.join(root,p));
const requireFile=(p,why)=>{if(!exists(p))problems.push(why+': '+p);else passes.push(p)};
const six=['vesper','briar','zephyr','prism','rook','solara'];
const stages=['new-bond','apprentice','guardian','ascendant','celestial'];
for(const name of six){
 requireFile('assets/familiars/canon/'+name+'-guardian.webp','Missing canonical portrait');
 for(const stage of stages){
  requireFile('assets/familiars/evolution_stages/'+name+'-'+stage+'.webp','Missing evolution portrait');
  for(const action of ['walk','play','sleep'])
   requireFile('sanctuary/assets/evolutions/'+name+'/'+stage+'/'+action+'.webp','Missing approved Guardian action pose');
 }
}
const expectedOriginals={
 luna:['idle','walk-1','walk-2','paw','sit','sleep'],
 ember:['idle','walk-1','walk-2','wave','fly','sleep'],
 nova:['walk-1','walk-2','pounce','sleep'],
 mallow:['idle','hop-1','hop-2','paw','sleep']
};
for(const [type,actions] of Object.entries(expectedOriginals)){
 for(const action of actions){
  const name='sanctuary/assets/motion/'+type+'-'+action+'.png';
  if(!exists(name)){problems.push('Missing original painted pose: '+name);continue}
  const buf=fs.readFileSync(path.join(root,name));
  if(buf.length<1000||buf.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')problems.push('Not a usable PNG: '+name);
  else passes.push(name);
 }
}
const atlas=fs.readFileSync(path.join(root,'enchanted-atelier.js'),'utf8');
const scholar=fs.readFileSync(path.join(root,'scholar-companion.js'),'utf8');
const workshop=fs.readFileSync(path.join(root,'solution-engine.js'),'utf8');
if(!atlas.includes('function hairFit(p)'))problems.push('Scholar saved hairstyle fitting owner not integrated into current release branch');
if(!scholar.includes('p.hairFit?.x')||!scholar.includes('p.hairFit?.size'))problems.push('Scholar cross-room companion does not retain hairstyle fitting');
if(!exists('assets/atelier/avatars/scholar-layer-contract.json'))problems.push('Scholar layer/attachment and pose contract not integrated');
if(!workshop.includes('MIX_ORDER')||!workshop.includes('mjStudyReasoningTab'))problems.push('Mixed-section Study Realm Reasoning Workshop not integrated');
const summary={auditedAt:new Date().toISOString(),checkedFiles:passes.length,failures:problems.length,missingOriginalActions:problems.filter(x=>x.includes('original painted pose')),missingAdditionalGuardianActions:problems.filter(x=>x.includes('Missing approved Guardian action pose')).length,details:problems};
console.log('MAJICK STRICT RELEASE CERTIFICATION',JSON.stringify(summary,null,2));
if(problems.length){console.error('BLOCKED: full visual / action asset release certification remains incomplete');process.exitCode=1;}
else console.log('PASS: all required source assets and owner references found; browser interaction and visual approval remain separate gates');
