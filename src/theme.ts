/**
 * Theme manager — persists the user choice and toggles a `.dark` class on the
 * document root so Tailwind's `dark:` utilities work. Applied at module load
 * so there is no flash of unstyled content before React mounts.
 */

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "mend:theme";

function isTheme(value: unknown): value is Theme {
	return value === "light" || value === "dark" || value === "system";
}

function resolvesToDark(theme: Theme): boolean {
	if (theme === "dark") return true;
	if (theme === "light") return false;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle("dark", resolvesToDark(theme));
}

/** Reads the persisted theme, falling back to "system" when nothing is stored. */
export function getStoredTheme(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);
	return isTheme(stored) ? stored : "system";
}

/** Persists the chosen theme and updates the document root immediately. */
export function setTheme(theme: Theme) {
	localStorage.setItem(STORAGE_KEY, theme);
	applyTheme(theme);
}

applyTheme(getStoredTheme());
