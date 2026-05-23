import anthropicLogo from "@/assets/providers/anthropic.png";
import deepseekLogo from "@/assets/providers/deepseek.png";
import googleLogo from "@/assets/providers/google-gemini.png";
import openaiLogo from "@/assets/providers/openai.svg";
import type { AiProvider } from "../../../electron/ai/types";

export type ProviderOption = {
	id: AiProvider;
	label: string;
	logo: string;
	invertInDarkMode?: boolean;
	logoClassName?: string;
};

export const PROVIDER_OPTIONS: ProviderOption[] = [
	{ id: "openai", label: "OpenAI", logo: openaiLogo, invertInDarkMode: true },
	{ id: "anthropic", label: "Anthropic", logo: anthropicLogo },
	{ id: "google", label: "Google", logo: googleLogo },
	{
		id: "deepseek",
		label: "DeepSeek",
		logo: deepseekLogo,
		logoClassName: "scale-110",
	},
];

export const DEFAULT_MODELS: Record<AiProvider, string> = {
	openai: "gpt-5.4",
	anthropic: "claude-haiku-4-5",
	google: "gemini-2.0-flash",
	deepseek: "deepseek-v4-flash",
};
