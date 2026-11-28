<script lang="ts">
  import { sceneFor, sceneUrl, type SceneId } from './scene-config'
  let { room, portrait = false }: { room: SceneId; portrait?: boolean } = $props()
  let scene = $derived(sceneFor(room))
</script>
<div class="college-scene" class:scene-portrait={portrait} data-scene={room} aria-hidden="true" style:--scene-focal={scene.focal} style:--scene-mobile-focal={scene.mobileFocal}>
  <picture>
    {#if scene.compact}<source media="(max-width: 820px)" srcset={sceneUrl(scene.compact)}/>{/if}
    <img src={sceneUrl(scene.file)} alt="" decoding="async" fetchpriority={room === 'home' ? 'high' : 'auto'}/>
  </picture>
  <div class="college-scene-light"></div>
</div>
<style>
  .college-scene{position:fixed;inset:0;z-index:-2;pointer-events:none;overflow:hidden;background:#2d2041}
  .scene-portrait{position:absolute;z-index:0}
  picture,img{width:100%;height:100%;display:block}
  img{object-fit:cover;object-position:var(--scene-focal)}
  .college-scene-light{position:absolute;inset:0;background:linear-gradient(#2713394d,#2713394d),radial-gradient(ellipse at 50% 44%,transparent 30%,#140b207d 100%)}
  /* Bright, crisp foreground stage: no flat haze, only an edge vignette and a soft base for the plaque. */
  .scene-portrait img{filter:brightness(1.12) contrast(1.18) saturate(1.3)}
  .scene-portrait .college-scene-light{background:radial-gradient(ellipse at 50% 42%,transparent 55%,#12081e66 100%),linear-gradient(to top,#12081e8c 0%,transparent 32%)}
  .scene-portrait::after{content:'';position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle at 18% 22%,#ffcf7a33,transparent 22%),radial-gradient(circle at 80% 30%,#b98cff2e,transparent 26%)}
  @media(max-width:820px){img{object-position:var(--scene-mobile-focal)}}
  @media(max-width:700px){.scene-portrait img{object-position:var(--scene-mobile-focal)}}
</style>
