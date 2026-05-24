/** Languages the user can translate text into. `englishName` is what is sent
 * to the AI prompt; `nativeName` is what is shown in the picker. */

export type LanguageCode =
	| "en"
	| "es"
	| "pt"
	| "fr"
	| "de"
	| "it"
	| "nl"
	| "sv"
	| "pl"
	| "tr"
	| "ru"
	| "ar"
	| "zh"
	| "ja"
	| "ko"
	| "hi";

export type LanguageDef = {
	code: LanguageCode;
	englishName: string;
	nativeName: string;
};

export const LANGUAGES: LanguageDef[] = [
	{ code: "en", englishName: "English", nativeName: "English" },
	{ code: "es", englishName: "Spanish", nativeName: "Español" },
	{ code: "pt", englishName: "Portuguese", nativeName: "Português" },
	{ code: "fr", englishName: "French", nativeName: "Français" },
	{ code: "de", englishName: "German", nativeName: "Deutsch" },
	{ code: "it", englishName: "Italian", nativeName: "Italiano" },
	{ code: "nl", englishName: "Dutch", nativeName: "Nederlands" },
	{ code: "sv", englishName: "Swedish", nativeName: "Svenska" },
	{ code: "pl", englishName: "Polish", nativeName: "Polski" },
	{ code: "tr", englishName: "Turkish", nativeName: "Türkçe" },
	{ code: "ru", englishName: "Russian", nativeName: "Русский" },
	{ code: "ar", englishName: "Arabic", nativeName: "العربية" },
	{ code: "zh", englishName: "Chinese (Simplified)", nativeName: "中文" },
	{ code: "ja", englishName: "Japanese", nativeName: "日本語" },
	{ code: "ko", englishName: "Korean", nativeName: "한국어" },
	{ code: "hi", englishName: "Hindi", nativeName: "हिन्दी" },
];

const LANGUAGE_BY_CODE = new Map(LANGUAGES.map((lang) => [lang.code, lang]));

export function findLanguage(code: LanguageCode): LanguageDef | undefined {
	return LANGUAGE_BY_CODE.get(code);
}

/** Lowercase + strip diacritics so searches like `portugues` match `Portugu\u00eas`. */
export function normalizeSearchString(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
}

/** Filter languages by a free-text query against native, English and locale-specific names. */
export function filterLanguages(
	query: string,
	getLocalizedName: (code: LanguageCode) => string,
): LanguageDef[] {
	const trimmed = query.trim();
	if (!trimmed) return LANGUAGES;
	const needle = normalizeSearchString(trimmed);
	return LANGUAGES.filter((language) => {
		return (
			normalizeSearchString(language.nativeName).includes(needle) ||
			normalizeSearchString(language.englishName).includes(needle) ||
			normalizeSearchString(getLocalizedName(language.code)).includes(needle)
		);
	});
}
