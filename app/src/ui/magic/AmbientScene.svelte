<script lang="ts">
  import type { SceneId } from './scene-config'
  import type { CoverRect } from './cover-geometry'
  let { room, cover }: {room: SceneId; cover: CoverRect|null} = $props()
  // Authored scene-relative free-floating positions. Additional desktop-only details use CSS.
  const fireflies = [[8,57],[18,71],[27,49],[37,64],[48,79],[61,55],[76,69],[88,48],[12,83],[32,86],[56,68],[69,83],[85,78],[94,62]]
  const candles = [[14,16,0],[42,13,-2],[78,18,-4],[91,30,-5]]
  const quills = [[20,42,0],[51,46,-4],[76,38,-2],[91,52,-6]]
  const motes = [[18,28],[40,54],[76,31],[62,68],[89,52]]
  // Approximate normalized painting-space centers from review; visual calibration still required.
  const paintedCandles = [[22,36],[63,32],[83,42]]
</script>
<div class="ambient-scene" data-ambient={room} aria-hidden="true">
  {#if cover && (room==='home'||room==='study')}
    <div class="ambient-anchors" style:left={cover.left+'px'} style:top={cover.top+'px'} style:width={cover.width+'px'} style:height={cover.height+'px'}>
      {#if room==='home'}
        <span class="ambient-lantern ambient-motion" style="--x:13%;--y:15%"></span>
        <span class="ambient-moonbeam ambient-motion" style="--x:57%;--y:5%"></span>
      {:else}
        {#each paintedCandles as [x,y],i}
          <span class="ambient-painted-candle ambient-motion" style="--x:{x}%;--y:{y}%;--delay:{-i*1.4}s"></span>
        {/each}
      {/if}
    </div>
  {/if}
  {#if room==='home'}
    {#each fireflies as [x,y],i}
      <span class="ambient-firefly ambient-motion" class:ambient-desktop={i>=8} style="--x:{x}%;--y:{y}%;--size:{3+i%4}px;--duration:{8+i%6}s;--delay:{-i*.9}s;--dx:{i%2?'-19px':'22px'};--dy:{i%3===0?'14px':'-20px'}"></span>
    {/each}
    {#each [[29,48],[73,60],[48,77]] as [x,y],i}
      <span class="ambient-wisp ambient-motion" class:ambient-desktop={i===2} style="--x:{x}%;--y:{y}%;--delay:{-3-i*5}s"></span>
    {/each}
  {:else if room==='study'}
    {#each candles as [x,y,delay],i}
      <svg class="ambient-candle ambient-motion" class:ambient-desktop={i===3} style="--x:{x}%;--y:{y}%;--delay:{delay}s" viewBox="0 0 48 104" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="ambient-flame ambient-motion" cx="24" cy="20" rx="9" ry="13" fill="#ffc066"/>
        <path d="M24 4C13 18 16 29 24 31C35 30 34 18 24 4Z" fill="#fff0af" class="ambient-flame ambient-motion"/>
        <path d="M24 27v10" stroke="#67452e" stroke-width="2"/>
        <path d="M14 36Q24 31 34 36V90Q24 96 14 90Z" fill="#f2dfb5" stroke="#b89462" stroke-width="1.2"/>
        <path d="M17 38v48M22 39v50" stroke="#fff5db" stroke-width="2"/>
        <path d="M29 35v18q-3 5-5 0V37" fill="#fff0cc"/>
        <ellipse cx="24" cy="92" rx="13" ry="3" fill="#c89c5b"/>
      </svg>
    {/each}
    {#each quills as [x,y,delay],i}
      <svg class="ambient-quill ambient-motion" class:ambient-desktop={i===3} style="--x:{x}%;--y:{y}%;--delay:{delay}s" viewBox="0 0 58 90" xmlns="http://www.w3.org/2000/svg">
        <path d="M43 3C17 8 3 28 9 51l10-6-3 11C32 49 49 25 43 3Z" fill="#fff0d0" stroke="#b78fc8" stroke-width="1.4"/>
        <path d="M9 77 36 16M18 52 15 35M23 42 34 36M28 31 24 21" fill="none" stroke="#9873b0" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M8 82 10 69 16 64 18 70Z" fill="#ffd47a" stroke="#b78235" stroke-width="1" class="ambient-nib"/>
        <g fill="#ffe5a0" class="ambient-trail ambient-motion"><circle cx="5" cy="60" r="1.4"/><circle cx="2" cy="48" r="1"/><circle cx="13" cy="85" r="1.2"/><path d="M42 57v8m-4-4h8" stroke="#ffe5a0" stroke-width="1"/></g>
      </svg>
    {/each}
  {:else}
    {#each motes as [x,y],i}
      <span class="ambient-mote ambient-motion" class:ambient-desktop={i>=3} style="--x:{x}%;--y:{y}%;--size:{2+i%2}px;--duration:{11+i}s;--delay:{-i*2}s;--dx:12px;--dy:-16px"></span>
    {/each}
  {/if}
</div>
