import { ArrowElbowDownLeftIcon, SparkleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Hint } from "@/components/ui/hint";

export function Footer({ additionalHint }: { additionalHint?: ReactNode }) {
	return (
		<footer className="flex items-center justify-between border-zinc-900/8 border-t bg-zinc-50/40 px-4 py-3 dark:border-white/10 dark:bg-black/20">
			<div className="flex items-center gap-1.5">
				<SparkleIcon
					size={16}
					weight="fill"
					className="text-zinc-700 dark:text-zinc-300"
				/>
				<p className="text-base text-zinc-700 dark:text-zinc-300">Mend</p>
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
