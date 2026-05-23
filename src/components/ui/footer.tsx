import { ArrowElbowDownLeftIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Hint } from "@/components/ui/hint";
import polireMark from "../../../assets/brand/polire-mark.svg";

export function Footer({ additionalHint }: { additionalHint?: ReactNode }) {
	return (
		<footer className="flex items-center justify-between border-zinc-900/8 border-t bg-zinc-50/40 px-4 py-3 dark:border-white/10 dark:bg-black/20">
			<div className="flex items-center gap-1.5">
				<img src={polireMark} alt="" className="h-4 w-4" />
				<p className="text-base text-zinc-700 dark:text-zinc-300">Polire</p>
			</div>
			<div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300">
				{additionalHint}
				{additionalHint && (
					<span className="text-zinc-300 dark:text-zinc-600">|</span>
				)}
				<Hint label="Fechar" kbd="esc" />
				<span className="text-zinc-300 dark:text-zinc-600">|</span>
				<Hint
					label="Enviar"
					kbd={<ArrowElbowDownLeftIcon size={11} weight="bold" />}
				/>
			</div>
		</footer>
	);
}
