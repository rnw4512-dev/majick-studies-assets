(()=>{
'use strict';
const VERSION='3.3.65';
const ROOM_PRIMARY={
 home:'.v3354CampusGate',
 learninglab:'.v3354TeachingBoard',
 livinggrimoire:'.v3354ArchiveDesk',
 games:'.realmHub,.realmShell',
 mission:'.mission,.realmQuestion',
 companions:'.v3341GuardianHero,.v3317SanctuaryFrame'
};
function screen(){return window.S?.screen||'home'}
function mark(){
 const r=screen(),root=document.querySelector('.content');
 document.documentElement.dataset.majickMobileClean='3365';
 document.body.dataset.majickPrimaryRoom=r;
 const ribbon=document.getElementById('majickRoomRibbon');
 const primary=ROOM_PRIMARY[r]&&document.querySelector(ROOM_PRIMARY[r]);
 if(ribbon){
   ribbon.classList.toggle('v3365HasPrimary',!!primary);
   ribbon.setAttribute('data-room',r);
 }
 document.querySelectorAll('.content h1,.content h2,.content h3').forEach((h,i)=>{
   if(i>40)return;
   const t=(h.textContent||'').trim().replace(/\s+/g,' ');
   h.dataset.majickHeadingKey=t.toLowerCase().slice(0,80);
 });
 compactRepeatedHeadings(root);
}
function compactRepeatedHeadings(root){
 if(!root)return;
 const seen=new Map();
 root.querySelectorAll('[data-majick-heading-key]').forEach(h=>{
   const key=h.dataset.majickHeadingKey;
   if(!key||key.length<5)return;
   if(seen.has(key)){
     h.classList.add('v3365RepeatedHeading');
     const parent=h.closest('section,article,header,div');
     if(parent)parent.classList.add('v3365RepeatedBlock');
   }else seen.set(key,h);
 });
}
const q=window.MajickRenderQueue;
if(q?.register){q.register('mobile-cleanup',mark,110);q.schedule()}else setTimeout(mark,160);
window.addEventListener('resize',()=>q?.schedule?.()||mark(),{passive:true});
window.MajickMobileCleanup={VERSION,ROOM_PRIMARY,screen,mark,compactRepeatedHeadings};
})();