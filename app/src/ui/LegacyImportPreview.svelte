<script lang="ts">
  import { previewLegacyFixture } from '../core/legacy-import'
  import { LocalWorkspaceStore, MemoryBackend } from '../core/local-workspace'

  const store = new LocalWorkspaceStore(new MemoryBackend(), 'synthetic-import-preview')
  const sample = (xp: number, crystals: number, fragments: number) => JSON.stringify({
    courses: { D772: { id: 'D772' } },
    progress: { D772: { answers: [], xp, crystals } },
    majickAccount: { xp, crystals, rewardCore: { eggFragments: fragments, ledger: { 'demo-receipt': true } } }
  })
  const start = store.initialize().then(workspace => previewLegacyFixture({
    snapshots: {},
    local: {
      moonlit_learning_v1: sample(1234, 26, 4),
      moonlit_learning_v1__known_good: sample(980, 18, 2)
    }
  }, workspace))

  let selected = $state('')
  let confirmed = $state(false)
  let deferMaterials = $state(false)
  let busy = $state(false)
  let result = $state('')
  let recoveryCopy: string | undefined

  function select(id: string) {
    selected = id
    confirmed = false
    deferMaterials = false
    result = ''
  }

  async function apply(preview: Awaited<typeof start>) {
    busy = true
    try {
      const { state } = await preview.apply(store, selected, confirmed, async backup => { recoveryCopy = backup }, deferMaterials)
      result = `Practice import applied. ${state.rewards.xp} XP, ${state.rewards.crystals} crystals, ${state.rewards.fragments} fragments. ${recoveryCopy ? 'A practice recovery copy is held in memory.' : ''}`
      confirmed = false
    } catch (error) {
      result = error instanceof Error ? error.message : 'Could not apply the practice copy.'
    } finally { busy = false }
  }
</script>

<section class="room-intro" aria-label="Practice import">
  <p>This practice uses fictional saves. Changes disappear when you leave this page.</p>
  {#await start}
    <p role="status">Preparing practice saves…</p>
  {:then preview}
    {#if preview.conflict}<p>The saved copies differ. Review their balances before choosing a copy.</p>{/if}
    <fieldset disabled={busy}>
      <legend>Choose a practice save</legend>
      {#each preview.summaries as candidate (candidate.id)}
        <label class="candidate">
          <input type="radio" name="practice-source" value={candidate.id} checked={selected === candidate.id} onchange={() => select(candidate.id)}/>
          <span><strong>{candidate.id.endsWith('__known_good') ? 'Known-good backup' : 'Main save'}</strong>{candidate.id === preview.suggested ? ' (suggested)' : ''}<br/>
          {candidate.xp} XP · {candidate.crystals} crystals · {candidate.fragments} fragments · {candidate.receipts} reward {candidate.receipts === 1 ? 'receipt' : 'receipts'}</span>
        </label>
      {/each}
    </fieldset>
    {@const choice = preview.summaries.find(candidate => candidate.id === selected)}
    {#if choice?.canDeferMaterials}
      <label class="candidate"><input type="checkbox" bind:checked={deferMaterials} disabled={busy}/> Leave oversized study materials in the original app</label>
    {:else if choice?.oversized}
      <p>This copy is over 20 MB and cannot be imported safely.</p>
    {/if}
    <label class="candidate"><input type="checkbox" bind:checked={confirmed} disabled={!choice || busy}/> Use the selected save for this practice import</label>
    <button class="portal" disabled={!confirmed || !choice || busy || (choice.oversized && !deferMaterials)} onclick={() => apply(preview)}>Apply practice import</button>
    <p role="status">{result}</p>
  {:catch}
    <p role="status">The practice saves could not be prepared.</p>
  {/await}
</section>

<style>
  fieldset { border: 1px solid currentColor; margin-block: 1rem; padding: .75rem 1rem; }
  .candidate { display: flex; gap: .65rem; align-items: start; padding-block: .45rem; }
  .candidate input { margin-top: .3rem; }
  button { margin-top: .75rem; }
</style>
