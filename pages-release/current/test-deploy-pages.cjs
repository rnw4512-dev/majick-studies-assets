'use strict';
const assert=require('node:assert/strict');
const deploy=require('./deploy-pages.cjs');
const sha='a'.repeat(40);
function fixture({head=sha,artifacts=[{id:123,name:'github-pages',expired:false,size_in_bytes:100}],statuses=['queued','succeed']}={}){
  const calls=[],outputs={},logs=[];let tokenReads=0;
  const github={request:async(route,p)=>{
    calls.push({route,p});
    if(route.includes('/actions/runs/'))return {data:{artifacts}};
    if(route.includes('/git/ref/'))return {data:{object:{sha:head}}};
    if(route==='POST /repos/{owner}/{repo}/pages/deployments')return {data:{id:'deployment-1',page_url:'https://example.github.io/site'}};
    if(route.endsWith('/cancel'))return {data:{}};
    const status=statuses.shift()||'queued';if(status instanceof Error)throw status;return {data:{status}};
  }};
  const core={getIDToken:async()=>{tokenReads++;return 'TEST_OIDC'},setOutput:(k,v)=>outputs[k]=v,info:s=>logs.push(s),warning:s=>logs.push(s)};
  return {options:{github,core,context:{repo:{owner:'owner',repo:'repo'},runId:42,sha},artifactId:'123',pollMs:0,maxPolls:4,sleep:async()=>{}},calls,outputs,logs,get tokenReads(){return tokenReads}};
}
(async()=>{
  const ok=fixture();await deploy(ok.options);
  assert.equal(ok.outputs.page_url,'https://example.github.io/site/');
  const posted=ok.calls.find(c=>c.route==='POST /repos/{owner}/{repo}/pages/deployments').p;
  assert.equal(posted.artifact_id,123);assert.equal(posted.pages_build_version,sha);assert.equal(posted.oidc_token,'TEST_OIDC');
  assert(!ok.logs.join('').includes('TEST_OIDC'),'OIDC tokens must not appear in logs');
  for(const data of [{head:'b'.repeat(40)},{artifacts:[]},{artifacts:[{id:123,name:'github-pages',expired:true,size_in_bytes:100}]}]){
    const blocked=fixture(data);await assert.rejects(deploy(blocked.options),/supersedes|missing/);
    assert.equal(blocked.tokenReads,0);assert(!blocked.calls.some(c=>c.route.startsWith('POST')),'Rejected identities cannot deploy');
  }
  const temporary=fixture({statuses:[new Error('temporary'), 'succeed']});await deploy(temporary.options);assert(temporary.outputs.page_url);
  const failed=fixture({statuses:['deployment_content_failed']});await assert.rejects(deploy(failed.options),/deployment_content_failed/);assert(!failed.outputs.page_url);
  const stalled=fixture({statuses:['queued']});await assert.rejects(deploy(stalled.options),/bounded polling/);assert(stalled.calls.some(c=>c.route.endsWith('/cancel')));assert(!stalled.outputs.page_url);
  console.log('PASS Pages REST identity, stale/expired artifact rejection, OIDC privacy, status retry, failure and bounded cancellation');
})().catch(error=>{console.error(error);process.exitCode=1});
