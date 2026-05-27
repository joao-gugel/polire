import { useEffect, useState } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import {
	PaneToggle,
	type ResultPane,
} from "@/components/ui/transformation-result/pane-toggle";
import { ResultFooter } from "@/components/ui/transformation-result/result-footer";
import {
	ErrorPane,
	LoadingPane,
	ResultTextPane,
} from "@/components/ui/transformation-result/result-pane";
import { useNav } from "@/hooks/use-nav";
import type { View } from "@/types";
import type { TransformHint } from "../../../../electron/modules/ai/types";

type TransformationResultProps = {
	activeView: View;
	title: string;
	originalLabel: string;
	resultLabel: string;
	original: string;
	result: string;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
	hints?: TransformHint[];
};

export function TransformationResult({
	activeView,
	title,
	originalLabel,
	resultLabel,
	original,
	result,
	status,
	error,
	hints,
}: TransformationResultProps) {
	const { current, pop } = useNav();
	const [pane, setPane] = useState<ResultPane>("result");
	const [hintsExpanded, setHintsExpanded] = useState(false);
	const [copied, setCopied] = useState(false);
	const visibleText = pane === "original" ? original : result;
	const canInteract = status === "success";
	const hasHints = !!hints && hints.length > 0;
	const hasDiff = hasHints && original !== result;

	useEffect(() => {
		if (status !== "loading") return;
		setPane("result");
		setHintsExpanded(false);
	}, [status]);

	useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 1400);
		return () => clearTimeout(timeout);
	}, [copied]);

	async function copy() {
		if (!canInteract) return;
		await navigator.clipboard.writeText(visibleText);
		setCopied(true);
	}

	function toggleHints() {
		setHintsExpanded((value) => !value);
	}

	useEffect(() => {
		if (current !== activeView) return;
		const handler = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				pop();
				return;
			}
			if (event.ctrlKey || event.metaKey || event.altKey) return;
			if (!canInteract) return;
			const key = event.key.toLowerCase();
			if (key === "t") {
				event.preventDefault();
				setPane((value) => (value === "result" ? "original" : "result"));
				return;
			}
			if (key === "c") {
				event.preventDefault();
				void navigator.clipboard
					.writeText(visibleText)
					.then(() => setCopied(true));
				return;
			}
			if (key === "d" && hasDiff) {
				event.preventDefault();
				setHintsExpanded((value) => !value);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [activeView, current, pop, canInteract, hasDiff, visibleText]);

	return (
		<PageLayout
			title={title}
			footer={
				<ResultFooter
					hasDiff={hasDiff}
					expanded={hintsExpanded}
					onToggle={toggleHints}
					hints={hints ?? []}
				/>
			}
		>
			<div className="flex h-full w-full flex-col">
				{status === "success" && (
					<div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
						<PaneToggle
							pane={pane}
							onChange={setPane}
							originalLabel={originalLabel}
							resultLabel={resultLabel}
						/>
					</div>
				)}
				<div className="relative flex-1 overflow-hidden">
					{status === "loading" && <LoadingPane />}
					{status === "error" && <ErrorPane message={error} />}
					{status === "success" && (
						<ResultTextPane
							pane={pane}
							text={visibleText}
							copied={copied}
							onCopy={copy}
						/>
					)}
				</div>
			</div>
		</PageLayout>
	);
}
