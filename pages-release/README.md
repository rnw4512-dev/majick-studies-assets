# Majick Studies — Permanent GitHub Pages App

The deployment workflow is already installed in this repository.

## Upload exactly one file

Upload the current site package here and name it exactly:

`pages-release/majick-pages-site.zip`

Current package: **Majick Studies V3.3.8 — Canon Guardians + Current Progress Restored**

### GitHub steps
1. Open this repository and enter the **pages-release** folder.
2. Click **Add file → Upload files**.
3. Upload the supplied `Majick_Studies_GitHub_Pages_SITE_V3_3_8.zip`.
4. Before committing, set the repository filename to **majick-pages-site.zip**.
5. Commit directly to **main**.
6. Open **Settings → Pages** and set **Source** to **GitHub Actions** if it is not already selected.
7. Open **Actions** and wait for **Deploy Majick Studies to GitHub Pages** to finish.

Permanent app address after deployment:

https://rnw4512-dev.github.io/majick-studies-assets/

## Future updates

The URL does not change. Future Majick Studies releases replace only `pages-release/majick-pages-site.zip`. The workflow publishes the replacement at the same GitHub Pages address.

Because the web origin remains the same, normal browser progress stays with the same app between code updates. The current build also includes the Sep 19 emergency recovery snapshot for the initial move from localhost.
