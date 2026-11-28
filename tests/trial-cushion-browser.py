"""Trial replay and the shared Sanctuary's craftable Guardian bed."""
import os
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import expect, sync_playwright


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


root = Path(sys.argv[1] if len(sys.argv) > 1 else 'current-site').resolve()
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(root)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/'

with sync_playwright() as pw:
    browser = pw.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
        args=['--no-sandbox', '--enable-unsafe-swiftshader'],
    )
    page = browser.new_page(reduced_motion='reduce', viewport={'width': 1180, 'height': 950})
    page.goto(url, wait_until='domcontentloaded')
    page.wait_for_function('!!window.MajickRewardCore && !!window.MajickSanctuaryState && !!window.MajickGameRealm')
    page.evaluate("switchCourse('D669');navigate('games')")
    trial_key = 'trial-completion:D669:memory-constellation'

    for attempt in range(2):
        page.evaluate('startMemoryConstellation()')
        pairs = page.evaluate("""session.cards.flatMap((card,i)=>card.kind==='clue'?
            [[i,session.cards.findIndex(other=>other.kind==='answer'&&other.pair===card.pair)]]:[])""")
        for clue, answer in pairs:
            page.locator(f'[data-card-index="{clue}"]').evaluate('button=>button.click()')
            page.locator(f'[data-card-index="{answer}"]').evaluate('button=>button.click()')
        page.wait_for_function('session.finished')
        receipt = page.evaluate('(key)=>S.majickAccount.rewardCore.ledger[key].receipt', trial_key)
        assert (receipt['xp'], receipt['crystals'], receipt['masteryXp']) == (16, 1, 0)
        if attempt == 0:
            first_receipt = receipt
            balance = page.evaluate('MajickRewardCore.inspect()')
            expect(page.locator('#majRewardReceipt')).to_be_visible()
            page.locator('[data-maj-reward-dismiss]').click()
            page.evaluate('MajickSaveSafety.flush()')
            page.reload(wait_until='domcontentloaded')
            page.wait_for_function('!!window.MajickGameRealm')
        else:
            assert receipt == first_receipt
            assert page.evaluate('MajickRewardCore.inspect().xp') == balance['xp']
            assert page.evaluate('MajickRewardCore.inspect().crystals') == balance['crystals']
            assert page.evaluate('MajickRewardCore.inspect().eggFragments') == balance['eggFragments']
            expect(page.locator('#majRewardReceipt')).to_have_count(0)
    print('PASS Memory Constellation completion, celebration, and reload/replay balance', flush=True)

    page.evaluate("""()=>{S.legacy.pets=[{id:'cushion-test-pet',type:'luna',name:'Velora'}];
        S.legacy.activePetId='cushion-test-pet';save();navigate('vault');majickVaultTab('potions')}""")
    page.locator('[data-craft-cushion]').click()
    expect(page.locator('#majCushionStatus')).to_contain_text('You need 2')
    page.locator('[onclick="majickClaimPotionTestKit()"]').click()
    ingredients = page.evaluate('MajickRewardCore.inventory().ingredients')
    page.locator('[data-craft-cushion]').click()
    expect(page.locator('#majCushionStatus')).to_contain_text('crafted and placed')
    expect(page.locator('[data-craft-cushion]')).to_be_disabled()
    for ingredient in ['star-moss', 'moonpetal']:
        assert page.evaluate('id=>MajickRewardCore.inventory().ingredients[id]',ingredient) == ingredients[ingredient] - 2
    page.evaluate("navigate('companions')")
    def room_frame():
        return page.locator('#phase4SanctuaryFrame').element_handle().content_frame()
    def pixi_cushion():
        return "MajickPixiSanctuary.inspect().furniture.find(item=>item.id==='moonweave-cushion')"

    pixi = room_frame()
    pixi.wait_for_function("window.MajickPixiSanctuary?.inspect().furniture.some(item=>item.id==='moonweave-cushion'&&item.visible)")
    pixi.locator('#care-guardian').select_option('cushion-test-pet')
    pixi.evaluate("""()=>{const room=MajickPixiSanctuary;
        const item=room.inspect().furniture.find(x=>x.id==='moonweave-cushion');
        const queue=[room.app.stage];
        while(queue.length){const node=queue.pop();if(node.eventMode==='static'&&node.texture&&node.x===item.x&&node.y===item.y){node.emit('pointertap');return}
        queue.push(...(node.children||[]));}throw Error('Cushion sprite missing');}""")
    page.wait_for_function("window.S?.v3311?.sanctuaryState?.bedAssignments?.['moonweave-cushion']==='cushion-test-pet'")
    pixi.locator('#furniture-select').select_option('moonweave-cushion')
    pixi.locator('#furniture-store').click()
    pixi.wait_for_function(f'!({pixi_cushion()}).visible')
    assert page.evaluate("MajickGuardianCare.performAction('cushion-test-pet','sleep',{objectId:'moonweave-cushion'}).ok") is False
    pixi.locator('#furniture-place').click()
    pixi.wait_for_function(f'({pixi_cushion()}).visible')

    page.get_by_role('button',name='Use original Sanctuary (Phaser)').click()
    page.wait_for_function("document.querySelector('#phase4SanctuaryFrame')?.src.includes('/sanctuary/index.html')")
    phaser = room_frame()
    phaser.wait_for_function("""()=>window.majickPhaserGame?.scene.getScene('Game')?.decorItems?.some(
        item=>item.getData('objectId')==='moonweave-cushion'&&item.visible)""", timeout=60000)
    page.evaluate("MajickGuardianCare.state('cushion-test-pet').energy=10")
    phaser.evaluate("""()=>{const scene=majickPhaserGame.scene.getScene('Game');
        const original=scene.showInteractionPanel;
        try{
          scene.showInteractionPanel=(_heading,_title,_body,buttons)=>buttons[0].run();
          scene.openGuardianCarePicker('sleep','moonweave-cushion');
        }finally{scene.showInteractionPanel=original;}
    }""")
    page.wait_for_function("MajickGuardianCare.state('cushion-test-pet')?.energy>=50")
    page.evaluate('MajickSaveSafety.flush()')
    page.reload(wait_until='domcontentloaded')
    page.wait_for_function("window.S?.v3311?.sanctuaryState?.bedAssignments?.['moonweave-cushion']==='cushion-test-pet'")
    page.wait_for_function('!!window.MajickRewardCore')
    assert page.evaluate("MajickRewardCore.inventory().blueprints.filter(id=>id==='moonweave-cushion').length") == 1
    print('PASS exact craft cost, Pixi rest, same furnishing in Phaser, storage, and reload', flush=True)

    # Each trial gets a clean profile, but its replay uses the same saved profile.
    # Observe actual receipt nodes, not generic per-answer reward animations.
    cases = [
        ('D669', 'oracle-lens', 'startOracleLens', 4, 15, 1),
        ('D669', 'hex-breaker', 'startHexBreaker', 8, 18, 1),
        ('D669', 'gauntlet-victory', 'startGuardianGauntlet', None, 24, 2),
        ('D772', 'gauntlet-run', 'startD772SectionReview', 12, 14, 1),
    ]
    for course, kind, starter, target, xp, crystals in cases:
        trial = browser.new_page(reduced_motion='reduce', viewport={'width': 1180, 'height': 950})
        key = f'trial-completion:{course}:{kind}'
        first = None
        for attempt in range(2):
            trial.goto(url, wait_until='domcontentloaded') if attempt == 0 else trial.reload(wait_until='domcontentloaded')
            trial.wait_for_function('!!window.MajickRewardCore && !!window.MajickGameRealm')
            trial.evaluate("course=>{switchCourse(course);navigate('games')}", course)
            if attempt:
                trial.wait_for_function("key=>!!S.majickAccount.rewardCore.ledger[key]", arg=key)
            else:
                assert trial.evaluate("key=>!!S.majickAccount.rewardCore.ledger[key]", key) is False
            trial.evaluate("""kind=>{
                window.trialReceiptCount=0;
                const heading=('trial '+kind.replace(/-/g,' ')).replace(/\\b\\w/g,c=>c.toUpperCase());
                const observer=new MutationObserver(records=>{
                    for(const record of records)for(const node of record.addedNodes){
                        if(node.nodeType===1&&node.id==='majRewardReceipt'&&
                            node.querySelector('h3')?.textContent===heading)window.trialReceiptCount++;
                    }
                });
                observer.observe(document.body,{childList:true,subtree:true});
                window.trialReceiptObserver=observer;
            }""", kind)
            trial.evaluate(f'{starter}()')
            for _ in range(12):
                if trial.evaluate('session.finished'):
                    break
                trial.evaluate("""kind=>{
                    const answer=session.current.answer;
                    if(kind==='oracle-lens'){
                        oracleChooseLens(session.correctLens);oracleAnswer(answer);oracleNext();
                    }else if(kind==='hex-breaker'){
                        hexJudge(session.claimValid?'valid':'hexed');hexRepair(answer);hexNext();
                    }else{
                        gauntletAnswer(answer);if(!session.finished)gauntletNext();
                    }
                }""", kind)
            result = trial.evaluate('({finished:session.finished,score:session.score,round:session.round,won:session.won})')
            assert result['finished'] and result['score'] == result['round'], (kind, result)
            if target is not None:
                assert result['score'] == target, (kind, result)
            if kind.startswith('gauntlet'):
                assert result['won'], (kind, result)
            # Only the completion ledger entry is compared; question-level awards
            # may legitimately change the total account balance on either run.
            receipt = trial.evaluate("key=>S.majickAccount.rewardCore.ledger[key].receipt", key)
            assert (receipt['key'], receipt['type'], receipt['course'], receipt['source']) == (
                key, 'trial-'+kind, course, 'game-realm')
            assert (receipt['xp'], receipt['crystals'], receipt['masteryXp'], receipt['eggFragments'],
                    receipt['independent']) == (xp, crystals, 0, 0, False), receipt
            assert trial.evaluate("key=>Object.keys(S.majickAccount.rewardCore.ledger).filter(k=>k===key).length", key) == 1
            assert trial.evaluate('window.trialReceiptCount') == (1 if attempt == 0 else 0), kind
            if attempt == 0:
                first = receipt
                expect(trial.locator('#majRewardReceipt')).to_be_visible()
                trial.locator('[data-maj-reward-dismiss]').click()
                trial.evaluate('MajickSaveSafety.flush()')
            else:
                assert receipt == first, (kind, receipt, first)
        print(f'PASS {course} {kind}: exact completion receipt and one celebration across reload/replay', flush=True)
        trial.context.close()
    browser.close()
