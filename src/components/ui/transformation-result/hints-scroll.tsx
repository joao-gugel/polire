import { useDragScroll } from "@/hooks/use-drag-scroll";
import type { TransformHint } from "../../../../electron/modules/ai/types";

type HintsScrollProps = {
	hints: TransformHint[];
};

type HintCardProps = {
	hint: TransformHint;
};

export function HintsScroll({ hints }: HintsScrollProps) {
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

function HintCard({ hint }: HintCardProps) {
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
