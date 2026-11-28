import { test, expect } from '@playwright/test'
const rooms=['home','study','learn','trials','games','sanctuary','atelier','journal','council','observatory','backup-preview','storage-check']
const artwork: Record<string,string>={home:'fairy-hatch-forest.webp',study:'learn-classroom-v2',learn:'ancient-study-library-v1',observatory:'game-observatory-v1'}
for(const width of [390,820,1366]){
  test('painted scenes load, preserve contrast and do not block interaction at '+width,async({page})=>{
    await page.setViewportSize({width,height:900})
    await page.emulateMedia({reducedMotion:'reduce'})
    for(const room of rooms){
      await page.goto('/#/'+room)
      const scene=page.locator('.college-scene:not(.scene-portrait)')
      await expect(scene).toHaveAttribute('data-scene',room.endsWith('preview')||room==='storage-check'?'utility':room)
      await expect(scene).toHaveCSS('pointer-events','none')
      const img=scene.locator('img')
      await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true)
      const box=await scene.boundingBox()
      expect(box?.width).toBe(width)
      expect(box?.height).toBe(900)
      if(artwork[room]){
        const expected=room==='home'?artwork[room]:artwork[room]+(width<=820?'-820':'')+'.webp'
        expect(await img.evaluate((el:HTMLImageElement)=>el.currentSrc)).toContain(expected)
      }
      expect(await scene.evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    }
    await page.goto('/#/home')
    const portrait=page.locator('.scene-portrait img')
    await expect.poll(()=>portrait.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
    expect(await portrait.evaluate((el:HTMLImageElement)=>el.currentSrc)).toContain('fairy-hatch-forest.webp')
    expect((await portrait.boundingBox())?.height).toBeGreaterThan(250)
    const ratio=await page.locator('.welcome-copy').evaluate(el=>{
      const s=getComputedStyle(el)
      const parse=(v:string)=>v.match(/[\d.]+/g)!.map(Number)
      const [r,g,b,a=1]=parse(s.backgroundColor)
      const background=[r,g,b].map(x=>x*a+255*(1-a))
      const lum=(rgb:number[])=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0)
      return (lum(parse(s.color).slice(0,3))+.05)/(lum(background)+.05)
    })
    expect(ratio).toBeGreaterThanOrEqual(4.5)
    await page.getByRole('link',{name:'Explore Learning Lab'}).click()
    await expect(page.getByRole('heading',{level:1})).toHaveText('Learning Lab')
  })
}
