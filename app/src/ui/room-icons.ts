import type { RoomId } from '../core/router'
export const roomIcons: Record<RoomId,string> = {
  "home": "house.png",
  "study": "book.png",
  "learn": "skill-03.webp",
  "trials": "skill-17.webp",
  "games": "cluster-1.webp",
  "sanctuary": "heart.png",
  "atelier": "purple.webp",
  "journal": "skill-08.webp",
  "council": "briefcase.png",
  "observatory": "star.png"
}
export const roomIconUrl = (id: RoomId) => import.meta.env.BASE_URL + 'assets/room-icons/' + roomIcons[id]
