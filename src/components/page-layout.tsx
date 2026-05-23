import { CaretLeftIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Footer } from "@/components/ui/footer";
import { useNav } from "@/providers/nav";

type Props = {
	title: string;
	children: ReactNode;
};

/**
 * Standard layout for non-root views: header with a back button, divider,
 * scrollable content slot, and the shared footer. Back is wired straight to
 * the nav stack so views don't have to thread `onBack` props.
 */
export function PageLayout({ title, children }: Props) {
	const { pop } = useNav();
	return (
		<>
			<header className="flex items-center gap-3 px-4 py-4">
				<button
					type="button"
					onClick={pop}
					className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-zinc-700 outline-none transition-colors hover:bg-zinc-900/5 focus:outline-none focus-visible:outline-none dark:text-zinc-300 dark:hover:bg-white/10"
				>
					<CaretLeftIcon size={16} weight="bold" />
				</button>
				<h1 className="font-medium text-base text-zinc-900 dark:text-zinc-50">
					{title}
				</h1>
			</header>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="flex-1 overflow-y-auto">{children}</div>
			<Footer />
		</>
	);
}
