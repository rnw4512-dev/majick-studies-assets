import { describe, expect, it } from 'vitest'
import { rooms, roomFromHash, roomLink } from '../src/core/router'
describe('room routing', () => {
  it('round trips every unique room', () => {
    expect(new Set(rooms.map(room => room.id)).size).toBe(rooms.length)
    for (const room of rooms) expect(roomFromHash(roomLink(room.id))).toBe(room.id)
  })
  it('safely handles unknown routes', () => {
    for (const hash of ['', '#unknown', '#/missing', '#/../current-site']) expect(roomFromHash(hash)).toBe('home')
  })
})
