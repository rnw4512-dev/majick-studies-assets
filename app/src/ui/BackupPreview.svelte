<script lang="ts">
  import BackupPanel from './BackupPanel.svelte'
  import { MemoryBackend, LocalWorkspaceStore } from '../core/local-workspace'
  const store = new LocalWorkspaceStore(new MemoryBackend(),'synthetic-demo')
  let ready = $state(false)
  let busy = $state(false)
  let failure = $state('')
  let lastExport = $state<string|null>(null)
  let recovery = $state<string[]>([])
  async function start() {
    busy=true
    try {
      await store.initialize()
      await store.update(0,s=>{s.rewards.xp=15;s.rewards.crystals=3;s.guardians={demo:{stage:'new-bond'}};s.eggs={demo:{moonlight:5}}})
      ready=true
    } catch { failure='Demo could not start.' }
    finally {busy=false}
  }
</script>
<p><strong>Practice preview only.</strong> Uses fictional data in memory. It never reads or changes your real saves. Demo recovery history disappears on reload. The durable backup vault is being tested separately.</p>
{#if ready}
  <BackupPanel {store} owner="synthetic-demo" retain={async text=>{recovery=[...recovery,text]}} {lastExport} onExport={at=>{lastExport=at}}/>
  <p role="status">Demo recovery checkpoints retained: {recovery.length}</p>
{:else}
  <button class="portal" disabled={busy} onclick={start}>Open backup practice</button>
  <p role="status">{failure}</p>
{/if}
