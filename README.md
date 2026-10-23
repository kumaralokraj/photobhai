# PhotoBhai

A responsive, client-side image resizer and compressor built with React, Vite, Tailwind CSS v4 and the Canvas API.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

Push to GitHub and import the repo in Vercel. Framework: Vite; build command: `npm run build`; output directory: `dist`.

## Notes

- JPG, PNG and WebP inputs, up to 25 MB.
- Dimensions 1–10,000 px, maximum 40 MP.
- Compression target is best effort for JPG/WebP, not an exact size guarantee.
- PNG quality slider and target KB are not supported by the browser Canvas encoder.
- Passport preset approximates 35 × 45 mm at 300 DPI; verify official photo requirements and print settings before use.
- Browser canvas can hit memory limits on some devices with very large images.
- No images are sent to a server.
