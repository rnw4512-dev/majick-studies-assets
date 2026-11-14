# Guardian controller reconciliation

Extracted the non-destructive controller, manifest contract and tests from PR #266. The current Pixi Sanctuary retains canonical identities, evolution-stage mapping, geometry validation, movement, care, furniture and its sole existing ticker. Motion/playback now delegates to the controller; replacement/removal stops the old controller before sprite destruction without destroying shared cached textures.

Only explicitly approved complete four-frame sets may supersede existing walking pairs. The supplied PR's walking manifest is empty, so approved two-frame walking and static fallback art remain active. No frames are invented and no unrelated portraits are substituted. The PR's separate static portrait additions were deliberately excluded: they are not required for motion reconciliation and must not replace approved current art implicitly.

Six controller tests pass, including all stages, four-frame validation, missing art, fallback, pause and disposal. The full real-browser Sanctuary suite passes: eleven identities and duplicate Guardians, all evolution stages, existing walking pairs, hit areas, care, furniture store/place/drag/reload and Phaser fallback. Raw output is under evidence/aetheria-2026-11-14/guardian-*.log. All 33 protected motion PNGs remain unchanged.

Controller capability is integrated; universal four-frame animation remains blocked by absent approved walking sets. This is an explicit asset limitation, not a renderer failure. Production unchanged; no merge or deployment.
