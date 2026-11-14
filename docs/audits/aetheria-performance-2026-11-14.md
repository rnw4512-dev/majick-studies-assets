# Measured performance and cleanup

Measurements use real Chromium on the same cloud computer. Startup uses three sequential cold synthetic contexts per version at 1366×900, waiting for the same main Commons/Guardian readiness condition. These are indicative local measurements, not full-room startup or a guaranteed speed improvement. No browser runtime errors were observed.

| Measurement | Fetched main | Final candidate |
| --- | ---: | ---: |
| Median main-room readiness | 3,040 ms | 3,397 ms |
| Median CDP event listener count | 902 | 863 |
| Median JS heap used | 12,187,456 bytes | 12,536,124 bytes |
| Root external scripts | 93 | 94 |
| Root external script bytes | 2,521,727 | 2,577,346 |
| Root scripts, individually gzipped | 734,867 bytes | 751,564 bytes |

The six-script consolidation alone reduced total JavaScript by 24,992 bytes (main versus migration commit 8d31d10). Finished Council/Observatory/controller/journal features add code, so the final candidate has a larger payload and modestly slower measured cold readiness. This is reported as a feature cost, not hidden or described as a startup win. Event listener count decreased; heap results vary with asynchronous initialization.

The targeted Council lifecycle improvement is separately causal: startup plus one dialogue response creates **one Pixi application instead of two**, keeps the canvas, and explicitly releases the scene/listeners on Close. Existing Sanctuary still has one app-owned ticker; no artificial extra ticker or texture duplication was added. All protected movement artwork is unchanged.

Raw data: evidence/aetheria-2026-11-14/release-performance.json, static-source-performance.json and council-performance.json. Reproduction tool: tools/aetheria-performance.cjs. Original local measurement command: `node /workspace/work/aetheria/measure-release.cjs`; portable equivalent accepts baseline path, candidate path, baseline URL, candidate URL and output JSON path. Serve both source trees separately; never point storage tests at real learner contexts.

No unverified CSS/dependency deletion or unmeasured FPS/texture-memory improvement is claimed. Remaining historical inline code and inactive CSS are retained pending specific ownership/reachability proof.
