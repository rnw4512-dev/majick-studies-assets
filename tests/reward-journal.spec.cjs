const {test,expect}=require('playwright/test');
const url=process.env.MIGRATION_URL||'http://127.0.0.1:8765';
for(const width of [390,820,1366])test('Reward Journal reads existing receipts without changing balances at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(url,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.MajickRewardCore);
 await page.evaluate(()=>{MajickRewardCore.award('d756-meeting-first-pass',{key:'synthetic-journal',course:'D756'});navigate('vault')});
 await expect(page.locator('.majRewardJournal')).toHaveCount(1,{timeout:30000});
 const before=await page.evaluate(()=>JSON.stringify(S.majickAccount.rewardCore.ledger)+':'+S.majickAccount.xp+':'+S.majickAccount.crystals);
 await page.locator('.majRewardJournal summary').click();await expect(page.locator('.majRewardJournal')).toContainText('d756 meeting first pass');
 await page.evaluate(()=>{MajickRewardCore.award('d756-meeting-first-pass',{key:'synthetic-journal',course:'D756'});render()});
 expect(await page.evaluate(()=>JSON.stringify(S.majickAccount.rewardCore.ledger)+':'+S.majickAccount.xp+':'+S.majickAccount.crystals)).toBe(before);
});
