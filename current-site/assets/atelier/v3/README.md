# Aetheria — female Scholar fitting prototype

Real modular GLB assets based on the supplied Quaternius Universal Base Characters Standard CC0 model. All custom modules preserve the original 65 joint names, order and inverse bind matrices.

## Inspect
Open `scholar-preview.glb` in Blender (File > Import > glTF 2.0) or another trusted GLB viewer. This is the assembled locs, amethyst dress and onyx boots rest-pose prototype. `fitting-preview.png` is a software render of the actual mesh, not final art or a separate concept. Import the base and individual modules for further fitting. `skin-light.png` is an alternative source texture, not a separate body.

## Asset policy
Only one base and one selected module per slot should be loaded in Atelier. Use the existing Scholar identity and wardrobe save owner. Store selected IDs and colors, never model binary data in save files. Do not ship `scholar-preview.glb` in addition to modular production assets; it duplicates the base. Keep learning rooms on lightweight portraits. Do not replace existing avatar renderer until feature-gated acceptance tests pass.

## Integration handoff
`manifest.json` is a development inventory, not a production approval. Use a lazily imported 3D renderer (e.g. Three.js plus GLTFLoader) only inside the existing Atelier. `wardrobe-loader.mjs` provides a prototype module loader with explicit rig matching, shared skeleton binding, slot replacement and disposal. It accepts a GLTFLoader instance; it does not import or bundle Three.js. It has not been run in a browser. Load the base and all three default slots before revealing the preview. Add a neutral idle animation and test every combination before exposing controls.

## Required before deployment
1. Refine silhouette, scalp transitions, root placement and braid/loc shapes. The visible cap and clipping at belt, cuffs and torso need artist adjustment.
2. Add garment-specific body occlusion masks and check seams, foot shape, shoe soles and robe layering. Do not ship visible skin intersections.
3. Test standing, walking, sitting, turning head, and arm movement; improve skirt skin weights and optionally add hair bones/physics. Existing rigid head-weight hair and approximate skirt weights are starting points, not certified animation results.
4. Test all skin tones and add suitable neutral/idle animations; avoid promising face/body morphs since source has none.
5. Verify actual WebGL renderer, model swapping, disposal, fallback on context loss, reduced motion, touch/keyboard operation, 390/820/1366px layouts and startup network bytes.
6. Release only after functional gates pass; do not change XP, mastery, Guardian state, or course saves.

## Validation
`validation.json` records binary structure, joint order, original bind matrices, valid indices, finite coordinates, normalized weights and embedded texture decoding. These are structural checks, not a visual/animation certification.

Original model and textures: Quaternius, CC0 1.0. See LICENSE.txt.
