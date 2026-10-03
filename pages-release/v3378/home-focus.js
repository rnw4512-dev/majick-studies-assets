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
 '</div><details><summary>More campus tools</summary><div class="v3377ToolRow"><button class="v34Button" data-go="addmaterial">Notes Forge</button><button class="v34Button" data-go="analytics">Analytics</button><button class="v34Button" data-go="vault">Magic Vault</button><button class="v34Button" data-go="guide">Study Guide</button></div></details>';
 nav.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
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