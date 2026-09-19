# Majick Studies — Permanent GitHub Pages App

This folder is the deployment source for the permanent Majick Studies web app.

## Current release
Majick Studies V3.3.8 — Canon Guardians + Progress Restored

The release is split into four ZIP parts so each file stays below GitHub's browser-upload limit. The deployment workflow unpacks all four parts into one site and publishes the result to GitHub Pages.

## One-time setup
1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Return to this `pages-release` folder.
5. Use **Add file → Upload files** and upload all four `majick-pages-part-XX.zip` files together.
6. Commit directly to `main`.

After the workflow finishes, the permanent site should be:

https://rnw4512-dev.github.io/majick-studies-assets/

## Progress behavior
The site uses one stable GitHub Pages origin, so browser storage remains attached to the same app across future code updates. V3.3.8 also carries the Sep 19 recovery snapshot for the first transition from localhost to GitHub Pages.

Normal future updates should modify the same deployed app rather than changing the public URL.
