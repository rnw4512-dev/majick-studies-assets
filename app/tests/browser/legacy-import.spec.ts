import { test, expect } from '@playwright/test'

test('synthetic import compares balances, requires confirmation and leaves browser saves untouched', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('moonlit_learning_v1', 'legacy sentinel')
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('link', { name: 'Legacy import practice' }).click()
  await expect(page.getByRole('heading', { name: 'Legacy import practice' })).toBeFocused()
  await expect(page.getByText('1234 XP · 26 crystals · 4 fragments · 1 reward receipt')).toBeVisible()
  await expect(page.getByText('980 XP · 18 crystals · 2 fragments · 1 reward receipt')).toBeVisible()

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
  await expect(page.getByRole('status')).toContainText('980 XP, 18 crystals, 2 fragments')
  expect(await page.evaluate(() => localStorage.getItem('moonlit_learning_v1'))).toBe('legacy sentinel')
})
