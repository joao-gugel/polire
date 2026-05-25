import { createContext } from "react";
import type { Locale } from "@/i18n";
import type { Messages } from "@/i18n/locales/pt-BR";

type TranslateParams = Record<string, string | number>;

export type I18nContextValue = {
	locale: Locale;
	messages: Messages;
	setLocale: (locale: Locale) => void;
	t: (key: string, params?: TranslateParams) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);
