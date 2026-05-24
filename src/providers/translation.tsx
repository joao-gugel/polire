import { createContext, type ReactNode, useState } from "react";
import { useI18n } from "@/hooks/use-i18n";

type TranslationState = {
	original: string;
	translated: string;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

export type TranslationContextValue = {
	state: TranslationState;
	translateToEnglish: (text: string) => Promise<void>;
};

const INITIAL_STATE: TranslationState = {
	original: "",
	translated: "",
	status: "idle",
	error: null,
};

export const TranslationContext = createContext<TranslationContextValue | null>(
	null,
);

type TranslationProviderProps = {
	children: ReactNode;
};

export function TranslationProvider({ children }: TranslationProviderProps) {
	const { t } = useI18n();
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
				error: t("translation.error"),
			});
		}
	}

	return (
		<TranslationContext.Provider value={{ state, translateToEnglish }}>
			{children}
		</TranslationContext.Provider>
	);
}
