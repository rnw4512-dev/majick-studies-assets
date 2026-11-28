<script lang="ts">
  import { reviewLegacyBackup } from '../core/legacy-backup-preview'

  type Review = Awaited<ReturnType<typeof reviewLegacyBackup>>
  type Entry = { name: string; review: Review | null; error?: string }
  const metrics = [
    { label: 'Exported at', value: (r: Review) => r.exportedAt ?? 'Unavailable' },
    { label: 'XP', value: (r: Review) => r.summary.xp },
    { label: 'Crystals', value: (r: Review) => r.summary.crystals },
    { label: 'Chests', value: (r: Review) => r.summary.chests },
    { label: 'Fragments', value: (r: Review) => r.summary.fragments },
    { label: 'Reward receipts', value: (r: Review) => r.summary.receipts },
    { label: 'Courses', value: (r: Review) => r.summary.courses.join(', ') || 'None' },
    { label: 'Progress records', value: (r: Review) => r.summary.progressRecords },
    { label: 'Guardians', value: (r: Review) => r.summary.guardians },
    { label: 'Eggs', value: (r: Review) => r.summary.eggs },
    { label: 'Study-material record', value: (r: Review) => r.materialRows === null ? 'Missing' : 'Included' },
    { label: 'Study-material rows', value: (r: Review) => r.materialRows?.length ?? 'Unavailable' }
  ]

  let files = $state.raw<Entry[]>([])
  let selected = $state<number | undefined>()
  let confirmed = $state(false)
  let message = $state('')
  let busy = $state(false)
  let chosen = $derived(selected === undefined ? undefined : files[selected])
  let materialIds = $derived([...new Set(files.flatMap(file => file.review?.materialRows?.map(row => row.id) ?? []))].sort())
  let materialByFile = $derived(files.map(file => new Map(file.review?.materialRows?.map(row => [row.id, row.title]))))

  async function choose(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    const picked = Array.from(input.files ?? [])
    input.value = ''
    if (!picked.length) return
    files = []
    selected = undefined
    confirmed = false
    message = ''
    if (picked.length > 3) {
      message = 'Choose up to three backup files at a time.'
      return
    }
    busy = true
    try {
      const reviewed: Entry[] = []
      for (const file of picked) {
        try { reviewed.push({ name: file.name, review: await reviewLegacyBackup(file) }) }
        catch (error) {
          reviewed.push({
            name: file.name, review: null,
            error: error instanceof Error ? error.message : 'This backup could not be previewed.'
          })
        }
      }
      files = reviewed
    } finally { busy = false }
  }

  function download() {
    if (!chosen?.review || !confirmed) return
    try {
      const text = chosen.review.convert(confirmed)
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
      const link = document.createElement('a')
      link.href = url
      link.download = chosen.name.replace(/\.json$/i, '') + '-aetheria-workspace.json'
      try { link.click() }
      finally { setTimeout(() => URL.revokeObjectURL(url), 1000) }
      message = 'Converted backup download started. Keep the original files.'
      confirmed = false
    } catch (error) {
      message = error instanceof Error ? error.message : 'The converted backup could not be created.'
    }
  }
</script>

<section class="room-intro" aria-labelledby="backup-review-heading">
  <h2 id="backup-review-heading">Compare Aetheria backups</h2>
  <p>Select two or three JSON backups together. Files are read on this device. Conversion downloads a new file and leaves app storage untouched.</p>
  <label for="legacy-backup-file">Choose legacy backup files</label>
  <input id="legacy-backup-file" type="file" accept=".json,application/json" multiple disabled={busy} onchange={choose}/>
  {#if files.length}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll this table.) -->
    <div class="table-scroll" role="region" aria-label="Backup comparison" tabindex="0">
      <table>
        <caption>Backup comparison</caption>
        <thead><tr><th scope="col">Field</th>{#each files as file}<th scope="col">{file.name}</th>{/each}</tr></thead>
        <tbody>
          {#each metrics as metric (metric.label)}
            {@const values = files.map(file => file.review ? metric.value(file.review) : null)}
            {@const differs = new Set(values.filter(value => value !== null)).size > 1}
            <tr class:different={differs}>
              <th scope="row">{metric.label}{#if differs}<span class="difference">Differs</span>{/if}</th>
              {#each values as value}<td>{value ?? '—'}</td>{/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#each files as file}
      {#if file.error}<p><strong>{file.name}</strong> {file.error}</p>{/if}
      {#if file.review?.summary.oversized}<p><strong>{file.name}</strong> The converted file would exceed 20 MB with all its data.</p>{/if}
    {/each}
    {#if materialIds.length}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll this table.) -->
      <div class="table-scroll" role="region" aria-label="Study-material rows by file" tabindex="0">
        <table>
          <caption>Study-material rows by file</caption>
          <thead><tr><th scope="col">Row ID</th>{#each files as file}<th scope="col">{file.name}</th>{/each}</tr></thead>
          <tbody>
            {#each materialIds as id (id)}
              <tr><th scope="row">{id}</th>
                {#each materialByFile as index, i}
                  <td>{index.has(id) ? index.get(id) || 'Included' : files[i].review?.materialRows ? 'Absent' : 'Unavailable'}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    <label for="conversion-file">Backup to convert</label>
    <select id="conversion-file" bind:value={selected} onchange={() => { confirmed = false; message = '' }}>
      <option value={undefined}>Choose a file</option>
      {#each files as file, i}<option value={i} disabled={!file.review || file.review.summary.oversized}>{file.name}</option>{/each}
    </select>
    <label class="confirm"><input type="checkbox" bind:checked={confirmed} disabled={!chosen?.review}/> Convert this backup and download a copy</label>
    <button class="portal" disabled={!confirmed || !chosen?.review || chosen.review.summary.oversized} onclick={download}>Download converted backup</button>
  {/if}
  <p role="status">{busy ? 'Reading backups…' : message}</p>
</section>

<style>
  .table-scroll { overflow-x: auto; margin-block: 1rem; }
  table { width: 100%; border-collapse: collapse; }
  caption, th, td { text-align: start; padding: .45rem; overflow-wrap: anywhere; }
  th, td { border-bottom: 1px solid #ad9567; min-width: 7rem; }
  caption { font-weight: bold; }
  .different th, .different td { background: #59462b; color: #fff4d9; }
  .difference { display: block; font-size: .8em; }
  .confirm { display: block; margin-block: .65rem; }
</style>
