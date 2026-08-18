# Phase 5 Public Data Integration

## Visitor Data Flow
The visitor application implements a framework-free vanilla JS hydration strategy:
1. **Initial Shell**: Astro statically builds the `VisitorLayout` shell containing loading state UI elements (`<p id="projects-loading">`).
2. **Template Components**: The UI component structures (`ProjectCard.astro`, `ExperienceItem.astro`) are statically rendered inside hidden `<template>` elements. This preserves their CSS footprints and exact DOM structure without requiring client-side JS component libraries.
3. **Hydration Script**: A vanilla JS script requests the data using `VisitorDataService`. When data is received, the script clones the `<template>` elements, injects the real data into the DOM nodes, and appends them to their respective containers while hiding the loading states.

## RTDB Published Endpoints
The following endpoints are consumed by the public application:
- `published/profile.json`
- `published/projects/summary.json`
- `published/experience.json`

## Domain Mapping Boundary
The `VisitorDataService` abstracts the raw `public-fetch.ts` client. It uses the existing `data-mapper.ts` to convert the unordered Firebase RTDB dictionaries into strictly typed and sorted domain arrays before returning the payload to the UI hydration script.

## Loading/Error/Empty States
State changes are managed natively:
- **Loading**: Shown by default in the statically generated HTML.
- **Error**: If the API call fails and no cache exists, the loading state is hidden, and the error element's `display` is toggled.
- **Empty**: If the API returns a success but an empty payload (`[]`), the empty state element is toggled.

## SWR Behavior
The SWR mechanism established in Phase 4 is integrated effortlessly via the `onUpdate` callback pattern in `VisitorDataService`. 
1. If valid cache exists, `VisitorDataService` instantly yields `success` and renders the payload.
2. If the cache is stale, it yields `success` instantly (rendering stale data), but securely fires a background revalidation.
3. If the background revalidation completes and the data differs from the cache, the `onUpdate` callback triggers the UI render function again, seamlessly updating the DOM without user intervention.

## Firebase SDK Exclusion
The public bundle remains completely free of any Firebase dependencies. All data fetching utilizes the native browser `fetch` API.

## Media Boundary
Media URLs (e.g., project thumbnails) are injected into the DOM as clean paths (e.g., `/media/project-1.png`). Firebase Storage download URLs are strictly excluded from the client. The Edge Proxy (to be implemented in future phases) will intercept these `/media/*` requests natively at the edge network.

## Current SEO Limitation
Because Astro is deployed as a purely static site on GitHub Pages, the actual content for `ProjectCard` and `ExperienceItem` is injected at runtime. Search engine crawlers that do not execute JavaScript will only index the loading states. Complete server-side rendering (SSR) is not possible on static GitHub Pages without an Edge computing layer or build-time data integration.
