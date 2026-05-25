import {
	createContext,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	getMessages,
	getStoredLocale,
	type Locale,
	setStoredLocale,
	translate,
} from "@/i18n";
import type { Messages } from "@/i18n/locales/pt-BR";

type TranslateParams = Record<string, string | number>;

export type I18nContextValue = {
	locale: Locale;
	messages: Messages;
	setLocale: (locale: Locale) => void;
	t: (key: string, params?: TranslateParams) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
	children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
	const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

	const value = useMemo<I18nContextValue>(() => {
		const messages = getMessages(locale);
		return {
			locale,
			messages,
			setLocale: (next) => {
				setStoredLocale(next);
				setLocaleState(next);
			},
			t: (key, params) => translate(messages, key, params),
		};
	}, [locale]);

	useEffect(() => {
		const { open, quit } = value.messages.tray;
		window.api.setTrayLabels({ open, quit });
	}, [value.messages]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
