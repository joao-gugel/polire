import { createContext } from "react";
import type { AiSettingsStatus } from "../../electron/ai/types";

export type AiStatusContextValue = {
	status: AiSettingsStatus;
	setStatus: (status: AiSettingsStatus) => void;
};

export const AiStatusContext = createContext<AiStatusContextValue | null>(null);
