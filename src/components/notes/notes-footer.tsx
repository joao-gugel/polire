import { Footer } from "@/components/ui/footer";
import { Kbd } from "@/components/ui/kbd";
import { useI18n } from "@/hooks/use-i18n";

type NotesFooterProps = {
	canRemove: boolean;
};

export function NotesFooter({ canRemove }: NotesFooterProps) {
	const { t } = useI18n();
	return (
		<Footer
			additionalHint={
				canRemove ? (
					<span className="flex items-center gap-1.5">
						<span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
							{t("notes.deleteHint")}
						</span>
						<Kbd>ctrl</Kbd>
						<span className="text-zinc-400 dark:text-zinc-500">+</span>
						<Kbd>del</Kbd>
					</span>
				) : undefined
			}
		/>
	);
}
