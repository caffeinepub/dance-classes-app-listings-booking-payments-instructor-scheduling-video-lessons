# Specification

## Summary
**Goal:** Add an instructor portrait photo to the existing Biodata page.

**Planned changes:**
- Create an optimized, square 512x512 portrait image from the uploaded `IMG-20220513-WA0015.jpg` and save it as a static asset under `frontend/public/assets/generated/`.
- Update `frontend/src/pages/biodata/BiodataPage.tsx` to display the portrait near the top of the page with appropriate alt text, while keeping the existing Biodata heading and the two sections (Professional Summary, Core Competencies) unchanged and ensuring responsive layout using existing Tailwind conventions.

**User-visible outcome:** The /biodata page shows a centered, responsive instructor portrait image near the top, without changing the existing biodata content.
