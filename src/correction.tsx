import { createContext, type ReactNode, useContext, useState } from "react";

type CorrectionState = {
	original: string;
	corrected: string;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

type CorrectionContextValue = {
	state: CorrectionState;
	correctText: (text: string) => Promise<void>;
};

const INITIAL_STATE: CorrectionState = {
	original: "",
	corrected: "",
	status: "idle",
	error: null,
};

const CorrectionContext = createContext<CorrectionContextValue | null>(null);

export function CorrectionProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<CorrectionState>(INITIAL_STATE);

	async function correctText(text: string) {
		setState({ original: text, corrected: "", status: "loading", error: null });
		try {
			const result = await window.api.ai.transform({
				kind: "improve",
				text,
				tone: "preserve",
			});
			setState({
				original: text,
				corrected: result.text,
				status: "success",
				error: null,
			});
		} catch {
			setState({
				original: text,
				corrected: "",
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

export function useCorrection(): CorrectionContextValue {
	const context = useContext(CorrectionContext);
	if (!context) {
		throw new Error("useCorrection must be used within a CorrectionProvider");
	}
	return context;
}
