import { expect, it, vi } from 'vitest'
import { LEGACY_CONVERSION_OWNER, MAX_LEGACY_PREVIEW_BYTES, reviewLegacyBackup } from '../src/core/legacy-backup-preview'

import { parseBackup } from '../src/core/workspace-backup'

const state = {
  courses: { D772: {} }, progress: { D772: { answers: [] } },
  majickAccount: { xp: 1234, crystals: 5, chests: 3, rewardCore: { eggFragments: 2, ledger: { synthetic: true } } }
}
const backup = (payload: object) => new Blob([JSON.stringify(payload)])

it('summarizes the legacy export without exposing auxiliary payloads', async () => {
  const result = await reviewLegacyBackup(backup({
    type: 'MajickStudiesSave', schemaVersion: 1, state,
    browserData: { moonlit_learning_v1: '{"courses":{},"progress":{}}', 'aetheria-cloud-session-v1': 'synthetic secret' }
  }))
  expect(result.summary).toMatchObject({ courses: ['D772'], xp: 1234, crystals: 5, chests: 3, fragments: 2, receipts: 1 })
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

it('converts deterministically, retaining selected study material and removing credential fields', async () => {
  const input = backup({
    type: 'MajickStudiesSave', schemaVersion: 1, exportedAt: '2026-11-28T09:00:00.000Z',
    state: { ...state, nested: { access_token: 'test-secret', safe: 'kept' } },
    browserData: {
      'aetheria-cloud-session-v1': '{"refresh_token":"test-secret"}',
      'majick-study-materials-v1': JSON.stringify([
        { id: 'row-a', sourceName: 'Lesson', courseId: 'D772', text: 'private lesson text', refreshToken: 'test-secret' }
      ])
    }
  })
  const review = await reviewLegacyBackup(input)
  expect(review.exportedAt).toBe('2026-11-28T09:00:00.000Z')
  expect(review.materialRows).toEqual([{ id: 'row-a', title: 'Lesson' }])
  expect(() => review.convert(false)).toThrow('Confirm')
  const output = review.convert(true)
  expect(output).toBe((await reviewLegacyBackup(input)).convert(true))
  expect(output).not.toContain('test-secret')
  expect(parseBackup(output, LEGACY_CONVERSION_OWNER).state.extensions.legacyImportV1).toMatchObject({
    fields: { nested: { safe: 'kept' } },
    auxiliary: { 'majick-study-materials-v1': [{ id: 'row-a', text: 'private lesson text' }] }
  })
})

it('distinguishes missing material, empty material and material that would exceed the conversion limit', async () => {
  const base = { type: 'MajickStudiesSave', schemaVersion: 1, state }
  const withMaterials = (rows: unknown[]) => backup({
    ...base, browserData: { 'majick-study-materials-v1': JSON.stringify(rows) }
  })
  expect((await reviewLegacyBackup(backup(base))).materialRows).toBeNull()
  expect((await reviewLegacyBackup(withMaterials([]))).materialRows).toEqual([])
  await expect(reviewLegacyBackup(withMaterials([{ id: 'invalid' }]))).rejects.toThrow('invalid')
  const large = await reviewLegacyBackup(withMaterials([
    { id: 'large', title: 'Large material', courseId: 'D772', text: 'a'.repeat(20 * 1024 * 1024) }
  ]))
  expect(large.summary.oversized).toBe(true)
  expect(() => large.convert(true)).toThrow('over 20 MB with all its data')
})
