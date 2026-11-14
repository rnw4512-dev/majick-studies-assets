/* Shared, non-invasive instructions for Aetheria interactive experiences. */
(function(){
'use strict';
if(window.MajickInteractionHelp)return;
const instructions={
 council:{title:'Council Chamber · How to practice',steps:[
 'Choose Full Mock for the entire guided IEP meeting, Guided for hints, Independent to practice without ready-made answers, or Final Trial for harder questions.',
 'The highlighted name and role tell you who is speaking. Select Hear stakeholder to listen. Review IEP at a Glance at any time.',
 'Respond aloud, type, or dictate. Choose a sample response only when you want coached practice. Select Send response to stakeholder to record your turn.',
 'The Response Coach explains what was accurate, what was missing and how to improve. Practice rewrite checks your words without sending a second turn or changing the original transcript.',
 'Select Return to meeting after feedback. Undo last response takes back only the most recent sent turn; Redo restores that turn. Continue agenda moves to the next agenda item when ready.',
 'Restart meeting starts a new practice attempt after confirmation. The 20-minute clock is for rehearsal; the typing-friendly option pauses it while composing.' ]},
 study:{title:'Study Hall · How to study',steps:[
 'Choose your current course and a lesson or skill to work on.',
 'Read the explanation and examples before attempting a question.',
 'Use available hints or guided practice when you need them; these do not count as independent mastery.',
 'Complete an independent question in your own words and read its feedback.',
 'Return to the course progress view to see what to review next.' ]},
 lab:{title:'Learn Lab · How to learn',steps:[
 'Choose the skill or lesson you want to understand.',
 'Read the explanation and examine the worked example.',
 'Try guided practice, then answer a new problem independently.',
 'Read the full feedback and use a repair step if offered.',
 'Return to your learning plan when you are ready for the next skill.' ]},
 trial:{title:'Trial Chamber · How to practice',steps:[
 'Read the challenge and identify the clues in the question.',
 'Choose a method, solve, and explain your reasoning.',
 'Use the feedback to diagnose mistakes; guided repair is not independent mastery.',
 'After repair, attempt a fresh transfer problem without help.',
 'Check your progress and leave the challenge using its normal navigation.' ]},
 sanctuary:{title:'Celestial Sanctuary · How to use it',steps:[
 'Open your Guardian collection and select the Guardian you want to care for or view.',
 'Use the existing care and movement controls to interact with your Guardian.',
 'Open the incubator to see owned eggs, choose an egg, and inspect its progress when available.',
 'Egg fragments and moonlight are earned through eligible learning milestones; view the reward ledger for confirmed awards.',
 'Your existing saved Guardians and eggs should remain attached to your Scholar profile.' ]},
 atelier:{title:'Atelier · How to customize',steps:[
 'Choose the avatar or item category you want to customize.',
 'Select an available appearance or outfit choice to preview it.',
 'Use the existing save or apply control to keep your changes.',
 'Return to your Scholar profile to inspect the result.' ]},
 game:{title:'Game Realm · How to play',steps:[
 'Select an available game or challenge and read its objective.',
 'Use the onscreen controls to make a choice or submit your answer.',
 'Check the explanation after every attempt and repair mistakes where offered.',
 'Earn rewards only when the game confirms the required learning activity.',
 'Use the room navigation to return to your learning plan.' ]},
 quiz:{title:'Quiz and practice · How to answer',steps:[
 'Read the entire question before choosing an answer.',
 'Use any available calculator, hints or examples as directed.',
 'Submit your answer and inspect the explanation or error diagnosis.',
 'Use Try again or Repair if offered before moving to the next question.',
 'Review the summary for areas that need more practice.' ]},
 general:{title:'Aetheria · How to use interactive activities',steps:[
 'Choose a room, course, lesson or activity from the navigation.',
 'Read the current objective and the instructions shown near its controls.',
 'Use Learn or Guided modes for help; use Independent or Trial modes when you want to test your understanding.',
 'After answering, read the explanation and use repair or retry controls where offered.',
 'Use the app’s progress and journal views to review completed activity. This guide stays available throughout Aetheria.' ]}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function context(){
 if(document.querySelector('#d756MeetingRoom'))return 'council';
 if(document.querySelector('#majickHandsOnOverlay'))return 'study';
 const screen=String(window.S?.screen||window.S?.activeRoom||document.body?.dataset?.room||'').toLowerCase();
 if(/council|iep|d756/.test(screen))return 'council';
 if(/sanctuary|guardian|incubat/.test(screen))return 'sanctuary';
 if(/atelier|closet|avatar/.test(screen))return 'atelier';
 if(/trial|chamber/.test(screen))return 'trial';
 if(/lab|lesson|learn/.test(screen))return 'lab';
 if(/quiz|test|assessment|probab/.test(screen))return 'quiz';
 if(/game/.test(screen))return 'game';
 if(/study|grimoire|hall/.test(screen))return 'study';
 return 'general';
}
let previous=null;
function close(){
 const panel=document.getElementById('aetheriaHelpDialog');
 if(!panel)return;
 panel.remove();(previous?.isConnected?previous:document.getElementById('aetheriaHelpLauncher'))?.focus();
 previous=null;
}
function open(which){
 close();
 const topic=instructions[which]||instructions[context()]||instructions.general;
 previous=document.activeElement;
 const layer=document.createElement('div');layer.id='aetheriaHelpDialog';layer.className='aetheriaHelpOverlay';
 layer.innerHTML='<section class="aetheriaHelpPanel" role="dialog" aria-modal="true" aria-labelledby="aetheriaHelpTitle"><header><h2 id="aetheriaHelpTitle">'+esc(topic.title)+'</h2><button type="button" data-help-close aria-label="Close instructions">Close ×</button></header><p>Use these steps whenever you need a reminder. They do not change your answers, progress or saved work.</p><ol>'+topic.steps.map(step=>'<li>'+esc(step)+'</li>').join('')+'</ol><button type="button" data-help-close>Return to activity</button></section>';
 document.body.append(layer);layer.querySelectorAll('[data-help-close]').forEach(b=>b.onclick=close);
 layer.addEventListener('click',e=>{if(e.target===layer)close();});
 layer.addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();close();return;}
 if(e.key!=='Tab')return;
 const targets=[...layer.querySelectorAll('button')].filter(el=>!el.disabled);
 if(!targets.length)return;
 if(e.shiftKey&&document.activeElement===targets[0]){e.preventDefault();targets.at(-1).focus();}
 if(!e.shiftKey&&document.activeElement===targets.at(-1)){e.preventDefault();targets[0].focus();}
 });
 layer.querySelector('[data-help-close]')?.focus();
}
const style=document.createElement('style');style.textContent=`
#aetheriaHelpLauncher{position:fixed;bottom:18px;left:18px;z-index:1290;min-height:44px;padding:10px 16px;background:#3b2b43;color:#fff7dc;border:2px solid #c6a161;border-radius:30px;box-shadow:0 6px 20px #130b2288;cursor:pointer;font:600 14px system-ui,sans-serif}
#aetheriaHelpLauncher:focus-visible{outline:3px solid #ffe3a1;outline-offset:3px}
body:has(#d756MeetingRoom) #aetheriaHelpLauncher{display:none}
.aetheriaHelpOverlay{position:fixed;inset:0;z-index:4000;background:#100c19cc;display:grid;place-items:center;padding:16px}
.aetheriaHelpPanel{max-height:90vh;overflow:auto;width:min(650px,100%);padding:22px;background:#fff7e8;color:#31273a;border:2px solid #ba955c;border-radius:18px;box-shadow:0 18px 60px #06030b99;font:16px/1.6 system-ui,sans-serif}
.aetheriaHelpPanel :is(h2,p,li){color:#31273a!important}
.aetheriaHelpPanel header{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}
.aetheriaHelpPanel h2{font:700 1.5rem/1.25 Georgia,serif;margin:0}
.aetheriaHelpPanel li{margin:10px 0}
.aetheriaHelpPanel button{background:#44314b;color:#fff7e6;padding:10px 15px;min-height:44px;border-radius:9px;border:1px solid #a98452;cursor:pointer}
.aetheriaHelpPanel button:focus-visible{outline:3px solid #9a6b29;outline-offset:3px}
@media(max-width:480px){#aetheriaHelpLauncher{bottom:8px;left:8px;padding:7px 12px}.aetheriaHelpPanel{padding:15px}}
`;document.head.append(style);
const launcher=document.createElement('button');launcher.id='aetheriaHelpLauncher';launcher.type='button';launcher.textContent='? How to use this';launcher.setAttribute('aria-label','How to use the current Aetheria activity');launcher.onclick=()=>open();document.body.append(launcher);
window.MajickInteractionHelp={open,close,context};
})();
