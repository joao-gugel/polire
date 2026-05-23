import { ArrowElbowDownLeftIcon, SparkleIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Kbd } from "./kbd";

export function Footer() {
	return (
		<footer className="flex items-center justify-between border-zinc-200/60 border-t bg-zinc-50/50 px-4 py-3">
			<div className="flex items-center gap-1.5">
				<SparkleIcon size={16} weight="fill" className="text-zinc-500" />
				<p className="text-zinc-500 text-base">Mend</p>
			</div>
			<div className="flex items-center gap-3 text-xs text-zinc-500">
				<Hint label="Fechar" kbd="esc" />
				<span className="text-zinc-200">|</span>
				<Hint
					label="Enviar"
					kbd={<ArrowElbowDownLeftIcon size={11} weight="bold" />}
				/>
			</div>
		</footer>
	);
}

type HintProps = {
	label: string;
	kbd: ReactNode;
};

function Hint({ label, kbd }: HintProps) {
	return (
		<span className="flex items-center gap-1.5">
			<span className="text-zinc-500 font-medium text-sm">{label}</span>
			<Kbd>{kbd}</Kbd>
		</span>
	);
}
