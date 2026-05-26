import { createContext } from "react";
import type {
	TransformHint,
	WritingTone,
} from "../../electron/modules/ai/types";

export type CorrectionState = {
	original: string;
	corrected: string;
	hints: TransformHint[];
	tone: WritingTone;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

export type CorrectionContextValue = {
	state: CorrectionState;
	draft: string;
	setDraft: (text: string) => void;
	correctText: (text: string, tone?: WritingTone) => Promise<void>;
};

export const CorrectionContext = createContext<CorrectionContextValue | null>(
	null,
);
