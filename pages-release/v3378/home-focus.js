(()=>{
'use strict';
const VERSION='3.3.77';
function compactHome(){return window.S?.screen==='home'}
function lesson(){
 try{return window.MajickCourseTutor?.selectedLesson?.(window.S?.activeCourse)||null}catch(_){return null}
}
function go(route){try{window.navigate?.(route)}catch(_){}}
function continueCourse(){
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
 const l=lesson(),title=l?.title||'Continue your course';
 nav.innerHTML='<header><div><small>YOUR CAMPUS</small><h3>Where do you want to go?</h3></div><span>Home stays simple. Each room has one job.</span></header><div class="v3377DoorGrid">'+
 '<button data-go="continue"><b>✦ Continue '+String(window.S?.activeCourse||'Course')+'</b><small>'+String(title).replace(/[&<>"]/g,'')+'</small></button>'+
 '<button data-go="livinggrimoire"><b>☾ Grimoire</b><small>Notes, references & course map</small></button>'+
 '<button data-go="games"><b>✧ Game Realm</b><small>Practice, review & challenges</small></button>'+
 '<button data-go="companions"><b>◆ Dormitory & Sanctuary</b><small>Your room, Guardians & care</small></button>'+
 '</div><details><summary>More campus tools</summary><div class="v3377ToolRow"><button data-go="addmaterial">Notes Forge</button><button data-go="analytics">Analytics</button><button data-go="vault">Magic Vault</button><button data-go="guide">Study Guide</button></div></details>';
 nav.querySelector('[data-go="continue"]')?.addEventListener('click',continueCourse);
 nav.querySelectorAll('[data-go]').forEach(b=>{if(b.dataset.go!=='continue')b.addEventListener('click',()=>go(b.dataset.go))});
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