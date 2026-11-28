export const rooms = [
  { id: 'home', name: 'Moonlit Collegium', description: 'Your gateway to the enchanted university.' },
  { id: 'study', name: 'Scholar’s Study Hall', description: 'Independent study and whole-course assessments.' },
  { id: 'learn', name: 'Learning Lab', description: 'Lessons, worked examples and guided practice.' },
  { id: 'trials', name: 'Trial Chamber', description: 'Reasoning challenges and misconception repair.' },
  { id: 'games', name: 'Game Realm', description: 'Interactive academic games and magical adventures.' },
  { id: 'sanctuary', name: 'Celestial Sanctuary', description: 'Guardian care, eggs and your personal magical space.' },
  { id: 'atelier', name: 'Enchanted Atelier', description: 'Crafting, wardrobe and magical discoveries.' },
  { id: 'journal', name: 'Scholar’s Journal', description: 'Achievements, learning memories and goals.' },
  { id: 'council', name: 'Council Chamber', description: 'IEP collaboration and professional simulations.' },
  { id: 'observatory', name: 'Learning Observatory', description: 'Review progress and identify next learning steps.' },
] as const
export type RoomId = typeof rooms[number]['id']
export function roomFromHash(hash: string): RoomId {
  const id = hash.replace(/^#\/?/, '')
  return rooms.find(room => room.id === id)?.id ?? 'home'
}
export function roomLink(id: RoomId): string { return '#/' + id }
