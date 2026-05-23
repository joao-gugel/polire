import { SpinnerIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { PageLayout } from "@/components/page-layout";
import { useNav } from "@/providers/nav";
import type { View } from "@/types";

type Props = {
	activeView: View;
	title: string;
	resultLabel: string;
	original: string;
	result: string;
	status: "idle" | "loading" | "success" | "error";
	error: string | null;
};

export function TransformationResult({
	activeView,
	title,
	resultLabel,
	original,
	result,
	status,
	error,
}: Props) {
	const { current, pop } = useNav();

	useEffect(() => {
		if (current !== activeView) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Backspace") return;
			event.preventDefault();
			pop();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeView, current, pop]);

	return (
		<PageLayout title={title}>
			<div className="flex flex-col gap-4 px-5 py-4">
				<TextPanel label="Original" text={original} />
				<section className="flex flex-col gap-2">
					<SectionHeader label={resultLabel} />
					{status === "loading" && (
						<div className="flex h-24 items-center justify-center rounded-xl bg-zinc-900/5 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
							<SpinnerIcon size={18} weight="bold" className="animate-spin" />
						</div>
					)}
					{status === "success" && <TextBox text={result} />}
					{status === "error" && (
						<p className="rounded-xl bg-zinc-900/5 px-3 py-4 text-sm text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
							{error}
						</p>
					)}
				</section>
			</div>
		</PageLayout>
	);
}

function TextPanel({ label, text }: { label: string; text: string }) {
	return (
		<section className="flex flex-col gap-2">
			<SectionHeader label={label} />
			<TextBox text={text} />
		</section>
	);
}

function TextBox({ text }: { text: string }) {
	return (
		<textarea
			readOnly
			value={text}
			className="h-24 w-full resize-none rounded-xl bg-zinc-900/5 px-3 py-3 text-sm text-zinc-800 outline-none dark:bg-white/10 dark:text-zinc-100"
		/>
	);
}

function SectionHeader({ label }: { label: string }) {
	return (
		<p className="font-medium text-[11px] text-zinc-600 uppercase tracking-wider dark:text-zinc-400">
			{label}
		</p>
	);
}
