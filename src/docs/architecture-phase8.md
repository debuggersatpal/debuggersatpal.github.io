# Phase 8 CMS Content Editors Architecture

## CMS Editor Architecture
The CMS explicitly avoids heavy UI frameworks like React/Vue, preserving the ultra-lightweight Astro + Vanilla JS footprint. Forms are rendered as HTML `<template>` structures and hydrated at runtime via the dedicated `CmsService`.

## Route Namespace
- `/me` — Dashboard
- `/me/login` — Authentication
- `/me/profile` — Profile Editor
- `/me/experience` — Experience Editor
- `/me/projects` — Projects Editor

**CRITICAL RULE:** `/admin` is entirely deprecated. All references must stick strictly to `/me`.

## Draft Data Flow
When an admin saves a form in any of the modules, the payload strictly updates the `/drafts/*` nodes in the Firebase Realtime Database. The visitor UI, reading from `/published/*`, remains completely unaware of these changes.

## Authentication Boundary
Authentication is securely guarded by `AdminLayout.astro`. Direct, unauthenticated visits to `/me/*` trigger a redirect loop to `/me/login`. Authenticated visits to `/me/login` push the user back into `/me`.

## Publishing Boundary
The Phase 7 security vulnerability regarding direct client-side publishing has been mitigated. The `Publish` button in the UI now invokes `CmsService.triggerServerPublish()`. Currently, this method intentionally throws an error identifying that a trusted Server/Edge environment (like the Cloudflare Worker) must perform the final atomic copy from `/drafts` to `/published`.

## Firebase SDK Isolation
All Firebase Database and Auth dependencies are restricted strictly to the chunk generated for the `/me` directory routes. Visitor paths (`/` and `/projects/*`) rely purely on standard browser `fetch`.

## Media Architecture
The CMS inputs respect the `MediaReference` contract (e.g., `/media/avatar.png`). Raw Firebase Storage URLs are not exposed in the forms. The upload mechanism for binary files directly into Firebase Storage and generating the `mediaMap` JSON is intentionally left for the next phase, preserving this phase's focus strictly on RTDB string schemas.
