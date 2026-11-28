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
      if(!room.endsWith('preview') && room!=='storage-check'){
        const stage=page.locator('.room-stage')
        const portrait=stage.locator('.scene-portrait img')
        await expect.poll(()=>portrait.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
        await expect(portrait).toHaveCSS('filter','brightness(1.12) contrast(1.18) saturate(1.3)')
        const lighting=await stage.locator('.college-scene-light').evaluate(el=>getComputedStyle(el).backgroundImage)
        expect(lighting).not.toContain('rgba(39, 19, 57, 0.3)')
        const area=await stage.evaluate(el=>{
          const b=el.getBoundingClientRect()
          const plaque=el.querySelector('.scene-plaque')!.getBoundingClientRect()
          const clip=(r:DOMRect)=>Math.max(0,Math.min(r.right,innerWidth)-Math.max(0,r.left))*Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(0,r.top))
          // Sample actual topmost hit-tested elements in the unobstructed artwork area.
          // The decorative scene is pointer-events:none, so the stage itself should receive hits.
          let clear=0,total=0
          for(let y=Math.max(b.top,0)+20;y<Math.min(b.bottom,innerHeight)-20;y+=25){
            for(let x=Math.max(b.left,0)+20;x<Math.min(b.right,innerWidth)-20;x+=25){
              total++
              if(document.elementFromPoint(x,y)===el)clear++
            }
          }
          return {height:b.height,top:b.top,visible:clip(b),uncovered:clip(b)-clip(plaque),clear:clear/Math.max(total,1),animations:el.getAnimations({subtree:true}).length}
        })
        expect(area.top).toBeLessThan(150)
        expect(area.height).toBeGreaterThanOrEqual(900*(width<=700?.35:.54))
        expect(area.uncovered/area.visible).toBeGreaterThan(.65)
        expect(area.clear).toBeGreaterThan(.60)
        expect(area.animations).toBe(0)
      }
      await expect(img).toHaveCSS('filter','none')
      expect(await scene.evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    }
    await page.goto('/#/home')
    const portrait=page.locator('.scene-portrait img')
    await expect.poll(()=>portrait.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
    expect(await portrait.evaluate((el:HTMLImageElement)=>el.currentSrc)).toContain('fairy-hatch-forest.webp')
    expect((await portrait.boundingBox())?.height).toBeGreaterThan(250)
    const ratio=await page.locator('.scene-plaque').evaluate(el=>{
      const s=getComputedStyle(el)
      const parse=(v:string)=>v.match(/[\d.]+/g)!.map(Number)
      const [r,g,b,a=1]=parse(s.backgroundColor)
      const background=[r,g,b].map(x=>x*a+255*(1-a))
      const lum=(rgb:number[])=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0)
      return (lum(parse(s.color).slice(0,3))+.05)/(lum(background)+.05)
    })
    expect(ratio).toBeGreaterThanOrEqual(4.5)
    if(width<=700)await page.getByRole('button',{name:'School rooms'}).click()
    const nav=page.locator('.room-nav')
    await expect(nav).toBeVisible()
    const glass=await nav.evaluate(el=>{
      const parse=(v:string)=>v.match(/[\d.]+/g)!.map(Number)
      const lum=(rgb:number[])=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0)
      const composite=(rgba:number[],under:number[])=>rgba.slice(0,3).map((x,i)=>x*(rgba[3]??1)+under[i]*(1-(rgba[3]??1)))
      const style=getComputedStyle(el)
      const bg=parse(style.backgroundColor)
      const link=el.querySelector('a:not([aria-current])')!
      const ls=getComputedStyle(link)
      const worst=composite(parse(ls.backgroundColor),composite(bg,[255,255,255]))
      return {alpha:bg[3],blur:style.backdropFilter,contrast:(lum(parse(ls.color).slice(0,3))+.05)/(lum(worst)+.05)}
    })
    expect(glass.alpha).toBeLessThan(.5)
    expect(glass.blur).toContain('blur')
    expect(glass.contrast).toBeGreaterThanOrEqual(4.5)
    if(width<=700)await page.getByRole('button',{name:'School rooms'}).click()
    await page.getByRole('link',{name:'Explore Learning Lab'}).click()
    await expect(page.getByRole('heading',{level:1})).toHaveText('Learning Lab')
  })
}
