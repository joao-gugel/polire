import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
	getMessages,
	getStoredLocale,
	type Locale,
	setStoredLocale,
	translate,
} from "@/i18n";
import { I18nContext, type I18nContextValue } from "@/providers/i18n-context";

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
		window.api.setUpdateLabels(value.messages.update);
	}, [value.messages]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
