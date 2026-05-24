import { AnimatePresence, motion } from "motion/react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { CompactRelativeDate } from "@/components/notes/relative-date";
import type { Note } from "../../../electron/notes/types";

const SELECTION_LAYOUT_ID = "notes-selection";

type NoteListProps = {
	notes: Note[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
	registerItemRef: (index: number, element: HTMLButtonElement | null) => void;
};

export function NoteList({
	notes,
	selectedId,
	onSelect,
	onKeyDown,
	registerItemRef,
}: NoteListProps) {
	return (
		<div className="flex w-56 shrink-0 flex-col gap-0.5 overflow-y-auto px-2 py-2">
			<AnimatePresence initial={false}>
				{notes.map((note, index) => (
					<NoteListItem
						key={note.id}
						innerRef={(element) => registerItemRef(index, element)}
						note={note}
						selected={note.id === selectedId}
						tabbable={note.id === selectedId}
						onSelect={() => onSelect(note.id)}
						onKeyDown={onKeyDown}
					/>
				))}
			</AnimatePresence>
			{notes.length === 0 && (
				<p className="px-3 py-4 text-xs text-zinc-500 dark:text-zinc-400">
					Nenhuma nota salva.
				</p>
			)}
		</div>
	);
}

type NoteListItemProps = {
	note: Note;
	selected: boolean;
	tabbable: boolean;
	onSelect: () => void;
	onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
	innerRef: (element: HTMLButtonElement | null) => void;
};

function NoteListItem({
	note,
	selected,
	tabbable,
	onSelect,
	onKeyDown,
	innerRef,
}: NoteListItemProps) {
	const preview = extractPreview(note.content);
	return (
		<motion.button
			layout
			ref={innerRef}
			autoFocus={selected}
			type="button"
			onClick={onSelect}
			onKeyDown={onKeyDown}
			tabIndex={tabbable ? 0 : -1}
			data-selected={selected || undefined}
			exit={{ opacity: 0, x: -12, height: 0, paddingTop: 0, paddingBottom: 0 }}
			transition={{ duration: 0.18, ease: "easeOut" }}
			className="relative w-full cursor-pointer overflow-hidden rounded-xl px-3 py-2.5 text-left outline-none focus:outline-none focus-visible:outline-none"
		>
			{selected && (
				<motion.div
					layoutId={SELECTION_LAYOUT_ID}
					transition={{ duration: 0.08, ease: "easeOut" }}
					className="absolute inset-0 rounded-xl bg-zinc-900/5 dark:bg-white/10"
				/>
			)}
			<div className="relative min-w-0">
				<p
					className={`truncate text-sm transition-colors ${
						selected
							? "font-medium text-zinc-900 dark:text-zinc-50"
							: "text-zinc-700 dark:text-zinc-200"
					}`}
				>
					{preview || "Nova nota"}
				</p>
				<p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
					<CompactRelativeDate date={new Date(note.updatedAt)} />
				</p>
			</div>
		</motion.button>
	);
}

function extractPreview(content: string): string {
	const firstLine = content.split("\n").find((line) => line.trim().length > 0);
	if (!firstLine) return "";
	return firstLine.replace(/^[-•*\d.)\s]+/, "").trim() || firstLine.trim();
}
