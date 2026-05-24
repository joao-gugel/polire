export type Messages = {
	common: {
		close: string;
		send: string;
		copy: string;
		copied: string;
		copyText: string;
		original: string;
	};
	palette: {
		placeholder: string;
		options: {
			correction: string;
			translation: string;
			saveNote: string;
			openNotes: string;
			settings: string;
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
		sections: {
			provider: string;
			apiKey: string;
		};
		apiKey: {
			placeholder: string;
			placeholderWithSaved: string;
		};
	};
	correction: {
		title: string;
		resultLabel: string;
		error: string;
	};
	translation: {
		title: string;
		resultLabel: string;
		error: string;
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
};

export const ptBR: Messages = {
	common: {
		close: "Fechar",
		send: "Enviar",
		copy: "Copiar",
		copied: "Copiado",
		copyText: "Copiar texto",
		original: "Original",
	},
	palette: {
		placeholder: "Escreva ou cole seu texto...",
		options: {
			correction: "Corrigir texto",
			translation: "Traduzir para inglês",
			saveNote: "Salvar nota",
			openNotes: "Abrir notas",
			settings: "Configurações",
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
		title: "IA",
		sections: {
			provider: "Provider",
			apiKey: "Chave da API",
		},
		apiKey: {
			placeholder: "Cole sua chave e aperte enter",
			placeholderWithSaved: "•••••••• (cole uma nova e aperte enter)",
		},
	},
	correction: {
		title: "Corrigir texto",
		resultLabel: "Corrigido",
		error: "Não foi possível corrigir o texto. Verifique sua API key.",
	},
	translation: {
		title: "Traduzir para inglês",
		resultLabel: "Tradução",
		error: "Não foi possível traduzir o texto. Verifique sua API key.",
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
};
