const {test,expect}=require('playwright/test');const fs=require('node:fs');
const url=process.env.MIGRATION_URL||'http://127.0.0.1:8765';
for(const width of [390,820,1366])test('backup download and file import preserve synthetic progress at '+width,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});page.on('dialog',dialog=>dialog.accept());
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.MajickSaveSafety&&window.MajickRewardCore);
 await page.evaluate(()=>{S.fixtureMarker={unknownField:'retained'};localStorage.setItem('majick-d756-task2-rehearsal-v1-history',JSON.stringify([{done:true,profile:'angela',mode:'guided',records:[],completedAt:Date.now(),assessment:{passed:false},synthetic:true}]));save();navigate('control')});
 const panel=page.locator('.v338SavePanel');await expect(panel).toBeVisible();
 expect(await panel.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1})).toBe(true);
 const downloadPromise=page.waitForEvent('download');await panel.getByRole('button',{name:'Download backup',exact:true}).click();const download=await downloadPromise;
 const payload=JSON.parse(fs.readFileSync(await download.path(),'utf8'));expect(payload.state.fixtureMarker.unknownField).toBe('retained');expect(payload.browserData['majick-d756-task2-rehearsal-v1-history']).toContain('synthetic');
 await page.evaluate(()=>{S.fixtureMarker.unknownField='changed';localStorage.setItem('majick-d756-task2-rehearsal-v1-history','[]');save()});
 await panel.locator('input[type=file]').setInputFiles({name:'synthetic-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});
 await expect.poll(()=>page.evaluate(()=>S.fixtureMarker.unknownField)).toBe('retained');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('majick-d756-task2-rehearsal-v1-history'))[0].synthetic)).toBe(true);
 expect(await page.evaluate(()=>!!localStorage.getItem(MajickSaveSafety.keys.PIN))).toBe(true);
});
