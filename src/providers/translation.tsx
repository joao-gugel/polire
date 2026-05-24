import { createContext, type ReactNode, useState } from "react";
import { useI18n } from "@/hooks/use-i18n";

type TranslationState = {
	original: string;
	translated: string;
	targetLanguage: string;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

export type TranslationContextValue = {
	state: TranslationState;
	draft: string;
	setDraft: (text: string) => void;
	translate: (text: string, targetLanguage: string) => Promise<void>;
};

const INITIAL_STATE: TranslationState = {
	original: "",
	translated: "",
	targetLanguage: "",
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
	const [draft, setDraft] = useState("");

	async function translate(text: string, targetLanguage: string) {
		setState({
			original: text,
			translated: "",
			targetLanguage,
			status: "loading",
			error: null,
		});
		try {
			const result = await window.api.ai.transform({
				kind: "translate",
				text,
				targetLanguage,
			});
			setState({
				original: text,
				translated: result.text,
				targetLanguage,
				status: "success",
				error: null,
			});
		} catch {
			setState({
				original: text,
				translated: "",
				targetLanguage,
				status: "error",
				error: t("translation.error"),
			});
		}
	}

	return (
		<TranslationContext.Provider value={{ state, draft, setDraft, translate }}>
			{children}
		</TranslationContext.Provider>
	);
}
