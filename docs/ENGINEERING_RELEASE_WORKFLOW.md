# Canonical release workflow

`main` is the integration branch. `current-site/` is the only application source.

## Before committing an application change

1. Review the actual diff and source provenance. Course content belongs in `course-packs/` or `course-content/`, not Guardian or reward code. Existing save, mastery and reward owners remain authoritative.
2. Run `python pages-release/current/review_manifest.py`. Modified, missing, symlinked and **unregistered** files all reject the release; the command never approves automatically.
3. After review, calculate the exact SHA-256 of each approved file and explicitly register it:

   ```sh
   sha256sum current-site/path/to/reviewed-file
   python pages-release/current/review_manifest.py --approve path/to/reviewed-file=EXACT_SHA256
   ```

   Multiple explicit `--approve` arguments are supported. Invalid approvals reject the entire batch before changing the manifest. Do not run a catch-all rehash, remove the audit, or approve unknown provenance.
4. Record why the paths were approved and the applicable verification. Licensed artwork also belongs in `assets/licensed/asset-manifest.json`, with authors, source links, licenses, transformations and output digests.
5. Run `python pages-release/current/validate_release.py current-site work/certified`. This shared read-only gate audits every file, runs canonical Node regressions and manifest negative tests, then builds with syntax and URL verification.
6. Run the relevant browser suites, including startup/learning, room navigation, D669 sources, approved assets, room interactions and the existing Council/Sanctuary suites at 390/820/1366px. Never weaken a failing assertion to manufacture a pass.

## Publishing

Both integration and publishing invoke the same validator. The legacy manual certification workflow retains its extra checks and delegates publishing to `publish-aetheria.yml`; it does not publish a competing artifact layout.

Only a certified artifact is uploaded. The publisher cancels superseded runs, checks that `GITHUB_SHA` is still the current main head immediately before deployment, and publishes the canonical `/current-site/` route. Release keys cover the source manifest and build implementation. Static media and documents are cache-versioned; dynamically assembled approved media and reference requests use the same release key.

Production verification compares `deployment.json`, `release.json` and the stamped entry point with the exact approved commit. It then exercises live learning, Journal, navigation, D669 content, asset controls and educational-game interactions. HTTP 200 alone does not certify a release.

## Recovery

- For a manifest failure, inspect the named paths and their diffs. Register only reviewed bytes. Restore or separately review an accidentally changed file; never disable the gate.
- For a UI regression, reproduce it and repair the feature's existing owner. Preserve learner localStorage, backups, notes, independent evidence and reward receipts.
- Revert the specific faulty code commit, recalculate only the deliberately reverted source digests, and rerun the complete gates. Use the existing certified publisher and independently verify its public commit. Never restore a whole old repository or reset learner data as a visual fix.
- Blender source files remain outside the deployed application under `asset-sources/approved/`. Render with saved-script execution disabled and a nonzero Python error exit code. Ship only lightweight reviewed derivatives.
