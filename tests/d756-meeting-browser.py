"""Executable browser acceptance checks; reward duration uses Playwright's virtual clock.
Run against a served canonical build with MAJICK_URL (defaults to localhost:8765).
Fresh browser context only: never edits a real learner's saved account.
"""
import os,json
from urllib.parse import urlsplit
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright
URL=os.environ.get('MAJICK_URL','http://127.0.0.1:8765/')
KEY='majick-d756-task2-rehearsal-v1'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 context=browser.new_context(); page=context.new_page(); errors=[]; failed=[]
 page.on('pageerror',lambda e: errors.append(e.stack))
 page.on('response',lambda r: failed.append(r.url) if r.status>=400 else None)
 page.goto(URL);page.wait_for_function('!!window.MajickD756Meeting && !!window.MajickRewardCore')
 page.clock.install(time=datetime(2026,11,11,12,0,tzinfo=timezone.utc))
 page.evaluate('switchCourse("D756")')
 page.locator('#majickHandsOnLaunch').click();page.locator('#d756Task2Launch').click()
 room=page.locator('#d756MeetingRoom')
 def click(a):room.locator('[data-action='+a+']').click()
 assisting=False
 def submit(text):
  if assisting:
   click('repair');room.locator('#dmRepairAnswer').fill(text);click('repair-submit')
  else:room.locator('#dmAnswer').fill(text);click('submit')
 def saved():return page.evaluate('(key)=>JSON.parse(localStorage.getItem(key))',KEY)
 def start(profile,mode):
  if room.locator('[data-action=reset]').count():click('reset')
  if room.locator('#dmAnswer').count():click('finish');click('reset')
  room.locator('#dmProfile').select_option(profile);room.locator('#dmMode').select_option(mode);click('start')
 def complete(profile,mode,qualify=True,assisted=False):
  global assisting
  start(profile,mode)
  assisting=assisted
  names={'angela':['Angela','Elena','Mr. Moore'],'maya':['Maya','Sofia','Ms. Patel'],'jordan':['Jordan','Marcus','Mr. Harris']}[profile]
  career={'angela':'graphic design','maya':'animation','jordan':'web design'}[profile]
  case=room.locator('details').first.inner_text()
  goals=page.evaluate('()=>{const d=document.querySelector("#d756MeetingRoom details");return [...d.querySelectorAll("[data-goal]")].map(p=>p.textContent).join(" ")}')
  responses=[
   'Welcome everyone. Today our meeting purpose and agenda are to review strengths, needs, goals and transition decisions. What questions do you have about our agenda?',
   names[2]+', what observations would you share about classroom strengths and support needs so we can build our plan?',
   names[1]+', what ideas would you share about helpful routines and the challenges you observe at home?',
   names[0]+', what supports do you prefer and what would help you participate actively in classroom learning?',
   'Let me explain all three annual goals and the measurement criteria in plain language. '+goals,
   'We will monitor weekly work samples and task logs, report quarterly to your family and review teaching if data show little progress. What questions do you have about these progress updates?',
   names[0]+', what ideas would you share about college education and employment in '+career+' so we can plan together?',
   'I hear your concern about financial security and understand why it matters. We will respect the student preference and choice, explore options together and compare education costs and employment opportunities.',
   'We can model the routine, scaffold classroom tasks and collect samples before we gradually reduce support based on evidence from independent work.',
   names[2]+', what suggestions would you share about next steps and who should take responsibility for coordinating classroom support?',
   'We have reviewed decisions while keeping student voice central to the plan. What questions do you have or what needs clarification before we finish?',
   'Our next steps are for the counselor to arrange program visits, the student to select portfolio examples and me to share data in four weeks. Thank you for your participation; we can close the meeting.'
  ]
  for stage,text in enumerate(responses):
   if stage==7:
    assert not __import__('re').search(r'financial|training costs|financially',room.locator('.dmPrompt').inner_text(),__import__('re').I), 'Concern leaked before elicitation'
    submit(names[1]+', what concerns would you share about the student’s future education and career options?')
    assert saved()['financialDiscovered'], 'Parent concern must follow an actual invitation'
   submit(text)
   if saved().get('pending'):
    if stage in [1,2,3,6,9]: assert saved()['pending']['who']=={1:3,2:0,3:1,6:1,9:3}[stage],saved()['pending']
    # Address the specific stakeholder statement rather than advancing past it.
    submit('I understand your point about '+saved()['pending']['line'].rstrip('?')+' We will use weekly work samples and a planning routine to review supports, preserve student choice, compare career training costs and assign follow-up responsibilities at review '+str(stage)+'.')
   assert not saved().get('pending'),saved()
   if stage==11 and qualify:
    # Move the browser wall clock atomically; fast_forward can race a resumed
    # clock after reload/day jumps in CI. The engine still measures its own time.
    now=page.evaluate('Date.now()');page.clock.set_system_time(datetime.fromtimestamp((now+901000)/1000,timezone.utc))
    assert page.evaluate('MajickD756Meeting.assessment().duration')>=900
   click('next')
  state=saved()
  assert state['done']
  assert state['assessment']['passed']==(qualify and not assisted),state['assessment']
  assisting=False
  return state
 # Mobile/tablet/desktop and all scenario/mode combinations, no coaching leakage.
 for width in ([1366] if os.environ.get('MEETING_QUICK') else [390,820,1366]):
  page.set_viewport_size({'width':width,'height':900})
  for profile in ['angela','maya','jordan']:
   for mode in ['guided','independent','challenge']:
    start(profile,mode)
    assert room.locator('.dmPerson').count()==4
    assert room.locator('.dmHint').count()==(1 if mode=='guided' else 0)
    assert room.evaluate('(r)=>r.scrollWidth<=r.clientWidth+1')
    submit('Yes')
    assert saved()['records']==[]
    submit('Can you please share your ideas about this meeting with the whole team today?')
    assert saved()['pending']
    click('next');assert saved()['step']==0
    room.locator('#dmAnswer').fill('Draft response that must survive closing the meeting room.')
    click('close');page.evaluate('MajickD756Meeting.open()')
    if mode=='guided':
     click('resume');assert room.locator('#dmAnswer').input_value().startswith('Draft response')
    else:
     assert saved()['done'] and saved()['interrupted'] and saved()['reward']['xp']==0
     assert room.locator('[data-action=resume]').count()==0
 print('PASS scenario/mode/viewport launches, meaningful response gate, pending reply gate and draft resume')
 # Natural short questions must reach the addressed person, without a ten-word barrier.
 start('angela','independent')
 for question,who in [('Angela, what do you want to do after graduation?',1),('Elena, what do you think?',0),('Mr. Moore, how is Angela doing in class?',3),('Team, what ideas would you like to share?',None)]:
  submit(question);assert saved()['pending']
  if who is not None:assert saved()['pending']['who']==who,(question,saved())
  if who==1:assert 'graphic design' in saved()['pending']['line']
  submit('I hear your perspective. We will document the supports and review progress together with the student at our next meeting about '+str(who)+'.')
 submit('Does anyone have questions?');assert saved()['pending']['kind']=='question'
 print('PASS short natural participant questions and four-word clarification invitation')
 # Guided practice alone supports pausing/resume; trials archive interrupted evidence.
 start('angela','guided');submit('Elena, what ideas would you share about the supports we can coordinate for this meeting?')
 click('back');elapsed=saved()['elapsed'];page.clock.fast_forward(60000)
 assert saved()['elapsed']==elapsed
 page.reload();page.wait_for_function('!!window.MajickD756Meeting');page.evaluate('switchCourse("D756");MajickD756Meeting.open()');click('resume')
 assert saved()['records'];print('PASS reload resume and paused clock')
 # Failed/incomplete practice has no reward, and unrelated course state stays intact.
 baseline=page.evaluate('JSON.stringify(S.progress.D772,(k,v)=>["xp","crystals","chests"].includes(k)?undefined:v)')
 click('finish');assert saved()['reward']['xp']==0
 before=page.evaluate('MajickStateCore.ensureAccount().xp')
 first=complete('angela','guided');assert first['reward']['xp']==30,first['reward']
 assert page.evaluate('MajickStateCore.ensureAccount().xp')==before+30
 repeat=complete('maya','independent');assert repeat['reward']['xp']==8,repeat['reward']
 third=complete('jordan','challenge');assert third['reward']['xp']==0 and third['reward']['status']=='already-awarded',third['reward']
 assert page.evaluate('MajickStateCore.ensureAccount().xp')==before+38
 assert page.evaluate('JSON.stringify(S.progress.D772,(k,v)=>["xp","crystals","chests"].includes(k)?undefined:v)')==baseline
 print('PASS complete meetings in three scenarios/modes, live shared XP +30/+8/0, profile-switch first-award protection, unrelated D772 state')
 # History, repeat duplicate across reload, independent mastery separation.
 page.reload();page.wait_for_function('!!window.MajickD756Meeting');page.evaluate('switchCourse("D756");MajickD756Meeting.open()')
 assert 'already granted' in room.inner_text()
 click('reset');room.locator('summary',has_text='Previous attempts').click();room.locator('[data-history]').first.click()
 assert room.get_by_text('Previous attempt transcript',exact=True).is_visible()
 ledger=page.evaluate('Object.entries(MajickStateCore.ensureAccount().rewardCore.ledger).filter(([k])=>k.startsWith("d756:task2:meeting:"))')
 assert len(ledger)==2
 assert all(v['receipt']['masteryXp']==0 for k,v in ledger)
 print('PASS persisted ledger, reviewable history and zero mastery XP')
 failed_meeting=complete('angela','independent',False)
 assert failed_meeting['reward']['xp']==0
 assert page.evaluate('MajickStateCore.ensureAccount().xp')==before+38
 print('Calendar before next-day jump',page.evaluate('new Date().toString()'),flush=True)
 page.clock.fast_forward(86400000)
 print('Calendar after next-day jump',page.evaluate('new Date().toString()'),flush=True)
 next_day_key=page.evaluate('(()=>{const d=new Date();return "d756:task2:meeting:repeat:"+d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")})()')
 assert page.evaluate('(key)=>!MajickStateCore.ensureAccount().rewardCore.ledger[key]',next_day_key),next_day_key
 tomorrow=complete('jordan','guided')
 assert tomorrow['reward']['xp']==8,{'reward':tomorrow['reward'],'now':page.evaluate('new Date().toString()'),'ledger':page.evaluate('Object.keys(MajickStateCore.ensureAccount().rewardCore.ledger).filter(k=>k.startsWith("d756:task2:meeting:"))')}
 assert page.evaluate('MajickStateCore.ensureAccount().xp')==before+46
 print('PASS completed short attempt earns zero; next calendar day repeat earns eight XP')
 original=page.evaluate('(key)=>localStorage.getItem(key)',KEY)
 original_history=page.evaluate('(key)=>localStorage.getItem(key+"-history")',KEY)
 original_xp=page.evaluate('MajickStateCore.ensureAccount().xp')
 choices=room.locator('[data-replay-choice]');choices.nth(0).check();choices.nth(1).check();click('replay-start')
 for n in range(2):
  room.locator('#dmReplayAnswer').fill('I hear your concern and respect the student voice. We will review the evidence together and assign the counselor a follow-up next week about issue '+str(n)+'.')
  click('replay-submit');click('replay-next')
 click('replay-exit')
 assert page.evaluate('(key)=>localStorage.getItem(key)',KEY)==original
 assert page.evaluate('(key)=>localStorage.getItem(key+"-history")',KEY)==original_history
 assert page.evaluate('MajickStateCore.ensureAccount().xp')==original_xp
 print('PASS two-exchange Replay Chamber preserves original evidence and grants zero XP')
 assisted_only=complete('angela','guided',True,True)
 assert assisted_only['reward']['xp']==0
 print('PASS guided repair-only meeting earns zero completion XP')
 # Never silently dismiss a concern.
 start('angela','challenge')
 for stage in range(7):
  submit('We are reviewing this topic carefully with the team and documenting concrete supports for the learner at agenda point '+str(stage)+'.');click('next')
 submit('We should move on because I have already decided what the student needs for this topic today.')
 assert saved()['pending']['kind']=='concern';click('next');assert saved()['step']==7
 submit('Elena, what concerns would you share about the student’s future education and career pathway?')
 submit('I hear your concern and respect the student choice. We still disagree. We will explore options together and compare realistic costs and employment outcomes next week.')
 click('next');assert saved()['step']==8
 assert saved()['concernStatus']=='follow-up scheduled'
 print('PASS disagreement requires listening and concern discovery; follow-up plan may retain differing views')
 assert not errors,errors
 # release.json is absent when testing raw source; a canonical build must have no missing assets.
 # /health is the pre-existing optional localhost AI bridge, not a static asset.
 # The meeting uses branching scripts and makes no AI backend requests.
 asset_extensions=('.js','.css','.png','.webp','.jpg','.jpeg','.svg','.woff','.woff2','.json')
 bad=[u for u in failed if urlsplit(u).path.endswith(asset_extensions) and not urlsplit(u).path.endswith('release.json')]
 optional_api=[u for u in failed if urlsplit(u).path=='/health']
 if optional_api:print('INFO optional legacy local AI bridge offline; scripted meeting has no AI dependency')
 assert not bad,bad
 print('PASS no runtime errors or failed application assets')
 browser.close()
