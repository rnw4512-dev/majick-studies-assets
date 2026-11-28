<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { rooms, roomFromHash, roomLink, type RoomId } from './core/router'
  import RoomNavigation from './ui/RoomNavigation.svelte'
  import BackupPreview from './ui/BackupPreview.svelte'
  import StorageCheck from './ui/StorageCheck.svelte'
  import PortalArrow from './ui/PortalArrow.svelte'
  let current = $state<RoomId>(roomFromHash(window.location.hash))
  let checkingStorage = $state(window.location.hash === '#/storage-check')
  let checkingBackup = $state(window.location.hash === '#/backup-preview')
  let heading: HTMLHeadingElement
  let motion = $state(true)
  let room = $derived(rooms.find(item => item.id === current) ?? rooms[0])
  onMount(() => {
    const update = async () => {
      const next = roomFromHash(window.location.hash)
      const check = window.location.hash === '#/storage-check'
      const backup = window.location.hash === '#/backup-preview'
      if (next === current && check === checkingStorage && backup === checkingBackup) return
      checkingBackup = backup
      checkingStorage = check
      current = next
      await tick()
      heading?.focus()
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  })
</script>
<div class="school" class:still={!motion}>
  <a class="skip" href="#main-heading" onclick={(event) => {event.preventDefault(); heading?.focus()}}>Skip to room content</a>
  <header class="masthead">
    <a class="brand" href={roomLink('home')}><span class="seal" aria-hidden="true">☾</span><span>Aetheria<small>Moonlit Collegium</small></span></a>
    <span class="preview-label">Foundation preview</span>
    <button class="motion-toggle" aria-pressed={!motion} onclick={() => motion = !motion}>Reduce motion: {motion ? 'Off' : 'On'}</button>
  </header>
  <div class="school-layout">
    <RoomNavigation {current}/>
    <main id="main-content">
      <header class="room-heading">
        <p class="eyebrow">Moonlit Collegium · Development preview</p>
        <h1 id="main-heading" tabindex="-1" bind:this={heading}>{checkingBackup ? 'Scholar’s Archive' : checkingStorage ? 'Storage safety check' : room.name}</h1>
        <p>{checkingBackup ? 'Backup and recovery practice.' : checkingStorage ? 'Metadata-only diagnostic for the parallel rebuild.' : room.description}</p>
      </header>
      {#if checkingBackup}
        <BackupPreview/>
      {:else if checkingStorage}
        <StorageCheck/>
      {:else if current === 'home'}
        <section class="welcome" aria-labelledby="welcome-heading">
          <div class="moon-window" aria-hidden="true"><span>☾</span><i>✧</i><b>✦</b></div>
          <div><p class="eyebrow">Where knowledge awakens magic</p><h2 id="welcome-heading">Welcome, Scholar.</h2>
          <p>Explore the new school navigation. Your courses, rewards and Guardians remain in the original application until migration is tested.</p>
          <a class="portal" href={roomLink('learn')}>Explore Learning Lab <PortalArrow/></a></div>
        </section>
        <section aria-labelledby="rooms-heading"><h2 id="rooms-heading">Explore the Collegium</h2>
          <div class="room-grid">{#each rooms.slice(1) as item}<a class="room-card" href={roomLink(item.id)}><span class="room-glyph" aria-hidden="true">{item.glyph}</span><span><strong>{item.name}</strong><small>{item.description}</small></span><PortalArrow/></a>{/each}</div>
        </section>
      {:else}
        <section class="paper" aria-labelledby="stage-heading"><h2 id="stage-heading">Room foundation</h2><p>The navigation for this room is available. Its learning activities, approved artwork and saved progression have not yet been migrated.</p><a class="portal" href={roomLink('home')}>Return to Collegium <PortalArrow/></a></section>
      {/if}
      <aside class="notice"><strong>Your existing learning is protected.</strong> This preview does not read or write learner save values. <a href="#/storage-check">Storage safety check</a>. <a href="#/backup-preview">Backup practice</a>. <a href="https://rnw4512-dev.github.io/majick-studies-assets/current-site/">Open the existing application</a>.</aside>
    </main>
  </div>
</div>
