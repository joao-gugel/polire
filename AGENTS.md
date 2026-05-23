# AGENTS.md

Guidance for AI agents (and humans) contributing to this repository.

## Project

**Mend** is a desktop typing assistant that helps users write better text — primarily targeted at people writing in a non-native language.

The app is designed to feel ambient: it runs in the system tray, stays out of the way, and is summoned with a global hotkey (`Ctrl+Alt+P`). When dismissed (Esc or hotkey again) it hides back into the tray rather than quitting.

The package directory is `usemend`; the product name is **Mend**.

## Stack

- **Runtime:** [Electron](https://www.electronjs.org/) (main + renderer processes)
- **UI:** [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 (CSS-first config via `@import "tailwindcss"`, no `tailwind.config.js`)
- **Icons:** [Phosphor Icons](https://phosphoricons.com/) — `@phosphor-icons/react`. Use only this library; do not introduce other icon sets (lucide, heroicons, etc). Always import with the `Icon` suffix (`GearIcon`, `SparkleIcon`, …) — the unsuffixed exports are deprecated and will trigger warnings.
- **Bundler / dev server:** [Vite](https://vitejs.dev/) 6 with [`vite-plugin-electron`](https://github.com/electron-vite/vite-plugin-electron) (simple preset)
- **Package manager / runner:** [Bun](https://bun.sh/) — use `bun install`, `bun run <script>`
- **Formatter / linter:** [Biome](https://biomejs.dev/) — run `bun run format` before committing
- **Target platforms:** Windows and Linux (X11 recommended for global shortcuts; Wayland support is limited)

## Build outputs

- `dist/` — bundled renderer (HTML + JS + CSS)
- `dist-electron/` — bundled main + preload (`main.js`, `preload.mjs`)
- `node_modules/.cache/tsc/` — TypeScript build info (project references)

All three are gitignored.

## Project structure

```
electron/
├── constants.ts   # paths, window size, hotkey, app name
├── window.ts      # window lifecycle: create, show, toggle, quit, Esc handler
├── tray.ts        # system tray icon + context menu
├── main.ts        # entry: whenReady wiring + global shortcuts
└── preload.ts     # renderer ↔ main bridge (exposes `window.api`)
src/
├── app.tsx                  # shell: wraps NavProvider + AnimatePresence + view renderer
├── main.tsx                 # React entry — mounts <App /> into #root
├── main.css                 # Tailwind v4 import + dark variant + base styles
├── theme.ts                 # theme state: persistence + DOM apply
├── types.ts                 # shared types (CommandOption, View, ...)
├── global.d.ts              # ambient types (window.api from preload)
├── providers/
│   ├── nav.tsx              # navigation stack (push/pop) + slide direction
│   ├── correction.tsx       # correction request/result state
│   └── translation.tsx      # translation request/result state
├── views/
│   ├── palette.tsx          # root view: search + command list (no back)
│   ├── settings.tsx         # settings overview: theme + nav to sub-pages
│   ├── ai-settings.tsx      # AI sub-page: provider list + API key form
│   ├── correction.tsx       # AI correction before/after screen
│   └── translation.tsx      # AI translation before/after screen
└── components/
    ├── page-layout.tsx      # header w/ back + content slot + footer (non-root views)
    ├── search-input.tsx     # top text field
    ├── option-list.tsx      # list of selectable commands
    ├── transformation-result.tsx # shared before/after result layout
    ├── ui/option-item.tsx   # shared selectable row + icon/check/caret adornments
    ├── ui/footer.tsx        # bottom bar: logo + keyboard hints
    ├── ui/kbd.tsx           # visual key representation
    └── ui/noise.tsx         # SVG turbulence overlay (Linux-only glass texture)
index.html         # renderer HTML shell
vite.config.ts     # Vite + plugins (React, Tailwind, Electron)
```

Module-level state in `electron/` is intentional: `win` and `isQuitting` live as `let` bindings inside `window.ts` and are mutated by exported functions. Don't pull them out into a shared store — the encapsulation is the point.

### Navigation

The renderer uses a tiny stack-based router exposed through `useNav()` (`src/providers/nav.tsx`):

- `push(view)` / `pop()` — mutate the stack
- `current` — top of stack
- `direction` — `1` (forward) or `-1` (back), drives the slide animation in `app.tsx`

Views that are not the root render inside `<PageLayout title="...">` so they get the back button + footer for free. Views read `current` to know whether they're the active screen — `useEffect` keyboard handlers early-return when `isActive` is false, so the offscreen view (mid-transition) doesn't intercept input.

When adding a new view: extend the `View` union in `src/types.ts`, add a branch in `renderView` (in `app.tsx`), and call `push("your-view")` from wherever it's triggered. Renderer imports may use the configured `@/` alias for `src/` modules.

## Scripts

| Command            | What it does                                                         |
| ------------------ | -------------------------------------------------------------------- |
| `bun install`      | Install dependencies                                                 |
| `bun run dev`      | Start Vite + Electron with hot reload                                |
| `bun run build`    | `tsc -b && vite build` → outputs to `dist/` and `dist-electron/`     |
| `bun run preview`  | Serve the built renderer (without Electron) — rarely useful here     |
| `bun run format`   | Run Biome to format and lint the whole repo                          |

## Rules

Non-negotiable do's and don'ts. These exist to keep the codebase coherent and avoid common footguns.

### Forbidden

- **No `useEffect`.** Strictly. If you think you need one, you almost certainly don't — derive state during render, use event handlers, or refs. If you cannot avoid it, stop and ask first.

- **No `any`.** Type things properly. If a type is hard to express, reach for `unknown` + narrowing, generics, or `satisfies`. `as any` casts are also forbidden — if you hit a third-party type that's wrong, add a precise interface or use `@ts-expect-error` with a one-line reason.

### Required

- **Avoid `else`.** Prefer early returns, guard clauses, or restructuring. If you're reaching for `else`, the function probably wants splitting.

  ```ts
  // ❌ avoid
  function toggleWindow() {
    if (win.isVisible() && win.isFocused()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  }

  // ✅ prefer
  function toggleWindow() {
    if (!win) return;
    if (win.isVisible() && win.isFocused()) return win.hide();
    showWindow();
  }
  ```

- **Names must explain themselves.** Pick names that tell the reader *what* a thing is and *why* it exists. `toggleWindow` over `tw`; `isQuitting` over `flag`; `hideOnEscape` over `handler`. A caller should not need to open the body to know what a function does.

- **JSDoc in English, when it adds signal.** Add a JSDoc comment on exported functions whenever the name alone does not capture: side effects, edge cases, why a function can return early, or what the params and return value actually mean. Use `@param` and `@returns` when their meaning is not obvious from the types alone. Skip JSDoc when the signature is fully self-evident — redundant comments are noise.

  ```ts
  /**
   * Register the global hotkey. Logs an error if the OS refuses the binding
   * (already in use, missing permission, etc).
   */
  function registerShortcuts() { /* ... */ }
  ```

  **React components are usually the exception.** Their props are typed and their names describe the rendered output (`SearchInput`, `OptionList`, `Footer`). Don't add JSDoc to a component unless it has non-obvious behavior — render side effects, controlled-vs-uncontrolled trade-offs, focus management, etc. Default to no JSDoc on components.

- **File names are kebab-case.** Always. Even for React components: `search-input.tsx`, `option-list.tsx`, `app.tsx`, `kbd.tsx`. The exported identifier inside still uses PascalCase (`SearchInput`, `OptionList`) — only the filename changes. This keeps imports portable across case-sensitive filesystems (Linux) and case-insensitive ones (macOS, Windows) without surprises.

### Workflow

- **Always use Bun.** `bun install`, `bun run <script>`, `bunx <tool>`. Do not introduce `npm`, `pnpm`, `yarn`, or `node` commands unless the user explicitly asks for another runtime/tool.

- **Format before finishing.** Run `bun run format` after every task — this executes Biome to format and lint the whole repo. The task isn't done until the formatter passes clean.
