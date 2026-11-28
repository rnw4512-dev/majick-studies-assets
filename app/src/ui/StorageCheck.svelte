<script lang="ts">
  import { browserSources, inspectStorage, formatReport, type Report } from '../core/storage-inventory'
  let report = $state<Report | null>(null)
  let busy = $state(false)
  let message = $state('')
  let selected = $state(false)
  let output = $state<HTMLTextAreaElement>()
  const expectedOrigin = 'https://rnw4512-dev.github.io'
  let correctOrigin = $derived(window.location.origin === expectedOrigin)
  async function scan() {
    busy = true
    report = null
    message = ''
    try {
      report = await inspectStorage(browserSources())
      message = 'Storage names collected. Review the list before copying.'
    } catch { message = 'The check could not finish. No save data was changed.' }
    finally { busy = false }
  }
  async function copy() {
    if (!report) return
    try {
      await navigator.clipboard.writeText(formatReport(report))
      message = 'List copied. Paste it into your chat when ready.'
    } catch {
      output?.focus()
      output?.select()
      message = 'Clipboard unavailable. The list is selected; use Ctrl+C or your device’s Copy command.'
    }
  }
</script>
<section class="paper" aria-labelledby="storage-title">
  <h2 id="storage-title">Read-only storage check</h2>
  <p>Find the names of old saves and artwork databases. This tool does not read saved values, change records, upload information or calculate exact byte sizes.</p>
  <p><strong>Current website:</strong> {window.location.origin}</p>
  {#if !correctOrigin}
    <p role="note">This is not the original Aetheria website. Results here are test data or storage for a different website, not your live learning saves.</p>
  {/if}
  <p>Other projects on the same website may share this storage. Only run this check on a device you control. Review names for private information before sharing. Session storage is limited to this tab.</p>
  <label class="consent"><input type="checkbox" bind:checked={selected}/> I understand and want to list storage names only.</label>
  <button class="portal" disabled={!selected || busy} onclick={scan}>{busy ? 'Checking…' : 'Check storage names'}</button>
  <p role="status">{message}</p>
  {#if report}
    <p>{report.entries.length} metadata entries found. Byte sizes are marked null (unavailable).</p>
    <label for="storage-report">Review the list</label>
    <textarea id="storage-report" rows="12" readonly bind:this={output} value={formatReport(report)}></textarea>
    <button class="portal" onclick={copy}>Copy list</button>
  {/if}
</section>
<style>
  .consent{display:flex;gap:10px;align-items:center;margin:16px 0}
  input{width:20px;height:20px;flex-shrink:0}
  textarea{display:block;width:100%;max-width:100%;margin:8px 0 16px;padding:10px;font: .85rem monospace;color:var(--ink);background:#fffdf5;border:1px solid var(--line);border-radius:6px;resize:vertical}
  button:disabled{opacity:.55;cursor:not-allowed}
</style>
