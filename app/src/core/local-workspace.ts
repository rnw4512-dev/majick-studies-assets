import { assertOwner, newWorkspace, validateWorkspace, WorkspaceError, type Workspace, type WorkspaceState } from './workspace'

// Backend must compare and replace atomically (including across tabs).
export interface LocalBackend {
  read(owner: string): Promise<unknown | undefined>
  compareAndSwap(owner: string, expected: number | null, next: Workspace): Promise<void>
}
export const LOCAL_DB = 'aetheria-next-workspaces-v1'
export const LOCAL_STORE = 'workspaces'
export const LOCAL_KEY_PREFIX = 'aetheria-next-workspace-v1:'
export const LOCAL_LOCK_PREFIX = 'aetheria-next-workspace-lock-v1:'
const conflict = () => new WorkspaceError('conflict', 'Progress changed in another tab. Reopen the latest local checkpoint.')
const unavailable = () => new WorkspaceError('unavailable', 'Local storage unavailable. Keep your progress and export a backup when available.')
function compare(raw: unknown | undefined, owner: string, expected: number | null, next: Workspace) {
  const prior = raw === undefined ? null : validateWorkspace(raw, owner)
  if ((prior?.localRevision ?? null) !== expected) throw conflict()
  const validated = validateWorkspace(next, owner)
  if (validated.localRevision !== (expected ?? -1) + 1) throw conflict()
  return validated
}
export class MemoryBackend implements LocalBackend {
  private data = new Map<string, Workspace>()
  async read(owner: string) { assertOwner(owner); return structuredClone(this.data.get(owner)) }
  async compareAndSwap(owner: string, expected: number | null, next: Workspace) {
    this.data.set(owner, compare(this.data.get(owner), owner, expected, next))
  }
}
export class IndexedWorkspaceBackend implements LocalBackend {
  constructor(private factory: IDBFactory) {}
  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = this.factory.open(LOCAL_DB, 1)
      let blocked = false
      request.onupgradeneeded = () => {
        if (blocked) { request.transaction?.abort(); return }
        if (!request.result.objectStoreNames.contains(LOCAL_STORE)) request.result.createObjectStore(LOCAL_STORE)
      }
      request.onblocked = () => { blocked = true; reject(unavailable()) }
      request.onerror = () => reject(unavailable())
      request.onsuccess = () => {
        if (blocked) { request.result.close(); return }
        request.result.onversionchange = () => request.result.close()
        resolve(request.result)
      }
    })
  }
  async read(owner: string): Promise<unknown | undefined> {
    assertOwner(owner)
    const db = await this.open()
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(LOCAL_STORE, 'readonly')
        const req = tx.objectStore(LOCAL_STORE).get(owner)
        tx.oncomplete = () => resolve(req.result)
        tx.onabort = tx.onerror = () => reject(unavailable())
      })
    } finally { db.close() }
  }
  async compareAndSwap(owner: string, expected: number | null, next: Workspace): Promise<void> {
    assertOwner(owner)
    const db = await this.open()
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(LOCAL_STORE, 'readwrite')
        const store = tx.objectStore(LOCAL_STORE)
        const req = store.get(owner)
        let failure: unknown
        req.onsuccess = () => {
          try { store.put(compare(req.result, owner, expected, next), owner) }
          catch (error) { failure = error; tx.abort() }
        }
        tx.oncomplete = () => resolve()
        tx.onabort = () => reject(failure ?? unavailable())
        tx.onerror = () => { /* abort handler reports transaction failure */ }
      })
    } finally { db.close() }
  }
}
// Explicit fallback, not automatic: switching backend after a failed write
// could hide a newer durable checkpoint. Web Locks are required for atomic CAS.
type StringStorage = Pick<Storage, 'getItem' | 'setItem'>
type Locks = { request<T>(name: string, callback: () => T | Promise<T>): Promise<T> }
export class LockedStringBackend implements LocalBackend {
  constructor(private storage: StringStorage, private locks: Locks) {}
  private raw(owner: string): unknown | undefined {
    assertOwner(owner)
    const raw = this.storage.getItem(LOCAL_KEY_PREFIX + owner)
    if (raw === null) return undefined
    try { return JSON.parse(raw) }
    catch { throw new WorkspaceError('invalid', 'Local checkpoint is unreadable; original retained') }
  }
  async read(owner: string) { return this.raw(owner) }
  async compareAndSwap(owner: string, expected: number | null, next: Workspace) {
    assertOwner(owner)
    await this.locks.request(LOCAL_LOCK_PREFIX + owner, () => {
      const value = compare(this.raw(owner), owner, expected, next)
      this.storage.setItem(LOCAL_KEY_PREFIX + owner, JSON.stringify(value))
    })
  }
}
export class LocalWorkspaceStore {
  constructor(private backend: LocalBackend, private owner: string, private now = () => new Date().toISOString()) { assertOwner(owner) }
  async read(): Promise<Workspace | null> {
    const raw = await this.backend.read(this.owner)
    return raw === undefined ? null : validateWorkspace(raw, this.owner)
  }
  async initialize(): Promise<Workspace> {
    const existing = await this.read()
    if (existing) return existing
    const next = newWorkspace(this.owner, this.now())
    try { await this.backend.compareAndSwap(this.owner, null, next); return next }
    catch (error) {
      if (error instanceof WorkspaceError && error.code === 'conflict') {
        const winner = await this.read()
        if (winner) return winner
      }
      throw error
    }
  }
  // Caller must supply the exact revision of the state it edited.
  // Never silently replay a mutation against a newer state.
  async update(expected: number, edit: (draft: WorkspaceState) => void): Promise<Workspace> {
    const current = await this.read()
    if (!current || current.localRevision !== expected) throw conflict()
    const next = structuredClone(current)
    edit(next.state)
    next.localRevision++
    next.updatedAt = this.now()
    const validated = validateWorkspace(next, this.owner)
    await this.backend.compareAndSwap(this.owner, expected, validated)
    return validated
  }
}
