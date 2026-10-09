# Valoroast Design System & Layout Guidelines

## Overview

Valoroast is a fun side project for roasting Valorant players. You drop a Riot ID, the app pulls public stats (HS%, winrate, ACS, main agent, last 5 matches) and turns them into an exaggerated, shareable verdict. It is not serious coaching or analysis — the point is to make sessions with friends more entertaining.

**Who it's for:** Valorant players and their friend groups who want to roast themselves or each other and share the result.

**Core user flow:**
1. Enter a Riot ID (`Username#TAG`) and submit.
2. A short "pulling the case file" scan plays.
3. The result shows a verdict stamp, the roast line, an unlocked "badge of shame" and the stat tiles.
4. The player downloads a roast card, copies a share link, or challenges a rival in a 1v1 comparison.
5. The player can delete the roast and its link at any time.

**Product boundaries (current):**
- Public stats only — no login, no accounts.
- One screen: intake, scan, result, compare dialog, delete confirmation.
- The HTML prototype (`valoroast/index.html`) uses mocked data; real stats, persistence and the API are separate issues.
- Not affiliated with Riot Games.

The visual language borrows from Valorant's own UI: a dark slate canvas, a single hot red accent, condensed uppercase labels and sharp, square geometry. It should feel like an intense "case file" — loud and playful in copy, precise in layout.

**Key Characteristics:**
- Dark-only slate canvas with faint red/teal radial glows.
- One red accent for action, focus and verdicts; teal reserved for "winning" and positive outcomes.
- Square corners everywhere — no rounded surfaces.
- Accent borders (left or top) instead of shadows to give panels identity.
- Condensed, uppercase, tracked labels; heavy display headlines.
- Semantic token-driven styling through `src/app/globals.css`.

## Colors

### Brand & Accent
- **Primary Red** (`{colors.primary}`, `#FF4655`): Main actions, accent borders, verdict stamp, focus ring, kicker labels.
- **Primary Foreground** (`{colors.primary-foreground}`): Text/icon color on red fills.
- **Ring** (`{colors.ring}`): Focus outline color (same red).

### Surface
- **Background** (`{colors.background}`, `#0F1923`): App canvas and sunken fields.
- **Card** (`{colors.card}`, `#111E29`): Panels, stat tiles, dialogs.
- **Muted** (`{colors.muted}`, `#1B2733`): Secondary buttons and quiet filled controls (`{colors.muted-hover}` on hover).
- **Input** (`{colors.input}`): Field surfaces.
- **Border** (`{colors.border}`): Structural dividers (12% foreground).
- **Overlay** (`{colors.overlay}`): Dialog backdrop.

### Text
- **Foreground** (`{colors.foreground}`, `#ECE8E1`): Primary text and headlines.
- **Muted Foreground** (`{colors.muted-foreground}`): Supporting copy and descriptions.
- **Faint Foreground** (`{colors.faint-foreground}`): Labels, hints, placeholders, tertiary actions.

### Semantic
- **Success** (`{colors.success}`, `#00E0B0`): Wins, the rival's winning stats, "badge unlocked".
- **Destructive** (`{colors.destructive}`): Errors and invalid states — same red as primary; Valoroast does not introduce a second red.

## Typography

### Font Family
Loaded with `next/font/google` in `src/app/layout.tsx`:

- **Display** (`font-display`): **Anton** — headlines, the roast line, stat values, verdict stamp, dialog titles. Always uppercase.
- **Condensed** (`font-condensed`): **Barlow Condensed** (500–700) — buttons, kicker labels, badges, hints, toasts. Uppercase with Tailwind's `tracking-wider` or `tracking-widest` utilities.
- **Body** (`font-sans`): **Barlow** (400–600) — paragraphs and input text.

### Hierarchy
- **Hero headline:** Anton, `clamp(38px, 7.2vw, 80px)`, tight leading.
- **Roast line:** Anton, `clamp(21px, 3.1vw, 36px)`.
- **Dialog / section titles:** Anton, 24–32px.
- **Stat values:** Anton, 34px.
- **Body:** Barlow, 14–18px, `muted-foreground`.
- **Kickers (Eyebrow):** Barlow Condensed, 12–13px, uppercase, wide tracking.

### Principles
- Shout with the display face, explain with the body face, label with the condensed face.
- Keep roast copy short and punchy; never wrap labels across lines.

## Layout

### Spacing System
Valoroast follows Tailwind's spacing scale. Shared primitives use the closest utility to the prototype's value.

Shared UI primitives use the closest Tailwind typography and spacing utilities. Responsive primitive sizes use breakpoint utilities instead of one-off `clamp()` values. The 10px text size is available as `text-xxs`.

- Tight control spacing: `gap-2` to `gap-2.5`
- Card internal padding: `px-4.5 py-4` (tiles) up to `p-7 md:p-8 lg:p-11` (verdict card)
- Page gutter: `clamp(16px, 4vw, 48px)`

### Page Structure
- **Page canvas:** `bg-background` with two faint radial glows (red top-left, teal bottom-right).
- **Header:** sticky, translucent background with blur, bottom border.
- **Main container:** centered, max width ~1180px.
- **Sections:** hero intake → scan panel → result (verdict card, stat grid, action row).
- **Footer:** privacy/deletion note, delete action, disclaimer.
- **Overlays:** centered dialogs for compare and delete confirmation; toasts at the bottom center.

### Component Layout Rules
- Use accent borders (`border-l-3/4` or `border-t-4` in red/teal) to mark important surfaces.
- Use background contrast (canvas vs card vs muted) before adding borders.
- Stat tiles use an auto-fit grid (`minmax(150px, 1fr)`).
- Action rows wrap; the destructive text action sits at the far end.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | `bg-background` | canvas, sunken fields |
| Panel | `bg-card` | stat tiles, scan panel, dialogs |
| Accent | `bg-card` + red/teal accent border | verdict card, scan panel, winner callout, fields |
| Overlay | `bg-overlay` + backdrop blur | dialog backdrop |

Valoroast does not use drop shadows for depth; contrast and accent borders do that job.

## Motion

Keyframes live in `src/app/globals.css` and are exposed as `animate-*` utilities:

- **`animate-pop`** — dialogs open with translateY 18px + scale 0.97 → rest, 220ms ease.
- **`animate-sweep`** — indeterminate progress bar sweeps left → right, 1.1s linear, infinite.

Prototype motion still to port with its feature components: the verdict stamp slam (rotate + scale overshoot), the result fade-in, and the blinking scan cursor. Controls use Tailwind's default color transition for hover and focus.

## Shapes

- **Square corners only.** Do not use `rounded-*` on primitives.
- Decorative shapes (logo diamond, rank emblems) use `clip-path` polygons and live in feature components, not in `/ui`.

## Components

### UI Primitive Direction
Reusable components live in `src/components/ui/` and follow `src/components/AGENTS.md`. They must stay generic — no Valoroast business meaning inside them.

Current primitive families:
- **Button** for every action (default red, secondary, inverse, soft, link)
- **Badge** and **Eyebrow** for tags, W/L chips and kicker labels
- **Input** (`InputRoot`, `InputAddon`, `InputControl`, `InputDescription`, `InputError`) for Riot ID fields
- **Card** for panels and tiles
- **Progress** for the scan bar and compare bars
- **Separator** for dividers
- **Dialog** and **AlertDialog** for compare and delete confirmation
- **Toaster** (Sonner) for feedback

### Feature Components
Valoroast-specific components live in `src/components/` above the primitive layer and compose the primitives:
- **Page chrome:** `logo`, `header`, `footer`
- **Intake:** `hero`, `roast-form` (react-hook-form + zod), `scan-panel`
- **Result:** `roast-result`, `verdict-card`, `verdict-stamp`, `badge-emblem`, `stat-tile`, `match-form`, `result-actions`
- **Overlays:** `challenge-friend-dialog` (with `compare-row`), `delete-roast-dialog`

Form schemas live inside the form components. Shared flow state (view, roast, rival, dialog flags) comes from `RoastFlowProvider` in `src/contexts/`.

### Component Principles
- Use semantic token classes, not hardcoded hex values.
- Expose `variant` and `size` consistently.
- Prefer Radix UI for overlays and accessibility-sensitive controls.
- Icons come from Lucide only.
- Keep primitives generic so feature-level components (logo, verdict stamp, emblem, stat tile, compare row) can compose them.

## Do's and Don'ts

### Do
- Use token-backed utilities from `src/app/globals.css`.
- Match the HTML prototype's sizing, spacing and states when migrating.
- Keep copy loud and labels uppercase; keep layout disciplined.
- Use red for action and verdicts, teal for wins.

### Don't
- Don't introduce one-off color values inside components.
- Don't round corners or add drop shadows.
- Don't add a light theme or extra accent colors.
- Don't make primitives carry Valoroast-specific business meaning.
- Don't use unicode glyphs as icons.

## Responsive Behavior
- **Mobile (< 768px):** hero form stacks (field then button), stat grid collapses to 1–2 columns, dialogs fill the width minus a 20px gutter, action rows wrap.
- **Tablet (768px–1024px):** stat grid at 3 columns, verdict stamp scales down with `clamp()`.
- **Desktop (> 1024px):** full 5-tile stat row, max-width container, larger display type.

## Iteration Guide
1. Start from the HTML prototype and the semantic tokens in `src/app/globals.css`.
2. Reuse existing primitives before creating new visual patterns.
3. Add Valoroast-specific composed components above the primitive layer, not inside it.
4. Update this file when visual rules or layout direction materially change.
