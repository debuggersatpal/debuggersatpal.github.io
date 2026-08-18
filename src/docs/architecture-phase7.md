# Phase 7 CMS Architecture & Authentication

## Admin/Visitor Boundary
The architecture completely bifurcates the application into two distinct contexts:
1. **Visitor Bundle (`/` and `/projects/*`)**: Hydrates using zero-dependency vanilla JS against unauthenticated `.json` REST endpoints.
2. **Admin Bundle (`/me/*`)**: Consumes the official Firebase JS SDK (`firebase/auth`, `firebase/database`). Thanks to Astro's page-based routing and Vite's chunking, the heavy Firebase SDK is only bundled for the `/me` routes.

## Authentication Flow
Access to the CMS is protected by Firebase Authentication (Email/Password). 
- **Login Screen**: Uses `signInWithEmailAndPassword` on `/me/login`. If already authenticated, users are redirected to `/me`.
- **Layout Guard**: `AdminLayout.astro` enforces an `onAuthStateChanged` listener. Unauthenticated users navigating to `/me` are violently redirected back to `/me/login`.

## RTDB Security Rules & Security Findings
The database enforces strict, structural separation of concerns via `database.rules.json`:
- `/published`: Public read access for the visitor SWR client. Write access restricted to the hardcoded `admins` group.
- `/drafts` & `/versions` & `/mediaMap`: Read and write access strictly locked to the `admins` group. No public exposure.

**SECURITY WEAKNESS IDENTIFIED: Client-Side Publishing**
Currently, the `/me` CMS dashboard executes the "Publish" action directly from the browser by writing to `/published/*`. While protected by the `admins` node rule (preventing unauthenticated writes), this architecture trusts the client bundle to dictate the exact structural payload of live production data. If a trusted admin's session were hijacked, or if the client had a bug, invalid data could bypass draft validations and corrupt the live state. In a fully mature architecture, the client should only write to `/drafts`, and the "Publish" action should invoke a trusted server/Cloudflare Worker boundary that atomically validates and copies the draft to `/published`.

## Environment Variable Boundaries
- **Public Variables (`PUBLIC_FIREBASE_*`)**: Contain standard Firebase configuration identifiers (Project ID, API Key). These are mathematically safe to expose to the client because Firebase Web API keys are configuration endpoints, not authorization secrets. Actual security relies exclusively on Firebase Authentication and Database Rules.
- **Server/Edge Variables (`FIREBASE_DB_SECRET`)**: Used *exclusively* by the Cloudflare Worker in Phase 6. Never exposed to Astro client scripts or `import.meta.env.PUBLIC_*`.

## Media Workflow
1. The admin uploads a file to Firebase Storage.
2. The admin writes a mapping to `/mediaMap/[identifier]` pointing to the raw Storage path.
3. The CMS saves the clean `/media/[identifier]` string into the `/drafts/` content.
4. The Edge Proxy dynamically resolves this identifier at runtime.
*Result: Firebase Storage URLs never enter the rich-text content or visitor payloads.*

## Future Extensibility
The foundation built here (`AdminLayout`, authentication guards, draft/publish separation) is structurally ready to support complex React/Svelte form components inside the Astro islands if the CMS complexity warrants it later, without ever bloating the visitor UI.
