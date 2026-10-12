# Enchanted Atelier V2 — image asset upload destination

This directory is reserved for the approved Atelier V2 artwork pack.

The generated ZIP is staged separately for upload and **its binary PNG/WebP assets have NOT been committed here yet**.

When uploading, preserve these folders:
- references/
- wardrobe/
- accessories/
- guardians/

Each source PNG and corresponding optimized WebP must be placed at the matching path from `majick-atelier-v2-assets.zip`, then update `current-site/source-manifest.json` with each newly committed file's SHA-256.

The reference sheets are composite artwork, **not** rigged avatar layers or animation frames. Do not use them as directly equippable assets. Existing fitted avatar and Guardian renderers remain canonical until new individual sprite files are prepared, aligned, and validated.

Never replace `current-site/assets/atelier/avatars/` or existing Guardian assets with these references.
