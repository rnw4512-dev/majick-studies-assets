import { test, expect } from '@playwright/test'
for (const width of [390, 820, 1366]) {
  test('accessible navigation and storage isolation at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(() => {
      localStorage.setItem('majick_campus_v3', 'protected-test-fixture')
    })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Moonlit Collegium')
    await page.getByRole('link', { name: 'Explore Learning Lab' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Learning Lab')
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    if (width <= 700) await page.getByRole('button', { name: 'School rooms' }).click()
    await page.getByRole('navigation', { name: 'School rooms' }).getByRole('link', { name: 'Celestial Sanctuary' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Celestial Sanctuary')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Celestial Sanctuary')
    await page.goBack()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Learning Lab')
    await page.getByRole('button', { name: 'Reduce motion: Off' }).click()
    await expect(page.getByRole('button', { name: 'Reduce motion: On' })).toHaveAttribute('aria-pressed', 'true')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await page.evaluate(() => localStorage.getItem('majick_campus_v3'))).toBe('protected-test-fixture')
  })
}
