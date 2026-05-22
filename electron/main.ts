import { app, globalShortcut, Menu } from 'electron';
import { SHORTCUT } from './constants';
import { createTray } from './tray';
import { createWindow, toggleWindow } from './window';

/** Register the global hotkey. Logs an error if the OS refuses the binding (already in use, missing permission, etc). */
function registerShortcuts() {
  const ok = globalShortcut.register(SHORTCUT, toggleWindow);
  if (!ok) console.error(`Failed to register global shortcut ${SHORTCUT}`);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  createTray();
  registerShortcuts();
});

app.on('will-quit', () => globalShortcut.unregisterAll());
// Keep the app alive in the tray when all windows are closed.
// Registering an empty listener overrides Electron's default quit-on-all-closed.
app.on('window-all-closed', () => {});
