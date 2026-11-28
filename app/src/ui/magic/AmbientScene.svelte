<script lang="ts">
  import type { SceneId } from './scene-config'
  let { room }: {room: SceneId} = $props()
  // Fixed authored positions and timings; no random re-render, timers, or animation loops in JS.
  const fireflies = [[11,52,7,0],[23,32,9,-2],[36,65,8,-5],[48,24,10,-4],[57,54,9,-6],[69,35,8,-3],[83,57,11,-8],[91,29,9,-5]]
  const candles = [[17,22,0],[76,19,-2],[89,43,-4]]
  const quills = [[30,35,0],[68,28,-4]]
</script>
{#if room === 'home' || room === 'study'}
  <div class="ambient-scene" data-ambient={room} aria-hidden="true">
    {#if room === 'home'}
      <span class="ambient-lantern ambient-motion" style="--x:27%;--y:56%"></span>
      {#each fireflies as [x,y,d,delay],i}
        <span class="ambient-firefly ambient-motion" style="--x:{x}%;--y:{y}%;--duration:{d}s;--delay:{delay}s;--dx:{i%2?'-19px':'22px'};--dy:{i%3===0?'14px':'-20px'}"></span>
      {/each}
      <span class="ambient-wisp ambient-motion" style="--x:39%;--y:58%;--delay:-3s"></span>
      <span class="ambient-wisp ambient-motion" style="--x:73%;--y:66%;--delay:-9s"></span>
    {:else}
      {#each candles as [x,y,delay]}
        <div class="ambient-candle ambient-motion" style="--x:{x}%;--y:{y}%;--delay:{delay}s">
          <span class="ambient-flame ambient-motion"></span><span class="ambient-wick"></span><span class="ambient-wax"></span>
        </div>
      {/each}
      {#each quills as [x,y,delay]}
        <svg class="ambient-quill ambient-motion" style="--x:{x}%;--y:{y}%;--delay:{delay}s" viewBox="0 0 48 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M40 3C17 8 3 28 9 51l10-6-3 11C32 49 46 25 40 3Z" fill="#e9d5bc" stroke="#a780c2" stroke-width="1.2"/>
          <path d="M5 80 35 16M18 52 15 35M23 42 34 36M28 31 24 21M12 65l-3 10" fill="none" stroke="#926caa" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M6 79 16 60" stroke="#ffd488" stroke-width="2" stroke-linecap="round"/>
        </svg>
      {/each}
    {/if}
  </div>
{/if}
