import type { Messages } from "@/i18n/locales/pt-BR";

export const es: Messages = {
	common: {
		close: "Cerrar",
		send: "Enviar",
		copy: "Copiar",
		copied: "Copiado",
		copyText: "Copiar texto",
		original: "Original",
	},
	palette: {
		placeholder: "Escribe o pega tu texto...",
		options: {
			correction: "Corregir texto",
			translation: "Traducir al inglés",
			saveNote: "Guardar nota",
			openNotes: "Abrir notas",
			settings: "Ajustes",
		},
	},
	settings: {
		title: "Ajustes",
		sections: {
			general: "General",
			theme: "Tema",
			language: "Idioma",
		},
		ai: "IA",
		theme: {
			light: "Claro",
			dark: "Oscuro",
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
			provider: "Proveedor",
			apiKey: "Clave de API",
		},
		apiKey: {
			placeholder: "Pega tu clave y presiona enter",
			placeholderWithSaved: "•••••••• (pega una nueva y presiona enter)",
		},
	},
	correction: {
		title: "Corregir texto",
		resultLabel: "Corregido",
		error: "No se pudo corregir el texto. Verifica tu clave de API.",
	},
	translation: {
		title: "Traducir al inglés",
		resultLabel: "Traducción",
		error: "No se pudo traducir el texto. Verifica tu clave de API.",
	},
	notes: {
		title: "Notas",
		placeholder: "Escribe tu nota...",
		empty: "No hay notas guardadas.",
		newNote: "Nueva nota",
		emptyHint: "Guarda un texto desde la paleta para crear tu primera nota.",
		deleteHint: "Eliminar",
	},
	result: {
		showChanges: "Ver cambios ({{count}})",
		hideChanges: "Ocultar cambios",
	},
};
