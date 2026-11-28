import { test, expect } from '@playwright/test'
test('metadata-only check requires consent and preserves existing storage', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    localStorage.setItem('legacy-test-key', 'secret-test-value')
    sessionStorage.setItem('draft-test-key', 'private-draft')
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('inventory-test-db', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('test-store')
      request.onsuccess = () => {request.result.close(); resolve()}
      request.onerror = () => reject(request.error)
    })
  })
  await page.getByRole('link', { name: 'Storage safety check' }).click()
  await expect(page.getByRole('button', { name: 'Check storage names' })).toBeDisabled()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Check storage names' }).click()
  const output = page.getByRole('textbox', { name: 'Review the list' })
  await expect(output).toBeVisible()
  const report = JSON.parse(await output.inputValue())
  expect(report.entries.map((e: {name: string}) => e.name)).toEqual(expect.arrayContaining(['legacy-test-key','draft-test-key','inventory-test-db','test-store']))
  expect(await output.inputValue()).not.toContain('secret-test-value')
  expect(await output.inputValue()).not.toContain('private-draft')
  expect(await page.evaluate(() => localStorage.getItem('legacy-test-key'))).toBe('secret-test-value')
  expect(await page.evaluate(() => sessionStorage.getItem('draft-test-key'))).toBe('private-draft')
  expect(await page.evaluate(async () => (await indexedDB.databases()).map(db => db.name))).toEqual(['inventory-test-db'])
})
