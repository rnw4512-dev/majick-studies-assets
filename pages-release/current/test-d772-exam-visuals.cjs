const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Node{constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.attrs={};this.dataset={};this.textContent='';this.className=''}append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=nodes}setAttribute(k,v){this.attrs[k]=v}focus(){}getBoundingClientRect(){return {width:0,height:0}}set innerHTML(s){this.html=s;if(/<svg/.test(s))this.children=[new Node('svg')]}querySelector(selector){return flatten(this).slice(1).find(n=>selector==='svg,img,canvas,table'?['SVG','IMG','CANVAS','TABLE'].includes(n.tagName):selector==='[data-exam-submit]'?n.dataset?.examSubmit:selector.startsWith('.')?n.className===selector.slice(1):false)||null}}
const flatten=n=>[n,...n.children.flatMap(flatten)];
const ctx={document:{createElement:t=>new Node(t)},localStorage:{getItem:()=>null,setItem:()=>{}},save:()=>{}};ctx.window=ctx;ctx.S={activeCourse:'D772',progress:{D772:{},D756:{untouched:1}},majickAccount:{xp:123,crystals:45}};vm.createContext(ctx);
for(const f of ['visual-evidence-gate.js','d772-shared-oa-questions.js','d772-preassessment-deep-practice.js'])vm.runInContext(fs.readFileSync('current-site/'+f,'utf8'),ctx);
const src=fs.readFileSync('current-site/room-section-nav.js','utf8');vm.runInContext(src.slice(src.indexOf('function examProgress'),src.indexOf('function renderReasoning')),ctx);
const bank=ctx.examQuestions();assert.equal(ctx.MajickVisualEvidence.audit(bank).blocked.length,0);
for(const id of ['d772-oa-342-graph-interpret','d772-oa-342-box-interpret','d772-oa-342-histogram-interpret']){const q=bank.find(q=>q.id===id);const e=ctx.examEvidence(q);assert(e.ok&&e.required&&/<svg/.test(e.html),id)}
const scatter=bank.find(q=>q.id==='d772-oa-342-graph-interpret');assert.equal(scatter.visual.points.length,7);assert.equal(scatter.visual.points.filter(([x,y])=>y===2*x).length,6);
const box=bank.find(q=>q.id==='d772-oa-342-box-interpret');assert.equal(box.visual.fiveNumber[3]-box.visual.fiveNumber[1],Number(box.answer));
const hist=bank.find(q=>q.id==='d772-oa-342-histogram-interpret');assert(hist.visualHtml.includes('20–29 frequency 9'));
const bad={...scatter,id:'missing-chart',visual:undefined,prompt:'Use the scatterplot shown below. Which pattern is present?'};
const good=bank.find(q=>!ctx.examEvidence(q).required);const run={version:1,deck:[bad,good],index:0,selected:'',submitted:false,correct:0,attempted:0,skillResults:{}};ctx.S.progress.D772.mixedExamRound=run;
const unrelated=JSON.stringify({other:ctx.S.progress.D756,account:ctx.S.majickAccount});const panel=new Node('section');ctx.renderMixedExam(panel);assert(!flatten(panel).some(n=>n.textContent==='Check answer'));
const replace=flatten(panel).find(n=>n.textContent==='Replace question · no penalty');assert(replace);replace.onclick();assert.equal(run.deck[0].id,good.id);assert.equal(run.attempted,0);assert.equal(run.correct,0);assert.equal(run.technicalSkips.length,1);assert(ctx.validExamRound(run));
run.deck=[scatter];run.index=0;run.selected='';ctx.renderMixedExam(panel);const radio=flatten(panel).find(n=>n.tagName==='INPUT');radio.onchange();flatten(panel).find(n=>n.textContent==='Check answer').onclick();assert.equal(run.attempted,0,'zero-size SVG must not be graded');assert(flatten(panel).some(n=>n.textContent.includes('Nothing was scored')));
run.deck=[bad];run.selected='';assert.equal(ctx.replaceBlockedExamItem(run),false);assert.equal(run.deck[0].id,bad.id);
assert.equal(JSON.stringify({other:ctx.S.progress.D756,account:ctx.S.majickAccount}),unrelated);
console.log('PASS 60-item visual audit, plot/data agreement, blocked grading, zero-size diagram, no-penalty replacement and preserved score/account/course state');
