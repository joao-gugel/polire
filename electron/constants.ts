import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Project root (parent of dist-electron at runtime). */
export const APP_ROOT = path.join(__dirname, "..");

/** Folder holding the built renderer assets. */
export const RENDERER_DIST = path.join(APP_ROOT, "dist");

/** Preload script bundled alongside the main process. */
export const PRELOAD = path.join(__dirname, "preload.mjs");

/** Built index.html used in production. */
export const INDEX_HTML = path.join(RENDERER_DIST, "index.html");

/** Vite dev server URL — only defined while running `bun run dev`. */
export const DEV_URL = process.env.VITE_DEV_SERVER_URL;

/** Global hotkey that toggles the main window. */
export const SHORTCUT = "Control+Alt+I";

/** App display name used in tooltips, menus, etc. */
export const APP_NAME = "usemend";

/** Main window width in pixels. */
export const WINDOW_WIDTH = 800;

/** Main window height in pixels. */
export const WINDOW_HEIGHT = 480;
