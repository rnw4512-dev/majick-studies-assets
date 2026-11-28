import { validateWorkspace, WorkspaceError, type Workspace } from './workspace'
import type { LocalWorkspaceStore } from './local-workspace'
export const BACKUP_FORMAT = 'aetheria-workspace-backup'
export const MAX_BACKUP_BYTES = 20 * 1024 * 1024
export class BackupSizeError extends WorkspaceError {
  constructor() { super('invalid', 'Backup exceeds supported size') }
}
export const REMINDER_DAYS = 7
export function exportBackup(workspace: Workspace, at = new Date().toISOString()): string {
  const checked = validateWorkspace(workspace, workspace.owner)
  if (!Number.isFinite(Date.parse(at))) throw new WorkspaceError('invalid','Invalid export timestamp')
  const text = JSON.stringify({ format: BACKUP_FORMAT, version: 1, exportedAt: at, workspace: checked }, null, 2)
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new BackupSizeError()
  return text
}
export function parseBackup(text: string, owner: string): Workspace {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new BackupSizeError()
  let value: unknown
  try { value = JSON.parse(text) } catch { throw new WorkspaceError('invalid','This file is not valid backup JSON') }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new WorkspaceError('invalid','Invalid backup file')
  const record = value as Record<string,unknown>
  if (record.format !== BACKUP_FORMAT || record.version !== 1 ||
      typeof record.exportedAt !== 'string' || !Number.isFinite(Date.parse(record.exportedAt))) throw new WorkspaceError('invalid','Unsupported backup format')
  return validateWorkspace(record.workspace, owner)
}
export function backupSummary(workspace: Workspace) {
  const s = workspace.state
  return { updatedAt: workspace.updatedAt, xp: s.rewards.xp, crystals: s.rewards.crystals, chests: s.rewards.chests, fragments: s.rewards.fragments,
    guardians: Object.keys(s.guardians).length, eggs: Object.keys(s.eggs).length, courses: Object.keys(s.courses).length }
}
export function backupReminderDue(lastExport: string | null, now = Date.now()): boolean {
  const prior = lastExport === null ? NaN : Date.parse(lastExport)
  return !Number.isFinite(prior) || prior > now || now - prior >= REMINDER_DAYS * 86400000
}
export async function restoreBackup(store: LocalWorkspaceStore, owner: string, text: string, expected: number, retain: (backup: string) => Promise<void>): Promise<Workspace> {
  const incoming = parseBackup(text, owner)
  const before = await store.read()
  if (!before || before.owner !== owner || before.localRevision !== expected) throw new WorkspaceError('conflict','Current progress changed. Review again before restoring.')
  if (before.cloudRevision !== null || incoming.cloudRevision !== null) throw new WorkspaceError('conflict','Cloud-linked backups require reconciliation before restoration.')
  await retain(exportBackup(before))
  return store.update(expected, draft => {
    for (const key of Object.keys(draft)) delete (draft as unknown as Record<string,unknown>)[key]
    Object.assign(draft, structuredClone(incoming.state))
  })
}
