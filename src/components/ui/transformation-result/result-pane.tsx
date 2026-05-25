import { SpinnerIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CopyAction } from "@/components/ui/transformation-result/copy-action";
import type { ResultPane } from "@/components/ui/transformation-result/pane-toggle";
import { useI18n } from "@/hooks/use-i18n";

const ROTATION_INTERVAL_MS = 1800;

type ResultTextPaneProps = {
	pane: ResultPane;
	text: string;
	copied: boolean;
	onCopy: () => void;
};

type ErrorPaneProps = {
	message: string | null;
};

export function ResultTextPane({
	pane,
	text,
	copied,
	onCopy,
}: ResultTextPaneProps) {
	return (
		<>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={pane}
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -4 }}
					transition={{ duration: 0.16, ease: "easeOut" }}
					className="absolute inset-0 overflow-y-auto px-5 pt-1 pb-12"
				>
					<p className="whitespace-pre-wrap wrap-break-word text-[15px] text-zinc-800 leading-relaxed dark:text-zinc-100">
						{text}
					</p>
				</motion.div>
			</AnimatePresence>
			<div className="absolute right-2 bottom-2 z-10">
				<CopyAction copied={copied} onCopy={onCopy} />
			</div>
		</>
	);
}

export function LoadingPane() {
	const { messages } = useI18n();
	const rotation = messages.transforming.messages;
	const [index, setIndex] = useState(() =>
		Math.floor(Math.random() * rotation.length),
	);

	useEffect(() => {
		if (rotation.length <= 1) return;
		const id = window.setInterval(() => {
			setIndex((value) => (value + 1) % rotation.length);
		}, ROTATION_INTERVAL_MS);
		return () => window.clearInterval(id);
	}, [rotation.length]);

	const current = rotation[index] ?? "";

	return (
		<div className="flex items-center gap-2.5 px-5 pt-6 text-zinc-500 dark:text-zinc-400">
			<SpinnerIcon size={18} weight="bold" className="animate-spin" />
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={current}
					initial={{ opacity: 0, y: 2 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -2 }}
					transition={{ duration: 0.18, ease: "easeOut" }}
					className="text-base"
				>
					{current}
				</motion.span>
			</AnimatePresence>
		</div>
	);
}

export function ErrorPane({ message }: ErrorPaneProps) {
	return (
		<div className="flex h-full items-center justify-center px-6">
			<p className="text-center text-sm text-zinc-700 dark:text-zinc-200">
				{message}
			</p>
		</div>
	);
}
