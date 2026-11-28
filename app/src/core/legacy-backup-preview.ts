import { previewLegacyFixture } from './legacy-import'
import { newWorkspace } from './workspace'

export const MAX_LEGACY_PREVIEW_BYTES = 64 * 1024 * 1024

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
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
  const preview = previewLegacyFixture({
    snapshots: { 'primary-workspace-v2': JSON.stringify({
      format: 1, revision: 1, raw: JSON.stringify(state), browserData: browserData ?? {}
    }) },
    local: {}
  }, newWorkspace('local-backup-preview', new Date().toISOString()))
  const summary = preview.summaries[0]
  if (!summary) throw new Error('This backup does not contain a readable progress copy.')
  return summary
}
