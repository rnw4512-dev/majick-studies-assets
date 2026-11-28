<script lang="ts">
  import { reviewLegacyBackup } from '../core/legacy-backup-preview'

  let result = $state<Awaited<ReturnType<typeof reviewLegacyBackup>>>()
  let error = $state('')
  let busy = $state(false)

  async function choose(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    busy = true
    result = undefined
    error = ''
    try { result = await reviewLegacyBackup(file) }
    catch (failure) { error = failure instanceof Error ? failure.message : 'This backup could not be previewed.' }
    finally { busy = false; input.value = '' }
  }
</script>

<section class="room-intro" aria-labelledby="backup-review-heading">
  <h2 id="backup-review-heading">Review an Aetheria backup</h2>
  <p>Your browser reads the file on this device. Reviewing it does not save or upload progress.</p>
  <label for="legacy-backup-file">Choose a legacy backup file</label>
  <input id="legacy-backup-file" type="file" accept=".json,application/json" disabled={busy} onchange={choose}/>
  <div aria-live="polite">
    {#if busy}
      <p>Reading backup…</p>
    {:else if error}
      <p>{error}</p>
    {:else if result}
      {@const summary = result}
      <p>{summary.xp} XP · {summary.crystals} crystals · {summary.fragments} fragments · {summary.receipts} reward receipts</p>
      <p>{summary.progressRecords} course progress records · {summary.guardians} Guardians · {summary.eggs} eggs</p>
      {#if summary.courses.length}<p>Courses: {summary.courses.join(', ')}</p>{/if}
      {#if summary.canDeferMaterials}
        <p>This backup is over 20 MB with study materials. Progress fits if those materials are transferred separately.</p>
      {:else if summary.oversized}
        <p>This backup is over 20 MB and is too large for the current import limit.</p>
      {/if}
    {/if}
  </div>
</section>
