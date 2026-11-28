import type { LocalWorkspaceStore } from './local-workspace'
import { BackupSizeError, exportBackup, restoreBackup } from './workspace-backup'
import { newWorkspace, validateWorkspace, WorkspaceError, type Json, type JsonObject, type Workspace, type WorkspaceState } from './workspace'

const durableKeys = ['primary-workspace-v2', 'previous-workspace', 'primary-workspace']
const knownGood = 'moonlit_learning_v1__known_good'
const materialKey = 'majick-study-materials-v1'
const pin = 'moonlit_learning_v1__before_restore'
const localKeys = ['moonlit_learning_v1', 'moonlit_learning_v1__recovery_previous',
  pin, 'moonlit_learning_v1__good_backup', 'moonlit_learning_v1__session_backup', knownGood]
const auxiliaryKeys = new Set([
  'majick-learning-observatory-v1', 'majick-fragment-study-evidence-v1', 'majick-universal-hands-on-v1',
  'majick-d772-mixed-exam-review-v1', materialKey, 'aetheria-experiences-v1', 'aetheria-adventure-journal-v1'
])
const preservedKeys = new Set([
  'majick-reward-sanctuary-v3411', 'majick-sanctuary-furniture-v1', 'majick-sanctuary-layout-v2',
  'majick-sanctuary-object-interactions-v1', 'majick-sanctuary-renderer', 'majick-sitewide-response-mode-v1',
  'aetheria-learning-path-current-v2', 'aetheria-d772-oa-focus-cs229-v1'
])
const credentials = /^(?:api[_-]?key|access[_-]?token|refresh[_-]?token|app[_-]?token|password|secret[_-]?key|service[_-]?role(?:[_-]?key)?|authorization|aetheria-cloud-session-v1|majick_cloud_ai_.+)$/i

type Records = Readonly<Partial<Record<string, string>>>
export interface LegacyFixture {
  snapshots: Records
  local: Records
}

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function scrub(value: Json, depth = 0): Json {
  if (depth > 72) throw new WorkspaceError('invalid', 'Legacy record exceeds nesting limit')
  if (Array.isArray(value)) return value.map(entry => scrub(entry, depth + 1))
  if (!isObject(value)) return value
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !credentials.test(key))
    .map(([key, entry]) => [key, scrub(entry, depth + 1)]))
}

function auxiliary(key: string): boolean {
  return auxiliaryKeys.has(key) || key.startsWith('majick-d756-task2-rehearsal-v1')
}

function mapRoster(value: Json | undefined): JsonObject {
  const roster: JsonObject = Object.create(null)
  if (value === undefined || value === null) return roster
  if (!Array.isArray(value)) throw new WorkspaceError('invalid', 'Invalid legacy roster')
  for (const entry of value) {
    if (!isObject(entry) || typeof entry.id !== 'string' || !entry.id || Object.hasOwn(roster, entry.id))
      throw new WorkspaceError('invalid', 'Invalid or duplicate legacy roster ID')
    roster[entry.id] = entry
  }
  return roster
}

function balance(value: Json | undefined): number | undefined {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return undefined
  const number = Number(value)
  return Number.isSafeInteger(number) && number >= 0 ? number : undefined
}

function mapRewards(legacy: JsonObject, progress: JsonObject, world: JsonObject | null | undefined): WorkspaceState['rewards'] {
  const account = isObject(legacy.majickAccount) ? legacy.majickAccount : {}
  const rewardCore = isObject(account.rewardCore) ? account.rewardCore : {}
  const merge = isObject(account.progressMergeV3323) ? account.progressMergeV3323 : {}
  const recovery = isObject(account.balanceRecoveryV3322) ? account.balanceRecoveryV3322 : {}
  const restored = isObject(recovery.restoredTo) ? recovery.restoredTo : {}
  const courses = Object.values(progress).filter(isObject)
  const xp = [account.xp, account.xpHighWater, account.lifetimeXpHighWater,
    merge.mergedXp, restored.xp, legacy.xp, legacy.totalXp, world?.xp, world?.totalXp]
    .reduce<number>((best, value) => Math.max(best, balance(value) ?? 0), 0)
  const courseXp = courses.reduce((best, row) => Math.max(best, balance(row.xp) ?? 0), xp)
  const courseCrystals = courses.map(row => balance(row.crystals)).filter(value => value !== undefined)
  const crystals = balance(account.crystals) ?? (courseCrystals.length
    ? courseCrystals.reduce((best, value) => Math.max(best, value), 0)
    : balance(world?.crystals) ?? 0)

  const chests = balance(account.chests) ?? courses.reduce((best, row) => Math.max(best, balance(row.chests) ?? 0), 0)

  const receipts = new Set<string>()
  if (isObject(rewardCore.ledger)) {
    for (const [id, entry] of Object.entries(rewardCore.ledger)) if (id && entry) receipts.add(id)
  }
  for (const course of courses) {
    if (!isObject(course.interactiveRewardLedger)) continue
    for (const [id, entry] of Object.entries(course.interactiveRewardLedger)) if (id && entry) receipts.add(id)
  }
  const chestLedger = account.chestEggLedger
  if (isObject(chestLedger) && Array.isArray(chestLedger.receipts)) {
    for (const entry of chestLedger.receipts) {
      if (isObject(entry) && typeof entry.id === 'string' && entry.id) receipts.add(entry.id)
    }
  }
  return {
    xp: courseXp, crystals, chests, fragments: balance(rewardCore.eggFragments) ?? 0,
    receipts: Object.fromEntries([...receipts].map(id => [id, true]))
  }
}

function exceedsBackupLimit(workspace: Workspace): boolean {
  try { exportBackup(workspace, workspace.updatedAt); return false }
  catch (error) {
    if (error instanceof BackupSizeError) return true
    throw error
  }
}

function withoutImportedMaterials(workspace: Workspace): Workspace | undefined {
  const extension = workspace.state.extensions.legacyImportV1
  if (!isObject(extension) || !isObject(extension.auxiliary) || !Object.hasOwn(extension.auxiliary, materialKey)) return
  const { [materialKey]: _deferred, ...auxiliary } = extension.auxiliary
  return {
    ...workspace,
    state: { ...workspace.state, extensions: { ...workspace.state.extensions,
      legacyImportV1: { ...extension, auxiliary, deferredMaterials: true } } }
  }
}

function mapCandidate(raw: string, aux: JsonObject, standalone: JsonObject, destination: Workspace): Workspace {
  const legacy = scrub(JSON.parse(raw))
  if (!isObject(legacy) || !isObject(legacy.courses) || !isObject(legacy.progress))
    throw new WorkspaceError('invalid', 'Invalid legacy courses or progress')
  const version = legacy.saveSchemaVersion
  if (typeof version === 'number' && version > 1)
    throw new WorkspaceError('newer-schema', 'Legacy checkpoint requires a newer importer')
  if (version != null && version !== 1) throw new WorkspaceError('invalid', 'Invalid legacy schema')
  for (const course of Object.values(legacy.progress)) {
    if (!isObject(course) || (course.answers != null && !Array.isArray(course.answers)))
      throw new WorkspaceError('invalid', 'Invalid legacy course progress')
  }
  const { courses, progress, ...fields } = legacy
  const world = legacy.legacy
  if (world != null && !isObject(world)) throw new WorkspaceError('invalid', 'Invalid legacy world')
  const workspace = newWorkspace(destination.owner, destination.updatedAt)
  workspace.state.rewards = mapRewards(legacy, progress, world)
  workspace.state.courses = courses
  workspace.state.progress = progress
  workspace.state.guardians = mapRoster(world?.pets)
  workspace.state.eggs = mapRoster(world?.eggs)
  workspace.state.extensions.legacyImportV1 = { fields, auxiliary: aux, standalone }
  return validateWorkspace(workspace, destination.owner)
}

function canonical(value: Json): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']'
  if (!isObject(value)) return JSON.stringify(value)
  return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}'
}

function stateKey(workspace: Workspace): string {
  return canonical(workspace.state as unknown as JsonObject)
}

function parseRecords(records: Readonly<Record<string, unknown>>, allow: (key: string) => boolean, unreadable: string[]): JsonObject {
  const parsed: JsonObject = {}
  for (const [key, value] of Object.entries(records)) {
    if (!allow(key)) continue
    try {
      if (typeof value !== 'string') throw new Error('Invalid record')
      const choices = key === 'majick-sanctuary-renderer' ? ['pixi', 'phaser']
        : key === 'majick-sitewide-response-mode-v1' ? ['choice', 'writing', 'both'] : undefined
      if (choices) {
        if (!choices.includes(value)) throw new Error('Invalid preference')
        parsed[key] = value
        continue
      }
      parsed[key] = scrub(JSON.parse(value))
    } catch { unreadable.push(key) }
  }
  return parsed
}

export function previewLegacyFixture(fixture: LegacyFixture, destination: Workspace) {
  const before = validateWorkspace(destination, destination.owner)
  const unreadable: string[] = []
  const aux = parseRecords(fixture.local, auxiliary, unreadable)
  const standalone = parseRecords(fixture.local, key => preservedKeys.has(key), unreadable)
  const options = new Map<string, Workspace>()
  const identities = new Set<string>()
  function add(id: string, raw: string, records: JsonObject) {
    const workspace = mapCandidate(raw, records, standalone, before)
    const key = stateKey(workspace)
    if (identities.has(key)) return
    identities.add(key)
    options.set(id, workspace)
  }
  function inspect(id: string, read: () => void) {
    try { read() }
    catch (error) {
      if (error instanceof WorkspaceError && error.code === 'newer-schema') throw error
      unreadable.push(id)
    }
  }
  let overflow: { raw: string; at: number; records: JsonObject } | undefined
  for (const key of durableKeys) {
    const text = fixture.snapshots[key]
    if (text === undefined) continue
    inspect(key, () => {
      const record = JSON.parse(text)
      if (key === 'primary-workspace' && isObject(record) && record.format == null &&
          typeof record.raw === 'string' && typeof record.at === 'number' && Number.isFinite(record.at) &&
          (record.browserData == null || isObject(record.browserData))) {
        const invalidAux: string[] = []
        const records = parseRecords(record.browserData ?? {}, auxiliary, invalidAux)
        if (invalidAux.length) throw new Error('Invalid quota records')
        overflow = { raw: record.raw, at: record.at, records }
        return
      }
      if (!isObject(record) || record.format !== 1 || typeof record.revision !== 'number' ||
        !Number.isSafeInteger(record.revision) || record.revision < 1 ||
        typeof record.raw !== 'string' || (record.browserData != null && !isObject(record.browserData))) throw new Error('Invalid checkpoint')
      const invalidAux: string[] = []
      const stored = parseRecords(record.browserData ?? {}, auxiliary, invalidAux)
      if (invalidAux.length) throw new Error('Invalid checkpoint records')
      add(key, record.raw, { ...aux, ...stored })
    })
  }
  for (const key of localKeys) {
    const text = fixture.local[key]
    if (text === undefined) continue
    inspect(key, () => {
      if (key !== pin) { add(key, text, aux); return }
      const paired = fixture.local[pin + '__council']
      const records = paired === undefined ? {} : JSON.parse(paired)
      if (!isObject(records)) throw new Error('Invalid pinned records')
      const invalidAux: string[] = []
      const stored = parseRecords(records, auxiliary, invalidAux)
      if (invalidAux.length) throw new Error('Invalid pinned records')
      add(key, text, stored)
    })
  }
  const metadata = parseRecords(fixture.local, key => key === 'moonlit_learning_v1__safety_meta', unreadable)
  const meta = metadata.moonlit_learning_v1__safety_meta
  const preferred = options.keys().next().value
  let suggested = preferred ?? null
  if (overflow) {
    const { raw, at, records } = overflow
    inspect('primary-workspace', () => add('primary-workspace', raw, { ...aux, ...records }))
    const noModern = !preferred || !durableKeys.includes(preferred)
    const localAt = isObject(meta) ? meta.at : undefined
    if (noModern && options.has('primary-workspace') &&
      (typeof localAt !== 'number' || localAt <= at || !preferred)) suggested = 'primary-workspace'
  }
  const archivedKnownGood = fixture.snapshots[knownGood]
  if (archivedKnownGood !== undefined)
    inspect('archive:' + knownGood, () => add('archive:' + knownGood, archivedKnownGood, aux))
  suggested ??= options.keys().next().value ?? null
  const candidates = [...options.keys()]
  return {
    suggested,
    candidates,
    summaries: [...options].map(([id, workspace]) => {
      const { state } = workspace
      const oversized = exceedsBackupLimit(workspace)
      const progressOnly = oversized ? withoutImportedMaterials(workspace) : undefined
      return {
        id,
        oversized,
        canDeferMaterials: progressOnly !== undefined && !exceedsBackupLimit(progressOnly),
        courses: Object.keys(state.courses),
        progressRecords: Object.keys(state.progress).length,
        guardians: Object.keys(state.guardians).length,
        eggs: Object.keys(state.eggs).length,
        xp: state.rewards.xp,
        crystals: state.rewards.crystals,
        chests: state.rewards.chests,
        fragments: state.rewards.fragments,
        receipts: Object.keys(state.rewards.receipts).length
      }
    }),
    conflict: candidates.length > 1 || (isObject(meta) && meta.legacyDivergence === true),
    unreadable,
    async apply(store: LocalWorkspaceStore, selected: string, confirmed: boolean, retain: (backup: string) => Promise<void>, deferMaterials = false) {
      let incoming = options.get(selected)
      if (!confirmed || !incoming) throw new WorkspaceError('invalid', 'Select and confirm a reviewed candidate')
      const current = await store.read()
      if (!current || current.owner !== before.owner || current.cloudRevision !== null)
        throw new WorkspaceError('conflict', 'A matching local workspace is required')
      if (deferMaterials) {
        const progressOnly = exceedsBackupLimit(incoming) ? withoutImportedMaterials(incoming) : undefined
        if (!progressOnly) throw new WorkspaceError('invalid', 'This copy does not need a separate study materials transfer.')
        incoming = progressOnly
      }
      if (stateKey(incoming) === stateKey(current)) return current
      if (current.localRevision !== before.localRevision || stateKey(current) !== stateKey(before))
        throw new WorkspaceError('conflict', 'Destination changed. Review the import again.')
      if (exceedsBackupLimit(current))
        throw new WorkspaceError('invalid', 'Your current workspace is too large to back up safely. Nothing was changed.')
      if (exceedsBackupLimit(incoming)) {
        const progressOnly = withoutImportedMaterials(incoming)
        if (progressOnly && !exceedsBackupLimit(progressOnly))
          throw new WorkspaceError('invalid', 'This copy is over 20 MB with study materials. Review and confirm importing progress while leaving those materials in the original app.')
        throw new WorkspaceError('invalid', 'This progress copy is over 20 MB and cannot be imported safely. Nothing was changed.')
      }
      return restoreBackup(store, before.owner, exportBackup(incoming, incoming.updatedAt), before.localRevision, retain)
    }
  }
}
