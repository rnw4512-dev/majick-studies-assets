<script lang="ts">
  import { rooms, roomLink, type RoomId } from '../core/router'
  let { current, expanded, onSelect }: { current: RoomId | null; expanded: boolean; onSelect: () => void } = $props()
</script>
<nav class="room-nav" class:expanded aria-label="School rooms">
  <ul id="room-links" class:expanded>
    {#each rooms as room}
      <li><a href={roomLink(room.id)} aria-current={current === room.id ? 'page' : undefined} onclick={onSelect}><span aria-hidden="true">{room.glyph}</span>{room.name}</a></li>
    {/each}
  </ul>
</nav>
