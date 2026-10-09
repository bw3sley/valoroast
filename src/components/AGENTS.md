# UI Component Library — Agent Guide

This document is the authoritative reference for creating and extending components in `src/components/ui/`. Any agent or developer adding new components **must** follow the patterns described here.

---

## Core Rules

| Rule | Detail |
|---|---|
| **File names** | `kebab-case.tsx` — e.g. `scroll-area.tsx`, `combo-box.tsx` |
| **Exports** | Only **named exports**. No default exports. |
| **Function style** | Components and helpers use `function Name() {}` declarations, never `const Name = () => {}`. Variant configs (`tv({...})`) and other non-function values still use `const`. |
| **Styling** | Use `tailwind-variants` (`tv`) + the `cn` utility. Never write ad-hoc inline class concatenation. |
| **Variants & Sizes** | Every component **must** expose at minimum `variant` and `size` props via `tailwind-variants`. |
| **Types** | Extend `ComponentProps<"element">` for native elements or `ComponentProps<typeof Primitive.X>` for Radix parts. In React 19 `ref` is a regular prop, so these types already carry it — no `forwardRef`, no `ComponentPropsWithoutRef`. Never create props from scratch if a standard type already models the element. |
| **Composition** | If a component is more than one DOM element working together, use the **composition pattern** (see below). Simple leaf elements like `Button` or `Badge` do **not** need it. |
| **Radix UI** | When a component requires accessibility primitives (focus traps, ARIA, portals), always prefer a Radix UI primitive as the underlying layer. |
| **`cn` usage** | Always call `cn(variantResult, className)` in that order. This ensures consumer overrides win without fighting specificity. |
| **Icons** | Use `lucide-react` only. Never use unicode glyphs or inline SVG as icons. Size icons from the component via `[&_svg]:size-*`. |
| **Client boundary** | Add `"use client"` only when the file needs state, effects, or a stateful Radix primitive (Dialog, AlertDialog, Progress) or Sonner. Static primitives stay server-compatible. |

---

## Imports Reference

```ts
// Variants engine
import { tv, type VariantProps } from "tailwind-variants";

// Class merger
import { cn } from "@/lib/utils";

// Radix primitives (example — pick the right one per component)
import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
```

---

## Pattern 1 — Simple Component (no composition)

Use this for single-element, self-contained components.

**Examples:** `Button`, `Badge`, `Textarea`

```tsx
// badge.tsx
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badgeVariants = tv({
  base: ["inline-flex items-center gap-1 font-medium border"],
  variants: {
    variant: {
      default:  "border-transparent bg-primary text-primary-foreground",
      outline:  "border-border bg-transparent text-foreground",
      success:  "border-transparent bg-success/15 text-success",
    },
    size: {
      sm: "px-1.5 py-0.5 text-xxs",
      md: "px-2   py-0.5 text-xs",
      lg: "px-2.5 py-1   text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends ComponentProps<"span">, BadgeVariants {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
```

**Checklist:**
- [ ] `tv()` defines `base`, `variants.variant`, `variants.size`, `defaultVariants`
- [ ] `VariantProps<typeof xVariants>` is re-exported as a named type
- [ ] Interface extends the matching HTML prop type + `VariantProps`
- [ ] `cn(variants({ variant, size }), className)` in the render
- [ ] `xVariants` exported so consumers can re-use it (e.g., for `asChild` patterns)

---

## Pattern 2 — Composition Component

Use this when a component is composed of multiple related parts that must be assembled by the consumer. Each sub-component is a named export with the **ComponentName + PartName** convention.

**Examples:** `Input` (`InputRoot`, `InputAddon`, `InputControl`, `InputDescription`, `InputError`), `Dialog`, `AlertDialog`

### Naming Convention

```
InputRoot          ← wrapper / field surface (carries variants/sizes when it wraps addons)
InputAddon         ← inline prefix inside the field (e.g. "ID")
InputControl       ← the interactive element
InputDescription   ← helper text
InputError         ← validation error message
```

The current UI has no visible labels, so fields take an `aria-label`. If a visible label is needed later, add a standalone `Label` component (`@/components/ui/label`) rather than an `Input`-scoped part, so it can be shared across fields.

### Usage by the consumer

```tsx
import {
  InputRoot,
  InputAddon,
  InputControl,
  InputDescription,
  InputError,
} from "@/components/ui/input";

<InputRoot size="lg">
  <InputAddon>ID</InputAddon>
  <InputControl aria-label="Riot ID" aria-invalid={hasError} placeholder="Username#TAG" />
</InputRoot>
<InputDescription>Public stats only · no login · takes 3 seconds</InputDescription>
<InputError>Use the format Username#TAG</InputError>
```

### Implementation skeleton

```tsx
// input.tsx

// Root — layout wrapper only
export function InputRoot({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

// Control — the only part that needs variants
const inputControlVariants = tv({ ... });

export interface InputControlProps
  extends Omit<ComponentProps<"input">, "size">,
    InputControlVariants {}

export function InputControl({ className, variant, size, ...props }: InputControlProps) {
  return (
    <input
      className={cn(inputControlVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

**Checklist:**
- [ ] Root component provides layout only (e.g. `flex flex-col gap-1.5`)
- [ ] Only the *interactive* sub-part carries `variant`/`size` variants
- [ ] Supporting parts (Label, Description, Error) extend the appropriate native HTML type
- [ ] If `size` conflicts with an HTML attribute (e.g. `<input size>`), use `Omit<ComponentProps<"input">, "size">`

> **Field surfaces with addons.** When the visible field box wraps more than the control (e.g. Valoroast's `InputRoot` holds an `InputAddon` like the "ID" prefix plus a transparent `InputControl`), the box itself is the styled part — `variant`/`size` live on the Root and the control stays unstyled. Root then carries the surface classes instead of layout only.

---

## Pattern 3 — Radix-backed Component with Slots

Use this when a component has multiple DOM nodes that must share variant styling (e.g. the track + indicator in `Progress`, or the thumb in `Slider`).

`tailwind-variants` **slots** let you define co-dependent class sets in a single `tv()` call.

**Examples:** `Progress`, `Tabs`, `ScrollArea`

```tsx
// progress.tsx
const progressVariants = tv({
  slots: {
    root: "relative w-full overflow-hidden bg-foreground/10",
    indicator: "h-full w-full flex-1 transition-all duration-500",
  },
  variants: {
    variant: {
      default:     { indicator: "bg-primary" },
      success:     { indicator: "bg-success" },
      destructive: { indicator: "bg-destructive" },
    },
    size: {
      sm: { root: "h-1"   },
      md: { root: "h-1.5" },
      lg: { root: "h-2.5" },
      xl: { root: "h-4"   },
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export function Progress({ className, value, variant, size, ...props }: ProgressProps) {
  const { root, indicator } = progressVariants({ variant, size });
  return (
    <ProgressPrimitive.Root className={cn(root(), className)} {...props}>
      <ProgressPrimitive.Indicator
        className={indicator()}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
```

**Checklist:**
- [ ] Destructure slots: `const { root, indicator } = progressVariants({ ... })`
- [ ] Call each slot as a function: `root()`, `indicator()`
- [ ] Apply `cn(root(), className)` only on the outermost element — inner slots usually don't need `className` override
- [ ] Export `progressVariants` for consumers who need to extend

---

## Design Tokens Reference

All components must use CSS variable–backed Tailwind tokens, **not** hardcoded hex values. Tokens are defined in `src/app/globals.css` (dark-only).

| Token | CSS Variable | Usage |
|---|---|---|
| `bg-background` | `--background` | App canvas, sunken fields |
| `bg-card` | `--card` | Panels, stat tiles, dialogs |
| `bg-muted` / `hover:bg-muted-hover` | `--muted` / `--muted-hover` | Secondary buttons, quiet filled controls |
| `bg-input` | `--input` | Field surfaces |
| `bg-primary` | `--primary` | Primary actions, accent borders, focus |
| `text-primary-foreground` | `--primary-foreground` | Text on primary surfaces |
| `bg-success` | `--success` | Progress bars, winning stats, "Badge unlocked" labels |
| `bg-destructive` | `--destructive` | Errors, destructive actions |
| `border-border` | `--border` | All structural dividers |
| `text-muted-foreground` | `--muted-foreground` | Secondary text, descriptions |
| `text-faint-foreground` | `--faint-foreground` | Labels, hints, placeholders, tertiary actions |
| `bg-overlay` | `--overlay` | Dialog backdrop |
| `ring-ring` | `--ring` | Focus indicators |
| `font-display` / `font-condensed` / `font-sans` | `--font-*` | Anton headlines / Barlow Condensed labels & actions / Barlow body |

**Shape:** Valoroast is square — do **not** use `rounded-*` on primitives. Use accent borders (`border-l-3`, `border-t-4`) instead of shadows.

---

## Variant Conventions

Always include these two variant axes at minimum. Pick names from the tables below; add a new name only when none fits (e.g. `inverse` for the light-on-dark button, `soft` for the red-tint button).

### `variant` — semantic meaning

| Name | Purpose |
|---|---|
| `default` | Primary branded action |
| `secondary` | Lower emphasis |
| `outline` | Border-only, transparent fill |
| `ghost` | No border, no fill |
| `destructive` | Error or removal action |
| `success` | Positive or progression action |
| `muted` | De-emphasised, disabled-feeling |
| `link` | Inline text-like action (buttons only) |

### `size` — spatial scale

Sizes come from the original HTML prototype (no longer in the repo; the existing components are the reference), not from a generic scale. Keep the names:

| Name | Use |
|---|---|
| `sm` | Compact controls (footer, dialog actions) |
| `md` | Default (always the default) |
| `lg` | Hero controls (e.g. the 56px "Roast me" button, 58px Riot ID field) |
| `xl` | Extra large — use sparingly |

---

## Focus & Accessibility

- Always include `outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` (field surfaces use `focus-within:` on the Root).
- For components wrapping Radix primitives, Radix handles ARIA automatically — do **not** manually add `role`, `aria-*`, or keyboard handlers unless you have a strong reason.
- Disabled state: always add `disabled:pointer-events-none disabled:opacity-50`.
- Error state: style `aria-invalid` (`aria-invalid:` or `has-[[aria-invalid=true]]:` on a wrapping Root) with `destructive`.

---

## File Structure Summary

```
src/components/ui/
├── alert-dialog.tsx   # Radix-backed, composition pattern
├── badge.tsx          # Simple pattern
├── button.tsx         # Simple pattern
├── card.tsx           # Simple pattern
├── dialog.tsx         # Radix-backed, composition pattern
├── eyebrow.tsx        # Simple pattern
├── input.tsx          # Composition pattern
├── progress.tsx       # Radix-backed, slots pattern
├── separator.tsx      # Radix-backed, simple
├── sonner.tsx         # Sonner toaster
└── AGENTS.md          # ← you are here
```

---

## Test Hooks

Interactive elements exercised by E2E tests must carry a `data-testid` prop, in `kebab-case`,
describing the element's role — e.g. `roast-submit-button`, `challenge-rival-button`,
`download-card-button`. Since components already spread native HTML attributes (`{...props}`),
`data-testid` passes through with no extra plumbing — just add the prop at the call site, no new
component API needed. Only add it to elements a test actually targets; don't blanket-apply it to
every element.

## Testing

**Primitives in this folder do not need unit tests.** Verify them by rendering every variant and
size on a temporary catalog route (or the first migrated screen) against the existing screens,
plus `npm run lint` and `npm run build`. Delete the temporary route before committing.

When tests are added for feature components or logic, use **Vitest** + **Testing Library** and
keep the test file next to its source: `roast-card.spec.tsx` beside `roast-card.tsx`.

### Rules

- Always wrap cases in `describe('<ComponentName>')`.
- Every test uses `it()`, **not** `test()`.
- Test name **must** start with `"should be able to"` — frames assertions as user abilities.
- Import from `@testing-library/react` and `@testing-library/jest-dom`.

### Example

```tsx
// stat-tile.spec.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatTile } from "./stat-tile";

describe("StatTile", () => {
  it("should be able to render the label and value", () => {
    render(<StatTile label="Headshot %" value="14%" />);
    expect(screen.getByText("14%")).toBeInTheDocument();
  });
});
```

### Checklist

- [ ] File named `<component>.spec.tsx`, co-located with the component
- [ ] One `describe` block per component
- [ ] All cases use `it("should be able to ...")`
- [ ] No `test()` calls
- [ ] Assertions use `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveClass`, etc.)

---

## Quick Template

Copy-paste template for a **new simple component**:

```tsx
// my-component.tsx
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const myComponentVariants = tv({
  base: [
    // shared base classes
  ],
  variants: {
    variant: {
      default: "",
      secondary: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type MyComponentVariants = VariantProps<typeof myComponentVariants>;

export interface MyComponentProps
  extends ComponentProps<"div">,
    MyComponentVariants {}

export function MyComponent({ className, variant, size, ...props }: MyComponentProps) {
  return (
    <div
      className={cn(myComponentVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { myComponentVariants };
```
