import { useContext } from "react";
import {
	TranslationContext,
	type TranslationContextValue,
} from "@/providers/translation-context";

export function useTranslation(): TranslationContextValue {
	const context = useContext(TranslationContext);
	if (!context) {
		throw new Error(
			"useTranslation must be used within a TranslationProvider.",
		);
	}
	return context;
}
