import { createContext } from "react";

export type TranslationState = {
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

export const TranslationContext = createContext<TranslationContextValue | null>(
	null,
);
