<script lang="ts">
  import { exportBackup, parseBackup, backupSummary, backupReminderDue, restoreBackup, MAX_BACKUP_BYTES } from '../core/workspace-backup'
  import type { LocalWorkspaceStore } from '../core/local-workspace'
  import type { Workspace } from '../core/workspace'
  let { store, owner, retain, lastExport = null, onExport = () => {} }: {
    store: LocalWorkspaceStore; owner: string; retain: (text: string) => Promise<void>;
    lastExport?: string | null; onExport?: (at: string) => void
  } = $props()
  let candidate = $state<Workspace | null>(null)
  let current = $state<Workspace | null>(null)
  let raw = $state('')
  let message = $state('')
  let busy = $state(false)
  let confirmed = $state(false)
  let recovery = $state('')
  let due = $derived(backupReminderDue(lastExport))
  function download(text: string, filename: string) {
    const url = URL.createObjectURL(new Blob([text], {type:'application/json'}))
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = filename
    document.body.append(anchor)
    try { anchor.click() } finally { anchor.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000) }
  }
  async function exportCurrent() {
    busy = true
    try {
      const workspace = await store.read()
      if (!workspace || workspace.owner !== owner) throw Error('No compatible local save yet.')
      const at = new Date().toISOString()
      download(exportBackup(workspace, at), 'aetheria-backup-' + at.slice(0,10) + '.json')
      onExport(at)
      message = 'Backup download requested. Check your Downloads folder and keep the file private.'
    } catch { message = 'Could not export this workspace. Existing progress was not changed.' }
    finally { busy = false }
  }
  async function preview(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    candidate = null; current = null; confirmed = false; raw = ''; message = ''
    if (!file) return
    busy = true
    try {
      if (file.size > MAX_BACKUP_BYTES) throw Error('File too large')
      const text = await file.text()
      const next = parseBackup(text, owner)
      const before = await store.read()
      if (!before || before.owner !== owner || before.cloudRevision !== null || next.cloudRevision !== null) throw Error('Workspace requires reconciliation')
      candidate = next; current = before; raw = text
      message = 'Review both checkpoints before restoring. The existing checkpoint will be retained first.'
    } catch { message = 'Backup is invalid, incompatible, or needs cloud reconciliation. Nothing changed.' }
    finally { busy = false; input.value = '' }
  }
  async function restore() {
    if (!candidate || !current || !confirmed) return
    busy = true
    try {
      await restoreBackup(store, owner, raw, current.localRevision, async text => {
        await retain(text)
        recovery = text
      })
      candidate = null; current = null; raw = ''; confirmed = false
      message = 'Local progress restored. The previous checkpoint is retained.'
    } catch { message = 'Restore stopped. No replacement was confirmed. Review the latest checkpoint again.'; confirmed = false; candidate = null; current = null; raw = '' }
    finally { busy = false }
  }
</script>
<section class="paper" aria-labelledby="backup-heading">
  <p class="section-label">Scholar’s archive</p>
  <h2 id="backup-heading">Progress backup & recovery</h2>
  <p>Keep a private copy of your learning progress. This backup covers the new workspace record; personal artwork and music files are not included yet.</p>
  {#if due}<p class="reminder">A gentle reminder: export your progress regularly, especially before changing devices.</p>{/if}
  <button class="portal" disabled={busy} onclick={exportCurrent}>Export progress</button>
  <label for="backup-file">Choose a backup to preview</label>
  <input id="backup-file" type="file" accept=".json,application/json" disabled={busy} onchange={preview}/>
  <p role="status">{message}</p>
  {#if candidate && current}
    <div class="comparison">
      {#each [{label:'Current progress',value:current},{label:'Selected backup',value:candidate}] as item}
        {@const summary = backupSummary(item.value)}
        <section>
          <h3>{item.label}</h3>
          <p>{summary.xp} XP · {summary.crystals} crystals · {summary.chests} chests · {summary.fragments} fragments</p>
          <p>{summary.guardians} Guardians · {summary.eggs} eggs · {summary.courses} courses</p>
          <p>Saved: {summary.updatedAt}</p>
        </section>
      {/each}
    </div>
    <label class="confirm"><input type="checkbox" bind:checked={confirmed} disabled={busy}/> I understand this replaces the current local workspace, not merges it.</label>
    <button class="portal" disabled={busy || !confirmed} onclick={restore}>Restore selected backup</button>
    <button class="portal" disabled={busy} onclick={()=>{candidate=null;current=null;raw='';confirmed=false;message='Restore cancelled.'}}>Cancel</button>
  {/if}
  {#if recovery}<button class="portal" onclick={()=>download(recovery,'aetheria-before-restore.json')}>Download previous checkpoint</button>{/if}
</section>
<style>
  .section-label{color:#67472f;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.8rem}
  .reminder{border-left:3px solid #9b7840;padding-left:12px}
  label:not(.confirm){display:block;font-weight:600;margin:18px 0 6px}
  input[type=file]{max-width:100%;font:inherit}
  .comparison{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr));gap:12px;margin:14px 0}
  .comparison section{border:1px solid #ae976d;padding:12px;border-radius:8px;overflow-wrap:anywhere}
  .confirm{display:flex;align-items:center;gap:10px;margin:14px 0}
  button{margin:4px 6px 4px 0}button:disabled{opacity:.55;cursor:not-allowed}
</style>
