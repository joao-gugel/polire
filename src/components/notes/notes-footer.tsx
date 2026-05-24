import { Footer } from "@/components/ui/footer";
import { HintButton } from "@/components/ui/hint";
import { Kbd } from "@/components/ui/kbd";
import { useI18n } from "@/hooks/use-i18n";

type NotesFooterProps = {
	canRemove: boolean;
};

function dispatchCtrlDelete() {
	window.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "Delete",
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		}),
	);
}

export function NotesFooter({ canRemove }: NotesFooterProps) {
	const { t } = useI18n();
	return (
		<Footer
			additionalHint={
				canRemove ? (
					<HintButton
						onClick={dispatchCtrlDelete}
						label={t("notes.deleteHint")}
						keys={
							<span className="inline-flex items-center gap-0.5">
								<Kbd>ctrl</Kbd>
								<span className="text-zinc-400 dark:text-zinc-500">+</span>
								<Kbd>del</Kbd>
							</span>
						}
					/>
				) : undefined
			}
		/>
	);
}
