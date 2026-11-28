// Metadata only. Never call getItem, get, getAll, openCursor or any mutation.
export type Entry = { area: 'localStorage' | 'sessionStorage' | 'IndexedDB'; name: string; database?: string; store?: string; bytes: null }
export type Report = { origin: string; entries: Entry[]; notes: string[] }
export type KeyStorage = Pick<Storage, 'length' | 'key'>
export type DatabaseInfo = { name?: string; version?: number }
export interface MetadataDatabase {
  objectStoreNames: ArrayLike<string>
  close(): void
}
export interface MetadataRequest {
  result: MetadataDatabase
  transaction: { abort(): void } | null
  onsuccess: (() => void) | null
  onerror: (() => void) | null
  onblocked: (() => void) | null
  onupgradeneeded: (() => void) | null
}
export interface DatabaseAccess {
  databases?: () => Promise<DatabaseInfo[]>
  open: (name: string) => MetadataRequest
}
export interface Sources {
  origin: string
  local: () => KeyStorage
  session: () => KeyStorage
  idb: () => DatabaseAccess
}

function stores(factory: DatabaseAccess, name: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // No requested version. A database removed after enumeration would trigger
    // an initial upgrade. Abort that transaction before any creation commits.
    const request = factory.open(name)
    let cancelled = false
    const fail = () => { cancelled = true; reject(new Error('Database metadata unavailable')) }
    request.onupgradeneeded = () => {
      cancelled = true
      try { request.transaction?.abort() } finally { fail() }
    }
    request.onerror = fail
    request.onblocked = fail
    request.onsuccess = () => {
      const db = request.result
      try {
        if (!cancelled) resolve(Array.from(db.objectStoreNames))
      } catch { fail() } finally { db.close() }
    }
  })
}

export async function inspectStorage(sources: Sources): Promise<Report> {
  const report: Report = { origin: sources.origin, entries: [], notes: [
    'Names only. Exact byte sizes are unavailable without reading stored values.',
    'Storage is origin-wide; names may belong to other applications on this host.',
    'Session storage covers only this tab (not other tabs). Review names before sharing.'
  ] }
  for (const [area, access] of [['localStorage', sources.local], ['sessionStorage', sources.session]] as const) {
    try {
      const storage = access()
      const names = new Set<string>()
      for (let i = 0, count = storage.length; i < count; i++) {
        const key = storage.key(i)
        if (key !== null) names.add(key)
      }
      for (const name of [...names].sort()) report.entries.push({ area, name, bytes: null })
    } catch { report.notes.push(area + ': unavailable; not equivalent to empty.') }
  }
  try {
    const factory = sources.idb()
    if (typeof factory.databases !== 'function') {
      report.notes.push('IndexedDB: database enumeration unsupported; no databases opened.')
      return report
    }
    const listed = await factory.databases()
    const names = [...new Set(listed.flatMap(db => typeof db.name === 'string' && db.name.length ? [db.name] : []))].sort()
    for (const name of names) {
      report.entries.push({ area: 'IndexedDB', name, database: name, bytes: null })
      try {
        // Recheck immediately before opening, and abort any upgrade race.
        if (!(await factory.databases()).some(db => db.name === name)) {
          report.notes.push('IndexedDB database disappeared during enumeration: ' + JSON.stringify(name))
          continue
        }
        for (const store of (await stores(factory, name)).sort()) {
          report.entries.push({ area: 'IndexedDB', name: store, database: name, store, bytes: null })
        }
      } catch { report.notes.push('IndexedDB stores unavailable for ' + JSON.stringify(name)) }
    }
  } catch { report.notes.push('IndexedDB: enumeration unavailable; not equivalent to empty.') }
  return report
}

export function formatReport(report: Report): string {
  // JSON quotes and escapes names, including newlines and control characters.
  return JSON.stringify(report, null, 2)
}

export function browserSources(): Sources {
  return {
    origin: window.location.origin,
    local: () => window.localStorage,
    session: () => window.sessionStorage,
    idb: () => {
      const factory = window.indexedDB
      return {
        databases: typeof factory.databases === 'function' ? () => factory.databases() : undefined,
        open: name => factory.open(name) as unknown as MetadataRequest
      }
    }
  }
}
