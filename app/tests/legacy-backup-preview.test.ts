import { expect, it, vi } from 'vitest'
import { MAX_LEGACY_PREVIEW_BYTES, reviewLegacyBackup } from '../src/core/legacy-backup-preview'

const state = {
  courses: { D772: {} }, progress: { D772: { answers: [] } },
  majickAccount: { xp: 1234, crystals: 5, rewardCore: { eggFragments: 2, ledger: { synthetic: true } } }
}
const backup = (payload: object) => new Blob([JSON.stringify(payload)])

it('summarizes the legacy export without exposing auxiliary payloads', async () => {
  const result = await reviewLegacyBackup(backup({
    type: 'MajickStudiesSave', schemaVersion: 1, state,
    browserData: { moonlit_learning_v1: '{"courses":{},"progress":{}}', 'aetheria-cloud-session-v1': 'synthetic secret' }
  }))
  expect(result).toMatchObject({ courses: ['D772'], xp: 1234, crystals: 5, fragments: 2, receipts: 1 })
  expect(JSON.stringify(result)).not.toContain('synthetic secret')
})

it('rejects unrelated, newer, malformed and oversized files', async () => {
  await expect(reviewLegacyBackup(backup({ state }))).rejects.toThrow('Choose a backup')
  await expect(reviewLegacyBackup(backup({ type: 'MajickStudiesSave', schemaVersion: 2, state }))).rejects.toThrow('newer')
  await expect(reviewLegacyBackup(new Blob(['broken']))).rejects.toThrow('read as JSON')
  const text = vi.fn()
  await expect(reviewLegacyBackup({ size: MAX_LEGACY_PREVIEW_BYTES + 1, text })).rejects.toThrow('over 64 MB')
  expect(text).not.toHaveBeenCalled()
})
