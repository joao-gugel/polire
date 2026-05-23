import { useEffect, useRef, useState } from "react";
import { ApiKeyInput } from "@/components/ai-settings/api-key-input";
import { ProviderList } from "@/components/ai-settings/provider-list";
import {
	DEFAULT_MODELS,
	PROVIDER_OPTIONS,
} from "@/components/ai-settings/provider-options";
import { PageLayout } from "@/components/ui/page-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { useNav } from "@/hooks/use-nav";
import type { AiProvider, AiSettingsStatus } from "../../electron/ai/types";

const INPUT_INDEX = PROVIDER_OPTIONS.length;
const TOTAL_ITEMS = PROVIDER_OPTIONS.length + 1;

export function AiSettings() {
	const { current, pop } = useNav();
	const isActive = current === "ai-settings";
	const [settings, setSettings] = useState<AiSettingsStatus | null>(null);
	const [selected, setSelected] = useState(0);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });
	const [apiKey, setApiKey] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [saving, setSaving] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		window.api.ai.getSettings().then((status) => {
			setSettings(status);
			const index = PROVIDER_OPTIONS.findIndex((p) => p.id === status.provider);
			if (index >= 0) setSelected(index);
		});
	}, []);

	async function selectProvider(provider: AiProvider) {
		const next = { provider, model: DEFAULT_MODELS[provider] };
		const status = await window.api.ai.saveSettings(next);
		setSettings(status);
		setApiKey("");
	}

	async function saveKey() {
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
	}

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
		const handleKeyDown = async (event: KeyboardEvent) => {
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
					if (!settings || !apiKey.trim() || saving) return;
					setSaving(true);
					try {
						const status = await window.api.ai.saveApiKey(
							settings.provider,
							apiKey,
						);
						setSettings(status);
						setApiKey("");
					} catch (error) {
						console.error("Failed to save API key:", error);
					} finally {
						setSaving(false);
					}
					return;
				}
				setConfirmation((current) => ({
					index: selected,
					sequence: current.sequence + 1,
				}));
				const provider = PROVIDER_OPTIONS[selected].id;
				const next = { provider, model: DEFAULT_MODELS[provider] };
				const status = await window.api.ai.saveSettings(next);
				setSettings(status);
				setApiKey("");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, pop, settings, apiKey, saving]);

	return (
		<PageLayout title="IA">
			<div className="flex flex-col gap-4 px-2 py-3">
				<section>
					<SectionHeader label="Provider" />
					<ProviderList
						activeProvider={settings?.provider}
						selected={selected}
						confirmation={confirmation}
						onHover={setSelected}
						onSelect={selectProvider}
					/>
				</section>

				<section>
					<SectionHeader label="Chave da API" />
					<ApiKeyInput
						hasSavedKey={settings?.hasApiKey ?? false}
						value={apiKey}
						selected={selected === INPUT_INDEX}
						visible={showKey}
						saving={saving}
						inputRef={inputRef}
						onChange={setApiKey}
						onFocus={() => setSelected(INPUT_INDEX)}
						onToggleVisibility={() => setShowKey((value) => !value)}
						onSave={saveKey}
					/>
				</section>
			</div>
		</PageLayout>
	);
}
