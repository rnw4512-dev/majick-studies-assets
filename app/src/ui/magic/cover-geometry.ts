// All painting-bound effects share the image's actual cover geometry.
export type CoverRect = { left:number; top:number; width:number; height:number }
export function coverRect(width:number,height:number,naturalWidth:number,naturalHeight:number,position:string): CoverRect | null {
  if (![width,height,naturalWidth,naturalHeight].every(n=>Number.isFinite(n)&&n>0)) return null
  const scale=Math.max(width/naturalWidth,height/naturalHeight)
  const w=naturalWidth*scale,h=naturalHeight*scale
  const [x='50%',y='50%']=position.trim().split(/\s+/)
  const fraction=(value:string)=>value==='left'||value==='top'?0:value==='right'||value==='bottom'?1:value.endsWith('%')&&Number.isFinite(parseFloat(value))?parseFloat(value)/100:.5
  return {left:(width-w)*fraction(x),top:(height-h)*fraction(y),width:w,height:h}
}
