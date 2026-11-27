/* Load classic app scripts in order after verified workspace recovery. */
(async()=>{
 const shell=document.querySelector('#app main');
 try{
  // A damaged legacy save is reported by the existing save owner and permits
  // its protected recovery view. No default workspace is committed in its place.
  try{await window.MajickSaveSafety.prepare()}catch(_){}
  const pending=[...document.querySelectorAll('script[type="application/x-aetheria-deferred"]')];
  await Promise.all(pending.map(source=>new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.async=false;
   script.src=source.src;
   script.onload=resolve;
   script.onerror=()=>reject(Error('Could not load '+new URL(source.src).pathname.split('/').pop()));
   document.head.append(script);
  })));
  if(window.S?.screen==='vault'&&!document.getElementById('majArcaneVault')){
   window.MajickRewardCore?.patchVault();
   window.render?.();
  }
  window.MajickSaveSafety.activate();
  window.MajickWorkspaceReady=true;
  document.dispatchEvent(new Event('majick:workspace-ready',{bubbles:true}));
 }catch(error){
  console.error('Aetheria startup',error);
  const host=document.querySelector('#app main')||shell;
  if(!host)return;
  const message=document.createElement('p');
  message.setAttribute('role','alert');
  message.textContent='Aetheria could not finish loading. Reload to try again.';
  const retry=document.createElement('button');
  retry.type='button';retry.textContent='Retry';retry.onclick=()=>location.reload();
  host.append(message,retry);
 }
})();
