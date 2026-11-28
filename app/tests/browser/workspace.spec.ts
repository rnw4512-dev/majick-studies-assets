import { test, expect } from '@playwright/test'
// Compile the real TypeScript adapter through the same Vite pipeline in a test-only
// entry, served by the Playwright fixture server; no production app startup writes.
import { build } from 'vite'
import { resolve } from 'node:path'
test('IndexedDB local save reload and cross-tab compare-and-swap preserve legacy data', async ({ page, context }) => {
  const result = await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,minify:false,target:'es2022',lib:{entry:resolve('tests/fixtures/workspace-browser.ts'),name:'WorkspaceFixture',formats:['iife']}}})
  if (Array.isArray(result) || !('output' in result)) throw Error('Expected single fixture bundle')
  const chunk = result.output.find(x=>x.type==='chunk')
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
  const second = await context.newPage()
  await second.goto('/')
  await second.addScriptTag({content:chunk.code})
  const outcomes = await Promise.all([page.evaluate(()=>window.WorkspaceFixture.tryUpdate()),second.evaluate(()=>window.WorkspaceFixture.tryUpdate())])
  expect(outcomes.sort()).toEqual(['conflict','saved'])
  expect(await page.evaluate(()=>window.WorkspaceFixture.readXP())).toBe(16)
  expect(await page.evaluate(()=>localStorage.getItem('moonlit_learning_v1'))).toBe('protected-legacy')
  expect(await page.evaluate(()=>window.WorkspaceFixture.otherOwner())).toBeNull()
})
