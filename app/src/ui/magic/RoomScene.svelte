<script lang="ts">
  import type { RoomId } from '../../core/router'
  let { room }: { room: RoomId | 'utility' } = $props()
  let asset = $derived(import.meta.env.BASE_URL + 'assets/scenes/' + (room === 'home' ? 'landscape-castle.webp' : room + '.svg'))
</script>
<div class="college-scene" data-scene={room} aria-hidden="true">
  <img src={asset} alt="" decoding="async" fetchpriority={room === 'home' ? 'high' : 'auto'}/>
  <div class="college-scene-light"></div>
</div>
<style>
  .college-scene{position:fixed;inset:0;z-index:-2;pointer-events:none;overflow:hidden;background:#2d2041}
  img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
  .college-scene-light{position:absolute;inset:0;background:linear-gradient(105deg,#1d132bdc 0%,#35204e7a 55%,#2d184b6b 100%),radial-gradient(ellipse at center,transparent 15%,#140b20b5 100%)}
</style>
