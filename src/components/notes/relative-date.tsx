import { formatDistanceToNow } from "date-fns";
import type { Locale as DateLocale } from "date-fns/locale";
import { enUS, es, ptBR } from "date-fns/locale";
import { useI18n } from "@/hooks/use-i18n";
import type { Locale } from "@/i18n";

const DATE_LOCALES: Record<Locale, DateLocale> = {
	"pt-BR": ptBR,
	en: enUS,
	es,
};

function useDateLocale(): DateLocale {
	const { locale } = useI18n();
	return DATE_LOCALES[locale];
}

type RelativeDateProps = {
	date: Date;
};

type CompactRelativeDateProps = {
	date: Date;
};

export function RelativeDate({ date }: RelativeDateProps) {
	const locale = useDateLocale();
	const formatted = formatDistanceToNow(date, { addSuffix: true, locale });
	return (
		<p className="px-6 pt-4 text-[11px] text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
			{formatted}
		</p>
	);
}

export function CompactRelativeDate({ date }: CompactRelativeDateProps) {
	const locale = useDateLocale();
	const formatted = formatDistanceToNow(date, { addSuffix: true, locale });
	return <>{formatted}</>;
}
