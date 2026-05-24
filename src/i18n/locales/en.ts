import type { Messages } from "@/i18n/locales/pt-BR";

export const en: Messages = {
	common: {
		close: "Close",
		send: "Send",
		copy: "Copy",
		copied: "Copied",
		copyText: "Copy text",
		original: "Original",
	},
	palette: {
		placeholder: "Type or paste your text...",
		options: {
			correction: "Improve text",
			translation: "Translate",
			saveNote: "Save note",
			openNotes: "Open notes",
			settings: "Settings",
		},
	},
	settings: {
		title: "Settings",
		sections: {
			general: "General",
			theme: "Theme",
			language: "Language",
		},
		ai: "AI",
		theme: {
			light: "Light",
			dark: "Dark",
			system: "System",
		},
		language: {
			"pt-BR": "Português (Brasil)",
			en: "English",
			es: "Español",
		},
	},
	aiSettings: {
		title: "AI",
		sections: {
			provider: "Provider",
			apiKey: "API key",
		},
		apiKey: {
			placeholder: "Paste your key and press enter",
			placeholderWithSaved: "•••••••• (paste a new one and press enter)",
		},
	},
	correction: {
		title: "Improve text",
		resultLabel: "Improved",
		error: "Could not improve the text. Check your API key.",
	},
	translation: {
		title: "Translate",
		resultLabel: "Translation",
		error: "Could not translate the text. Check your API key.",
	},
	translationTarget: {
		title: "Translate to",
		searchPlaceholder: "Search language...",
		recents: "Recent",
		all: "All languages",
		empty: "No language found.",
		languages: {
			en: "English",
			es: "Spanish",
			pt: "Portuguese",
			fr: "French",
			de: "German",
			it: "Italian",
			nl: "Dutch",
			sv: "Swedish",
			pl: "Polish",
			tr: "Turkish",
			ru: "Russian",
			ar: "Arabic",
			zh: "Chinese (Simplified)",
			ja: "Japanese",
			ko: "Korean",
			hi: "Hindi",
		},
	},
	notes: {
		title: "Notes",
		placeholder: "Write your note...",
		empty: "No saved notes.",
		newNote: "New note",
		emptyHint: "Save a text from the palette to create your first note.",
		deleteHint: "Delete",
	},
	result: {
		showChanges: "Show changes ({{count}})",
		hideChanges: "Hide changes",
	},
};
