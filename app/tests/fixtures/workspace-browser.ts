import { IndexedWorkspaceBackend, LocalWorkspaceStore } from '../../src/core/local-workspace'
const store = new LocalWorkspaceStore(new IndexedWorkspaceBackend(indexedDB),'synthetic-owner')
export async function create() {
  await store.initialize()
  await store.update(0,s=>{s.rewards.xp=15;s.guardians={velora:{stage:'new-bond'}};s.eggs={one:{moonlight:5}}})
}
export async function readXP() { return (await store.read())?.state.rewards.xp }
export async function tryUpdate(expected = 1) {
  try { await store.update(expected,s=>{s.rewards.xp++}); return 'saved' }
  catch (error) { if ((error as {code?:string}).code==='conflict') return 'conflict'; throw error }
}
export async function otherOwner() { return await new LocalWorkspaceStore(new IndexedWorkspaceBackend(indexedDB),'other-owner').read() }
declare global { interface Window { WorkspaceFixture: {
  create: typeof create; readXP: typeof readXP; tryUpdate: typeof tryUpdate; otherOwner: typeof otherOwner
} } }
