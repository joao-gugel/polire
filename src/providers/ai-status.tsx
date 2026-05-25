import { type ReactNode, use, useState } from "react";
import { AiStatusContext } from "@/providers/ai-status-context";
import type { AiSettingsStatus } from "../../electron/ai/types";

let initialStatusPromise: Promise<AiSettingsStatus> | null = null;

function getInitialStatusPromise(): Promise<AiSettingsStatus> {
	if (!initialStatusPromise) {
		initialStatusPromise = window.api.ai.getSettings();
	}
	return initialStatusPromise;
}

type AiStatusProviderProps = {
	children: ReactNode;
};

/**
 * Loads the AI configuration once on mount through React's `use()` hook so the
 * surrounding Suspense boundary covers the (very brief) IPC round-trip. After
 * that, the cached status is held in plain state and updated synchronously by
 * `setStatus` — typically right after the user saves a provider/key.
 */
export function AiStatusProvider({ children }: AiStatusProviderProps) {
	const initialStatus = use(getInitialStatusPromise());
	const [status, setStatus] = useState(initialStatus);
	return (
		<AiStatusContext.Provider value={{ status, setStatus }}>
			{children}
		</AiStatusContext.Provider>
	);
}
