import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { HintButton } from "@/components/ui/hint";
import { useI18n } from "@/hooks/use-i18n";

type CopyActionProps = {
	copied: boolean;
	onCopy: () => void;
};

type CopyLeadingProps = {
	copied: boolean;
};

type CopySwapLabelProps = {
	copied: boolean;
};

export function CopyAction({ copied, onCopy }: CopyActionProps) {
	const { t } = useI18n();
	return (
		<HintButton
			onClick={onCopy}
			kbd="C"
			aria-label={t("common.copyText")}
			leading={<CopyLeading copied={copied} />}
			label={<CopySwapLabel copied={copied} />}
		/>
	);
}

function CopyLeading({ copied }: CopyLeadingProps) {
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

function CopySwapLabel({ copied }: CopySwapLabelProps) {
	const { t } = useI18n();
	return (
		<span className="relative inline-block">
			<span className="invisible">{t("common.copied")}</span>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={copied ? "copied" : "copy"}
					initial={{ opacity: 0, y: -3 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 3 }}
					transition={{ duration: 0.14 }}
					className="absolute inset-0"
				>
					{copied ? t("common.copied") : t("common.copy")}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}
