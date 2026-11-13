# Council Chamber visual asset manifest

Updated: 2026-11-13

## Art direction
Original, consistent school-curriculum illustration; Aetheria plum, forest green, parchment, and muted gold. Figures remain seated/static. Only current speaker receives a visual indicator. These designs do not copy McGraw Hill artwork or character identities.

## Assets used in the live source
| Repository path | Intended role | Creator/source | Reuse status | Attribution |
| --- | --- | --- | --- | --- |
| `assets/iep-council/parent.svg` | Parent or guardian portrait | Original vector authored for Aetheria | Original project artwork, not third-party stock | No external creator |
| `assets/iep-council/student.svg` | Student portrait | Original vector authored for Aetheria | Original project artwork, not third-party stock | No external creator |
| `assets/iep-council/lea.svg` | School representative portrait | Original vector authored for Aetheria | Original project artwork, not third-party stock | No external creator |
| `assets/iep-council/teacher.svg` | General education teacher portrait | Original vector authored for Aetheria | Original project artwork, not third-party stock | No external creator |
| `iep-meeting-pixi-scene.js` | Conference furniture, window, moon, papers, folders, and coffee cups | Original PixiJS v8 Graphics shapes | Original project code/geometry | No external creator |

## Stock sourcing and rights rules
Approved candidates for future additions may come from Pexels, Unsplash, Pixabay, Openverse, Wikimedia Commons or OpenMoji, but only after recording a specific asset URL, creator, license, attribution requirement, and whether use in this public GitHub Pages app is allowed. No such external asset has been added or claimed as licensed by this update.

Use stock items as source references or props only when they match the existing illustration family. Do not combine identifiable real-student photos with a fictional IEP student. Do not copy proprietary educational publisher characters or pages.

## Fallback and accessibility
- Dialogue, buttons, timer, agenda and IEP reference remain real HTML, not inaccessible canvas labels.
- A speaker is identified by both visible text and visual highlight.
- If PixiJS fails, the scene uses the same SVG illustrations in a static HTML fallback.
- The image files contain no student PII or actual learner records.
