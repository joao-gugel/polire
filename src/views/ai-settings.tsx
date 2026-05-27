import { useEffect, useRef, useState } from "react";
import { ApiKeyInput } from "@/components/ai-settings/api-key-input";
import { ProviderList } from "@/components/ai-settings/provider-list";
import {
	DEFAULT_MODELS,
	PROVIDER_OPTIONS,
} from "@/components/ai-settings/provider-options";
import { PageLayout } from "@/components/ui/page-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { useAiStatus } from "@/hooks/use-ai-status";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";
import type { AiProvider } from "../../electron/modules/ai/types";

const INPUT_INDEX = PROVIDER_OPTIONS.length;
const TOTAL_ITEMS = PROVIDER_OPTIONS.length + 1;

export function AiSettings() {
	const { t } = useI18n();
	const { current, pop } = useNav();
	const { status, setStatus } = useAiStatus();
	const isActive = current === "ai-settings";
	const [selected, setSelected] = useState(() => {
		const index = PROVIDER_OPTIONS.findIndex((p) => p.id === status.provider);
		return index >= 0 ? index : 0;
	});
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });
	const [apiKey, setApiKey] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [saving, setSaving] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	async function selectProvider(provider: AiProvider) {
		const next = { provider, model: DEFAULT_MODELS[provider] };
		const nextStatus = await window.api.ai.saveSettings(next);
		setStatus(nextStatus);
		setApiKey("");
	}

	async function saveKey() {
		if (!apiKey.trim() || saving) return;
		setSaving(true);
		try {
			const nextStatus = await window.api.ai.saveApiKey(
				status.provider,
				apiKey,
			);
			setStatus(nextStatus);
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
			if (event.key === "Escape") {
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
					if (!apiKey.trim() || saving) return;
					setSaving(true);
					try {
						const nextStatus = await window.api.ai.saveApiKey(
							status.provider,
							apiKey,
						);
						setStatus(nextStatus);
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
				const nextStatus = await window.api.ai.saveSettings(next);
				setStatus(nextStatus);
				setApiKey("");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, pop, status.provider, apiKey, saving, setStatus]);

	return (
		<PageLayout title={t("aiSettings.title")}>
			<div className="flex h-full flex-col gap-4 overflow-y-auto px-2 py-3">
				<p className="px-3 text-sm text-zinc-600 dark:text-zinc-400">
					{t("aiSettings.description")}
				</p>
				<section>
					<SectionHeader label={t("aiSettings.sections.provider")} />
					<ProviderList
						activeProvider={status.provider}
						selected={selected}
						confirmation={confirmation}
						onHover={setSelected}
						onSelect={selectProvider}
					/>
				</section>

				<section>
					<SectionHeader label={t("aiSettings.sections.apiKey")} />
					<ApiKeyInput
						hasSavedKey={status.hasApiKey}
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
