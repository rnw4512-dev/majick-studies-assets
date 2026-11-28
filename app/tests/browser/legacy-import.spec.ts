import { readFile } from 'node:fs/promises'
import { test, expect } from '@playwright/test'

test('synthetic import compares balances, requires confirmation and leaves browser saves untouched', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('moonlit_learning_v1', 'legacy sentinel')
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('link', { name: 'Legacy import practice' }).click()
  await expect(page.getByRole('heading', { name: 'Legacy import practice' })).toBeFocused()
  await expect(page.getByText('1234 XP · 26 crystals · 3 chests · 4 fragments · 1 reward receipt')).toBeVisible()
  await expect(page.getByText('980 XP · 18 crystals · 0 chests · 2 fragments · 1 reward receipt')).toBeVisible()

  const apply = page.getByRole('button', { name: 'Apply practice import' })
  const consent = page.getByRole('checkbox', { name: 'Use the selected save for this practice import' })
  await expect(apply).toBeDisabled()
  await page.getByRole('radio', { name: /Main save/ }).check()
  await consent.check()
  await page.getByRole('radio', { name: /Known-good backup/ }).check()
  await expect(consent).not.toBeChecked()
  await expect(apply).toBeDisabled()
  await consent.check()
  await apply.click()
  await expect(page.getByRole('region', { name: 'Practice import' }).getByRole('status')).toContainText('980 XP, 18 crystals, 0 chests, 2 fragments')
  expect(await page.evaluate(() => localStorage.getItem('moonlit_learning_v1'))).toBe('legacy sentinel')
})

test('compares three legacy files and downloads only the confirmed conversion', async ({ page }) => {
  await page.goto('/#/import-preview')
  const storage = () => page.evaluate(async () => JSON.stringify([
    Object.entries(localStorage), Object.entries(sessionStorage), await indexedDB.databases()
  ]))
  const before = await storage()
  const file = (name: string, xp: number, rowIds?: string[]) => ({
    name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({
      type: 'MajickStudiesSave', schemaVersion: 1, exportedAt: '2026-11-28T09:00:00.000Z',
      state: { courses: { D772: {} }, progress: { D772: { answers: [], xp } },
        majickAccount: { rewardCore: { ledger: xp === 4242 ? { receipt: true } : {} } } },
      browserData: rowIds && {
        'majick-study-materials-v1': JSON.stringify(rowIds.map(id => ({ id, title: 'Title ' + id, courseId: 'D772', text: 'private-content' })))
      }
    }))
  })
  await page.getByLabel('Choose legacy backup files').setInputFiles([
    file('first.json', 4242, ['shared', 'unique']), file('second.json', 3500, ['shared']), file('third.json', 3500)
  ])
  const metrics = page.getByRole('table', { name: 'Backup comparison' })
  await expect(metrics.getByRole('row', { name: /^XP / })).toContainText('Differs')
  await expect(metrics.getByRole('row', { name: /^Reward receipts / })).toContainText('Differs')
  await expect(metrics.getByRole('row', { name: /^Study-material record / })).toContainText('Missing')
  await expect(metrics.getByRole('row', { name: /^Study-material rows / }).getByRole('cell')).toHaveText(['2', '1', 'Unavailable'])
  const materials = page.getByRole('table', { name: 'Study-material rows by file' })
  await expect(materials.getByRole('row', { name: /^unique / }).getByRole('cell')).toHaveText(['Title unique', 'Absent', 'Unavailable'])
  await expect(page.getByText('private-content')).toHaveCount(0)
  const button = page.getByRole('button', { name: 'Download converted backup' })
  const confirm = page.getByRole('checkbox', { name: 'Convert this backup and download a copy' })
  await page.getByLabel('Backup to convert').selectOption({ label: 'first.json' })
  await confirm.check()
  await page.getByLabel('Backup to convert').selectOption({ label: 'second.json' })
  await expect(button).toBeDisabled()
  await confirm.check()
  const pending = page.waitForEvent('download')
  await button.click()
  const download = await pending
  expect(download.suggestedFilename()).toBe('second-aetheria-workspace.json')
  const path = await download.path()
  const output = JSON.parse(await readFile(path!, 'utf8'))
  expect(output.workspace.state.rewards.xp).toBe(3500)
  expect(output.workspace.state.extensions.legacyImportV1.auxiliary['majick-study-materials-v1'])
    .toEqual([{ id: 'shared', title: 'Title shared', courseId: 'D772', text: 'private-content' }])
  expect(await storage()).toBe(before)
})
