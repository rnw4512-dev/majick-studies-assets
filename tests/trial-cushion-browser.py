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

    # Below-threshold attempts must not create a completion receipt, even
    # though correct individual answers may earn their ordinary rewards.
    boundary_cases = [
        ('D669', 'startOracleLens', 'oracle-lens', 2, 4),
        ('D669', 'startHexBreaker', 'hex-breaker', 5, 8),
        ('D669', 'startGuardianGauntlet', 'gauntlet-victory', 0, None),
        ('D772', 'startD772SectionReview', 'gauntlet-run', 6, 12),
        ('D756', 'startOracleLens', 'oracle-lens', None, 8),
        ('D756', 'startHexBreaker', 'hex-breaker', None, 8),
        ('D756', 'startGuardianGauntlet', 'gauntlet-victory', None, None),
        ('D756', 'startMemoryConstellation', 'memory-constellation', None, None),
    ]
    for course, starter, kind, correct_limit, rounds in boundary_cases:
        trial = browser.new_page(reduced_motion='reduce', viewport={'width': 1180, 'height': 950})
        trial.goto(url, wait_until='domcontentloaded')
        trial.wait_for_function('!!window.MajickRewardCore && !!window.MajickGameRealm')
        trial.evaluate("course=>{switchCourse(course);navigate('games')}", course)
        snapshot = """()=>{const s=MajickRewardCore.inspect(),r=S.majickAccount.rewardCore;
            return {xp:s.xp,crystals:s.crystals,chests:s.chests,fragments:s.eggFragments,
                    mastery:r.masteryXp,ledger:r.ledger}}"""
        before = trial.evaluate(snapshot)
        trial.evaluate("""()=>{
            window.trialBoundaryReceipts=[];
            new MutationObserver(records=>{
                for(const record of records)for(const node of record.addedNodes){
                    if(node.nodeType===1&&node.id==='majRewardReceipt'){
                        const title=node.querySelector('h3')?.textContent||'';
                        if(title.startsWith('Trial '))window.trialBoundaryReceipts.push(title);
                    }
                }
            }).observe(document.body,{childList:true,subtree:true});
        }""")
        trial.evaluate(f'{starter}()')
        if kind == 'memory-constellation':
            pairs = trial.evaluate("""session.cards.flatMap((card,i)=>card.kind==='clue'?
                [[i,session.cards.findIndex(other=>other.kind==='answer'&&other.pair===card.pair)]]:[])""")
            assert len(pairs) >= 4
            for clue, answer in pairs:
                trial.locator(f'[data-card-index="{clue}"]').evaluate('button=>button.click()')
                trial.locator(f'[data-card-index="{answer}"]').evaluate('button=>button.click()')
            trial.wait_for_function('session.finished')
            assert trial.evaluate('session.score') == len(pairs)
        else:
            for _ in range(12):
                if trial.evaluate('session.finished'):
                    break
                trial.evaluate("""limit=>{
                    const q=session.current;
                    const correct=limit===null||session.round<=limit;
                    const answer=correct?q.answer:q.options.find(o=>o!==q.answer);
                    if(answer===undefined)throw Error('Missing distractor');
                    if(session.type==='oraclelens'){
                        oracleChooseLens(session.correctLens);oracleAnswer(answer);oracleNext();
                    }else if(session.type==='hexbreaker'){
                        const valid=correct?session.claimValid:!session.claimValid;
                        hexJudge(valid?'valid':'hexed');hexRepair(answer);hexNext();
                    }else{
                        gauntletAnswer(answer);if(!session.finished)gauntletNext();
                    }
                }""", correct_limit)
            result = trial.evaluate('({finished:session.finished,score:session.score,round:session.round,won:session.won})')
            assert result['finished'], (course, kind, result)
            if rounds is not None:
                assert result['round'] == rounds, (course, kind, result)
            assert result['score'] == (result['round'] if correct_limit is None else correct_limit), result
            if kind.startswith('gauntlet'):
                assert result['won'] == (correct_limit is None), result
        after = trial.evaluate(snapshot)
        prefix = f'trial-completion:{course}:'
        assert {k:v for k,v in after['ledger'].items() if k.startswith(prefix)} == {
            k:v for k,v in before['ledger'].items() if k.startswith(prefix)}, (course, kind)
        assert trial.evaluate('window.trialBoundaryReceipts') == [], (course, kind)
        if course == 'D756':
            assert after == before, (course, kind, 'review must not award account rewards or mastery')
        trial.evaluate('MajickSaveSafety.flush()')
        trial.reload(wait_until='domcontentloaded')
        trial.wait_for_function('!!window.MajickRewardCore && !!window.MajickGameRealm')
        restored = trial.evaluate(snapshot)
        assert {k:v for k,v in restored['ledger'].items() if k.startswith(prefix)} == {
            k:v for k,v in before['ledger'].items() if k.startswith(prefix)}, (course, kind, 'reload')
        if course == 'D756':
            assert restored == before, (course, kind, 'review rewards after reload')
        print(f'PASS {course} {kind}: no ineligible completion reward or receipt after reload', flush=True)
        trial.context.close()

    # Exercise the real shared reward owner through the study bridge and direct
    # conflicting flags. Correct guided practice earns its existing base rate,
    # never independent, delayed or transfer mastery.
    policy = browser.new_page(reduced_motion='reduce')
    policy.goto(url, wait_until='domcontentloaded')
    policy.wait_for_function('!!window.MajickRewardCore && !!window.MajickStudyProgress')
    policy.evaluate("switchCourse('D669')")
    policy.evaluate("""()=>{
        const core=MajickRewardCore, r=S.majickAccount.rewardCore;
        const snapshot=()=>({xp:core.inspect().xp,crystals:core.inspect().crystals,
            mastery:r.masteryXp,fragments:r.eggFragments,keys:Object.keys(r.ledger).length});
        const check=(ok,label)=>{if(!ok)throw Error(label)};
        const start=snapshot();
        const wrong=core.award('correct-answer',{key:'boundary-wrong',correct:false,independent:true});
        check(wrong.rejected&&JSON.stringify(snapshot())===JSON.stringify(start),'wrong answer changed rewards');
        for(const type of ['independent-correct','mixed-transfer-success','delayed-recall','concept-mastered']){
            const result=core.award(type,{key:'boundary-rejected:'+type,assisted:true,independent:true});
            check(result.rejected&&JSON.stringify(snapshot())===JSON.stringify(start),'assisted milestone: '+type);
        }
        for(const [support,xp] of [['guided',8],['hint',5],['substantial',3]]){
            const key='boundary-guided:'+support,before=snapshot();
            const context={key,correct:true,assisted:true,independent:true,delayed:true,transfer:true,support,difficulty:5};
            const receipt=core.award('correct-answer',context),after=snapshot();
            check(receipt.xp===xp&&receipt.crystals===1&&receipt.masteryXp===0&&!receipt.independent,'guided receipt '+support);
            check(after.xp-before.xp===xp&&after.crystals-before.crystals===1&&after.mastery===before.mastery&&after.fragments===before.fragments,'guided balance '+support);
            check(JSON.stringify(core.award('correct-answer',context))===JSON.stringify(receipt)&&JSON.stringify(snapshot())===JSON.stringify(after),'duplicate guided receipt');
        }
        const before=snapshot();
        MajickStudyProgress.creditAnswer({key:'boundary-bridge-transfer',course:'D669',qid:'boundary-synthetic',correct:true,assisted:true,source:'guided-transfer',difficulty:5});
        const receipt=r.ledger['study:boundary-bridge-transfer'].receipt;
        check(receipt.xp===8&&receipt.crystals===1&&receipt.masteryXp===0&&!receipt.independent,'bridge transfer leaked mastery');
        check(snapshot().mastery===before.mastery,'bridge mastery changed');
    }""")
    policy.context.close()
    print('PASS wrong, assisted, conflicting flags, guided rates and duplicate study rewards', flush=True)

    routing = browser.new_page(reduced_motion='reduce')
    routing.goto(url, wait_until='domcontentloaded')
    routing.wait_for_function('!!window.MajickRewardCore && !!window.startD772SectionReview')
    routing.evaluate("switchCourse('D772');startD772SectionReview()")
    for _ in range(12):
        routing.evaluate("()=>{gauntletAnswer(session.current.answer);if(!session.finished)gauntletNext()}")
    assert routing.evaluate('session.finished && session.score===12 && session.reviewMode')
    routing.get_by_role('button', name='Play again', exact=True).click()
    assert routing.evaluate('session.reviewMode && session.limit===12 && session.round===1 && session.reviewQueue.length===11')
    routing.context.close()
    print('PASS D772 result Play again preserves balanced twelve-question review', flush=True)

    # All six Assessment Sigil families share a single first-clear fragment
    # entitlement. Each correct classification may still receive answer XP.
    sigil = browser.new_page(reduced_motion='reduce')
    sigil.goto(url, wait_until='domcontentloaded')
    sigil.wait_for_function('!!window.MajickRewardCore && !!window.MajickFragmentEarnings && !!window.startAssessmentSigilSort')
    sigil.evaluate("switchCourse('D755');navigate('games')")
    fragment_key = 'fragment:game:D755:assessmentsigilsort'
    snap = """()=>{const a=MajickRewardCore.inspect(),r=S.majickAccount.rewardCore;
       return {xp:a.xp,crystals:a.crystals,fragments:a.eggFragments,ledger:r.ledger}}"""
    original = sigil.evaluate(snap)
    first = None
    families = ['data','administration','purpose','monitoring','comparison','evidence']
    for family, good in [('data',False)]+[(family,True) for family in families]:
        sigil.evaluate("family=>{startAssessmentSigilSort();chooseAssessmentSigilFamily(family)}",family)
        total = sigil.evaluate('session.items.length')
        assert total >= 3,(family,total)
        for _ in range(total):
            before_answer = sigil.evaluate(snap)
            sigil.evaluate("""good=>{
                const q=session.items[session.index];
                const choices=[...document.querySelectorAll('.assessmentSigilGates button b')].map(b=>b.textContent);
                answerAssessmentSigil(good?q.sigilAnswer:choices.find(c=>c!==q.sigilAnswer));
            }""",good)
            assert sigil.evaluate('session.answered')
            if not good:
                after_answer = sigil.evaluate(snap)
                assert (after_answer['xp'],after_answer['crystals']) == (before_answer['xp'],before_answer['crystals'])
            sigil.evaluate('nextAssessmentSigil()')
        assert sigil.evaluate('session.finished')
        assert sigil.evaluate('session.score') == (total if good else 0)
        after = sigil.evaluate(snap)
        assert not any(k.startswith('trial-completion:D755:assessmentsigilsort') for k in after['ledger'])
        if not good:
            assert after == original, 'failed sigil sort awarded currency or fragments'
        else:
            receipt = after['ledger'][fragment_key]['receipt']
            assert (receipt['xp'],receipt['crystals'],receipt['masteryXp'],receipt['eggFragments']) == (0,0,0,1)
            if first is None:
                first = receipt
                sigil.evaluate('MajickSaveSafety.flush()')
                sigil.reload(wait_until='domcontentloaded')
                sigil.wait_for_function('!!window.MajickRewardCore && !!window.startAssessmentSigilSort')
                sigil.evaluate("switchCourse('D755');navigate('games')")
            else:
                assert receipt == first, (family,'duplicate first-clear fragment')
            assert after['fragments'] == original['fragments']+1
    sigil.context.close()
    print('PASS six D755 sigil families, incorrect answers, shared first-clear fragment and reload',flush=True)
    browser.close()
