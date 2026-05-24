import { Footer } from "@/components/ui/footer";
import { Kbd } from "@/components/ui/kbd";

type NotesFooterProps = {
	canRemove: boolean;
};

export function NotesFooter({ canRemove }: NotesFooterProps) {
	return (
		<Footer
			additionalHint={
				canRemove ? (
					<span className="flex items-center gap-1.5">
						<span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
							Apagar
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
