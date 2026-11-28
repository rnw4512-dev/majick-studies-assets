// Single delegated interaction effects owner. Never change native activation.
export const SPARK_LIMIT = 24
export const SPARKS_PER_PRESS = 6
export const SPARK_LIFETIME = 460
export function installMagic(root: HTMLElement) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const layer = document.createElement('div')
  layer.className = 'magic-sparks'
  layer.setAttribute('aria-hidden','true')
  root.append(layer)
  const active = new Map<HTMLElement, Animation>()
  const allowed = () => !preference.matches && !root.classList.contains('still') && !document.hidden
  function remove(particle: HTMLElement) {
    const animation = active.get(particle)
    active.delete(particle)
    animation?.cancel()
    particle.remove()
  }
  function clear() { for (const particle of [...active.keys()]) remove(particle) }
  function refresh() {
    root.classList.toggle('magic-paused',document.hidden)
    if (!allowed()) clear()
  }
  function activate(event: MouseEvent) {
    if (!event.isTrusted || !allowed() || !(event.target instanceof Element)) return
    const control = event.target.closest<HTMLElement>('button,a[href],input[type=file]')
    if (!control || !root.contains(control) || control.matches(':disabled,[aria-disabled=true]')) return
    const rect = control.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = Math.max(0,Math.min(innerWidth, event.detail ? event.clientX : rect.left+rect.width/2))
    const y = Math.max(0,Math.min(innerHeight, event.detail ? event.clientY : rect.top+rect.height/2))
    for (let i=0;i<SPARKS_PER_PRESS;i++) {
      if (active.size>=SPARK_LIMIT) remove(active.keys().next().value!)
      const particle=document.createElement('span')
      particle.className='magic-spark'
      particle.style.left=x+'px'
      particle.style.top=y+'px'
      layer.append(particle)
      const angle=i*Math.PI*2/SPARKS_PER_PRESS
      const distance=22+(i%3)*8
      const animation=particle.animate([
        {transform:'translate(-50%,-50%) scale(.65)',opacity:1},
        {transform:`translate(calc(-50% + ${Math.cos(angle)*distance}px),calc(-50% + ${Math.sin(angle)*distance}px)) scale(.15)`,opacity:0}
      ],{duration:SPARK_LIFETIME,easing:'cubic-bezier(.1,.7,.2,1)'})
      active.set(particle,animation)
      animation.onfinish=()=>remove(particle)
    }
  }
  // A single bounded portal poof shares the spark lifetime/cleanup owner.
  // Future verified reward events may use the same primitive after receipt integration.
  function poof(target: HTMLElement | undefined) {
    if (!target || !allowed()) return
    const rect = target.getBoundingClientRect()
    if (rect.bottom<=0 || rect.top>=innerHeight || rect.right<=0 || rect.left>=innerWidth) return
    if (active.size>=SPARK_LIMIT) remove(active.keys().next().value!)
    const particle=document.createElement('span')
    particle.className='magic-poof'
    particle.style.left=Math.max(0,Math.min(innerWidth,rect.left+rect.width/2))+'px'
    particle.style.top=Math.max(0,Math.min(innerHeight,rect.top+Math.min(rect.height/2,110)))+'px'
    layer.append(particle)
    const animation=particle.animate([
      {transform:'translate(-50%,-50%) scale(.45)',opacity:.65},
      {transform:'translate(-50%,-50%) scale(2.1)',opacity:0}
    ],{duration:SPARK_LIFETIME,easing:'ease-out'})
    active.set(particle,animation)
    animation.onfinish=()=>remove(particle)
  }
  // Capture before navigation or a control removes itself. No preventDefault.
  root.addEventListener('click',activate,true)
  preference.addEventListener('change',refresh)
  document.addEventListener('visibilitychange',refresh)
  refresh()
  return {update:refresh,poof,destroy(){
    root.removeEventListener('click',activate,true)
    preference.removeEventListener('change',refresh)
    document.removeEventListener('visibilitychange',refresh)
    clear()
    layer.remove()
    root.classList.remove('magic-paused')
  }}
}
