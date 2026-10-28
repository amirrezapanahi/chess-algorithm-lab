# Development and publishing

## Quality checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

## GitHub Pages

Enable **Settings → Pages → GitHub Actions**, then push to `main`. The deployment workflow derives the correct Vite repository subpath automatically.

## Publish this wiki

1. Enable **Settings → General → Features → Wikis**.
2. Create the first Home page once in GitHub so the `.wiki.git` repository exists.
3. Open **Actions → Publish GitHub Wiki → Run workflow**.

The manual workflow copies the Markdown files from `wiki/` to the repository’s real GitHub Wiki. Keeping the source pages in the main repository makes translations reviewable through pull requests.
