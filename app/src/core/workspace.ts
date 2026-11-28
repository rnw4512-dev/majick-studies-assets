// Versioned local workspace. No network, auth credentials or legacy storage access.
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
export type JsonObject = { [key: string]: Json }
export const WORKSPACE_VERSION = 1
export interface WorkspaceState {
  courses: JsonObject
  progress: JsonObject
  rewards: { xp: number; crystals: number; chests: number; fragments: number; receipts: Record<string, true> }
  guardians: JsonObject
  eggs: JsonObject
  inventory: JsonObject
  sanctuary: JsonObject
  journal: JsonObject
  settings: JsonObject
  materials: JsonObject
  extensions: JsonObject
}
export interface Workspace {
  schemaVersion: 1
  owner: string
  localRevision: number
  cloudRevision: number | null
  acknowledgedLocalRevision: number
  updatedAt: string
  state: WorkspaceState
}
export const pendingSync = (w: Workspace) => w.localRevision > w.acknowledgedLocalRevision
export class WorkspaceError extends Error {
  constructor(public code: 'invalid' | 'newer-schema' | 'conflict' | 'unavailable', message: string) {
    super(message); this.name = 'WorkspaceError'
  }
}
const invalid = (message: string): never => { throw new WorkspaceError('invalid', message) }
export function assertOwner(owner: string): void {
  if (typeof owner !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(owner)) invalid('Invalid workspace owner')
}
function object(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}
function integer(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}
// Reject non-JSON values, unsafe object keys and credential-shaped fields.
function validateJson(value: unknown, depth = 0): void {
  if (depth > 80) invalid('Workspace nesting limit exceeded')
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return
  if (typeof value === 'number' && Number.isFinite(value)) return
  if (Array.isArray(value)) {
    for (const entry of value) validateJson(entry, depth + 1)
    return
  }
  if (!object(value)) return invalid('Non-JSON workspace value')
  for (const [key, item] of Object.entries(value)) {
    if (/^(?:__proto__|prototype|constructor)$/i.test(key)) invalid('Unsafe workspace key')
    if (/^(?:api[_-]?key|access[_-]?token|refresh[_-]?token|app[_-]?token|password|secret[_-]?key|service[_-]?role(?:[_-]?key)?|authorization|aetheria-cloud-session-v1|majick_cloud_ai_.+)$/i.test(key)) invalid('Credential field is not allowed in workspace')
    validateJson(item, depth + 1)
  }
}
const sections = ['courses','progress','guardians','eggs','inventory','sanctuary','journal','settings','materials','extensions'] as const
export function validateWorkspace(value: unknown, owner: string): Workspace {
  assertOwner(owner)
  if (!object(value)) return invalid('Invalid workspace record')
  if (typeof value.schemaVersion === 'number' && value.schemaVersion > WORKSPACE_VERSION)
    throw new WorkspaceError('newer-schema', 'Workspace requires a newer application')
  validateJson(value)
  if (value.schemaVersion !== WORKSPACE_VERSION || value.owner !== owner) return invalid('Schema or owner mismatch')
  if (!integer(value.localRevision) || !integer(value.acknowledgedLocalRevision) ||
      value.acknowledgedLocalRevision > value.localRevision ||
      (value.cloudRevision !== null && (!integer(value.cloudRevision) || value.cloudRevision < 1)) ||
      (value.cloudRevision === null && value.acknowledgedLocalRevision !== 0)) return invalid('Invalid workspace revisions')
  if (typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt))) return invalid('Invalid workspace timestamp')
  const state = value.state
  if (!object(state)) return invalid('Missing workspace state')
  for (const section of sections) if (!object(state[section])) invalid('Invalid state section: ' + section)
  const rewards = state.rewards
  if (!object(rewards) || !integer(rewards.xp) || !integer(rewards.crystals) ||
      (Object.hasOwn(rewards, 'chests') && !integer(rewards.chests)) || !integer(rewards.fragments) || !object(rewards.receipts) ||
      Object.values(rewards.receipts).some(x => x !== true)) return invalid('Invalid rewards or receipts')
  const workspace = structuredClone(value) as unknown as Workspace
  // Version 1 checkpoints written before chest support omit this balance.
  workspace.state.rewards.chests ??= 0
  return workspace
}
export function newWorkspace(owner: string, at: string): Workspace {
  return validateWorkspace({ schemaVersion: 1, owner, localRevision: 0, cloudRevision: null,
    acknowledgedLocalRevision: 0, updatedAt: at,
    state: { courses: {}, progress: {}, rewards: { xp: 0, crystals: 0, chests: 0, fragments: 0, receipts: {} },
      guardians: {}, eggs: {}, inventory: {}, sanctuary: {}, journal: {}, settings: {}, materials: {}, extensions: {} }
  }, owner)
}
