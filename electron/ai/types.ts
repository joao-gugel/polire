/** Text transformations supported by the local AI execution layer. */
export type TransformRequest = ImproveTextRequest | TranslateTextRequest;

export type WritingTone =
	| "preserve"
	| "professional"
	| "casual"
	| "friendly"
	| "concise";

export type ImproveTextRequest = {
	kind: "improve";
	text: string;
	tone: WritingTone;
};

export type TranslateTextRequest = {
	kind: "translate";
	text: string;
	targetLanguage: string;
};

export type TransformHint = {
	original: string;
	corrected: string;
	explanation: string;
};

export type TransformResult = {
	text: string;
	hints?: TransformHint[];
};

/** Provider-independent prompt input ready to be passed to a text model. */
export type TransformPrompt = {
	system: string;
	prompt: string;
};

/** AI providers supported by the initial local configuration flow. */
export type AiProvider = "openai" | "anthropic" | "google" | "deepseek";

/** Non-secret preferences used to select the user's model. */
export type AiSettings = {
	provider: AiProvider;
	model: string;
};

/** Non-secret settings state that can be shown in the renderer. */
export type AiSettingsStatus = AiSettings & {
	hasApiKey: boolean;
};
