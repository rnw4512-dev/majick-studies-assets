# Council rendering lifecycle performance

Dependency discovered during Council certification: every dialogue paint replaced its Pixi host, and sync disposed/recreated the application even for the same host. Closing guided practice removed the dialog without disposing the active scene. Fixing this lifecycle precedes sustained final certification; no framework or second renderer is introduced.

The existing meeting owner retains the stage element across active dialogue paints. The scene owner updates participants, speaker highlight and the short speaking cue in place. Pending asynchronous setup uses the latest request data. Close disposes the scene, resize observer and visibility/motion listeners. Reduced motion and hidden-document stopping remain supported.

Measured with real Chromium, instrumenting the Pixi Application constructor: start plus one submitted dialogue response created **2 applications before, 1 after**. This is a construction-count improvement; no unmeasured startup/FPS claim is made. The regression failed before because the canvas was replaced. It now verifies stable canvas identity, unchanged construction count, speaker update and disposal on Close. A strengthened assertion also reproduced the old close-path leak before its focused fix.

Exact results: evidence/aetheria-2026-11-14/council-performance.json and council-lifecycle-*.log. Updated D756 UX checks pass at 390/820/1366. The established integration workflow includes the lifecycle regression. Production remains unchanged; full final-head acceptance still required.
