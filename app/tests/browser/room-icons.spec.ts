import { test, expect } from '@playwright/test'
import { rooms } from '../../src/core/router'
import { roomIcons } from '../../src/ui/room-icons'
for(const width of [390,820,1366]){
  test('room icons share real assets and preserve accessible navigation at '+width,async({page})=>{
    await page.setViewportSize({width,height:900})
    await page.emulateMedia({reducedMotion:'reduce'})
    await page.goto('/')
    if(width<=700)await page.getByRole('button',{name:'School rooms'}).click()
    const nav=page.getByRole('navigation',{name:'School rooms'})
    await expect(nav.locator('img.room-icon')).toHaveCount(rooms.length)
    await expect(page.locator('.room-card img.room-icon')).toHaveCount(rooms.length-1)
    for(const room of rooms){
      const link=nav.getByRole('link',{name:room.name,exact:true})
      const icon=link.locator('img.room-icon')
      expect(roomIcons[room.id]).toMatch(/^skill-(0[1-9]|1[0-9]|2[0-2])\.webp$/)
      await expect(icon).toHaveCSS('width','36px')
      await expect(icon).toHaveCSS('height','36px')
      await expect(icon).toHaveCSS('border-top-width','1px')
      await expect(icon).toHaveAttribute('alt','')
      await expect(icon).toHaveAttribute('aria-hidden','true')
      await expect(icon).toHaveAttribute('src',new RegExp('/assets/room-icons/'+roomIcons[room.id].replace('.','\\.')+'$'))
      await expect.poll(()=>icon.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
      expect(await icon.evaluate(el=>el.getAnimations().length)).toBe(0)
      if(room.id!=='home'){
        const card=page.locator('.room-card').filter({has:page.locator('img[data-room-icon="'+room.id+'"]')})
        await expect(card.locator('img')).toHaveCSS('width','36px')
        await expect(card.locator('img')).toHaveCSS('height','36px')
        await expect(card.locator('img')).toHaveAttribute('src',(await icon.getAttribute('src'))!)
        await expect.poll(()=>card.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
      }
    }
    const activeIcon=nav.locator('a[aria-current=page] .room-icon')
    await expect(activeIcon).toHaveCSS('border-top-color','rgb(255, 223, 154)')
    const target=nav.getByRole('link',{name:'Learning Lab',exact:true})
    await target.focus()
    await expect(target.locator('.room-icon')).toHaveCSS('border-top-color','rgb(255, 223, 154)')
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    await nav.getByRole('link',{name:'Learning Lab',exact:true}).click()
    await expect(page.getByRole('heading',{level:1})).toHaveText('Learning Lab')
    await expect(page.getByRole('heading',{level:1})).toBeFocused()
  })
}
test('missing icon shows original fallback without changing accessible label',async({page})=>{
  await page.route('**/assets/room-icons/skill-15.webp',route=>route.abort())
  await page.goto('/')
  const link=page.getByRole('navigation',{name:'School rooms'}).getByRole('link',{name:'Learning Lab',exact:true})
  const icon=link.locator('img')
  await expect(icon).toHaveAttribute('src',/fallback\.svg$/)
  await expect.poll(()=>icon.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
  await link.click()
  await expect(page.getByRole('heading',{level:1})).toHaveText('Learning Lab')
})
