import { describe, expect, it } from 'vitest'
import { newWorkspace, validateWorkspace, pendingSync } from '../src/core/workspace'
import { LocalWorkspaceStore, MemoryBackend, LockedStringBackend, LOCAL_KEY_PREFIX } from '../src/core/local-workspace'
const at = '2026-11-28T12:00:00.000Z'
const clock = () => at
describe('versioned workspace', () => {
  it('validates a realistic synthetic checkpoint and preserves extensions', () => {
    const w = newWorkspace('test-owner', at)
    w.state.rewards = {xp: 140, crystals: 20, fragments: 7, receipts: {'d772:answer:1':true}}
    w.state.guardians = {velora:{stage:'apprentice'}}
    w.state.eggs = {egg1:{moonlight:25}}
    w.state.progress = {D772:{guided:3,independent:2}}
    w.state.extensions = {unknownHistorical:{nested:['keep',5]}}
    expect(validateWorkspace(JSON.parse(JSON.stringify(w)), 'test-owner')).toEqual(w)
    expect(pendingSync(w)).toBe(false)
  })
  it('rejects wrong owner, newer schema, credentials and invalid revisions', () => {
    const w = newWorkspace('test-owner', at)
    expect(() => validateWorkspace(w,'other')).toThrow('owner mismatch')
    expect(() => validateWorkspace({...w,schemaVersion:2},'test-owner')).toThrow('newer')
    expect(() => validateWorkspace({...w,cloudRevision:0},'test-owner')).toThrow('revisions')
    w.state.extensions = { nested:{refresh_token:'synthetic-secret'} }
    expect(() => validateWorkspace(w,'test-owner')).toThrow('Credential')
  })
  it('rejects corrupt reward amounts and non-JSON values', () => {
    const w = newWorkspace('test-owner', at)
    w.state.rewards.xp = -1
    expect(() => validateWorkspace(w,'test-owner')).toThrow()
    w.state.rewards.xp = NaN
    expect(() => validateWorkspace(w,'test-owner')).toThrow()
  })
})
describe('local save adapter', () => {
  it('persists revisions, independent evidence and receipt deduplication across reopen', async () => {
    const backend = new MemoryBackend(), store = new LocalWorkspaceStore(backend,'test-owner',clock)
    const initial = await store.initialize()
    const award = (draft: typeof initial.state) => {
      if (!draft.rewards.receipts.answer1) {
        draft.rewards.receipts.answer1 = true; draft.rewards.xp += 10
      }
      draft.progress = {D772:{guided:2, independent:1}}
    }
    const one = await store.update(0,award)
    const two = await store.update(one.localRevision,award)
    const reopened = await new LocalWorkspaceStore(backend,'test-owner',clock).read()
    expect(reopened).toEqual(two)
    expect(two.state.rewards.xp).toBe(10)
    expect(two.localRevision).toBe(2)
    expect(two.cloudRevision).toBeNull()
    expect(pendingSync(two)).toBe(true)
    expect(await new LocalWorkspaceStore(backend,'other',clock).read()).toBeNull()
  })
  it('rejects concurrent stale writes and retains winning checkpoint', async () => {
    const backend = new MemoryBackend(), a = new LocalWorkspaceStore(backend,'test-owner',clock), b = new LocalWorkspaceStore(backend,'test-owner',clock)
    await a.initialize()
    const results = await Promise.allSettled([a.update(0,s=>{s.rewards.xp=10}),b.update(0,s=>{s.rewards.xp=20})])
    expect(results.filter(x=>x.status==='fulfilled')).toHaveLength(1)
    expect(results.filter(x=>x.status==='rejected')).toHaveLength(1)
    expect((await a.read())?.localRevision).toBe(1)
  })
  it('rejects invalid edits without overwriting prior data', async () => {
    const store = new LocalWorkspaceStore(new MemoryBackend(),'test-owner',clock)
    const before = await store.initialize()
    await expect(store.update(0,s=>{s.rewards.xp=-1})).rejects.toThrow()
    expect(await store.read()).toEqual(before)
  })
  it('explicit locked fallback touches only its own namespaced key and preserves corrupt records', async () => {
    const data = new Map([['moonlit_learning_v1','protected-legacy']])
    const backend = new LockedStringBackend({getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v)}},
      {request:async (_name,fn)=>fn()})
    const store = new LocalWorkspaceStore(backend,'test-owner',clock)
    await store.initialize()
    await store.update(0,s=>{s.rewards.crystals=4})
    expect((await store.read())?.state.rewards.crystals).toBe(4)
    expect(data.get('moonlit_learning_v1')).toBe('protected-legacy')
    data.set(LOCAL_KEY_PREFIX+'test-owner','broken')
    await expect(store.initialize()).rejects.toThrow('unreadable')
    expect(data.get(LOCAL_KEY_PREFIX+'test-owner')).toBe('broken')
  })
})
