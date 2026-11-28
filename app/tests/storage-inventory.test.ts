import { describe, expect, it, vi } from 'vitest'
import { inspectStorage, formatReport, type DatabaseAccess, type MetadataRequest, type Sources } from '../src/core/storage-inventory'
function fixture(names: string[]) {
  return { length: names.length, key: (i: number) => names[i] ?? null,
    getItem: vi.fn(() => { throw Error('Forbidden value read') }),
    setItem: vi.fn(() => { throw Error('Forbidden write') }),
    removeItem: vi.fn(), clear: vi.fn() }
}
function request(): MetadataRequest {
  return { result: { objectStoreNames: ['sources'], close: vi.fn() },
    transaction: { abort: vi.fn() }, onsuccess: null, onerror: null, onblocked: null, onupgradeneeded: null }
}
const source = (idb: DatabaseAccess): Sources => ({
  origin: 'https://rnw4512-dev.github.io', local: () => fixture(['legacy', 'unrelated']),
  session: () => fixture(['draft']), idb: () => idb
})
describe('metadata-only storage inventory', () => {
  it('lists names without calling value or mutation APIs, and closes databases', async () => {
    const local = fixture(['legacy', 'unrelated']), session = fixture(['draft'])
    const req = request()
    const factory = { databases: vi.fn(async () => [{ name: 'known' }]), open: vi.fn(() => {
      queueMicrotask(() => req.onsuccess?.()); return req
    }) }
    const result = await inspectStorage({ ...source(factory), local: () => local, session: () => session })
    expect(result.entries.map(e => e.name)).toEqual(['legacy', 'unrelated', 'draft', 'known', 'sources'])
    expect(result.entries.every(e => e.bytes === null)).toBe(true)
    expect(factory.open).toHaveBeenCalledExactlyOnceWith('known')
    expect(req.result.close).toHaveBeenCalledOnce()
    for (const s of [local, session]) for (const fn of [s.getItem, s.setItem, s.removeItem, s.clear]) expect(fn).not.toHaveBeenCalled()
    expect(formatReport(result)).not.toContain('Forbidden')
  })
  it('never probes names when enumeration is unavailable', async () => {
    const open = vi.fn(() => request())
    const result = await inspectStorage(source({ open }))
    expect(open).not.toHaveBeenCalled()
    expect(result.notes.join(' ')).toContain('unsupported')
  })
  it('skips a database that disappeared after enumeration', async () => {
    const databases = vi.fn<() => Promise<{ name: string }[]>>().mockResolvedValueOnce([{name:'gone'}]).mockResolvedValueOnce([])
    const open = vi.fn(() => request())
    const result = await inspectStorage(source({ databases, open }))
    expect(open).not.toHaveBeenCalled()
    expect(result.notes.join(' ')).toContain('disappeared')
  })
  it('aborts an unexpected upgrade without creating any store', async () => {
    const req = request()
    const factory = { databases: async () => [{name:'race'}], open: () => {
      queueMicrotask(() => req.onupgradeneeded?.()); return req
    } }
    const result = await inspectStorage(source(factory))
    expect(req.transaction?.abort).toHaveBeenCalledOnce()
    expect(result.entries.some(e => e.store)).toBe(false)
    expect(result.notes.join(' ')).toContain('stores unavailable')
  })
  it('reports inaccessible storage rather than claiming it is empty', async () => {
    const result = await inspectStorage({ ...source({ databases: async () => {throw Error('denied')}, open: () => request() }), local: () => {throw Error('denied')} })
    expect(result.notes.join(' ')).toContain('localStorage: unavailable')
    expect(result.notes.join(' ')).toContain('IndexedDB: enumeration unavailable')
  })
})
