# AGENTS.md

## Product vision
- Build an educational, interactive narrative that demystifies compound interest for Spanish-speaking audiences while keeping the dog-themed visual flair alive (animations, effects, UI accents) without forcing canine scenarios into the financial storytelling.
- Combine scrollytelling, motion, and data visualizations to help visitors move from intuition to confident application.

## Audience & voice
- Explain finance in plain, adult language: approachable, witty, and precise—never condescending.
- Use analogies anchored in everyday life; reserve the dog influence for aesthetic touches rather than the underlying financial examples.

## Narrative & pedagogy
- Structure long-form stories inside `ScrollSection` wrappers to maintain consistent spacing, tone variants (`default`, `surface`, `highlight`), and scroll markers.
- Each major beat should:  
  1. Introduce a relatable scenario,  
  2. Reveal the underlying math or mechanism, and  
  3. Offer an actionable takeaway or tool.
- Layer complexity gradually: start with intuitive visuals, then surface formulas, charts, and interactive controls for deeper dives.

## Interaction & visuals
- Treat the existing sections (`HeroSection`, `StoryScroller`, `InteractiveSandbox`, `InteractionTeaser`, `ClosingSection`) as building blocks; extend or replace their content rather than creating ad-hoc layouts.
- When adding visualizations, provide both Chart.js and D3 implementations where feasible so the sandbox toggle remains meaningful.
- Keep GSAP + ScrollTrigger timelines encapsulated in their section components; ensure animations are accessible (respect reduced-motion settings, avoid critical information conveyed by motion alone).
- Lean into dog-inspired motion, sound design, or styling for delight, but let the numerical examples, datasets, and explanatory copy stay broadly applicable beyond canine scenarios.

## Technical guidelines
- Use SvelteKit with TypeScript. Prefer named exports through `$lib/index.ts` for reusable components and utilities.
- Follow the established file structure (`src/lib/animations`, `components/{charts,common,layout,sections}`, `styles`) to keep concerns separated.
- Encapsulate animation logic in helpers under `src/lib/animations` and register plugins within `ensureGsapRegistered` before use.
- Style with the design tokens defined in `src/lib/styles`; avoid inline colors when a token exists.

## Data, math, and content accuracy
- Double-check all numerical examples; accompany any interactive calculator with tooltips or copy that defines principal, rate, compounding frequency, time horizon, and contributions.
- When presenting formulas, provide a quick interpretive sentence and, if space allows, an expandable panel or animation that walks through an example.

## Process & quality
- Update or add stories in both copy and component files; keep placeholder text out of production commits.
- Run `npm run check` before submitting changes, and smoke-test critical interactions in the latest Chromium and Firefox ESR releases.
- Document new animations or datasets in the component’s front-matter or comments so future contributors understand triggers, easing choices, and data sources.
