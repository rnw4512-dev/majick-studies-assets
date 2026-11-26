"""Reproduce the supplied D669 screenshots through real story and Observatory UI."""
import os,sys,re,threading
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
evidence=Path(os.environ.get('READING_EVIDENCE','/tmp/aetheria-reading-evidence'));evidence.mkdir(parents=True,exist_ok=True)
def luminance(rgb):
 values=[x/255 for x in rgb];values=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in values]
 return sum(x*w for x,w in zip(values,[.2126,.7152,.0722]))
def contrast(locator,backgrounds):
 for el in locator.all():
  if not el.is_visible() or not el.inner_text().strip():continue
  color=el.evaluate('(e)=>getComputedStyle(e).webkitTextFillColor||getComputedStyle(e).color')
  rgb=[float(n) for n in re.findall(r'[\d.]+',color)[:3]];assert len(rgb)==3,color
  ink=luminance(rgb)
  for bg in backgrounds:
   paper=luminance(bg);ratio=(max(ink,paper)+.05)/(min(ink,paper)+.05)
   assert ratio>=4.5,(el.inner_text()[:90],color,round(ratio,2),bg)
paper=[[255,248,237],[248,240,245],[237,243,233],[255,253,250]]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':1000});page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'))
  page.wait_for_function('!!window.MajickAetheriaAdventures&&!!window.MajickStudyObservatory&&!!window.MajickStateCore')
  # Isolated QA context only: unlock the existing story to reproduce the user's completed state.
  page.evaluate("S.activeCourse='D669';const a=MajickStateCore.ensureAccount();a.xpHighWater=1800;a.xp=1800;navigate('mission');MajickAetheriaAdventures.refresh()")
  adventure=page.locator('#aethAdventure');adventure.wait_for(state='visible');page.wait_for_timeout(1000)
  contrast(adventure.locator('.aeth-adventure-head :is(h2,p,small),.aeth-adventure-message :is(b,p),.aeth-adventure-foot'),paper)
  nav=page.locator('#majickRoomSections')
  if nav.count():
   assert nav.evaluate('(e)=>e.scrollWidth<=e.clientWidth+2'),'Section ribbon overflows'
   for button in nav.locator('button').all():
    assert button.evaluate('(e)=>e.clientWidth>=80&&e.scrollWidth<=e.clientWidth+2'),'Section label is clipped'
  protected=page.evaluate('JSON.stringify(S.progress)');xp=page.evaluate('MajickStateCore.ensureAccount().xpHighWater')
  adventure.locator('[data-aeth-action="start"]').click()
  for index in range(3):
   page.locator('[data-aeth-route="evidence"]').click()
   rune=page.locator('.aeth-runes button>span[aria-hidden=true]').first
   art=rune.evaluate('(e)=>({image:getComputedStyle(e).backgroundImage,font:getComputedStyle(e).fontSize,animation:getComputedStyle(e).animationName})')
   assert art['image']!='none' and art['font']=='0px' and art['animation']=='none',art
   prompt=page.locator('.aeth-adventure-play h3').inner_text()
   correct=page.evaluate(r'''prompt=>{const norm=s=>s.replace(/[—–]/g,'-').replace(/\s+/g,' ').trim();const q=MajickAetheriaAdventures.questions('D669').find(q=>norm(q.prompt)===norm(prompt));if(!q)throw Error('Displayed question missing from its source');return q.correct}''',prompt)
   page.locator(f'[data-aeth-answer="{correct}"]').click()
   contrast(page.locator('.aeth-result :is(b,p,small)'),paper)
   page.locator('[data-aeth-action="next"]').click()
  message=page.locator('.aeth-adventure-message');assert 'Quest completed!' in message.inner_text() and '3 / 3 correct' in message.inner_text()
  contrast(message.locator('b,p'),paper)
  assert page.evaluate('JSON.stringify(S.progress)')==protected,'Story practice altered academic progress'
  assert page.evaluate('MajickStateCore.ensureAccount().xpHighWater')==xp,'Story practice added XP'
  message.scroll_into_view_if_needed();page.screenshot(path=str(evidence/f'quest-{width}.png'))
  page.evaluate("navigate('games')")
  page.locator('#aethAdventure [data-aeth-action="start"]').click()
  targets=page.locator('#aethAdventure .aeth-target');assert targets.count()>=2
  art=targets.first.locator('span').evaluate('(e)=>({image:getComputedStyle(e).backgroundImage,font:getComputedStyle(e).fontSize,animation:getComputedStyle(e).animationName})')
  assert any(path in art['image'] for path in ('/skill-17.webp','/spell-icons/runes-magenta-1.webp')) and art['font']=='0px' and art['animation']=='none',art
  prompt=page.locator('.aeth-adventure-play h3').inner_text()
  correct=page.evaluate('(prompt)=>MajickAetheriaAdventures.questions("D669").find(q=>q.prompt===prompt).correct',prompt)
  target=page.locator(f'[data-aeth-answer="{correct}"]');target.focus();page.keyboard.press('Enter')
  assert 'Correct rune!' in page.locator('.aeth-result').inner_text()
  assert page.evaluate('JSON.stringify(S.progress)')==protected,'Rune artwork changed academic progress'
  assert page.evaluate('MajickStateCore.ensureAccount().xpHighWater')==xp,'Rune artwork changed XP'
  page.locator('.aeth-result').scroll_into_view_if_needed();page.screenshot(path=str(evidence/f'rune-art-{width}.png'))
  page.evaluate("navigate('learninglab')")
  obs=page.locator('.obs-shell');obs.wait_for(state='visible');page.wait_for_timeout(700)
  contrast(obs.locator('.obs-header :is(h3,p,span),.obs-kpis :is(b,small),.obs-scenario-metric,.obs-meter p,.obs-fragment-note,.obs-disclaimer'),paper)
  obs.scroll_into_view_if_needed();page.screenshot(path=str(evidence/f'observatory-{width}.png'))
  # Exercise the existing dark study-break renderer through its published practice owner.
  page.evaluate("""()=>{const items=Object.values(MajickCourseActivityPlayer.packs).filter(p=>p.courseId==='D669').flatMap(p=>p.activities.filter(a=>a._sourceVerified&&a.provenance?.source_url).map(a=>({p,a}))).slice(0,5);if(items.length!==5)throw Error('Five real sourced activities required');for(const {p,a} of items)MajickStudyObservatory.record({detail:{courseId:'D669',lessonId:p.id,questionId:a.id,sourceUrl:a.provenance.source_url,correct:true}})}""")
  page.locator('[data-obs-play]').click()
  game=page.locator('.obs-game');game.wait_for(state='visible')
  contrast(game.locator('h4,.obs-game-head :is(span,strong),.obs-targets button'),[[75,59,108],[33,27,57]])
  game.locator('.obs-targets button').first.click()
  contrast(game.locator('.obs-game-feedback :is(b,p,span)'),[[234,225,241]])
  assert page.evaluate('MajickStateCore.ensureAccount().xpHighWater')==xp,'Study-break display changed XP'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'Room overflows'
  assert not errors,errors
  print(f'PASS parchment {width}: D669 story/3-answer completion/Observatory painted text >=4.5:1, whole section labels, dark game/feedback contrast, preserved academic progress and XP',flush=True)
  context.close()
 browser.close()
server.shutdown()
