# Phase 9 Media Uploads & Trusted Publishing

## Security Boundary Lockdown
As of Phase 9, the `/published` node in the Firebase Realtime Database is completely locked down for client writes via `database.rules.json`. The browser CMS (running in `/me`) no longer has structural permission to corrupt live data directly.

## Trusted Publishing Flow
1. **Trigger**: An admin clicks "Publish to Live" in one of the CMS modules (Profile, Experience, or Projects).
2. **Client Dispatch**: `CmsService.triggerServerPublish()` fetches the current admin's Firebase ID token using `auth.currentUser.getIdToken()`.
3. **Edge Proxy Intercept**: The request is sent to the Phase 6 Cloudflare Worker via `POST /api/publish/:entity`.
4. **Token Verification & Fetch**: The Worker uses the ID Token to attempt to read the draft data directly from `/drafts/:entity.json?auth=<token>`. If the token is invalid or unauthorized, Firebase denies the request, making this natively secure without requiring a custom JWT verifier.
5. **Validation**: The Worker performs a structural check on the retrieved draft to ensure schema integrity before it touches production data.
6. **Atomic Copy**: The Worker executes an atomic `PUT` to `/published/:entity.json?auth=<FIREBASE_DB_SECRET>`. The DB secret bypasses the write restriction, cementing the Worker as the sole trusted publisher.

## Media Upload Architecture
1. **Upload Form**: The CMS exposes a Media Manager at `/me/media`. 
2. **Storage Blob**: The selected file is uploaded to Firebase Storage (`firebase/storage`) dynamically into `uploads/:identifier-:timestamp`.
3. **Map Registry**: A JSON entry mapping the identifier to the absolute Storage path is written to the `/mediaMap/` RTDB node.
4. **MediaReference Abstraction**: The CMS form surfaces only a clean `MediaReference` (e.g. `/media/avatar`) back to the admin.
5. **Separation of Concerns**: This cleanly isolates Firebase Storage endpoints from visitor pages, preventing bucket IDs or raw tokens from bleeding into the visitor HTML, preserving the edge-proxy strategy established in Phase 6.

## `/me` Namespace enforcement
The active CMS workspace remains exclusively inside `/me`. There is zero configuration pointing to obsolete legacy routes.
