import { CheckIcon, CopyIcon, SpinnerIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { PageLayout } from "@/components/page-layout";
import { Hint, HintButton } from "@/components/ui/hint";
import { useNav } from "@/providers/nav";
import type { View } from "@/types";
import type { TransformHint } from "../../electron/ai/types";

type Props = {
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

type Pane = "original" | "result";

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
}: Props) {
	const { current, pop } = useNav();
	const [pane, setPane] = useState<Pane>("result");
	const [hintsExpanded, setHintsExpanded] = useState(false);
	const [copied, setCopied] = useState(false);

	const visibleText = pane === "original" ? original : result;
	const canInteract = status === "success";
	const hasHints = !!hints && hints.length > 0;
	const hasDiff = hasHints && original !== result;

	useEffect(() => {
		if (status === "loading") {
			setPane("result");
			setHintsExpanded(false);
		}
	}, [status]);

	useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 1400);
		return () => clearTimeout(timeout);
	}, [copied]);

	const togglePane = useCallback(() => {
		setPane((value) => (value === "result" ? "original" : "result"));
	}, []);

	const copy = useCallback(async () => {
		if (!canInteract) return;
		await navigator.clipboard.writeText(visibleText);
		setCopied(true);
	}, [canInteract, visibleText]);

	const toggleHints = useCallback(() => {
		setHintsExpanded((value) => !value);
	}, []);

	useEffect(() => {
		if (current !== activeView) return;
		const handler = (event: KeyboardEvent) => {
			if (event.key === "Backspace") {
				event.preventDefault();
				pop();
				return;
			}
			if (event.ctrlKey || event.metaKey || event.altKey) return;
			if (!canInteract) return;
			const key = event.key.toLowerCase();
			if (key === "t") {
				event.preventDefault();
				togglePane();
				return;
			}
			if (key === "c") {
				event.preventDefault();
				void copy();
				return;
			}
			if (key === "d" && hasDiff) {
				event.preventDefault();
				toggleHints();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [
		activeView,
		current,
		pop,
		canInteract,
		hasDiff,
		togglePane,
		copy,
		toggleHints,
	]);

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
										{visibleText}
									</p>
								</motion.div>
							</AnimatePresence>

							<div className="absolute right-2 bottom-2 z-10">
								<HintButton
									onClick={copy}
									kbd="C"
									aria-label="Copiar texto"
									leading={<CopyLeading copied={copied} />}
									label={<CopySwapLabel copied={copied} />}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</PageLayout>
	);
}

type PaneToggleProps = {
	pane: Pane;
	onChange: (pane: Pane) => void;
	originalLabel: string;
	resultLabel: string;
};

function PaneToggle({
	pane,
	onChange,
	originalLabel,
	resultLabel,
}: PaneToggleProps) {
	return (
		<div className="relative inline-flex items-center rounded-lg bg-zinc-900/5 p-0.5 dark:bg-white/10">
			<PaneToggleOption
				active={pane === "original"}
				onClick={() => onChange("original")}
			>
				{originalLabel}
			</PaneToggleOption>
			<PaneToggleOption
				active={pane === "result"}
				onClick={() => onChange("result")}
			>
				{resultLabel}
			</PaneToggleOption>
		</div>
	);
}

function PaneToggleOption({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="relative z-10 cursor-pointer rounded-md px-2.5 py-1 font-medium text-sm text-zinc-600 transition-colors dark:text-zinc-400 data-[active=true]:text-zinc-900 dark:data-[active=true]:text-zinc-50"
			data-active={active}
		>
			{active && (
				<motion.span
					layoutId="pane-toggle-indicator"
					className="absolute inset-0 -z-10 rounded-md bg-white shadow-sm dark:bg-white/15"
					transition={{ type: "spring", stiffness: 500, damping: 40 }}
				/>
			)}
			{children}
		</button>
	);
}

function CopyLeading({ copied }: { copied: boolean }) {
	return (
		<span className="relative flex h-3.25 w-3.25 items-center justify-center">
			<AnimatePresence mode="wait" initial={false}>
				{copied ? (
					<motion.span
						key="check"
						initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
						animate={{ scale: 1, opacity: 1, rotate: 0 }}
						exit={{ scale: 0.5, opacity: 0 }}
						transition={{ type: "spring", stiffness: 500, damping: 22 }}
						className="absolute inset-0 flex items-center justify-center text-zinc-500 dark:text-zinc-400"
					>
						<CheckIcon size={13} weight="bold" />
					</motion.span>
				) : (
					<motion.span
						key="copy"
						initial={{ scale: 0.85, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.85, opacity: 0 }}
						transition={{ duration: 0.14 }}
						className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500"
					>
						<CopyIcon size={13} weight="bold" />
					</motion.span>
				)}
			</AnimatePresence>
		</span>
	);
}

function CopySwapLabel({ copied }: { copied: boolean }) {
	return (
		<span className="relative inline-block">
			<span className="invisible">Copiado</span>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={copied ? "copied" : "copy"}
					initial={{ opacity: 0, y: -3 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 3 }}
					transition={{ duration: 0.14 }}
					className="absolute inset-0"
				>
					{copied ? "Copiado" : "Copiar"}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}

function LoadingPane() {
	return (
		<div className="flex h-full items-center justify-center text-zinc-500 dark:text-zinc-400">
			<SpinnerIcon size={20} weight="bold" className="animate-spin" />
		</div>
	);
}

function ErrorPane({ message }: { message: string | null }) {
	return (
		<div className="flex h-full items-center justify-center px-6">
			<p className="text-center text-sm text-zinc-700 dark:text-zinc-200">
				{message}
			</p>
		</div>
	);
}

type ResultFooterProps = {
	hasDiff: boolean;
	expanded: boolean;
	onToggle: () => void;
	hints: TransformHint[];
};

function ResultFooter({
	hasDiff,
	expanded,
	onToggle,
	hints,
}: ResultFooterProps) {
	return (
		<div className="border-zinc-900/8 border-t bg-zinc-50/40 dark:border-white/10 dark:bg-black/20">
			<AnimatePresence initial={false}>
				{hasDiff && expanded && (
					<motion.div
						key="hints"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
						className="overflow-hidden"
					>
						<HintsScroll hints={hints} />
					</motion.div>
				)}
			</AnimatePresence>
			<div className="flex items-center justify-between gap-3 px-3 py-2">
				<div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
					{hasDiff && (
						<HintButton
							onClick={onToggle}
							label={
								expanded ? "Ocultar mudanças" : `Ver mudanças (${hints.length})`
							}
							kbd="D"
						/>
					)}
				</div>
				<div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
					<Hint label="Fechar" kbd="esc" />
				</div>
			</div>
		</div>
	);
}

function HintsScroll({ hints }: { hints: TransformHint[] }) {
	const ref = useDragScroll<HTMLDivElement>();
	return (
		<div className="border-zinc-900/8 border-b px-3 py-3 dark:border-white/10">
			<div
				ref={ref}
				className="-mx-1 flex cursor-grab gap-2 overflow-x-auto px-1 select-none active:cursor-grabbing mask-[linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [&::-webkit-scrollbar]:hidden"
			>
				{hints.map((hint) => (
					<HintCard
						key={`${hint.original}→${hint.corrected}|${hint.explanation}`}
						hint={hint}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * Drag-to-scroll for horizontal lists. Uses pointer capture so the drag keeps
 * working even when the cursor leaves the element. Click events are suppressed
 * after a real drag so child interactions aren't triggered by accident.
 */
function useDragScroll<T extends HTMLElement>() {
	const ref = useRef<T | null>(null);
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		let active = false;
		let startX = 0;
		let startScroll = 0;
		let moved = false;

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			active = true;
			moved = false;
			startX = event.clientX;
			startScroll = element.scrollLeft;
			element.setPointerCapture(event.pointerId);
		};
		const onPointerMove = (event: PointerEvent) => {
			if (!active) return;
			const dx = event.clientX - startX;
			if (Math.abs(dx) > 3) moved = true;
			element.scrollLeft = startScroll - dx;
		};
		const release = (event: PointerEvent) => {
			if (!active) return;
			active = false;
			try {
				element.releasePointerCapture(event.pointerId);
			} catch {
				/* pointer already released */
			}
		};
		const onClickCapture = (event: MouseEvent) => {
			if (!moved) return;
			event.stopPropagation();
			event.preventDefault();
			moved = false;
		};

		element.addEventListener("pointerdown", onPointerDown);
		element.addEventListener("pointermove", onPointerMove);
		element.addEventListener("pointerup", release);
		element.addEventListener("pointercancel", release);
		element.addEventListener("click", onClickCapture, true);
		return () => {
			element.removeEventListener("pointerdown", onPointerDown);
			element.removeEventListener("pointermove", onPointerMove);
			element.removeEventListener("pointerup", release);
			element.removeEventListener("pointercancel", release);
			element.removeEventListener("click", onClickCapture, true);
		};
	}, []);
	return ref;
}

function HintCard({ hint }: { hint: TransformHint }) {
	return (
		<div className="flex w-64 shrink-0 flex-col gap-1.5 rounded-lg border border-zinc-900/8 bg-white/70 px-2.5 py-2 dark:border-white/10 dark:bg-white/5">
			<div className="flex items-center gap-1.5">
				<span className="truncate rounded bg-red-500/10 px-1.5 py-0.5 text-[12px] text-red-700 line-through decoration-red-600/60 dark:bg-red-500/15 dark:text-red-300 dark:decoration-red-400/60">
					{hint.original}
				</span>
				<span className="shrink-0 text-zinc-400 text-[11px] dark:text-zinc-500">
					→
				</span>
				<span className="truncate rounded bg-emerald-500/10 px-1.5 py-0.5 text-[12px] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
					{hint.corrected}
				</span>
			</div>
			<p className="line-clamp-2 text-[12px] text-zinc-600 leading-snug dark:text-zinc-400">
				{hint.explanation}
			</p>
		</div>
	);
}
