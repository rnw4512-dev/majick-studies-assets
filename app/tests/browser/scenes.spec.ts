import { test, expect } from '@playwright/test'
const rooms=['home','study','learn','trials','games','sanctuary','atelier','journal','council','observatory','backup-preview','storage-check']
for(const width of [390,820,1366]){
  test('scene art loads without blocking interaction at '+width,async({page})=>{
    await page.setViewportSize({width,height:900})
    for(const room of rooms){
      await page.goto('/#/'+room)
      const scene=page.locator('.college-scene')
      await expect(scene).toHaveAttribute('data-scene',room.endsWith('preview')||room==='storage-check'?'utility':room)
      await expect(scene).toHaveCSS('pointer-events','none')
      await expect.poll(()=>scene.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    }
    await page.goto('/#/home')
    const castle=page.locator('.castle-portrait img')
    await expect.poll(()=>castle.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
    const box=await castle.boundingBox()
    expect(box?.height).toBeGreaterThan(250)
    await page.getByRole('link',{name:'Explore Learning Lab'}).click()
    await expect(page.getByRole('heading',{level:1})).toHaveText('Learning Lab')
  })
}
