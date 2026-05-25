import { createContext } from "react";
import type { TransformHint } from "../../electron/ai/types";

export type CorrectionState = {
	original: string;
	corrected: string;
	hints: TransformHint[];
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

export type CorrectionContextValue = {
	state: CorrectionState;
	correctText: (text: string) => Promise<void>;
};

export const CorrectionContext = createContext<CorrectionContextValue | null>(
	null,
);
