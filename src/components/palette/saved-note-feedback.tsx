import { CheckIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

type SavedNoteFeedbackProps = {
	sequence: number;
};

export function SavedNoteFeedback({ sequence }: SavedNoteFeedbackProps) {
	return (
		<AnimatePresence>
			{sequence > 0 && (
				<motion.div
					key={sequence}
					initial={{ opacity: 0, y: 4, scale: 0.97 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -4, scale: 0.97 }}
					transition={{ duration: 0.16, ease: "easeOut" }}
					className="pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300"
				>
					<CheckIcon size={13} weight="bold" />
					Nota salva
				</motion.div>
			)}
		</AnimatePresence>
	);
}
