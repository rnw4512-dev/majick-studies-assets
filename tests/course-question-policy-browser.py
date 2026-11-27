"""Retire course-location exercises without resetting academic or reward state."""
import os,sys,threading
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':1000});page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'))
  page.wait_for_function('!!window.MajickGameRealm&&!!window.MajickCourseQuestionPolicy&&!!window.S')
  result=page.evaluate('''()=>{
   const next=JSON.parse(JSON.stringify(S));
   next.activeCourse='D669';
   for(const id of ['D669','D772']){const p=next.progress[id];p.realmRecords={...(p.realmRecords||{}),runesort:{wins:2,plays:3},oraclelens:{wins:1,plays:1,best:1}};
    p.adaptiveSkills={...(p.adaptiveSkills||{}),'retired-location-test':{attempts:[{origin:'game-realm-rune-sort'}],errors:[],reconstructionBySkill:{'classify:Section 1':{source:{id:'rune-sort:fixture'}}}}};}
   next.courses.D669.questionBank.push({id:'qa-location',prompt:'Which course section contains phonics?',options:['Section 1','Section 2'],answer:'Section 1'});
   const protectedBefore=JSON.stringify({xp:next.progress.D669.xp,crystals:next.progress.D669.crystals,legacy:next.legacy,account:next.majickAccount,notes:next.progress.D669.notes});
   S=next;window.S=next;
   if(!MajickCourseQuestionPolicy.run())throw Error('Cleanup did not run');
   const protectedAfter=JSON.stringify({xp:S.progress.D669.xp,crystals:S.progress.D669.crystals,legacy:S.legacy,account:S.majickAccount,notes:S.progress.D669.notes});
   if(protectedAfter!==protectedBefore)throw Error('Protected progress changed');
   for(const id of ['D669','D772'])if(S.progress[id].realmRecords.runesort||S.progress[id].adaptiveSkills['retired-location-test'])throw Error('Retired records survived');
   if(questionPool().some(MajickCourseQuestionPolicy.excluded))throw Error('Retired study question survived');
   navigate('games');return true;
  }''')
  page.wait_for_timeout(300)
  assert page.get_by_text('Rune Sort',exact=True).count()==0
  path_text=' '.join(page.locator('.realmProgressHead').text_content().split())
  assert '/4 trials cleared' in path_text,path_text
  assert page.evaluate('startRuneSort()===false&&runeSortPick(0,"Section 1")===false&&finishRuneSort()===false')
  page.evaluate('window.MajickSaveSafety?.flush?.()');page.reload();page.wait_for_function('!!window.S&&!!window.MajickCourseQuestionPolicy')
  assert page.evaluate('!S.progress.D669.realmRecords.runesort&&!S.progress.D772.realmRecords.runesort&&!S.courses.D669.questionBank.some(MajickCourseQuestionPolicy.excluded)')
  assert not errors,errors
  print('PASS',width,'retired activity, study pool, saved cleanup, legacy handlers and protected state')
  context.close()
 browser.close()
server.shutdown()
