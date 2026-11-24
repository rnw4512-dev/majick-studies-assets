'use strict';

// Use the reviewed REST artifact identity. Do not depend on the separate
// artifact-results listing service that intermittently omitted Pages uploads.
module.exports = async function deployPages({github, context, core, artifactId, maxPolls=120, pollMs=5000, timeoutMs=600000, sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))}) {
  const {owner,repo}=context.repo;
  if(!/^[a-f0-9]{40}$/.test(context.sha)||!/^\d+$/.test(String(artifactId)))throw Error('Invalid certified deployment identity');
  const request=(route,params={})=>github.request(route,{owner,repo,...params,request:{timeout:20000}});
  const {data:{artifacts}}=await request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts',{run_id:context.runId,per_page:100});
  const matches=artifacts.filter(a=>String(a.id)===String(artifactId)&&a.name==='github-pages'&&!a.expired&&a.size_in_bytes>0);
  if(matches.length!==1)throw Error('The certified Pages artifact is missing, expired or ambiguous');
  const {data:head}=await request('GET /repos/{owner}/{repo}/git/ref/heads/main');
  if(head.object.sha!==context.sha)throw Error('A newer main commit supersedes this certified artifact');
  const oidc=await core.getIDToken();
  const {data:deployment}=await request('POST /repos/{owner}/{repo}/pages/deployments',{
    artifact_id:matches[0].id,pages_build_version:context.sha,oidc_token:oidc
  });
  const id=deployment.id||deployment.status_url?.split('/').pop();
  if(!id||!deployment.page_url)throw Error('Pages did not return a deployment identity and public URL');
  const url=new URL(deployment.page_url);
  if(url.protocol!=='https:')throw Error('Pages returned an invalid public URL');
  const started=Date.now();let errors=0;
  for(let attempt=0;attempt<maxPolls&&Date.now()-started<timeoutMs;attempt++){
    let state;
    try{state=(await request('GET /repos/{owner}/{repo}/pages/deployments/{deploymentId}',{deploymentId:id})).data;errors=0}
    catch(error){if(++errors>=3)throw Error('Pages status could not be read after three attempts');core.warning('Retrying Pages status request');await sleep(pollMs);continue}
    if(state.status==='succeed'){
      core.setOutput('page_url',url.href.endsWith('/')?url.href:url.href+'/');
      core.setOutput('deployment_id',String(id));
      core.info('Published the certified artifact for '+context.sha);
      return;
    }
    if(['deployment_failed','deployment_content_failed','deployment_cancelled','deployment_lost'].includes(state.status))throw Error('Pages reported '+state.status);
    await sleep(pollMs);
  }
  try{await request('POST /repos/{owner}/{repo}/pages/deployments/{deploymentId}/cancel',{deploymentId:id})}
  catch(error){core.warning('Timed-out Pages deployment could not be cancelled automatically')}
  throw Error('Pages deployment exceeded its bounded polling window');
};
