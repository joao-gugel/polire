# Mend

A desktop typing assistant that helps you write better text — built primarily for people writing in a non-native language.

Mend runs quietly in the background and is summoned with a global hotkey, so it stays out of your way until you need it.

![Mend screenshot](https://raw.githubusercontent.com/joao-gugel/usemend/main/docs/screenshot.png)

## Features

- Runs on Windows and Linux
- Lives in the system tray — no taskbar clutter
- Global hotkey `Ctrl+Alt+P` toggles the window from anywhere
- Press `Esc` to dismiss when the window is focused

## Tech stack

- [Electron](https://www.electronjs.org/) — desktop runtime
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) — UI
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Vite](https://vitejs.dev/) — bundler/dev server
- [Bun](https://bun.sh/) — package manager

## Requirements

- [Bun](https://bun.sh/) `>= 1.3`
- Linux: an X11 session is recommended (global shortcuts have limited support on Wayland).

## Install

```bash
bun install
```

## Develop

Starts Vite + Electron with hot reload:

```bash
bun run dev
```

## Build

Type-checks and produces a production bundle in `dist/` and `dist-electron/`:

```bash
bun run build
```

## Project layout

```
electron/
├── constants.ts   # Paths, window size, hotkey, app name
├── window.ts      # Window lifecycle: create, show, toggle, quit
├── tray.ts        # System tray icon and menu
├── main.ts        # Entry point: wires everything together
└── preload.ts     # Renderer ↔ main bridge (empty for now)
src/
├── App.tsx
├── main.tsx
└── main.css
```

## Default shortcuts

| Shortcut       | Action                          |
| -------------- | ------------------------------- |
| `Ctrl+Alt+P`   | Toggle the window (global)      |
| `Esc`          | Hide the window (when focused)  |
