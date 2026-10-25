const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../current-site');
test('Guardian animation code retains frame playback and stop conditions', () => {
 const src = fs.readFileSync(path.join(root,'pixi-sanctuary/prototype.js'),'utf8');
 expect(src).toContain('new PIXI.AnimatedSprite');
 expect(src).toContain('sprite.play()');
 expect(src).toContain('sprite.gotoAndStop(0)');
 expect(src).toContain('if(paused||document.hidden){setMotion(e,false)');
 expect(src).toContain('art.frames.length>=2?art.frames:[art.base]');
});
test('Avatar saved outfits retain the existing owner and save callback', () => {
 const src=fs.readFileSync(path.join(root,'scholar-wardrobe-studio.js'),'utf8');
 expect(src).toContain('window.MajickAtelier?.player?.()');
 expect(src).toContain('savedScholarLooks');
 expect(src).toContain('window.save?.()');
});
test('Verified ceremony opens, skips and rejects unverified events', async ({page}) => {
 await page.goto('/index.html');
 await page.waitForFunction(() => !!window.MajickVerifiedCeremony, {timeout:30000});
 await page.evaluate(() => document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'unverified-ci',type:'mastery',verified:false}})));
 await expect(page.locator('.majick-ceremony')).toHaveCount(0);
 await page.evaluate(() => document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'verified-ci',type:'mastery',verified:true}})));
 await expect(page.locator('.majick-ceremony')).toHaveCount(1);
 await page.getByRole('button',{name:'Skip / Close'}).click();
 await expect(page.locator('.majick-ceremony')).toHaveCount(0);
});
test('Reduced-motion ceremony does not animate its emblem', async ({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/index.html');
 await page.waitForFunction(() => !!window.MajickVerifiedCeremony, {timeout:30000});
 await page.evaluate(() => document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{key:'reduced-ci',type:'lesson',verified:true}})));
 const emblem=page.locator('.majick-ceremony__emblem');
 await expect(emblem).toBeVisible();
 expect(await emblem.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
test('Existing application renders without an empty page', async ({page}) => {
 await page.goto('/index.html');
 await expect(page.locator('body')).not.toBeEmpty();
 expect(await page.title()).toBeTruthy();
});
