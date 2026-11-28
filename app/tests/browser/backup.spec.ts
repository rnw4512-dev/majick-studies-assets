import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { build } from 'vite'
import { resolve } from 'node:path'
test('backup practice exports, previews, cancels, restores and retains',async({page})=>{
  await page.goto('/#/backup-preview')
  await page.getByRole('button',{name:'Open backup practice'}).click()
  const pending=page.waitForEvent('download')
  await page.getByRole('button',{name:'Export progress'}).click()
  const path=await (await pending).path()
  const backup=JSON.parse(await readFile(path,'utf8'))
  expect(backup.workspace.state.rewards.xp).toBe(15)
  backup.workspace.state.rewards.xp=8
  const file={name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))}
  await page.getByLabel('Choose a backup to preview').setInputFiles(file)
  await expect(page.getByText('8 XP · 3 crystals · 0 chests · 0 fragments')).toBeVisible()
  await expect(page.getByRole('button',{name:'Restore selected backup'})).toBeDisabled()
  await page.getByRole('button',{name:'Cancel',exact:true}).click()
  await expect(page.getByText('Demo recovery checkpoints retained: 0')).toBeVisible()
  await page.getByLabel('Choose a backup to preview').setInputFiles(file)
  await page.getByRole('checkbox').check()
  await page.getByRole('button',{name:'Restore selected backup'}).click()
  await expect(page.getByText('Demo recovery checkpoints retained: 1')).toBeVisible()
  const old=page.waitForEvent('download')
  await page.getByRole('button',{name:'Download previous checkpoint'}).click()
  expect(JSON.parse(await readFile(await (await old).path(),'utf8')).workspace.state.rewards.xp).toBe(15)
})
test('durable recovery vault retains checkpoint across reload and isolates owners',async({page})=>{
  const result=await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,minify:false,target:'es2022',lib:{entry:resolve('tests/fixtures/backup-browser.ts'),name:'BackupFixture',formats:['iife']}}})
  const outputs=(Array.isArray(result)?result:[result]).flatMap(r=>'output' in r?r.output:[])
  const chunk=outputs.find(x=>x.type==='chunk')
  if(!chunk||chunk.type!=='chunk')throw Error('No fixture bundle')
  await page.goto('/')
  await page.addScriptTag({content:chunk.code})
  await page.evaluate(()=>window.BackupFixture.seed())
  await page.reload()
  await page.addScriptTag({content:chunk.code})
  expect(await page.evaluate(()=>window.BackupFixture.read())).toBe(15)
  expect(await page.evaluate(()=>window.BackupFixture.other())).toBeNull()
})
