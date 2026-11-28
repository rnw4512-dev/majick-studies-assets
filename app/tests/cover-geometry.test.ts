import { describe,it,expect } from 'vitest'
import { coverRect } from '../src/ui/magic/cover-geometry'
describe('painting cover geometry',()=>{
  it('uses horizontal focal position for narrow portrait crops',()=>{
    expect(coverRect(390,360,1600,900,'22% 50%')).toEqual({left:-55,top:0,width:640,height:360})
  })
  it('uses vertical position for wide crops',()=>{
    expect(coverRect(1000,400,1000,1000,'50% 50%')).toEqual({left:0,top:-300,width:1000,height:1000})
  })
  it('does not anchor before dimensions are available',()=>expect(coverRect(0,360,1600,900,'center')).toBeNull())
})
