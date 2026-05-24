import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatRelativeDate(date: Date) {
	return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

type RelativeDateProps = {
	date: Date;
};

type CompactRelativeDateProps = {
	date: Date;
};

export function RelativeDate({ date }: RelativeDateProps) {
	const formatted = formatRelativeDate(date);
	return (
		<p className="px-6 pt-4 text-[11px] text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
			{formatted}
		</p>
	);
}

export function CompactRelativeDate({ date }: CompactRelativeDateProps) {
	const formatted = formatRelativeDate(date);
	return <>{formatted}</>;
}
