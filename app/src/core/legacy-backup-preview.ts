import { mapLegacyBackup, summarizeLegacyWorkspace } from './legacy-import'
import { BackupSizeError, exportBackup } from './workspace-backup'

export const MAX_LEGACY_PREVIEW_BYTES = 64 * 1024 * 1024
export const LEGACY_CONVERSION_OWNER = 'legacy-backup-conversion'
const MATERIALS_KEY = 'majick-study-materials-v1'
const UNKNOWN_DATE = '1970-01-01T00:00:00.000Z'

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function materialIndex(raw: unknown) {
  if (typeof raw !== 'string') throw new Error('Study materials in this backup are unreadable.')
  let rows: unknown
  try { rows = JSON.parse(raw) }
  catch { throw new Error('Study materials in this backup are unreadable.') }
  if (!Array.isArray(rows)) throw new Error('Study materials in this backup are unreadable.')
  const ids = new Set<string>()
  return rows.map((row: unknown) => {
    if (!record(row) || typeof row.id !== 'string' || !row.id || ids.has(row.id) ||
      typeof row.courseId !== 'string' || typeof row.text !== 'string') {
      throw new Error('This backup has an invalid or duplicate study-material row.')
    }
    ids.add(row.id)
    const title = typeof row.sourceName === 'string' ? row.sourceName : typeof row.title === 'string' ? row.title : ''
    return { id: row.id, title }
  })
}

export async function reviewLegacyBackup(file: Pick<File, 'size' | 'text'>) {
  if (file.size > MAX_LEGACY_PREVIEW_BYTES) {
    throw new Error('This backup is over 64 MB and is too large to preview here. Keep the original file.')
  }
  let payload: unknown
  try { payload = JSON.parse(await file.text()) }
  catch { throw new Error('This file could not be read as JSON. Choose a backup downloaded from Aetheria.') }

  if (!record(payload) || payload.type !== 'MajickStudiesSave') {
    throw new Error('Choose a backup downloaded from the existing Aetheria app.')
  }
  if (typeof payload.schemaVersion === 'number' && payload.schemaVersion > 1) {
    throw new Error('This backup was made with a newer save format.')
  }
  const { state, browserData } = payload
  if (payload.schemaVersion !== 1 || !record(state) || (browserData != null && !record(browserData))) {
    throw new Error('This Aetheria backup is incomplete or uses an unsupported format.')
  }
  const exportedAt = typeof payload.exportedAt === 'string' && Number.isFinite(Date.parse(payload.exportedAt))
    ? payload.exportedAt : null
  const at = exportedAt ?? UNKNOWN_DATE
  const auxiliary = browserData ?? {}
  const materialRows = Object.hasOwn(auxiliary, MATERIALS_KEY) ? materialIndex(auxiliary[MATERIALS_KEY]) : null
  const workspace = mapLegacyBackup(JSON.stringify(state), auxiliary, LEGACY_CONVERSION_OWNER, at)
  const summary = summarizeLegacyWorkspace(workspace)
  return {
    summary,
    exportedAt,
    materialRows,
    convert(confirmed: boolean) {
      if (!confirmed) throw new Error('Confirm which file to convert first.')
      try { return exportBackup(workspace, at) }
      catch (error) {
        if (error instanceof BackupSizeError) {
          throw new Error('The converted backup would be over 20 MB with all its data. Keep the original file. No backup was created.')
        }
        throw error
      }
    }
  }
}
