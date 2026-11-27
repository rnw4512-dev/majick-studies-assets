"""Exercise the real persisted workspace, using an isolated Chromium context."""
import json
import os
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


root = Path(sys.argv[1] if len(sys.argv) > 1 else 'current-site').resolve()
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(root)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = os.environ.get('MAJICK_URL', f'http://127.0.0.1:{server.server_port}/')

read_checkpoint = """key => new Promise((resolve, reject) => {
 const request=indexedDB.open('aetheria-recovery-v1',1);
 request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{
  const db=request.result;
  const read=db.transaction('snapshots').objectStore('snapshots').get(key);
  read.onsuccess=()=>{db.close();resolve(JSON.parse(read.result));};
  read.onerror=()=>{db.close();reject(read.error);};
 };
})"""


# Compare durable earned values and ledger receipts, not just aggregate counts.
reward_snapshot = """() => {
 const a=S.majickAccount,r=a.rewardCore;
 return {xp:a.xp,crystals:a.crystals,chests:a.chests,
         xpHighWater:a.xpHighWater,masteryXp:r.masteryXp,
         eggFragments:r.eggFragments,ledger:r.ledger};
}"""


def checkpoint_rewards(item):
    a = json.loads(item['raw'])['majickAccount']
    r = a['rewardCore']
    return dict(xp=a['xp'], crystals=a['crystals'], chests=a['chests'],
                xpHighWater=a['xpHighWater'], masteryXp=r['masteryXp'],
                eggFragments=r['eggFragments'], ledger=r['ledger'])


def ready(page):
    page.wait_for_function("!!window.MajickWorkspaceReady")
    page.evaluate('MajickSaveSafety.flush()')


with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
        args=['--no-sandbox'],
    )
    with browser.new_context() as ctx:
        ctx.add_init_script("""(() => {
         const seed=localStorage.getItem('workspace-quota-fixture');
         if(!seed) {
          const state={activeCourse:'D669',screen:'vault',courses:{D669:{id:'D669',title:'Early Literacy Methods',concepts:[],questionBank:[]}},progress:{D669:{answers:[{qid:'legacy-exact-attempt'}]}},
            legacy:{activePetId:'guardian-level-36',pets:[{id:'guardian-level-36',type:'velora',name:'Fixture Guardian',studyXP:1400,bond:39,hatched:true}],eggs:[{id:'fixture-egg',type:'cascade',progress:6,goal:21}]},testWorkspaceMarker:'legacy-quota-fixture'};
          localStorage.setItem('moonlit_learning_v1',JSON.stringify(state));
          localStorage.setItem('workspace-quota-fixture','ready');
         }
         const original=Storage.prototype.setItem;
         Storage.prototype.setItem=function(key,value){
          if(key==='moonlit_learning_v1'||key==='majick-learning-observatory-v1')
           throw new DOMException('Isolated quota test','QuotaExceededError');
          return original.call(this,key,value);
         };
        })();""")
        page = ctx.new_page()
        page.goto(url)
        ready(page)
        page.get_by_role('tablist', name='Magic Vault sections').wait_for()
        assert page.evaluate("S.progress.D669.answers.some(a=>a.qid==='legacy-exact-attempt')")
        world = page.evaluate("JSON.stringify({pets:S.legacy.pets,eggs:S.legacy.eggs})")
        assert page.evaluate("masPetLevel(S.legacy.pets.find(p=>p.id==='guardian-level-36'))")==36
        legacy = page.evaluate("localStorage.getItem('moonlit_learning_v1')")
        page.evaluate("""()=>{
         S.testWorkspaceMarker='newer-idb-workspace';
         const key='majick-d756-task2-rehearsal-v1-history';
         MajickSaveSafety.records.setItem(key,JSON.stringify([{id:'complete-council-attempt'}]));
         save();return MajickSaveSafety.flush();
        }""")
        # Award through the real reward owner. These fixed-key reward types
        # do not alter the existing Guardian/egg comparison fixture.
        page.evaluate("""()=>{
         MajickRewardCore.award('d756-meeting-first-pass',{key:'fixture-earned-council'});
         MajickRewardCore.award('study-fragment-earned',{key:'fixture-earned-fragment'});
         return MajickSaveSafety.flush();
        }""")
        earned = page.evaluate(reward_snapshot)
        assert earned['ledger']['fixture-earned-council']['receipt']['xp'] == 30
        assert earned['ledger']['fixture-earned-council']['receipt']['crystals'] == 5
        assert earned['ledger']['fixture-earned-fragment']['receipt']['eggFragments'] == 1
        latest = page.evaluate(read_checkpoint, 'primary-workspace-v2')
        assert checkpoint_rewards(latest) == earned
        assert latest['revision'] >= 2
        assert 'complete-council-attempt' in latest['browserData']['majick-d756-task2-rehearsal-v1-history']
        assert page.evaluate('MajickSaveSafety.status().ok') is True
        assert page.evaluate("localStorage.getItem('moonlit_learning_v1')") == legacy
        page.evaluate("""()=>new Promise((resolve,reject)=>{
         const request=indexedDB.open('aetheria-recovery-v1',1);
         request.onerror=()=>reject(request.error);
         request.onsuccess=()=>{
          const db=request.result,tx=db.transaction('snapshots','readwrite');
          tx.objectStore('snapshots').put(null,'primary-workspace');
          tx.oncomplete=()=>{db.close();resolve()};
          tx.onabort=()=>reject(tx.error);
         };
        })""")
        page.reload()
        ready(page)
        page.get_by_role('tablist', name='Magic Vault sections').wait_for()
        assert page.evaluate("S.testWorkspaceMarker==='newer-idb-workspace'")
        assert page.evaluate("MajickSaveSafety.records.getItem('majick-d756-task2-rehearsal-v1-history').includes('complete-council-attempt')")
        assert page.locator('#majickSaveFailure').count() == 0
        assert page.evaluate("JSON.stringify({pets:S.legacy.pets,eggs:S.legacy.eggs})")==world
        assert page.evaluate(read_checkpoint, 'previous-workspace')['revision'] < page.evaluate(read_checkpoint, 'primary-workspace-v2')['revision']
        assert page.evaluate(reward_snapshot) == earned
        # Closing the page and opening a new one in the same isolated profile
        # must preserve the authoritative checkpoint, including receipts.
        other = ctx.new_page()
        other.goto(url)
        ready(other)
        assert other.evaluate(reward_snapshot) == earned
        other.evaluate("""()=>{
         MajickRewardCore.award('d756-meeting-first-pass',{key:'fixture-earned-council'});
         MajickRewardCore.award('study-fragment-earned',{key:'fixture-earned-fragment'});
         save();return MajickSaveSafety.flush();
        }""")
        assert other.evaluate(reward_snapshot) == earned
        assert checkpoint_rewards(other.evaluate(read_checkpoint, 'primary-workspace-v2')) == earned
        page.evaluate("""()=>{S.testWorkspaceMarker='stale-tab';save();return MajickSaveSafety.flush()}""")
        assert page.evaluate("MajickSaveSafety.status().message.includes('another tab')")
        assert 'stale-tab' not in other.evaluate(read_checkpoint, 'primary-workspace-v2')['raw']
        before = other.evaluate(read_checkpoint, 'primary-workspace-v2')
        other.evaluate("""()=>{
         window.originalWorkspaceTransaction=IDBDatabase.prototype.transaction;
         IDBDatabase.prototype.transaction=function(store,mode,...rest){
          if(this.name==='aetheria-recovery-v1'&&mode==='readwrite')
           throw new DOMException('Synthetic transaction failure','QuotaExceededError');
          return originalWorkspaceTransaction.call(this,store,mode,...rest);
         };
         S.testWorkspaceMarker='retryable';save();return MajickSaveSafety.flush();
        }""")
        assert other.evaluate("MajickSaveSafety.status().ok") is False
        assert other.locator('#majickSaveFailure').is_visible()
        assert other.evaluate(read_checkpoint, 'primary-workspace-v2') == before
        ctx.set_offline(True)
        other.evaluate("""()=>{
         IDBDatabase.prototype.transaction=originalWorkspaceTransaction;
         for(const marker of ['queued-1','queued-2','offline-latest']){S.testWorkspaceMarker=marker;save();}
         return MajickSaveSafety.flush();
        }""")
        assert other.evaluate("MajickSaveSafety.status().ok") is True
        offline_checkpoint = other.evaluate(read_checkpoint, 'primary-workspace-v2')
        assert 'offline-latest' in offline_checkpoint['raw']
        assert checkpoint_rewards(offline_checkpoint) == earned
        assert other.locator('#majickSaveFailure').count() == 0
        ctx.set_offline(False)
        other.on('dialog', lambda dialog: dialog.accept())
        other.evaluate("""async()=>{
         const payload=MajickSaveSafety.exportPayload(S);
         payload.state.testWorkspaceMarker='restored-backup';
         payload.browserData['majick-d756-task2-rehearsal-v1-history']=JSON.stringify([{id:'imported-attempt'}]);
         await MajickSaveSafety.importFile({target:{files:[new File([JSON.stringify(payload)],'fixture.json')]}});
         await MajickSaveSafety.flush();
        }""")
        restored = other.evaluate(read_checkpoint, 'primary-workspace-v2')
        assert 'restored-backup' in restored['raw']
        assert 'imported-attempt' in restored['browserData']['majick-d756-task2-rehearsal-v1-history']
        assert checkpoint_rewards(restored) == earned
        last_good = other.evaluate(read_checkpoint, 'previous-workspace')
        page.close()
        other.evaluate("""()=>new Promise((resolve,reject)=>{
         const open=indexedDB.open('aetheria-recovery-v1',1);
         open.onerror=()=>reject(open.error);
         open.onsuccess=()=>{
          const db=open.result,tx=db.transaction('snapshots','readwrite');
          tx.objectStore('snapshots').put('synthetic invalid checkpoint','primary-workspace-v2');
          tx.oncomplete=()=>{db.close();resolve()};
          tx.onabort=()=>reject(tx.error);
         };
        })""")
        other.reload()
        ready(other)
        assert other.evaluate('S.testWorkspaceMarker') == json.loads(last_good['raw'])['testWorkspaceMarker']
        assert other.evaluate(read_checkpoint, 'primary-workspace-v2')['revision'] > last_good['revision']
        ctx.add_init_script("""Object.defineProperty(window,'indexedDB',{configurable:true,value:{
         open(){throw new DOMException('Synthetic database block','SecurityError');}
        }});""")
        blocked = ctx.new_page()
        blocked.goto(url)
        ready(blocked)
        assert blocked.locator('#majickSaveFailure').is_visible()
        assert 'database is unavailable' in blocked.locator('#majickSaveFailure').inner_text()
        assert blocked.evaluate("localStorage.getItem('moonlit_learning_v1')") == legacy
        print('PASS exact reward ledger, XP, crystals, fragment recovery and duplicate prevention; saved Vault, exact Guardian and egg recovery, quota, Council, stale tabs, failed writes, offline retry, verified import, corrupted checkpoint recovery and blocked database', flush=True)
    browser.close()
server.shutdown()
