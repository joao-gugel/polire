import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Kbd } from "@/components/ui/kbd";

type HintProps = {
	label: ReactNode;
	/** Single key/icon — auto-wrapped in a Kbd. Ignored when `keys` is provided. */
	kbd?: ReactNode;
	/** Pre-composed key group (e.g. `ctrl + del`) — rendered as-is, not wrapped. */
	keys?: ReactNode;
};

function HintKbd({ kbd, keys }: Pick<HintProps, "kbd" | "keys">) {
	if (keys !== undefined) return <>{keys}</>;
	return <Kbd>{kbd}</Kbd>;
}

/** Read-only "label + key" pair shown next to controls and in footers. */
export function Hint({ label, kbd, keys }: HintProps) {
	return (
		<span className="flex items-center gap-1.5">
			<span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
				{label}
			</span>
			<HintKbd kbd={kbd} keys={keys} />
		</span>
	);
}

type HintButtonProps = HintProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
		/** Optional icon rendered before the label. */
		leading?: ReactNode;
		/** Visual treatment for inline hints or floating controls over content. */
		variant?: "ghost" | "solid";
	};

const HINT_BUTTON_VARIANT_CLASSES = {
	ghost: "hover:bg-zinc-900/5 dark:hover:bg-white/10",
	solid:
		"bg-white shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
} satisfies Record<NonNullable<HintButtonProps["variant"]>, string>;

/** Same look as Hint, but clickable with the ghost hover used across the app. */
export function HintButton({
	label,
	kbd,
	keys,
	leading,
	variant = "ghost",
	className,
	...rest
}: HintButtonProps) {
	return (
		<button
			type="button"
			{...rest}
			className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-zinc-700 outline-none transition-colors focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 ${HINT_BUTTON_VARIANT_CLASSES[variant]} ${className ?? ""}`}
		>
			{leading}
			<span className="font-medium text-sm">{label}</span>
			<HintKbd kbd={kbd} keys={keys} />
		</button>
	);
}
