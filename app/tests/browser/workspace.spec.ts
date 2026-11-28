import { test, expect } from '@playwright/test'
// Compile the real TypeScript adapter through the same Vite pipeline in a test-only
// entry, served by the Playwright fixture server; no production app startup writes.
import { build } from 'vite'
import { resolve } from 'node:path'
test('IndexedDB local save reload and cross-tab compare-and-swap preserve legacy data', async ({ page, context }) => {
  const result = await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,minify:false,target:'es2022',lib:{entry:resolve('tests/fixtures/workspace-browser.ts'),name:'WorkspaceFixture',formats:['iife']}}})
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(r => 'output' in r ? r.output : [])
  const chunk = outputs.find(x=>x.type==='chunk')
  if (!chunk || chunk.type!=='chunk') throw Error('No fixture script')
  await page.goto('/')
  await page.addScriptTag({content:chunk.code})
  await page.evaluate(async () => {
    localStorage.setItem('moonlit_learning_v1','protected-legacy')
    await window.WorkspaceFixture.create()
  })
  await page.reload()
  await page.addScriptTag({content:chunk.code})
  expect(await page.evaluate(async()=>await window.WorkspaceFixture.readXP())).toBe(15)
  const tabs = [page]
  for (let i = 1; i < 6; i++) {
    const tab = await context.newPage()
    await tab.goto('/')
    await tab.addScriptTag({content:chunk.code})
    tabs.push(tab)
  }
  for (let revision = 1; revision <= 20; revision++) {
    const outcomes = await Promise.all(tabs.map(tab => tab.evaluate(r=>window.WorkspaceFixture.tryUpdate(r), revision)))
    expect(outcomes.sort()).toEqual(['conflict','conflict','conflict','conflict','conflict','saved'])
  }
  expect(await page.evaluate(()=>window.WorkspaceFixture.readXP())).toBe(35)
  expect(await page.evaluate(()=>localStorage.getItem('moonlit_learning_v1'))).toBe('protected-legacy')
  expect(await page.evaluate(()=>window.WorkspaceFixture.otherOwner())).toBeNull()
})
