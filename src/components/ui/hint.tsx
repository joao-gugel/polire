import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Kbd } from "@/components/ui/kbd";

type HintProps = {
	label: ReactNode;
	kbd: ReactNode;
};

/** Read-only "label + key" pair shown next to controls and in footers. */
export function Hint({ label, kbd }: HintProps) {
	return (
		<span className="flex items-center gap-1.5">
			<span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
				{label}
			</span>
			<Kbd>{kbd}</Kbd>
		</span>
	);
}

type HintButtonProps = HintProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
		/** Optional icon rendered before the label. */
		leading?: ReactNode;
	};

/** Same look as Hint, but clickable with the ghost hover used across the app. */
export function HintButton({
	label,
	kbd,
	leading,
	className,
	...rest
}: HintButtonProps) {
	return (
		<button
			type="button"
			{...rest}
			className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-zinc-700 outline-none transition-colors hover:bg-zinc-900/5 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/10 ${className ?? ""}`}
		>
			{leading}
			<span className="font-medium text-sm">{label}</span>
			<Kbd>{kbd}</Kbd>
		</button>
	);
}
