# Specification

## Summary
**Goal:** Create a safe, non-explicit, age-gated mature-audience content platform with basic posting/browsing, Internet Identity authentication for write actions, and explicit-content rejection.

**Planned changes:**
- Add an 18+ age-gate flow that blocks all content until confirmed and persists the confirmation per session/device.
- Implement browsing for non-explicit posts: global feed list and post detail view (available to anonymous users after passing the age gate).
- Add Internet Identity login/logout UI and require authentication to create or delete posts.
- Implement post creation with title, description, optional external link URL, and timestamp.
- Allow users to delete only their own posts.
- Add client-side and server-side keyword-based checks to reject explicitly sexual content with a clear error message.
- Apply a cohesive mature-audience visual theme across all views, avoiding blue/purple as the primary palette.

**User-visible outcome:** Users must confirm they are 18+ before seeing content; after that they can browse posts anonymously, sign in with Internet Identity to create posts, and delete only their own posts, with prohibited explicit wording blocked and explained.
