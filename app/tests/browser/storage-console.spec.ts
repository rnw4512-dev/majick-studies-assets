import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
test('generated console bundle matches the UI on the live-origin fixture', async ({ page }) => {
  // Serve a test document at the expected origin without contacting production.
  await page.route('https://rnw4512-dev.github.io/**', route => route.fulfill({contentType:'text/html',body:'<!doctype html><title>Isolated fixture</title>'}))
  await page.goto('https://rnw4512-dev.github.io/')
  await page.evaluate(async () => {
    localStorage.setItem('legacy-test', 'secret-value')
    sessionStorage.setItem('draft-test', 'private-value')
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('inventory-test', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('sources')
      request.onsuccess = () => {request.result.close(); resolve()}
      request.onerror = () => reject(request.error)
    })
  })
  const script = await readFile('dist/storage-check-console.js', 'utf8')
  page.once('dialog', dialog => dialog.accept())
  const logged = page.waitForEvent('console', {predicate: msg => msg.type() === 'log' && msg.text().startsWith('{')})
  await page.addScriptTag({content:script})
  const output = (await logged).text()
  const report = JSON.parse(output)
  expect(report.entries.map((e: {name:string}) => e.name)).toEqual(['legacy-test','draft-test','inventory-test','sources'])
  expect(output).not.toContain('secret-value')
  expect(output).not.toContain('private-value')
  expect(await page.evaluate(() => localStorage.getItem('legacy-test'))).toBe('secret-value')
  expect(await page.evaluate(() => sessionStorage.getItem('draft-test'))).toBe('private-value')
  expect(await page.evaluate(async () => (await indexedDB.databases()).map(x => x.name))).toEqual(['inventory-test'])
})
