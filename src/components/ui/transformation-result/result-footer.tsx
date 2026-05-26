import { AnimatePresence, motion } from "motion/react";
import { HintButton } from "@/components/ui/hint";
import { HintsScroll } from "@/components/ui/transformation-result/hints-scroll";
import { useI18n } from "@/hooks/use-i18n";
import type { TransformHint } from "../../../../electron/modules/ai/types";

type ResultFooterProps = {
	hasDiff: boolean;
	expanded: boolean;
	onToggle: () => void;
	hints: TransformHint[];
};

export function ResultFooter({
	hasDiff,
	expanded,
	onToggle,
	hints,
}: ResultFooterProps) {
	const { t } = useI18n();
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
								expanded
									? t("result.hideChanges")
									: t("result.showChanges", { count: hints.length })
							}
							kbd="D"
						/>
					)}
				</div>
				<div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
					<HintButton
						onClick={() => void window.api.hide()}
						label={t("common.close")}
						kbd="esc"
					/>
				</div>
			</div>
		</div>
	);
}
