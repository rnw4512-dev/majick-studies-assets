(()=>{
'use strict';
const VERSION='3.4.0';
function compactHome(){return window.S?.screen==='home'}
function lesson(){
 try{return window.MajickCourseTutor?.selectedLesson?.(window.S?.activeCourse)||null}catch(_){return null}
}
function go(route){try{window.navigate?.(route)}catch(_){}}
function continueCourse(){
 if(window.MajickProductCore?.goNext)return window.MajickProductCore.goNext();
 const l=lesson();
 try{
   if(window.S?.screen!=='learninglab')window.navigate?.('learninglab');
   setTimeout(()=>window.MajickCourseTutor?.openLesson?.(l?.id,null,window.S?.activeCourse),80);
 }catch(_){go('learninglab')}
}
function d772SectionDoors(){
 if(window.S?.activeCourse!=='D772')return '';
 const sections=window.MajickCourseTutor?.sections?.('D772')||[];
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return '<section aria-label="D772 section navigation" style="margin-top:1rem;padding:1rem;border:1px solid #b58b59;border-radius:14px;background:#291a38;color:#f8e8cc"><h3 style="color:#fff2d7">Study Now — Choose a D772 Section</h3><p>All three sections, from credibility to probability.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.7rem">'+sections.map((section,i)=>'<button type="button" data-d772-open="'+E(section.lessons?.[0]?.id||'')+'" style="text-align:left;padding:1rem;border:1px solid #b58b59;border-radius:12px;background:#f4e6d3;color:#30203d;cursor:pointer"><strong>Section '+(i+1)+': '+E(section.title)+'</strong><small style="display:block;margin-top:.4rem">'+(section.lessons||[]).length+' lessons • Open →</small></button>').join('')+'</div></section>';
}
function buildDoors(){
 if(!compactHome())return;
 const hero=document.querySelector('.v3327PortalHero');if(!hero)return;
 let nav=document.getElementById('v3377CampusDoors');
 if(nav)nav.remove();
 nav=document.createElement('section');nav.id='v3377CampusDoors';nav.className='v3377CampusDoors';
 const next=window.MajickProductCore?.nextAction?.();
 nav.innerHTML='<header><div><small>CAMPUS ROOMS</small><h3>Your college, without the clutter.</h3></div><span>The Daily Loop above owns your next action. These are alternate destinations.</span></header><div class="v3377DoorGrid v3400RoomGrid">'+
 '<button class="v34Button" data-go="livinggrimoire"><b>☾ Grimoire</b><small>Notes, references & course map</small></button>'+
 '<button class="v34Button" data-go="games"><b>✧ Game Realm</b><small>Practice, review & challenges</small></button>'+
 '<button class="v34Button" data-go="companions"><b>◆ Dormitory & Sanctuary</b><small>Your room, Guardians & visible progress</small></button>'+
 '</div>'+d772SectionDoors()+'<details><summary>More campus tools</summary><div class="v3377ToolRow"><button class="v34Button" data-go="addmaterial">Notes Forge</button><button class="v34Button" data-go="analytics">Analytics</button><button class="v34Button" data-go="vault">Magic Vault</button><button class="v34Button" data-go="guide">Study Guide</button></div></details>';
 nav.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
 nav.querySelectorAll('[data-d772-open]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.d772Open;if(!id)return;window.navigate?.('learninglab');setTimeout(()=>window.MajickCourseTutor?.openLesson?.(id,null,'D772'),80)}));
 hero.insertAdjacentElement('afterend',nav);
}
function simplifyHome(){
 document.documentElement.dataset.majickHomeFocus=compactHome()?'true':'false';
 if(!compactHome())return;
 document.querySelector('.v3354CampusGate')?.remove();
 document.querySelector('.v3358HallMap')?.remove();
 document.querySelector('.v3367CourseMap')?.remove();
 document.getElementById('majickHomeResume')?.remove();
 buildDoors();
}
function decorate(){simplifyHome()}
const q=window.MajickRenderQueue;
if(q?.register){q.register('home-focus',decorate,25);q.schedule()}else setTimeout(decorate,120);
window.MajickHomeFocus={VERSION,compactHome,lesson,continueCourse,buildDoors,simplifyHome,decorate};
})();