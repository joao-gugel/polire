import { createContext, type ReactNode, useState } from "react";
import type { TransformHint } from "../../electron/ai/types";

type CorrectionState = {
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

const INITIAL_STATE: CorrectionState = {
	original: "",
	corrected: "",
	hints: [],
	status: "idle",
	error: null,
};

export const CorrectionContext = createContext<CorrectionContextValue | null>(
	null,
);

export function CorrectionProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<CorrectionState>(INITIAL_STATE);

	async function correctText(text: string) {
		setState({
			original: text,
			corrected: "",
			hints: [],
			status: "loading",
			error: null,
		});
		try {
			const result = await window.api.ai.transform({
				kind: "improve",
				text,
				tone: "preserve",
			});
			setState({
				original: text,
				corrected: result.text,
				hints: result.hints ?? [],
				status: "success",
				error: null,
			});
		} catch {
			setState({
				original: text,
				corrected: "",
				hints: [],
				status: "error",
				error: "Não foi possível corrigir o texto. Verifique sua API key.",
			});
		}
	}

	return (
		<CorrectionContext.Provider value={{ state, correctText }}>
			{children}
		</CorrectionContext.Provider>
	);
}
