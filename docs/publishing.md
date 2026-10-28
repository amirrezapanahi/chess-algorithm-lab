# Publishing to GitHub Pages

The repository includes `.github/workflows/deploy.yml`. It verifies source before uploading `dist/` as a GitHub Pages artifact.

## Repository project page

For a repository named `chess-algorithm-lab`, Vite automatically builds with `/chess-algorithm-lab/` while GitHub Actions is running. This keeps JavaScript, CSS, Worker, source-map, and WASM URLs under the repository subpath.

## User or organization page

Repositories whose names end in `.github.io` automatically use `/`.

## Custom base path

Set `VITE_BASE_PATH` in the workflow environment only when the automatic rule does not match the host. It must begin and end with `/`.

## Verification

Run the same production build locally:

```bash
npm ci
npm run build
npm run preview
```

In browser developer tools, confirm that the module Worker and `.wasm` request return HTTP 200. Run a valid solution, a syntax error, and an infinite loop before publishing a major runtime change.
