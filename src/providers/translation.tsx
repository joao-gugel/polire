import { createContext, type ReactNode, useContext, useState } from "react";

type TranslationState = {
	original: string;
	translated: string;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

type TranslationContextValue = {
	state: TranslationState;
	translateToEnglish: (text: string) => Promise<void>;
};

const INITIAL_STATE: TranslationState = {
	original: "",
	translated: "",
	status: "idle",
	error: null,
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<TranslationState>(INITIAL_STATE);

	async function translateToEnglish(text: string) {
		setState({
			original: text,
			translated: "",
			status: "loading",
			error: null,
		});
		try {
			const result = await window.api.ai.transform({
				kind: "translate",
				text,
				targetLanguage: "English",
			});
			setState({
				original: text,
				translated: result.text,
				status: "success",
				error: null,
			});
		} catch {
			setState({
				original: text,
				translated: "",
				status: "error",
				error: "Não foi possível traduzir o texto. Verifique sua API key.",
			});
		}
	}

	return (
		<TranslationContext.Provider value={{ state, translateToEnglish }}>
			{children}
		</TranslationContext.Provider>
	);
}

export function useTranslation(): TranslationContextValue {
	const context = useContext(TranslationContext);
	if (!context) {
		throw new Error("useTranslation must be used within a TranslationProvider");
	}
	return context;
}
