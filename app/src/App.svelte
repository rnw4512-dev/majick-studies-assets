<script lang="ts">
  import { onMount, tick } from 'svelte'
  import RoomScene from './ui/magic/RoomScene.svelte'
  import { installMagic } from './ui/magic/interaction'
  import { rooms, roomFromHash, roomLink, type RoomId } from './core/router'
  import RoomIcon from './ui/RoomIcon.svelte'
  import RoomNavigation from './ui/RoomNavigation.svelte'
  import BackupPreview from './ui/BackupPreview.svelte'
  import StorageCheck from './ui/StorageCheck.svelte'
  import PortalArrow from './ui/PortalArrow.svelte'
  let current = $state<RoomId>(roomFromHash(window.location.hash))
  let checkingStorage = $state(window.location.hash === '#/storage-check')
  let checkingBackup = $state(window.location.hash === '#/backup-preview')
  let heading = $state<HTMLHeadingElement>()
  let motion = $state(true)
  let menuOpen = $state(false)
  let school: HTMLDivElement
  let magic: ReturnType<typeof installMagic> | undefined
  $effect(() => { motion; magic?.update() })
  let room = $derived(rooms.find(item => item.id === current) ?? rooms[0])
  onMount(() => {
    magic = installMagic(school)
    const update = async () => {
      const next = roomFromHash(window.location.hash)
      const check = window.location.hash === '#/storage-check'
      const backup = window.location.hash === '#/backup-preview'
      if (next === current && check === checkingStorage && backup === checkingBackup) return
      menuOpen = false
      checkingBackup = backup
      checkingStorage = check
      current = next
      await tick()
      heading?.focus()
    }
    window.addEventListener('hashchange', update)
    return () => { window.removeEventListener('hashchange', update); magic?.destroy() }
  })
</script>
<div class="school" class:still={!motion} bind:this={school}>
  <RoomScene room={checkingStorage || checkingBackup ? 'utility' : current}/>
  <a class="skip" href="#main-heading" onclick={(event) => {event.preventDefault(); heading?.focus()}}>Skip to room content</a>
  <header class="masthead">
    <a class="brand" href={roomLink('home')}><span class="seal" aria-hidden="true">☾</span><span>Aetheria<small>Moonlit Collegium</small></span></a>
    <span class="preview-label">Foundation preview</span>
    <button class="motion-toggle" aria-label={'Reduce motion: ' + (motion ? 'Off' : 'On')} aria-pressed={!motion} onclick={() => motion = !motion}><span aria-hidden="true" class="motion-long">Reduce motion: {motion ? 'Off' : 'On'}</span><span aria-hidden="true" class="motion-short">Motion {motion ? 'on' : 'off'}</span></button>
    <button class="nav-toggle" aria-label="School rooms" aria-expanded={menuOpen} aria-controls="room-links" onclick={() => menuOpen = !menuOpen}>Rooms <span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
  </header>
  <div class="school-layout">
    <RoomNavigation current={checkingStorage || checkingBackup ? null : current} expanded={menuOpen} onSelect={() => menuOpen = false}/>
    <main id="main-content">
      {#if checkingBackup || checkingStorage}
        <header class="room-heading utility-heading">
          <h1 id="main-heading" tabindex="-1" bind:this={heading}>{checkingBackup ? 'Scholar’s Archive' : 'Storage safety check'}</h1>
          <p>{checkingBackup ? 'Backup and recovery practice.' : 'Metadata-only diagnostic for the parallel rebuild.'}</p>
        </header>
        {#if checkingBackup}<BackupPreview/>{:else}<StorageCheck/>{/if}
      {:else}
        <section class="room-stage" class:home-stage={current === 'home'} aria-labelledby="main-heading">
          <RoomScene room={current} portrait={true}/>
          <header class="scene-plaque">
            <h1 id="main-heading" tabindex="-1" bind:this={heading}>{room.name}</h1>
            {#if current === 'home'}<p>Welcome home, Scholar. Your lessons await.</p>{/if}
          </header>
        </section>
        {#if current === 'home'}
          <section class="welcome-copy" aria-label="Welcome to Aetheria">
            <p>Your courses, rewards and Guardians remain in the original application until migration is tested.</p>
            <a class="portal" href={roomLink('learn')}>Explore Learning Lab <PortalArrow/></a>
          </section>
          <section aria-labelledby="rooms-heading"><h2 id="rooms-heading" class="section-heading">Explore the Collegium</h2>
            <div class="room-grid">{#each rooms.slice(1) as item}<a class="room-card" href={roomLink(item.id)}><RoomIcon room={item.id}/><span><strong>{item.name}</strong><small>{item.description}</small></span><PortalArrow/></a>{/each}</div>
          </section>
        {:else}
          <section class="room-intro" aria-labelledby="stage-heading"><h2 id="stage-heading">Room foundation</h2><p>{room.description} The learning activities and saved progression have not yet been migrated.</p><a class="portal" href={roomLink('home')}>Return to Collegium <PortalArrow/></a></section>
        {/if}
      {/if}
      <aside class="notice"><strong>Your existing learning is protected.</strong> This preview does not read or write learner save values. <a href="#/storage-check">Storage safety check</a>. <a href="#/backup-preview">Backup practice</a>. <a href="https://rnw4512-dev.github.io/majick-studies-assets/current-site/">Open the existing application</a>. <a href={import.meta.env.BASE_URL + 'assets/scenes/ASSET_RECORD.md'}>Scene artwork credits</a>. <a href={import.meta.env.BASE_URL + 'assets/room-icons/CREDITS.md'}>Room icon credits</a>.</aside>
    </main>
  </div>
</div>
