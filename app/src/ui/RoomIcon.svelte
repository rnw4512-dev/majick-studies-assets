<script lang="ts">
  import type { RoomId } from '../core/router'
  import { roomIconUrl } from './room-icons'
  let { room }: { room: RoomId } = $props()
  let failed = $state<RoomId | null>(null)
  let src = $derived(failed === room ? import.meta.env.BASE_URL + 'assets/room-icons/fallback.svg' : roomIconUrl(room))
</script>
<img class="room-icon" data-room-icon={room} {src} alt="" aria-hidden="true" width="36" height="36" decoding="async" onerror={() => {if(failed!==room)failed=room}}/>
<style>
  .room-icon{display:block;width:36px;height:36px;box-sizing:border-box;object-fit:contain;flex-shrink:0;border:1px solid #d8b16e;border-radius:9px;padding:2px;background:#24162f;box-shadow:0 0 5px #d6a95b40;pointer-events:none}
  :global(.room-nav a:hover) .room-icon,:global(.room-nav a:focus-visible) .room-icon,:global(.room-nav a[aria-current=page]) .room-icon,:global(.room-card:hover) .room-icon,:global(.room-card:focus-visible) .room-icon{border-color:#ffdf9a;box-shadow:0 0 12px #e7bc7caa,inset 0 0 6px #e7bc7c44}
</style>
