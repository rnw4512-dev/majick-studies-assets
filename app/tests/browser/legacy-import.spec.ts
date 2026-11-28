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
  await expect(page.getByRole('status')).toContainText('980 XP, 18 crystals, 0 chests, 2 fragments')
  expect(await page.evaluate(() => localStorage.getItem('moonlit_learning_v1'))).toBe('legacy sentinel')
})

test('reviewing a legacy backup displays its summary without writing to storage', async ({ page }) => {
  await page.goto('/#/import-preview')
  const before = await page.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]))
  const payload = {
    type: 'MajickStudiesSave', schemaVersion: 1,
    state: { courses: { D772: {} }, progress: { D772: { answers: [], xp: 4242 } } }
  }
  await page.getByLabel('Choose a legacy backup file').setInputFiles({
    name: 'synthetic-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload))
  })
  const review = page.getByRole('region', { name: 'Review an Aetheria backup' })
  await expect(review.getByText('4242 XP · 0 crystals · 0 chests · 0 fragments · 0 reward receipts')).toBeVisible()
  await expect(review.getByText('Courses: D772')).toBeVisible()
  expect(await page.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]))).toBe(before)
})
