
MajickSaveSafety.attach({get:()=>S,set:value=>{S=value;window.majickSaveLoadBlocked=false;session=null;S.screen='home';},refresh:()=>{ensureV4();ensureV5();render();}});
exportSave=()=>MajickSaveSafety.download();
importSave=event=>MajickSaveSafety.importFile(event);
v5RestoreBackup=()=>MajickSaveSafety.restorePrevious();
function majickShowSaveStatus(detail){
 const node=document.getElementById('majickSaveSafetyStatus');if(node)node.textContent=detail.message;
 let banner=document.getElementById('majickSaveFailure');
 if(detail.ok){banner?.remove();return;}
 if(detail.ok===null)return;
 if(!banner){banner=document.createElement('div');banner.id='majickSaveFailure';banner.setAttribute('role','alert');banner.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;padding:14px;background:#381e2a;color:#fff;border:2px solid #e5b47c;border-radius:12px';document.body.appendChild(banner);}
 banner.replaceChildren();
 const message=document.createElement('p');message.textContent=detail.message+' Your current workspace is still in memory. Download a backup before closing this tab.';message.style.margin='0 0 8px';
 const backup=document.createElement('button');backup.type='button';backup.className='btn violet';backup.textContent='Download current backup';backup.addEventListener('click',()=>{try{MajickSaveSafety.download()}catch(error){message.textContent='Backup export failed: '+error.message;}});
 banner.append(message,backup);
}
window.addEventListener('majick-save-status',event=>majickShowSaveStatus(event.detail));
majickShowSaveStatus(MajickSaveSafety.status());
