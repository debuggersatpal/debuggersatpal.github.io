# Phase 4 Visitor Data Architecture

## Domain Models
Centralized in `src/data/types.ts`. Provides strict typings for all core entities (Profile, Experience, Education, Projects, Capabilities, Contact) shared across the application.

## Published-Data Contract
The visitor application maps to exact Firebase Realtime Database structures.
- Firebase stores collections as dictionaries (`Record<string, Entity>`) for fast lookup and updates.
- The UI requires ordered arrays.
- **Contract Boundary**: `src/lib/data-mapper.ts` transforms raw dictionary structures to strictly typed arrays before they touch any UI component.

## Visitor Fetch Boundary
Defined in `src/lib/public-fetch.ts`. 
- Completely independent of the Firebase JS SDK.
- Uses native `fetch()` against the RTDB REST API (`[DB_URL]/published/....json`).
- Lightweight and prevents SDK bloat in the public bundle.

## Media-Reference Boundary
The domain types use a specific alias `MediaReference = string` enforcing clean paths (e.g. `/media/avatar.png`) at the content level. Raw Firebase Storage URLs are explicitly excluded from the visitor content contract. Actual security and URL protection are provided entirely by the edge-proxy architecture, not by TypeScript.

## Project-Detail Contract
The visitor-side routing for `/projects/:slug` relies on extracting the `:slug` from the URL, which perfectly maps to the database path: `/published/projects/details/:slug.json`. 

## Cache Interface
Implemented as Stale-While-Revalidate (SWR) in `public-fetch.ts`.
- Uses `localStorage` to persist data between sessions.
- **TTL Configuration**: 5 minutes (`ttlMs: 300000`).
- **SWR Behavior**: If the cache is stale, the application will render the stale data immediately for the visitor, while firing a background revalidation request to fetch the latest published data. If the server data has changed, a callback can optionally update the UI with the fresh data.

## Dependency Boundary
No imports from `firebase/*` exist in `src/lib/`, `src/components/visitor/`, or `src/data/`. This guarantees a lightweight static Astro shell.
