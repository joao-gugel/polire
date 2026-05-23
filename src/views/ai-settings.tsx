import {
	CheckCircleIcon,
	EyeIcon,
	EyeSlashIcon,
	PaperPlaneRightIcon,
	SpinnerIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AiProvider, AiSettingsStatus } from "../../electron/ai/types";
import anthropicLogo from "../assets/providers/anthropic.png";
import deepseekLogo from "../assets/providers/deepseek.png";
import googleLogo from "../assets/providers/google-gemini.png";
import openaiLogo from "../assets/providers/openai.svg";
import { PageLayout } from "../components/page-layout";
import { OptionItem, OptionItemCheck } from "../components/ui/option-item";
import { useNav } from "../nav";

type ProviderOption = {
	id: AiProvider;
	label: string;
	logo: string;
	invertInDarkMode?: boolean;
	logoClassName?: string;
};

const PROVIDER_LAYOUT_ID = "ai-provider-selection";

const PROVIDERS: ProviderOption[] = [
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

const INPUT_INDEX = PROVIDERS.length;
const TOTAL_ITEMS = PROVIDERS.length + 1;

const DEFAULT_MODELS: Record<AiProvider, string> = {
	openai: "gpt-5.4",
	anthropic: "claude-haiku-4-5",
	google: "gemini-2.0-flash",
	deepseek: "deepseek-v4-flash",
};

export function AiSettings() {
	const { current, pop } = useNav();
	const isActive = current === "ai-settings";
	const [settings, setSettings] = useState<AiSettingsStatus | null>(null);
	const [selected, setSelected] = useState(0);
	const [apiKey, setApiKey] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [saving, setSaving] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		window.api.ai.getSettings().then((status) => {
			setSettings(status);
			const index = PROVIDERS.findIndex((p) => p.id === status.provider);
			if (index >= 0) setSelected(index);
		});
	}, []);

	const selectProvider = useCallback(async (provider: AiProvider) => {
		const next = { provider, model: DEFAULT_MODELS[provider] };
		const status = await window.api.ai.saveSettings(next);
		setSettings(status);
		setApiKey("");
	}, []);

	const saveKey = useCallback(async () => {
		if (!settings || !apiKey.trim() || saving) return;
		setSaving(true);
		try {
			const status = await window.api.ai.saveApiKey(settings.provider, apiKey);
			setSettings(status);
			setApiKey("");
		} catch (error) {
			console.error("Failed to save API key:", error);
		} finally {
			setSaving(false);
		}
	}, [settings, apiKey, saving]);

	useEffect(() => {
		if (!isActive) return;
		const moveSelection = (delta: number) => {
			const next = (selected + delta + TOTAL_ITEMS) % TOTAL_ITEMS;
			setSelected(next);
			if (next === INPUT_INDEX) {
				inputRef.current?.focus();
				return;
			}
			if (document.activeElement === inputRef.current) {
				inputRef.current?.blur();
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			const inInput = event.target === inputRef.current;

			if (event.key === "Backspace" && !inInput) {
				event.preventDefault();
				pop();
				return;
			}
			if (event.key === "ArrowDown") {
				event.preventDefault();
				moveSelection(1);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				moveSelection(-1);
				return;
			}
			if (event.key === "Tab") {
				event.preventDefault();
				moveSelection(event.shiftKey ? -1 : 1);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				if (selected === INPUT_INDEX) {
					saveKey();
					return;
				}
				selectProvider(PROVIDERS[selected].id);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, pop, selectProvider, saveKey]);

	return (
		<PageLayout title="IA">
			<div className="flex flex-col gap-4 px-2 py-3">
				<section>
					<SectionHeader label="Provider" />
					<div className="flex flex-col gap-0.5">
						{PROVIDERS.map((option, index) => (
							<OptionItem
								key={option.id}
								label={option.label}
								selected={index === selected}
								layoutId={PROVIDER_LAYOUT_ID}
								leading={
									<img
										src={option.logo}
										alt=""
										className={`relative h-5 w-5 object-contain ${option.logoClassName ?? ""} ${
											option.invertInDarkMode ? "dark:invert" : ""
										}`}
									/>
								}
								trailing={
									option.id === settings?.provider ? (
										<OptionItemCheck />
									) : undefined
								}
								onHover={() => setSelected(index)}
								onSelect={() => selectProvider(option.id)}
							/>
						))}
					</div>
				</section>

				<section>
					<SectionHeader label="Chave da API" />
					<div className="relative px-2">
						<input
							ref={inputRef}
							type={showKey ? "text" : "password"}
							value={apiKey}
							onChange={(event) => setApiKey(event.target.value)}
							onFocus={() => setSelected(INPUT_INDEX)}
							placeholder={
								settings?.hasApiKey
									? "•••••••• (cole uma nova e aperte enter)"
									: "Cole sua chave e aperte enter"
							}
							className={`h-11 w-full rounded-xl pr-16 pl-12 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400 border ${
								selected === INPUT_INDEX
									? "border-zinc-900/8 dark:border-white/15"
									: "border-zinc-900/5 dark:border-white/10"
							}`}
						/>
						<button
							type="button"
							onClick={() => setShowKey((value) => !value)}
							className="-translate-y-1/2 absolute top-1/2 left-4.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-600 outline-none transition-colors hover:bg-zinc-900/5 hover:text-zinc-900 focus:outline-none focus-visible:outline-none dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50"
						>
							{showKey ? (
								<EyeSlashIcon size={16} weight="regular" />
							) : (
								<EyeIcon size={16} weight="regular" />
							)}
						</button>
						<div className="-translate-y-1/2 absolute top-1/2 right-4.5 flex items-center gap-1">
							{!saving && !apiKey && settings?.hasApiKey && (
								<CheckCircleIcon
									size={16}
									weight="fill"
									className="text-emerald-600 dark:text-emerald-400"
								/>
							)}
							<button
								type="button"
								onClick={saveKey}
								disabled={!apiKey.trim() || saving}
								className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 outline-none transition-colors enabled:cursor-pointer enabled:hover:bg-zinc-900/5 enabled:hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:outline-none dark:text-zinc-400 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-zinc-50"
							>
								{saving ? (
									<SpinnerIcon
										size={16}
										weight="bold"
										className="animate-spin"
									/>
								) : (
									<PaperPlaneRightIcon size={16} weight="bold" />
								)}
							</button>
						</div>
					</div>
				</section>
			</div>
		</PageLayout>
	);
}

function SectionHeader({ label }: { label: string }) {
	return (
		<p className="px-3 pb-2 font-medium text-[11px] text-zinc-600 uppercase tracking-wider dark:text-zinc-400">
			{label}
		</p>
	);
}
