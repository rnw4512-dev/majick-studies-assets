import { describe,it,expect,vi } from 'vitest'
import { MemoryBackend,LocalWorkspaceStore } from '../src/core/local-workspace'
import { newWorkspace } from '../src/core/workspace'
import { exportBackup,parseBackup,restoreBackup,backupReminderDue,backupSummary } from '../src/core/workspace-backup'
const at='2026-11-28T12:00:00.000Z'
const owner='synthetic-owner'
describe('portable workspace backups',()=>{
  it('round trips all state including unknown extensions',()=>{
    const w=newWorkspace(owner,at)
    w.state.guardians={velora:{stage:'apprentice'}}
    w.state.eggs={one:{moonlight:27}}
    w.state.extensions={historical:{nested:[1,'keep']}}
    w.state.rewards={xp:90,crystals:3,fragments:2,receipts:{one:true}}
    w.state.progress={d772:{guided:3,independent:7}}
    expect(parseBackup(exportBackup(w,at),owner)).toEqual(w)
    expect(backupSummary(w).guardians).toBe(1)
  })
  it('rejects invalid, cross-owner and credential-bearing backups',()=>{
    const w=newWorkspace(owner,at)
    expect(()=>parseBackup('broken',owner)).toThrow()
    expect(()=>parseBackup(exportBackup(w,at),'other')).toThrow()
    w.state.extensions={refresh_token:'fake'}
    expect(()=>exportBackup(w,at)).toThrow()
  })
  it('retains prior checkpoint before replacing and increments current revision',async()=>{
    const store=new LocalWorkspaceStore(new MemoryBackend(),owner,()=>at)
    await store.initialize()
    const before=await store.update(0,s=>{s.rewards.xp=20})
    const incoming=newWorkspace(owner,at);incoming.state.rewards.xp=9
    const retain=vi.fn(async(text:string)=>{expect(parseBackup(text,owner)).toEqual(before);expect(await store.read()).toEqual(before)})
    const restored=await restoreBackup(store,owner,exportBackup(incoming,at),1,retain)
    expect(retain).toHaveBeenCalledOnce()
    expect(restored.localRevision).toBe(2)
    expect(restored.state.rewards.xp).toBe(9)
    expect(await store.read()).toEqual(restored)
  })
  it('stops on retention failure and on a concurrent edit',async()=>{
    const store=new LocalWorkspaceStore(new MemoryBackend(),owner,()=>at)
    const before=await store.initialize()
    const text=exportBackup(before,at)
    await expect(restoreBackup(store,owner,text,0,async()=>{throw Error('quota')})).rejects.toThrow('quota')
    expect(await store.read()).toEqual(before)
    await expect(restoreBackup(store,owner,text,0,async()=>{await store.update(0,s=>{s.rewards.xp=5})})).rejects.toThrow()
    expect((await store.read())?.state.rewards.xp).toBe(5)
  })
  it('rejects cloud-linked input and stale preview',async()=>{
    const store=new LocalWorkspaceStore(new MemoryBackend(),owner,()=>at)
    const w=await store.initialize()
    const linked={...w,cloudRevision:1}
    const retain=vi.fn(async()=>{})
    await expect(restoreBackup(store,owner,exportBackup(linked,at),0,retain)).rejects.toThrow('reconciliation')
    await expect(restoreBackup(store,owner,exportBackup(w,at),1,retain)).rejects.toThrow('changed')
    expect(retain).not.toHaveBeenCalled()
  })
  it('reminds at seven days, not sooner',()=>{
    const now=Date.parse(at)
    expect(backupReminderDue(null,now)).toBe(true)
    expect(backupReminderDue(at,now+6*86400000)).toBe(false)
    expect(backupReminderDue(at,now+7*86400000)).toBe(true)
  })
})
