"""Real uploaded music: opt-in loading, one player, switching, mute and saved-data boundaries."""
import os,sys,threading
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import expect,sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
tracks=['crystal-cave','crystal-mystery','mystical-theme','enchanted-tiki','dark-ambience','enchanted-festival']
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':1000});page=context.new_page();errors=[];requests=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
  page.add_init_script("""(()=>{const Native=window.Audio;window.qaMusicPlayers=[];function Audio(src){const audio=new Native(src);if(String(src).includes('/music/')||String(src).includes('dreams-become-real'))qaMusicPlayers.push(audio);return audio}Audio.prototype=Native.prototype;Object.setPrototypeOf(Audio,Native);window.Audio=Audio})()""")
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'))
  page.wait_for_function('!!window.MajickCollegiumAtmosphere?.selectTrack&&!!window.MajickRewardCore');page.wait_for_timeout(600)
  def protected():return page.evaluate('JSON.stringify({progress:S.progress,xp:S.majickAccount.xpHighWater,rewards:MajickRewardCore.inspect()})')
  before=protected()
  page.locator('.caSoundOptions>summary').click();picker=page.locator('.caTrackSelect');assert picker.locator('option').count()==7
  for track in tracks:
   picker.select_option(track)
   assert page.evaluate('MajickCollegiumAtmosphere.inspect().track')==track
   assert not page.evaluate('MajickCollegiumAtmosphere.inspect().playing')
  assert not any('/assets/licensed/music/' in url for url in requests),'Music fetched before explicit opt-in'
  assert page.evaluate('qaMusicPlayers.length')==0,'Muted selection allocated a music player'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),'Sound settings overflow'
  page.locator('.caAmbience').click()
  page.wait_for_function('MajickCollegiumAtmosphere.inspect().playing&&MajickCollegiumAtmosphere.inspect().loaded>=2')
  for track in tracks:
   picker.select_option(track)
   page.wait_for_function('(id)=>{const s=MajickCollegiumAtmosphere.inspect();return s.track===id&&s.loadedTrack===id&&s.enabled&&s.playing&&s.loaded>=2&&!s.error}',arg=track)
  assert page.evaluate('qaMusicPlayers.length')==1,'Switching creates overlapping music owners'
  page.evaluate("Promise.all([MajickCollegiumAtmosphere.selectTrack('crystal-cave'),MajickCollegiumAtmosphere.selectTrack('mystical-theme')])")
  page.wait_for_function("MajickCollegiumAtmosphere.inspect().track==='mystical-theme'&&MajickCollegiumAtmosphere.inspect().playing&&MajickCollegiumAtmosphere.inspect().loaded>=2")
  assert page.evaluate('qaMusicPlayers.filter(a=>!a.paused).length')==1
  assert not page.evaluate("MajickCollegiumAtmosphere.selectTrack('__invalid__')")
  page.locator('.caAmbience').click()
  assert not page.evaluate('MajickCollegiumAtmosphere.inspect().enabled||MajickCollegiumAtmosphere.inspect().playing')
  assert page.evaluate('qaMusicPlayers.every(a=>a.paused)')
  page.evaluate('MajickCollegiumAtmosphere.setVolume(0)');page.locator('.caAmbience').click()
  assert not page.evaluate('MajickCollegiumAtmosphere.inspect().enabled')
  assert 'volume is 0' in page.locator('.caSoundStatus').inner_text()
  page.evaluate('MajickCollegiumAtmosphere.setVolume(.12)');page.locator('.caAmbience').click()
  page.wait_for_function('MajickCollegiumAtmosphere.inspect().playing')
  assert page.evaluate('qaMusicPlayers[0].volume')==.12
  page.locator('.caAmbience').click()
  assert protected()==before,'Audio changes study progress, XP or reward inventory'
  if width==820:
   personal=page.locator('.caSoundOptions input[type=file]')
   personal.set_input_files({
    'name':'Personal audio fixture.ogg','mimeType':'audio/ogg',
    'buffer':(root/'assets/audio/dreams-become-real.ogg').read_bytes(),
   })
   expect(picker.locator('option[value=personal]')).to_have_count(1)
   assert page.evaluate("MajickCollegiumAtmosphere.inspect().track==='personal'&&!MajickCollegiumAtmosphere.inspect().playing")
   page.locator('.caAmbience').click()
   page.wait_for_function("MajickCollegiumAtmosphere.inspect().playing&&MajickCollegiumAtmosphere.inspect().loadedTrack==='personal'")
   assert page.evaluate('qaMusicPlayers.length')==1
   page.evaluate('window.MajickSaveSafety?.flush?.()')
   page.reload()
   expect(page.locator('.caTrackSelect option[value=personal]')).to_have_count(1)
   assert page.evaluate('!MajickCollegiumAtmosphere.inspect().playing')
   print('PASS personal audio remains on the device, survives reload and uses the one opt-in player',flush=True)
  assert not errors,errors
  print(f'PASS optional music {width}: seven choices, six uploaded tracks decode/play, no pre-opt-in download, one player, rapid-switch safety, mute/zero-volume and preserved learning/rewards',flush=True)
  context.close()
 browser.close()
server.shutdown()
