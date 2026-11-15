
MajickSaveSafety.attach({get:()=>S,set:value=>{S=value;window.majickSaveLoadBlocked=false;session=null;S.screen='home';},refresh:()=>{ensureV4();ensureV5();render();}});
exportSave=()=>MajickSaveSafety.download();
importSave=event=>MajickSaveSafety.importFile(event);
v5RestoreBackup=()=>MajickSaveSafety.restorePrevious();
function majickShowSaveStatus(detail){
 const node=document.getElementById('majickSaveSafetyStatus');if(node)node.textContent=detail.message;
 let banner=document.getElementById('majickSaveFailure');
 if(detail.ok){banner?.remove();return;}
 if(!banner){banner=document.createElement('div');banner.id='majickSaveFailure';banner.setAttribute('role','alert');banner.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;padding:14px;background:#381e2a;color:#fff;border:2px solid #e5b47c;border-radius:12px';document.body.appendChild(banner);}
 banner.textContent=detail.message+' Open Progress Safety to import or restore a backup. Avoid closing this tab until your current work is backed up.';
}
window.addEventListener('majick-save-status',event=>majickShowSaveStatus(event.detail));
majickShowSaveStatus(MajickSaveSafety.status());
