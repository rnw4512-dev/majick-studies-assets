export const rooms = [
  { id: 'home', name: 'Moonlit Collegium', glyph: '✦', description: 'Your gateway to the enchanted university.' },
  { id: 'study', name: 'Scholar’s Study Hall', glyph: '▤', description: 'Independent study and whole-course assessments.' },
  { id: 'learn', name: 'Learning Lab', glyph: '✧', description: 'Lessons, worked examples and guided practice.' },
  { id: 'trials', name: 'Trial Chamber', glyph: '◇', description: 'Reasoning challenges and misconception repair.' },
  { id: 'games', name: 'Game Realm', glyph: '✺', description: 'Interactive academic games and magical adventures.' },
  { id: 'sanctuary', name: 'Celestial Sanctuary', glyph: '☾', description: 'Guardian care, eggs and your personal magical space.' },
  { id: 'atelier', name: 'Enchanted Atelier', glyph: '⚗', description: 'Crafting, wardrobe and magical discoveries.' },
  { id: 'journal', name: 'Scholar’s Journal', glyph: '▧', description: 'Achievements, learning memories and goals.' },
  { id: 'council', name: 'Council Chamber', glyph: '♧', description: 'IEP collaboration and professional simulations.' },
  { id: 'observatory', name: 'Learning Observatory', glyph: '✷', description: 'Review progress and identify next learning steps.' },
] as const
export type RoomId = typeof rooms[number]['id']
export function roomFromHash(hash: string): RoomId {
  const id = hash.replace(/^#\/?/, '')
  return rooms.find(room => room.id === id)?.id ?? 'home'
}
export function roomLink(id: RoomId): string { return '#/' + id }
