import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import { RelativeDate } from "@/components/notes/relative-date";
import type { Note } from "../../../electron/notes/types";

type Props = {
	note: Note | null;
	textareaRef: RefObject<HTMLTextAreaElement>;
	onChange: (content: string) => void;
	onBlur: (content: string) => void;
	onKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
};

export function NoteEditor({
	note,
	textareaRef,
	onChange,
	onBlur,
	onKeyDown,
}: Props) {
	return (
		<section className="flex flex-1 flex-col overflow-hidden">
			{note ? (
				<>
					<RelativeDate date={new Date(note.updatedAt)} />
					<textarea
						ref={textareaRef}
						defaultValue={note.content}
						onChange={(event) => onChange(event.target.value)}
						onBlur={(event) => onBlur(event.target.value)}
						onKeyDown={onKeyDown}
						placeholder="Escreva sua nota..."
						spellCheck={false}
						className="min-h-0 flex-1 resize-none bg-transparent px-6 pt-2 pb-5 text-[15px] text-zinc-800 leading-relaxed outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
					/>
				</>
			) : (
				<p className="px-6 pt-5 text-sm text-zinc-500 dark:text-zinc-400">
					Salve um texto pela paleta para criar sua primeira nota.
				</p>
			)}
		</section>
	);
}
