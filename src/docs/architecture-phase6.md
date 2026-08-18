# Phase 6 Edge Proxy Architecture

## Selected Edge Provider
**Cloudflare Workers** is the intended edge provider. 
- **Reasoning**: It can be layered transparently via DNS over the existing GitHub Pages deployment. It intercepts requests globally at the edge without requiring any structural changes to the Astro build or GitHub Actions. It supports standard Fetch APIs, robust caching, and environment secrets.

## Request Flow
1. Visitor requests `https://[domain]/projects/my-project`.
2. Cloudflare Worker intercepts the request.
3. The Worker detects `/projects/:slug` and transparently proxies a fetch to the origin (`/projects/index.html`), returning the static Astro shell.
4. The client's JS reads the `:slug` from the URL, calls Firebase RTDB, and hydrates the DOM.
5. If the visitor requests `https://[domain]/media/avatar.png`, the Worker intercepts the request and handles media resolution natively, masking all Firebase interactions.

## Media Proxy & Firebase Access
The Media Proxy completely obfuscates Firebase from the visitor.
1. Validates the `identifier` against a strict regex to prevent traversal.
2. Authenticates with Firebase RTDB using a server-side secret (`FIREBASE_DB_SECRET`) to map the clean `identifier` to a `storagePath`.
3. Fetches the binary from the Firebase Storage REST API, injecting `FIREBASE_STORAGE_AUTH_TOKEN` as a Bearer token if rules require it.
4. Streams the binary payload directly back to the visitor, scrubbing all internal Google/Firebase headers (e.g., `x-goog-hash`).

## Security Boundary & Secrets
- **No secrets in browser**: The visitor bundle remains completely ignorant of Firebase. It only sees clean URLs.
- **Worker Secrets**: The Cloudflare Worker relies on encrypted environment variables injected during deployment (e.g., via `wrangler secret put`). These are never tracked in Git or exposed to the public bundle.

## Caching Behavior
- **Media**: The proxy attaches a `Cache-Control: public, max-age=31536000, immutable` header, shifting caching onto the edge CDN and browser.
- **Project Shells**: Inherit default GitHub Pages caching.
- **JSON Data**: Unchanged (Client-side SWR using `localStorage`).

## Error Handling
- Invalid identifiers trigger an immediate 400.
- Missing `/mediaMap/` entries trigger a 404.
- If Firebase Storage returns a 404, it proxies a 404.
- Network/resolution failures trigger a 502/500 without leaking stack traces.

## SEO Limitations
The Cloudflare Worker intercepts `/projects/:slug` and returns the static shell. Because the real project data is still injected by vanilla JS in the browser, crawlers that do not execute JavaScript will only index the static shell ("Loading project details..."). Server-Side Rendering (SSR) for the project content is NOT provided by this edge rewrite.
