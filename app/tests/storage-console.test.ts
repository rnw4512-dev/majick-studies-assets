import { describe, expect, it, vi, afterEach } from 'vitest'
import { runConsoleCheck } from '../src/core/storage-console-entry'
import { browserSources, inspectStorage, formatReport } from '../src/core/storage-inventory'

function setup(origin = 'https://rnw4512-dev.github.io', consent = true) {
  const storage = { length: 2, key: (i: number) => ['legacy', 'odd\n"key'][i] ?? null,
    getItem: vi.fn(() => { throw Error('Value read forbidden') }),
    setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn() }
  const factory = { databases: vi.fn(async () => []), open: vi.fn() }
  const confirm = vi.fn(() => consent)
  vi.stubGlobal('window', { location: { origin }, localStorage: storage, sessionStorage: storage, indexedDB: factory, confirm })
  return { storage, factory, confirm }
}
afterEach(() => {vi.unstubAllGlobals(); vi.restoreAllMocks()})
describe('console adapter uses the canonical inventory', () => {
  it('produces the identical report and never calls value APIs', async () => {
    const { storage, factory } = setup()
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const expected = formatReport(await inspectStorage(browserSources()))
    expect(await runConsoleCheck()).toBe(expected)
    expect(log).toHaveBeenLastCalledWith(expected)
    expect(storage.getItem).not.toHaveBeenCalled()
    expect(storage.setItem).not.toHaveBeenCalled()
    expect(storage.removeItem).not.toHaveBeenCalled()
    expect(storage.clear).not.toHaveBeenCalled()
    expect(factory.open).not.toHaveBeenCalled()
  })
  it('does not scan a wrong origin or declined consent', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrong = setup('https://example.com')
    expect(await runConsoleCheck()).toBeNull()
    expect(wrong.confirm).not.toHaveBeenCalled()
    expect(wrong.factory.databases).not.toHaveBeenCalled()
    const declined = setup(undefined, false)
    expect(await runConsoleCheck()).toBeNull()
    expect(declined.factory.databases).not.toHaveBeenCalled()
  })
})
