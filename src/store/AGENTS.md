# Stores

Zustand + Immer. Currently one store, `roast-flow-store.ts`, exporting `RoastView` (`"idle" | "scanning" | "result"`) and `useRoastFlowStore`.

## Scope

- Stores hold UI flow state only: `view`, `roast`, `rival`, `scanIndex`, `compareOpen`, `deleteOpen`.
- Server data fetching and async work stay in React Query mutations (see `src/hooks/use-roast-flow-state.ts`). Do not call `/api/*` from a store.
- Stores are client-only. Do not import them from server code.

## Pattern

- Curried form: `create<State & Actions>()(immer((set) => ({ ... })))`.
- Separate non-exported `State` and `Actions` interfaces. A module-level `initialState`; `reset` is `set(() => ({ ...initialState }))` (returns a fresh object rather than mutating the draft).
- Actions are small, named by intent (`startScan`, `tickScan`, `showResult`, `failScan`, `setRival`, ...) and mutate the draft: `set((state) => { state.x = ... })`.
- Arrow-function action members are allowed here; the "function declarations" rule applies to named definitions, not members of the store object.
- Put derived transitions inside the action (for example `failScan` returns to `result` if a roast exists, otherwise `idle`; `showResult` clears `rival`).
- Types come from `@/types/roast`.

## Consumption

- Only `useRoastFlowState()` in `src/hooks/use-roast-flow-state.ts` reads `useRoastFlowStore`. It exposes a view-model through `RoastFlowProvider` / `useRoastFlow()` (`src/contexts/roast-flow-context.tsx`).
- Components must use `useRoastFlow()`, never the store directly.
- No selectors are used today; the React Compiler is on. If a new store or hot path needs them, select narrowly (and `useShallow` for object picks) instead of subscribing to the whole store.
- A new store goes in its own `<name>-store.ts` here, with its own provider hook only if components need it.
