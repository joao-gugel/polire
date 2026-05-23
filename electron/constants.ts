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

/** Source app icon used by the native window on Windows and Linux. */
export const APP_ICON = path.join(APP_ROOT, "assets", "app", "icon.png");

/** Small status icon used by the system tray, with an adjacent HiDPI variant. */
export const TRAY_ICON = path.join(APP_ROOT, "assets", "tray", "tray-icon.png");

/** Vite dev server URL — only defined while running `bun run dev`. */
export const DEV_URL = process.env.VITE_DEV_SERVER_URL;

/** Global hotkey that toggles the main window. */
export const SHORTCUT = "Control+Alt+P";

/** App display name used in tooltips, menus, etc. */
export const APP_NAME = "Polire";

/** Main window width in pixels. */
export const WINDOW_WIDTH = 800;

/** Main window height in pixels. */
export const WINDOW_HEIGHT = 480;
