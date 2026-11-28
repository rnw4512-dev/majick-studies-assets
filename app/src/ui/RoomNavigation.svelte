<script lang="ts">
  import { rooms, roomLink, type RoomId } from '../core/router'
  let { current }: { current: RoomId } = $props()
  let expanded = $state(false)
</script>
<nav class="room-nav" aria-label="School rooms">
  <button class="nav-toggle" aria-expanded={expanded} aria-controls="room-links" onclick={() => expanded = !expanded}>School rooms <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
  <ul id="room-links" class:expanded>
    {#each rooms as room}
      <li><a href={roomLink(room.id)} aria-current={current === room.id ? 'page' : undefined} onclick={() => expanded = false}><span aria-hidden="true">{room.glyph}</span>{room.name}</a></li>
    {/each}
  </ul>
</nav>
