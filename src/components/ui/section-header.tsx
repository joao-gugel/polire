export function SectionHeader({ label }: { label: string }) {
	return (
		<p className="px-3 pb-2 font-medium text-[11px] text-zinc-600 uppercase tracking-wider dark:text-zinc-400">
			{label}
		</p>
	);
}
