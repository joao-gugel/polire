import { ArrowElbowDownLeftIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { HintButton } from "@/components/ui/hint";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";
import { useUpdateStatus } from "@/hooks/use-update-status";
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
	const { current, pop } = useNav();
	const availableVersion = useUpdateStatus();
	const isRootView = current === "palette";
	const handleEscapeAction = isRootView
		? () => void window.api.window.hide()
		: pop;
	return (
		<footer className="flex items-center justify-between border-zinc-900/8 border-t bg-zinc-50/40 px-4 py-3 dark:border-white/10 dark:bg-black/20">
			<div className="flex items-center gap-2.5">
				<button
					type="button"
					onClick={() => void window.api.app.openHomepage()}
					title="polire.app"
					className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-0.5 outline-none transition-colors hover:bg-zinc-900/5 focus:outline-none focus-visible:outline-none dark:hover:bg-white/10"
				>
					<img src={polireMark} alt="" className="h-5 w-5" />
					<p className="text-base text-zinc-700 dark:text-zinc-300">Polire</p>
				</button>
				{availableVersion && (
					<button
						type="button"
						onClick={() => void window.api.update.openReleases()}
						title={`v${availableVersion}`}
						className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 font-medium text-emerald-700 text-sm outline-none transition-colors hover:bg-emerald-500/10 focus:outline-none focus-visible:outline-none dark:text-emerald-400"
					>
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						{t("footer.downloadUpdate")}
					</button>
				)}
			</div>
			<div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300">
				{additionalHint}
				{additionalHint && (
					<span className="px-1 text-zinc-300 dark:text-zinc-600">|</span>
				)}
				<HintButton
					onClick={handleEscapeAction}
					label={t(isRootView ? "common.close" : "common.back")}
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
