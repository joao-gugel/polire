import { ArrowElbowDownLeftIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { HintButton } from "@/components/ui/hint";
import { useI18n } from "@/hooks/use-i18n";
import polireMark from "../../../assets/brand/polire-mark.svg";

type FooterProps = {
	additionalHint?: ReactNode;
};

function dispatchEnter() {
	window.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "Enter",
			bubbles: true,
			cancelable: true,
		}),
	);
}

export function Footer({ additionalHint }: FooterProps) {
	const { t } = useI18n();
	return (
		<footer className="flex items-center justify-between border-zinc-900/8 border-t bg-zinc-50/40 px-4 py-3 dark:border-white/10 dark:bg-black/20">
			<div className="flex items-center gap-1.5">
				<img src={polireMark} alt="" className="h-5 w-5" />
				<p className="text-base text-zinc-700 dark:text-zinc-300">Polire</p>
			</div>
			<div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300">
				{additionalHint}
				{additionalHint && (
					<span className="px-1 text-zinc-300 dark:text-zinc-600">|</span>
				)}
				<HintButton
					onClick={() => void window.api.hide()}
					label={t("common.close")}
					kbd="esc"
				/>
				<span className="px-1 text-zinc-300 dark:text-zinc-600">|</span>
				<HintButton
					onClick={dispatchEnter}
					label={t("common.send")}
					kbd={<ArrowElbowDownLeftIcon size={11} weight="bold" />}
				/>
			</div>
		</footer>
	);
}
