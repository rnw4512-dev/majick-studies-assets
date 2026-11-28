<script lang="ts">
  import type { RoomId } from '../core/router'
  import { roomIconUrl } from './room-icons'
  let { room }: { room: RoomId } = $props()
  let failed = $state<RoomId | null>(null)
  let src = $derived(failed === room ? import.meta.env.BASE_URL + 'assets/room-icons/fallback.svg' : roomIconUrl(room))
</script>
<img class="room-icon" data-room-icon={room} {src} alt="" aria-hidden="true" width="32" height="32" decoding="async" onerror={() => {if(failed!==room)failed=room}}/>
<style>
  .room-icon{display:block;width:32px;height:32px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 2px 3px #10091c99);pointer-events:none}
  :global(.room-card) .room-icon{width:42px;height:42px}
</style>
