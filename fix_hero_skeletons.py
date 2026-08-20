import re

with open('src/components/visitor/Hero.astro', 'r') as f:
    content = f.read()

# Fix duplicate resume skeleton
content = content.replace(
    '<div id="hero-resume-skeleton" class="skeleton-box" style="width: 140px; height: 36px; border-radius: var(--radius-md);"></div>\n        <div id="hero-resume-skeleton" class="skeleton-box" style="width: 140px; height: 36px; border-radius: var(--radius-md);"></div>',
    '<div id="hero-resume-skeleton" class="skeleton-box" style="width: 140px; height: 36px; border-radius: var(--radius-md);"></div>'
)

# Fix Avatar Skeleton
content = content.replace(
    '<img id="hero-avatar" alt="" style="width: 160px; height: 160px; border-radius: var(--radius-full); object-fit: cover; display: block; background-color: var(--bg-inset);" />',
    '<img id="hero-avatar" alt="" class="skeleton-box" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style="width: 160px; height: 160px; border-radius: var(--radius-full); object-fit: cover; display: block; background-color: var(--bg-inset);" />'
)

# Fix Name Skeleton
content = content.replace(
    '<h1 id="hero-name" style="font-size: 2.25rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;"><span class="skeleton-box" style="display: inline-block; width: 60%; height: 1em; border-radius: var(--radius-sm);"></span></h1>',
    '<h1 id="hero-name" style="font-size: 2.25rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; min-height: 2.25rem;"><span class="skeleton-box" style="display: inline-block; width: 250px; height: 2.25rem; border-radius: var(--radius-sm);"></span></h1>'
)

# Fix Role Skeleton
content = content.replace(
    '<p id="hero-role" style="color: var(--accent-primary); font-weight: 500; font-size: 1rem;"><span class="skeleton-box" style="display: inline-block; width: 40%; height: 1em; border-radius: var(--radius-sm);"></span></p>',
    '<p id="hero-role" style="color: var(--accent-primary); font-weight: 500; font-size: 1rem; min-height: 1rem;"><span class="skeleton-box" style="display: inline-block; width: 120px; height: 1rem; border-radius: var(--radius-sm);"></span></p>'
)

# Fix Tagline Skeleton
content = content.replace(
    '<span class="skeleton-box" style="display: block; width: 100%; height: 16px; margin-bottom: 4px; border-radius: var(--radius-sm);"></span>\n          <span class="skeleton-box" style="display: block; width: 80%; height: 16px; border-radius: var(--radius-sm);"></span>',
    '<span class="skeleton-box" style="display: inline-block; width: 100%; height: 16px; margin-bottom: 4px; border-radius: var(--radius-sm);"></span>\n          <span class="skeleton-box" style="display: inline-block; width: 80%; height: 16px; border-radius: var(--radius-sm);"></span>'
)


with open('src/components/visitor/Hero.astro', 'w') as f:
    f.write(content)
