// src/worker/index.ts

/**
 * Cloudflare Worker Edge Proxy
 * Provides server-side routing for dynamic project URLs and secure resolution of Firebase Storage media.
 */
export interface Env {
  FIREBASE_DB_URL: string;
  FIREBASE_DB_SECRET: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_STORAGE_AUTH_TOKEN?: string; 
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 0. Trusted Publishing API
    if (request.method === 'POST' && url.pathname.startsWith('/api/publish/')) {
      return handleTrustedPublish(request, env, url);
    }

    // 1. Media Proxy Routing
    if (url.pathname.startsWith('/media/')) {
      return handleMediaProxy(request, env, url);
    }

    // 2. Project Detail Shell Routing
    if (url.pathname.startsWith('/projects/') && url.pathname !== '/projects/') {
      // Intercept any deep link to /projects/example-slug
      // Rewrite it server-side to serve the static index.html shell from GitHub Pages
      const shellUrl = new URL('/projects/index.html', request.url);
      
      // Transparent subrequest to the static origin
      return fetch(shellUrl.toString(), request);
    }

    // 3. Passthrough for all other visitor assets (HTML, CSS, JS)
    return fetch(request);
  }
};

async function handleTrustedPublish(request: Request, env: Env, url: URL): Promise<Response> {
  const entity = url.pathname.replace('/api/publish/', '');
  if (!['profile', 'experience', 'projects'].includes(entity)) {
    return new Response('Invalid entity', { status: 400 });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const idToken = authHeader.replace('Bearer ', '');

  try {
    // 1. Fetch draft using the client's ID token. 
    // This securely verifies the token AND the admin authorization against Firebase Security Rules.
    const draftUrl = `${env.FIREBASE_DB_URL}/drafts/${entity}.json?auth=${idToken}`;
    const draftRes = await fetch(draftUrl);
    
    if (!draftRes.ok) {
      return new Response('Unauthorized or forbidden', { status: draftRes.status });
    }
    
    const draftData = await draftRes.json();
    if (!draftData) {
      return new Response('No draft found', { status: 404 });
    }

    // 2. Validate data structure based on entity type
    if (entity === 'profile') {
      if (typeof draftData.bio !== 'string' || !Array.isArray(draftData.focusAreas) || typeof draftData.avatarUrl !== 'string') {
        return new Response('Invalid profile schema', { status: 400 });
      }
    } else if (entity === 'experience' || entity === 'projects') {
      if (typeof draftData !== 'object' || Array.isArray(draftData)) {
        return new Response(`Invalid ${entity} schema`, { status: 400 });
      }
    }

    // 3. Atomically copy to /published using the Worker's privileged DB secret
    const publishUrl = `${env.FIREBASE_DB_URL}/published/${entity}.json?auth=${env.FIREBASE_DB_SECRET}`;
    const publishRes = await fetch(publishUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftData)
    });

    if (!publishRes.ok) {
      return new Response('Failed to write to published', { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    return new Response('Internal publishing error', { status: 500 });
  }
}

async function handleMediaProxy(request: Request, env: Env, url: URL): Promise<Response> {
  const identifier = url.pathname.replace('/media/', '');
  
  // Security Boundary: Strict sanitization to prevent path traversal or injection
  if (!/^[a-zA-Z0-9_.-]+$/.test(identifier)) {
    return new Response('Invalid media identifier', { status: 400 });
  }

  try {
    // Step 1: Secure Server-Side RTDB Resolution
    const rtdbUrl = `${env.FIREBASE_DB_URL}/mediaMap/${identifier}.json?auth=${env.FIREBASE_DB_SECRET}`;
    const mapRes = await fetch(rtdbUrl);
    
    if (!mapRes.ok) {
      return new Response('Media map resolution failed', { status: 502 });
    }
    
    const mediaNode = await mapRes.json();
    if (!mediaNode || !mediaNode.storagePath) {
      return new Response('Media not found', { status: 404 });
    }

    // Step 2: Secure Server-Side Storage Fetch
    const encodedPath = encodeURIComponent(mediaNode.storagePath);
    const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${env.FIREBASE_STORAGE_BUCKET}/o/${encodedPath}?alt=media`;
    
    const headers = new Headers();
    if (env.FIREBASE_STORAGE_AUTH_TOKEN) {
      headers.set('Authorization', `Bearer ${env.FIREBASE_STORAGE_AUTH_TOKEN}`);
    }

    const storageRes = await fetch(storageUrl, { headers });

    if (!storageRes.ok) {
      if (storageRes.status === 404) return new Response('Underlying media not found', { status: 404 });
      return new Response('Storage fetch failed', { status: 502 });
    }

    // Step 3: Stream binary response to visitor
    const responseHeaders = new Headers(storageRes.headers);
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    // Ensure no internal Firebase metadata headers leak to the visitor
    responseHeaders.delete('x-goog-hash');
    responseHeaders.delete('x-goog-generation');

    return new Response(storageRes.body, {
      status: 200,
      headers: responseHeaders
    });
    
  } catch (err) {
    return new Response('Internal Edge Proxy Error', { status: 500 });
  }
}
