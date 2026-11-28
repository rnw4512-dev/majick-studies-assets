import { describe, expect, it, vi } from 'vitest'
import { previewLegacyFixture, type LegacyFixture } from '../src/core/legacy-import'
import { LocalWorkspaceStore, MemoryBackend } from '../src/core/local-workspace'
import { parseBackup } from '../src/core/workspace-backup'

const owner = 'synthetic-scholar'
const primary = 'moonlit_learning_v1'
const council = 'majick-d756-task2-rehearsal-v1-history'
const legacy = (xp: number, saveSchemaVersion = 1) => JSON.stringify({
  saveSchemaVersion, courses: { D772: { id: 'D772' } },
  progress: { D772: { xp, answers: [{ mode: 'guided' }, { mode: 'independent' }] } },
  legacy: { pets: [{ id: 'guardian-1', bond: 50 }], eggs: [{ id: 'egg-1' }] },
  majickAccount: { rewardCore: { ledger: { 'receipt-1': { xp: 4 } } } },
  unknown: { note: 'synthetic', accessToken: 'exclude-me' }
})
const envelope = (raw: string, revision: number) => JSON.stringify({
  format: 1, revision, raw, browserData: { [council]: '[{"id":"durable"}]' }
})
async function fixtureDestination() {
  const store = new LocalWorkspaceStore(new MemoryBackend(), owner)
  return { store, before: await store.initialize() }
}

describe('synthetic legacy importer', () => {
  it('suggests legacy precedence, overlays durable records and requires a confirmed choice', async () => {
    const { store, before } = await fixtureDestination()
    const sources: LegacyFixture = {
      snapshots: Object.freeze({
        'primary-workspace-v2': envelope(legacy(4), 1),
        'previous-workspace': envelope(legacy(99), 12)
      }),
      local: Object.freeze({
        [primary]: legacy(8), [council]: '[{"id":"local"}]',
        'aetheria-cloud-session-v1': '{"accessToken":"exclude-me"}'
      })
    }
    const preview = previewLegacyFixture(sources, before)
    expect(preview.candidates).toEqual(['primary-workspace-v2', 'previous-workspace', primary])
    expect(preview.suggested).toBe('primary-workspace-v2')
    expect(preview.conflict).toBe(true)
    const retain = vi.fn(async (_backup: string) => {})
    await expect(preview.apply(store, preview.suggested!, false, retain)).rejects.toMatchObject({ code: 'invalid' })
    expect(await store.read()).toEqual(before)
    expect(retain).not.toHaveBeenCalled()
    const imported = await preview.apply(store, preview.suggested!, true, retain)
    expect(imported.state.progress.D772).toMatchObject({
      xp: 4, answers: [{ mode: 'guided' }, { mode: 'independent' }]
    })
    expect(imported.state.guardians['guardian-1']).toMatchObject({ bond: 50 })
    expect(imported.state.eggs['egg-1']).toEqual({ id: 'egg-1' })
    expect(imported.state.extensions.legacyImportV1).toMatchObject({
      fields: { unknown: { note: 'synthetic' }, majickAccount: { rewardCore: { ledger: { 'receipt-1': { xp: 4 } } } } },
      auxiliary: { [council]: [{ id: 'durable' }] }
    })
    expect(JSON.stringify(imported)).not.toContain('exclude-me')
    expect(parseBackup(retain.mock.calls[0][0], owner)).toEqual(before)
    expect(await preview.apply(store, preview.suggested!, true, retain)).toEqual(imported)
    expect(retain).toHaveBeenCalledTimes(1)
  })

  it('falls back through invalid records, blocks newer schemas, and can select local recovery', async () => {
    const { store, before } = await fixtureDestination()
    const sources = {
      snapshots: { 'primary-workspace-v2': 'malformed', 'previous-workspace': envelope(legacy(4), 3) },
      local: { [primary]: 'invalid', [primary + '__recovery_previous']: legacy(8) }
    }
    const preview = previewLegacyFixture(sources, before)
    expect(preview.suggested).toBe('previous-workspace')
    expect(preview.unreadable).toEqual(['primary-workspace-v2', primary])
    const selected = await preview.apply(store, primary + '__recovery_previous', true, async () => {})
    expect(selected.state.progress.D772).toMatchObject({ xp: 8 })
    expect(() => previewLegacyFixture({ ...sources, local: { [primary]: legacy(8, 2) } }, before))
      .toThrow(expect.objectContaining({ code: 'newer-schema' }))
  })

  it('compares historical quota timestamps only when no modern checkpoint is valid', async () => {
    const { before } = await fixtureDestination()
    const snapshots = { 'primary-workspace': JSON.stringify({ raw: legacy(4), at: 200 }) }
    const local = { [primary]: legacy(7), [primary + '__safety_meta']: '{"at":201,"legacyDivergence":true}' }
    expect(previewLegacyFixture({ snapshots, local }, before)).toMatchObject({ suggested: primary, conflict: true })
    local[primary + '__safety_meta'] = '{"at":199}'
    expect(previewLegacyFixture({ snapshots, local }, before).suggested).toBe('primary-workspace')
    expect(previewLegacyFixture({ snapshots: {
      ...snapshots, 'previous-workspace': envelope(legacy(3), 1)
    }, local }, before).suggested).toBe('previous-workspace')
  })

  it('pairs a pinned workspace with its own auxiliary records', async () => {
    const { store, before } = await fixtureDestination()
    const pin = primary + '__before_restore'
    const preview = previewLegacyFixture({ snapshots: {}, local: {
      [pin]: legacy(4),
      [pin + '__council']: JSON.stringify({ [council]: '[{"id":"pinned"}]' }),
      [council]: '[{"id":"current"}]',
      'majick-sanctuary-renderer': 'pixi', 'majick-sitewide-response-mode-v1': 'writing'
    } }, before)
    expect(preview.summaries).toEqual([{ id: pin, courses: ['D772'], progressRecords: 1, guardians: 1, eggs: 1 }])
    const restored = await preview.apply(store, pin, true, async () => {})
    expect(restored.state.extensions.legacyImportV1).toMatchObject({
      auxiliary: { [council]: [{ id: 'pinned' }] },
      standalone: { 'majick-sanctuary-renderer': 'pixi', 'majick-sitewide-response-mode-v1': 'writing' }
    })
  })

  it('preserves the destination on failed retention or concurrent changes', async () => {
    const { store, before } = await fixtureDestination()
    const preview = previewLegacyFixture({ snapshots: {}, local: { [primary]: legacy(8) } }, before)
    await expect(preview.apply(store, primary, true, async () => { throw new Error('retention failed') }))
      .rejects.toThrow('retention failed')
    expect(await store.read()).toEqual(before)
    await expect(preview.apply(store, primary, true, async () => {
      await store.update(0, state => { state.settings.changed = true })
    })).rejects.toMatchObject({ code: 'conflict' })
    expect((await store.read())?.state.settings).toEqual({ changed: true })
    const retain = vi.fn(async () => {})
    await expect(preview.apply(store, primary, true, retain)).rejects.toMatchObject({ code: 'conflict' })
    expect(retain).not.toHaveBeenCalled()
  })
})
