# Final Portfolio UI Refinement --- Fix Only, No Redesign

## Reference

Use the existing `portfolio-reference.png` as the visual reference.

The current implementation is already close to the reference.

This task is **only a final refinement/fix pass**.

Do not redesign the portfolio. Do not change the architecture. Do not
change content or data.

------------------------------------------------------------------------

## IMPORTANT: Preserve Existing Work

Do NOT change:

-   Single-page portfolio architecture
-   Existing section order
-   Existing responsive layout
-   Existing typography system
-   Existing project data
-   Existing Firebase/CMS functionality
-   Existing theme persistence/hybrid theme system
-   Existing project cards
-   Existing experience timeline
-   Existing skills structure
-   Existing sidebar/profile structure except the resume button polish
-   Existing animation system except where required for the fixes below

The goal is to fix the listed issues and bring the UI slightly closer to
the reference.

------------------------------------------------------------------------

# 1. Header Navigation --- Fix Active State

There is currently a functional bug:

The `Home` navigation item remains active even after navigating to:

-   `#about`
-   `#projects`
-   `#contact`

The active navigation state must follow the currently visible section.

Required behavior:

  Current section   Active nav
  ----------------- ------------
  Top / Home        Home
  About             About
  Projects          Projects
  Contact           Contact

Use the existing section IDs:

-   `#about`
-   `#projects`
-   `#contact`

## Active state must work when:

1.  Clicking a navigation item.
2.  Scrolling manually.
3.  Clicking an internal hash link.
4.  Loading the page with a hash.
5.  Refreshing with a hash.
6.  Using browser back/forward navigation.

Use a reliable `IntersectionObserver` or equivalent section-observation
mechanism.

Do **not** hard-code Home as permanently active.

The active navigation pill should preserve the current/reference visual
language:

-   purple/blue gradient
-   subtle glow
-   smooth transition
-   clear contrast

Inactive navigation items should remain understated.

------------------------------------------------------------------------

# 2. Header Background --- Refine, Don't Redesign

The current header is too transparent/flat.

Bring it slightly closer to the reference.

Use a subtle glass-like treatment:

-   very low-opacity dark background
-   subtle border
-   light backdrop blur
-   restrained shadow
-   no heavy opaque panel

The header should feel like a floating navigation layer.

Do not make it visually heavy.

Do not remove the existing navigation structure.

------------------------------------------------------------------------

# 3. Get In Touch --- Complete the UI

The current `Get in Touch` section is incomplete compared with the
reference.

Keep the existing content, but improve the presentation.

Desired structure:

``` text
Get in Touch ✦
Let's work together or just say hi!

Email

┌──────────────────────────────────────────────┐
│ [icon]  Email                                │
│         hello.satpal@gmail.com       [Copy] │
└──────────────────────────────────────────────┘

Socials

┌────────────────────────┐  ┌────────────────────────┐
│ [GitHub icon]           │  │ [LinkedIn icon]         │
│ GitHub                  │  │ LinkedIn                │
│ github.com/...       ↗  │  │ linkedin.com/...     ↗  │
└────────────────────────┘  └────────────────────────┘
```

The GitHub and LinkedIn links should be proper visual cards, not plain
text links.

Each social card should contain:

-   platform icon
-   platform name
-   URL
-   external-link icon

Use the same visual language as the rest of the portfolio:

-   dark glass surface
-   subtle border
-   restrained accent
-   rounded corners
-   subtle hover lift/glow

Desktop:

-   GitHub and LinkedIn side-by-side.

Mobile:

-   stack them vertically.

Keep the existing real URLs.

------------------------------------------------------------------------

# 4. Email Card --- Make It More Compact

The current email card is unnecessarily wide.

Reduce its visual width so it feels like a compact contact component
rather than a full-width form field.

Keep:

-   email icon
-   `Email` label
-   actual email address
-   Copy button

The card can use a natural/max-content or constrained width on desktop.

On mobile it may expand to the available content width.

Do not make it tiny.

Do not change the functionality of the Copy button.

------------------------------------------------------------------------

# 5. Resume Button --- Improve Its Visual Quality

The current `Download Resume` button in the sidebar feels too plain.

Improve it so it belongs visually to the rest of the portfolio.

Requirements:

-   subtle purple accent
-   refined border
-   glass surface
-   download icon
-   clear typography
-   smooth hover transition
-   subtle glow on hover
-   slight elevation on hover

Keep it compact.

Do not make it oversized or flashy.

The existing resume download functionality must remain unchanged.

------------------------------------------------------------------------

# 6. Theme-Aware Scrollbar

Create a custom scrollbar that follows the active theme.

## Dark theme

Use:

-   very dark track
-   muted purple/blue thumb
-   rounded thumb
-   subtle hover accent

## Light theme

Use:

-   light neutral track
-   muted gray thumb
-   subtle theme-accent hover

The scrollbar must remain:

-   narrow
-   minimal
-   premium
-   unobtrusive

Support Chromium browsers and provide a reasonable Firefox fallback.

Do not create a large or distracting scrollbar.

------------------------------------------------------------------------

# 7. Contact Section Spacing

Refine only the spacing in the `Get in Touch` section.

Balance the spacing between:

-   section heading
-   subtitle
-   Email label
-   Email card
-   Socials label
-   Social cards
-   footer

Avoid excessive vertical gaps.

The section should feel compact and intentional, similar to the
reference.

------------------------------------------------------------------------

# 8. Small Sidebar Polish

Do not redesign the sidebar.

Only make minor visual refinements if necessary, primarily around:

-   Resume button
-   social icon spacing
-   profile spacing
-   subtle surface treatment

The existing sidebar layout is already correct.

------------------------------------------------------------------------

# 9. Interaction Polish

Make sure the following elements have consistent micro-interactions:

-   navigation items
-   active navigation pill
-   theme toggle
-   resume button
-   email card
-   social cards
-   project cards

Animations should be:

-   smooth
-   subtle
-   relaxing
-   professional

Avoid excessive movement.

Preserve and respect:

``` css
@media (prefers-reduced-motion: reduce)
```

Users with reduced-motion enabled should not receive unnecessary
transforms or animated transitions.

------------------------------------------------------------------------

# 10. Do Not Introduce New Design Concepts

This is a strict constraint.

Do NOT add:

-   new sections
-   new content
-   new navigation items
-   new pages
-   new layouts
-   excessive neon
-   excessive glow
-   huge shadows
-   excessive animations
-   unnecessary decorative elements
-   unrelated components

The existing design direction is already approved.

Only refine the requested areas.

------------------------------------------------------------------------

# 11. Responsive Requirements

Verify the fixes on:

### Desktop

-   Header remains correct.
-   Active nav follows the visible section.
-   Email card is compact.
-   Social cards are side-by-side.
-   Resume button fits the sidebar.
-   Scrollbar matches dark/light theme.

### Tablet

-   No layout breakage.
-   Contact cards remain usable.
-   Navigation remains readable.

### Mobile

-   Navigation remains usable.
-   Active nav still updates correctly.
-   Email card uses available width.
-   Social cards stack vertically.
-   Resume button remains properly sized.
-   No horizontal overflow.
-   Custom scrollbar does not create layout issues.

------------------------------------------------------------------------

# 12. Final Verification Checklist

Before finishing, verify all of these.

## Navigation

-   [ ] Home active at the top.
-   [ ] About active when About is the current visible section.
-   [ ] Projects active when Projects is the current visible section.
-   [ ] Contact active when Contact is the current visible section.
-   [ ] Clicking navigation updates active state.
-   [ ] Scrolling updates active state.
-   [ ] Hash navigation works.
-   [ ] Browser back/forward works.
-   [ ] Refreshing with a hash works.

## Header

-   [ ] Background is subtle glass-like.
-   [ ] Header is not opaque/heavy.
-   [ ] Active pill is visually clear.

## Contact

-   [ ] Get In Touch looks complete.
-   [ ] Email card is compact.
-   [ ] Copy button still works.
-   [ ] GitHub is a proper card.
-   [ ] LinkedIn is a proper card.
-   [ ] External links work.
-   [ ] Desktop cards are side-by-side.
-   [ ] Mobile cards stack.

## Resume

-   [ ] Button looks integrated with the UI.
-   [ ] Download icon is present.
-   [ ] Hover state works.
-   [ ] Existing download behavior is unchanged.

## Scrollbar

-   [ ] Dark theme scrollbar works.
-   [ ] Light theme scrollbar works.
-   [ ] Scrollbar is narrow and subtle.
-   [ ] No layout shift or overflow is introduced.

## Theme

-   [ ] Existing theme persistence still works.
-   [ ] Existing hybrid device-preference behavior still works.
-   [ ] No light-theme flash before dark theme.
-   [ ] Theme toggle remains functional.

## Responsive

-   [ ] Desktop checked.
-   [ ] Tablet checked.
-   [ ] Mobile checked.
-   [ ] No horizontal overflow.

------------------------------------------------------------------------

# Final Instruction

After making these fixes, compare the result against:

`portfolio-reference.png`

Do one final visual sanity check.

If something is already matching the reference, **leave it alone**.

This is the final polish pass, not another redesign.
