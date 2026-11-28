import { BackupVault } from '../../src/core/backup-vault'
import { newWorkspace } from '../../src/core/workspace'
import { exportBackup,parseBackup } from '../../src/core/workspace-backup'
const owner='synthetic-backup-owner'
export async function seed(){
  const workspace=newWorkspace(owner,new Date().toISOString())
  workspace.state.rewards.xp=15
  await new BackupVault(indexedDB,owner).retain(exportBackup(workspace))
}
export async function read(){
  const text=await new BackupVault(indexedDB,owner).latest()
  return text?parseBackup(text,owner).state.rewards.xp:null
}
export async function other(){return new BackupVault(indexedDB,'other-owner').latest()}
declare global{interface Window{BackupFixture:{seed:typeof seed;read:typeof read;other:typeof other}}}
