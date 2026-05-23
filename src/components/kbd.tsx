import type { ReactNode } from "react";

type KbdProps = {
	children: ReactNode;
};

export function Kbd({ children }: KbdProps) {
	return (
		<kbd className="inline-flex h-6 min-w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white px-1 font-medium font-sans text-[11px] text-zinc-600">
			{children}
		</kbd>
	);
}
