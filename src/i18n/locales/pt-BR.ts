export type Messages = {
	common: {
		close: string;
		send: string;
		back: string;
		copy: string;
		copied: string;
		copyText: string;
		original: string;
	};
	palette: {
		placeholder: string;
		disabledAiHint: string;
		options: {
			correction: string;
			tone: string;
			translation: string;
			saveNote: string;
			openNotes: string;
			settings: string;
			onboardAi: string;
		};
	};
	settings: {
		title: string;
		sections: {
			general: string;
			theme: string;
			language: string;
		};
		ai: string;
		theme: {
			light: string;
			dark: string;
			system: string;
		};
		language: {
			"pt-BR": string;
			en: string;
			es: string;
		};
	};
	aiSettings: {
		title: string;
		description: string;
		sections: {
			provider: string;
			apiKey: string;
		};
		apiKey: {
			placeholder: string;
			placeholderWithSaved: string;
		};
	};
	onboarding: {
		title: string;
		options: {
			localKey: {
				label: string;
				description: string;
			};
		};
	};
	correction: {
		title: string;
		resultLabel: string;
		error: string;
	};
	tone: {
		title: string;
	};
	toneTarget: {
		title: string;
		tones: {
			professional: string;
			casual: string;
			friendly: string;
			concise: string;
			persuasive: string;
			playful: string;
		};
	};
	translation: {
		title: string;
		resultLabel: string;
		error: string;
	};
	translationTarget: {
		title: string;
		searchPlaceholder: string;
		recents: string;
		all: string;
		empty: string;
		languages: {
			en: string;
			es: string;
			pt: string;
			fr: string;
			de: string;
			it: string;
			nl: string;
			sv: string;
			pl: string;
			tr: string;
			ru: string;
			ar: string;
			zh: string;
			ja: string;
			ko: string;
			hi: string;
		};
	};
	notes: {
		title: string;
		placeholder: string;
		empty: string;
		newNote: string;
		emptyHint: string;
		deleteHint: string;
	};
	result: {
		showChanges: string;
		hideChanges: string;
	};
	tray: {
		open: string;
		quit: string;
	};
	transforming: {
		messages: string[];
	};
};

export const ptBR: Messages = {
	common: {
		close: "Fechar",
		send: "Enviar",
		back: "Voltar",
		copy: "Copiar",
		copied: "Copiado",
		copyText: "Copiar texto",
		original: "Original",
	},
	palette: {
		placeholder: "Escreva ou cole seu texto...",
		disabledAiHint: "Configure a IA para usar",
		options: {
			correction: "Corrigir texto",
			tone: "Mudar tonalidade",
			translation: "Traduzir",
			saveNote: "Salvar nota",
			openNotes: "Abrir notas",
			settings: "Configurações",
			onboardAi: "Começar a usar o Polire",
		},
	},
	settings: {
		title: "Configurações",
		sections: {
			general: "Geral",
			theme: "Tema",
			language: "Idioma",
		},
		ai: "IA",
		theme: {
			light: "Light",
			dark: "Dark",
			system: "Sistema",
		},
		language: {
			"pt-BR": "Português (Brasil)",
			en: "English",
			es: "Español",
		},
	},
	aiSettings: {
		title: "Usar minha própria chave de API",
		description:
			"Escolha um provedor e informe sua chave para corrigir e traduzir textos.",
		sections: {
			provider: "Provider",
			apiKey: "Chave da API",
		},
		apiKey: {
			placeholder: "Cole sua chave e aperte enter",
			placeholderWithSaved: "•••••••• (cole uma nova e aperte enter)",
		},
	},
	onboarding: {
		title: "Começar a usar o Polire",
		options: {
			localKey: {
				label: "Usar com minha chave de API",
				description:
					"Conecte um provedor de IA e use sua própria chave, sem custo extra.",
			},
		},
	},
	correction: {
		title: "Corrigir texto",
		resultLabel: "Corrigido",
		error: "Não foi possível corrigir o texto. Verifique sua API key.",
	},
	tone: {
		title: "Tom: {{name}}",
	},
	toneTarget: {
		title: "Mudar tonalidade",
		tones: {
			professional: "Profissional",
			casual: "Casual",
			friendly: "Amigável",
			concise: "Conciso",
			persuasive: "Persuasivo",
			playful: "Brincalhão",
		},
	},
	translation: {
		title: "Traduzir",
		resultLabel: "Tradução",
		error: "Não foi possível traduzir o texto. Verifique sua API key.",
	},
	translationTarget: {
		title: "Traduzir para",
		searchPlaceholder: "Buscar idioma...",
		recents: "Recentes",
		all: "Todos os idiomas",
		empty: "Nenhum idioma encontrado.",
		languages: {
			en: "Inglês",
			es: "Espanhol",
			pt: "Português",
			fr: "Francês",
			de: "Alemão",
			it: "Italiano",
			nl: "Holandês",
			sv: "Sueco",
			pl: "Polonês",
			tr: "Turco",
			ru: "Russo",
			ar: "Árabe",
			zh: "Chinês (Simplificado)",
			ja: "Japonês",
			ko: "Coreano",
			hi: "Hindi",
		},
	},
	notes: {
		title: "Notas",
		placeholder: "Escreva sua nota...",
		empty: "Nenhuma nota salva.",
		newNote: "Nova nota",
		emptyHint: "Salve um texto pela paleta para criar sua primeira nota.",
		deleteHint: "Apagar",
	},
	result: {
		showChanges: "Ver mudanças ({{count}})",
		hideChanges: "Ocultar mudanças",
	},
	tray: {
		open: "Abrir",
		quit: "Sair",
	},
	transforming: {
		messages: ["Polindo...", "Refinando...", "Pensando...", "Trabalhando..."],
	},
};
