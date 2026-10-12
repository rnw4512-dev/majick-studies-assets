# Enchanted Atelier avatar layers

These assets are uploaded and referenced by `enchanted-atelier.js`, the shared renderer for the Atelier and Scholar Companion. Do not restore the original ZIP over repaired layers: the original Afro filename contains accessories and hands, and the original Braids filename contains curls.

## Standing customization

The renderer uses complete warm/deep `layer-body-*-v2.webp` bodies, six fitted hairstyles (Locs v2, Braids v2, Twists v2, Afro v2, Curls v1, Waves v1), four gowns (Plum, Midnight, Emerald v1, Silver v1), and Plum boots. Exact layer transforms live in the renderer. Source art stays intact; only the covered bare feet are clipped when boots are equipped. Both skin tones and all 24 hair/gown pairs were visually checked.

## Activity collection

`activity-plum-locs-warm-{sleeping,playing,studying,walking,talking,companion}-v1.webp` are six complete illustrations of one matching look: Warm brown, Locs, Plum Scholar. They are static images, not animation frames or equippable layers. The Activity Portraits tab previews each image and remembers its selected moment in the existing Atelier save. Sleeping is landscape; the others are portrait.

The Scholar Companion uses studying, playing, and Velora portraits only when this matching skin/hair/gown is equipped. All other looks continue to use their own fitted standing layers. Activity images must never silently recolor or replace another saved look. No new XP, mastery, Guardian, or save engine is introduced.

## Generation brief

Created with the built-in image generation tool. Hairstyle edit prompts preserved the canvas center, crown, forehead hairline, clear transparent face opening, and realistic fantasy-game texture of the fitted braids reference. Distinct styles: short rounded type 4C Afro, defined shoulder-length curls, and glossy shoulder-length waves. Silver gown prompt preserved the Plum gown's silhouette and replaced its palette with moonlit silver silk, charcoal shadows, and celestial silver embroidery. Generated silhouettes were fitted in CSS and checked against both body bases.

Activity prompts used a rendered Warm brown / Locs / Plum Scholar as the identity reference. They preserved her face, complexion, locs, gown, boots, adult proportions, and connected anatomy while changing the action: asleep on a velvet chaise; kneeling with a rune ball; seated reading and writing at a desk; walking mid-stride; gesturing in conversation; and seated petting Velora. The Velora asset was an additional identity reference for the companion image. All outputs retain their alpha and were converted to WebP without retouching the source illustration.
