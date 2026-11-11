"""Real browser save/restore and schema protection; isolated learner contexts only."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = os.environ.get('MAJICK_URL', 'http://127.0.0.1:8875/')
OUT = Path(os.environ.get('CLEANUP_QA_DIR', '/tmp/aetheria-cleanup-qa'))
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])
    for width in (390, 820, 1366):
        context = browser.new_context(viewport={'width': width, 'height': 900})
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(URL)
        page.wait_for_function('!!window.MajickSaveSafety && !!window.MajickCourseManager')
        page.evaluate('''() => {
            S.cleanupUnknownField={preserve:'unknown valid data'};
            for(const id of ['D755','D772','D756']) {
                switchCourse(id);
                S.progress[id].cleanupSentinel='isolated-'+id;
            }
            save();navigate('control');
        }''')
        panel = page.locator('.v338SavePanel')
        panel.get_by_role('button', name='Save now', exact=True).click()
        with page.expect_download() as download:
            panel.get_by_role('button', name='Download backup', exact=True).click()
        payload = json.loads(Path(download.value.path()).read_text())
        assert payload['state']['cleanupUnknownField']['preserve'] == 'unknown valid data'
        assert all(payload['state']['progress'][cid]['cleanupSentinel'] == 'isolated-'+cid for cid in ('D755', 'D772', 'D756'))
        protected = page.evaluate('JSON.stringify({account:S.majickAccount,legacy:S.legacy,progress:S.progress})')
        # Change only a test sentinel, then import the browser-downloaded backup.
        page.evaluate("S.cleanupUnknownField.preserve='modified';save()")
        page.on('dialog', lambda dialog: dialog.accept())
        panel.locator('input[type=file]').set_input_files({'name': 'backup.json', 'mimeType': 'application/json', 'buffer': json.dumps(payload).encode()})
        page.wait_for_function("S.cleanupUnknownField?.preserve==='unknown valid data'")
        assert page.evaluate('JSON.stringify({account:S.majickAccount,legacy:S.legacy,progress:S.progress})') == protected
        page.evaluate("navigate('control')")
        page.locator('.v338SavePanel').get_by_role('button', name='Restore recovery copy', exact=True).click()
        page.wait_for_function("S.cleanupUnknownField?.preserve==='modified'")
        page.reload()
        page.wait_for_function("S.cleanupUnknownField?.preserve==='modified'")
        assert all(page.evaluate('(id)=>S.progress[id].cleanupSentinel', cid) == 'isolated-'+cid for cid in ('D755','D772','D756'))
        # Exercise the real storage API with a newer save and a tempting older backup.
        result = page.evaluate('''() => {
            const api=MajickSaveSafety, raw=localStorage.getItem(api.keys.KEY);
            const future=JSON.parse(raw);future.saveSchemaVersion=2;
            const futureRaw=JSON.stringify(future);
            localStorage.setItem(api.keys.PREVIOUS,raw);
            localStorage.setItem(api.keys.KEY,futureRaw);
            let message='';try{api.read()}catch(e){message=e.message}
            const intact=localStorage.getItem(api.keys.KEY)===futureRaw;
            localStorage.setItem(api.keys.KEY,raw);
            return {message,intact};
        }''')
        assert result['intact'] and 'newer schema' in result['message'], result
        page.evaluate("save();navigate('control')")
        safety = page.locator('.v338SavePanel')
        safety.scroll_into_view_if_needed()
        assert safety.evaluate('(e)=>{const r=e.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && e.scrollWidth<=e.clientWidth+1}'), 'Progress safety panel clips outside viewport'
        safety.screenshot(path=str(OUT / f'progress-safety-{width}.png'))
        assert not errors, errors
        print(f'PASS {width}px: download/import/restore/reload, unknown fields, course isolation and newer-schema bytes protected', flush=True)
        # Exercise the existing wardrobe owner with an isolated older accessory
        # fixture. Active accessory artwork/selection is explicitly pending.
        page.evaluate('''() => {const p=MajickAtelier.player();p.accessory='fixture-accessory';p.cleanupUnknown='keep';save()}''')
        wallet = page.evaluate('JSON.stringify([S.majickAccount.xp,S.majickAccount.crystals])')
        page.locator('#atelierLaunch').click()
        wardrobe = page.locator('#wsOverlay')
        wardrobe.locator('[data-section=Appearance]').click()
        wardrobe.locator('[data-skin="4"]').click()
        wardrobe.locator('[data-hair="2"]').click()
        wardrobe.locator('[data-section=Wardrobe]').click()
        wardrobe.locator('[data-robe="3"]').click()
        wardrobe.locator('#wsLookName').fill('Cleanup fixture look')
        wardrobe.locator('[data-save-slot]').click()
        wardrobe.locator('[data-robe="0"]').click()
        wardrobe.locator('[data-load-look]').last.click()
        wardrobe.locator('[data-save]').click()
        wardrobe.locator('[data-section=Accessories]').click()
        assert 'remain saved' in wardrobe.locator('.wsControls').inner_text()
        wardrobe.locator('[data-close]').click()
        page.reload()
        page.wait_for_function('!!window.MajickAtelier')
        look = page.evaluate('MajickAtelier.player()')
        assert (look['skin'], look['hair'], look['robe']) == (4, 2, 3)
        assert look['accessory'] == 'fixture-accessory' and look['cleanupUnknown'] == 'keep'
        assert look['savedScholarLooks'][-1]['name'] == 'Cleanup fixture look'
        assert page.evaluate('JSON.stringify([S.majickAccount.xp,S.majickAccount.crystals])') == wallet
        print(f'PASS {width}px: actual appearance/robe/saved-outfit controls and reload; accessory/unknown fields and wallet preserved', flush=True)
        # Presentation event fixtures do not create reward receipts or mastery.
        page.emulate_media(reduced_motion='reduce')
        page.evaluate("document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'cleanup-unverified',type:'mastery',verified:false}}))")
        assert page.locator('.majick-ceremony').count() == 0
        page.evaluate("document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'cleanup-verified',type:'lesson',verified:true}}))")
        emblem = page.locator('.majick-ceremony__emblem')
        assert emblem.evaluate('(e)=>getComputedStyle(e).animationName') == 'none'
        page.get_by_role('button', name='Skip / Close', exact=True).click()
        assert page.locator('.majick-ceremony').count() == 0
        assert not errors, errors
        print(f'PASS {width}px: verified ceremony gate, Skip/Close and reduced motion', flush=True)
        context.close()
    browser.close()
