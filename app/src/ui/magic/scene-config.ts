import type { RoomId } from '../../core/router'
export type SceneId = RoomId | 'utility'
type Scene = { file: string; compact?: string; focal: string; mobileFocal: string }
const painted: Partial<Record<SceneId, Scene>> = {
  home: {file:'fairy-hatch-forest.webp',focal:'center',mobileFocal:'22% center'},
  learn: {file:'ancient-study-library-v1.webp',compact:'ancient-study-library-v1-820.webp',focal:'center',mobileFocal:'48% center'},
  observatory: {file:'game-observatory-v1.webp',compact:'game-observatory-v1-820.webp',focal:'center',mobileFocal:'66% center'},
  study: {file:'learn-classroom-v2.webp',compact:'learn-classroom-v2-820.webp',focal:'center',mobileFocal:'50% center'},
}
export function sceneFor(room: SceneId): Scene {
  return painted[room] ?? {file:room+'.svg',focal:'center',mobileFocal:'center'}
}
export const sceneUrl = (file: string) => import.meta.env.BASE_URL + 'assets/scenes/' + file
