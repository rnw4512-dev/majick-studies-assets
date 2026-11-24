# Source meshes

- human.blend: Base Human Models (Low Poly), Clint Bellanger, CC BY 3.0. https://opengameart.org/content/base-human-models-low-poly — https://creativecommons.org/licenses/by/3.0/
- potionBottlesOGA.blend: Potions, yd, CC0. https://opengameart.org/content/potions-6

Runtime derivatives are rendered transparent WebP portraits / bottles with studio materials and crops. No changes to source mesh geometry, no endorsement implied. Sources are outside the published app. Reproduction script: tools/asset-pipeline/render_models.py.

- rings.blend: Ring Set - Precious Metals, Clint Bellanger, CC BY 3.0. https://opengameart.org/content/ring-set-precious-metals — https://creativecommons.org/licenses/by/3.0/
  Derived static previews use studio lighting and converted materials. Source geometry unchanged; original reflection maps not used. No endorsement implied. Reproduce with tools/asset-pipeline/render_rings.py.

- gems.blend: Gems, Clint Bellanger, CC BY 3.0. https://opengameart.org/content/gems — https://creativecommons.org/licenses/by/3.0/
- crystals.blend: simple 3d crystals, rubberduck, CC0. https://opengameart.org/content/simple-3d-crystals-unwrapped-simple-texture
- plants/: Free HandPainted Plants 2, Nobiax / Yughues, CC0 1.0. https://opengameart.org/content/free-handpainted-plants-2. Original license retained alongside the selected OBJ/TGA pairs.

Gem/crystal meshes use studio material conversions; gems have muted material colors. Plant previews preserve original painted color/alpha textures. Geometry unchanged; no endorsement implied. Reproduction: tools/asset-pipeline/render_gems_crystals.py and render_plants.py, using Blender --disable-autoexec --python-exit-code 1.

- fantasy-rpg-models.blend: 50 Fantasy RPG Asset Models, rubberduck, CC0. https://opengameart.org/content/50-fantasy-rpg-asset-models
  Only candle_holder_2 is rendered for the reading-room still life. Antique brass derivative material, studio lighting, unchanged mesh. Reproduce with Blender --background --disable-autoexec fantasy-rpg-models.blend --python-exit-code 1 --python tools/asset-pipeline/render_rpg_prop.py -- OUTPUT; convert transparent PNG to WebP quality 90 using Pillow. Raw source is not published.
