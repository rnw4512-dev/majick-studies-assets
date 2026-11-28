import type { RoomId } from '../core/router'
export const roomIcons: Record<RoomId,string> = {
  "home": "skill-10.webp",
  "study": "skill-03.webp",
  "learn": "skill-15.webp",
  "trials": "skill-07.webp",
  "games": "skill-04.webp",
  "sanctuary": "skill-06.webp",
  "atelier": "skill-14.webp",
  "journal": "skill-16.webp",
  "council": "skill-18.webp",
  "observatory": "skill-08.webp"
}
export const roomIconUrl = (id: RoomId) => import.meta.env.BASE_URL + 'assets/room-icons/' + roomIcons[id]
