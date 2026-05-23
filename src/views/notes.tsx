import {
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteList } from "@/components/notes/note-list";
import { NotesFooter } from "@/components/notes/notes-footer";
import { PageLayout } from "@/components/ui/page-layout";
import { useNav } from "@/hooks/use-nav";
import { useNotes } from "@/hooks/use-notes";

const SAVE_DELAY_MS = 300;

export function Notes() {
	const { current, pop } = useNav();
	const { notes, updateNote, removeNote } = useNotes();
	const isActive = current === "notes";
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected =
		notes.find((note) => note.id === selectedId) ?? notes[0] ?? null;
	const selectedIndex = selected
		? notes.findIndex((note) => note.id === selected.id)
		: -1;
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const pendingSaveRef = useRef<number | null>(null);
	const removingNoteIdRef = useRef<string | null>(null);

	function discardPendingSave() {
		if (pendingSaveRef.current === null) return;
		window.clearTimeout(pendingSaveRef.current);
		pendingSaveRef.current = null;
	}

	function saveContent(id: string, content: string) {
		discardPendingSave();
		void updateNote(id, content);
	}

	function scheduleSave(id: string, content: string) {
		discardPendingSave();
		const timeout = window.setTimeout(() => {
			pendingSaveRef.current = null;
			void updateNote(id, content);
		}, SAVE_DELAY_MS);
		pendingSaveRef.current = timeout;
	}

	function focusItem(index: number) {
		itemRefs.current[index]?.focus();
	}

	function selectNote(id: string) {
		setSelectedId(id);
	}

	function moveSelection(delta: number) {
		if (selectedIndex < 0 || notes.length === 0) return;
		const nextIndex = (selectedIndex + delta + notes.length) % notes.length;
		setSelectedId(notes[nextIndex].id);
		focusItem(nextIndex);
	}

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Backspace" && event.target !== textareaRef.current) {
				event.preventDefault();
				pop();
				return;
			}
			if (event.key !== "Delete" || !event.ctrlKey || !selected) return;
			event.preventDefault();
			if (removingNoteIdRef.current) return;
			if (pendingSaveRef.current !== null) {
				window.clearTimeout(pendingSaveRef.current);
				pendingSaveRef.current = null;
			}
			const nextIndex =
				selectedIndex === notes.length - 1
					? selectedIndex - 1
					: selectedIndex + 1;
			const next = notes[nextIndex] ?? null;
			setSelectedId(next?.id ?? null);
			if (next) itemRefs.current[nextIndex]?.focus();
			removingNoteIdRef.current = selected.id;
			void removeNote(selected.id).finally(() => {
				removingNoteIdRef.current = null;
			});
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, notes, selected, selectedIndex, pop, removeNote]);

	function handleItemKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			moveSelection(1);
			return;
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			moveSelection(-1);
			return;
		}
		if (event.key === "Tab" && !event.shiftKey) {
			event.preventDefault();
			textareaRef.current?.focus();
		}
	}

	function handleEditorKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
		if (event.key !== "Tab") return;
		event.preventDefault();
		focusItem(selectedIndex);
	}

	return (
		<PageLayout
			title="Notas"
			footer={<NotesFooter canRemove={selected !== null} />}
		>
			<div className="flex h-full w-full">
				<NoteList
					notes={notes}
					selectedId={selected?.id ?? null}
					onSelect={selectNote}
					onKeyDown={handleItemKeyDown}
					registerItemRef={(index, element) => {
						itemRefs.current[index] = element;
					}}
				/>
				<div className="w-px bg-zinc-900/8 dark:bg-white/10" />
				<NoteEditor
					key={selected?.id ?? "empty"}
					note={selected}
					textareaRef={textareaRef}
					onChange={(content) => {
						if (!selected) return;
						scheduleSave(selected.id, content);
					}}
					onBlur={(content) => {
						if (!selected) return;
						if (removingNoteIdRef.current === selected.id) return;
						saveContent(selected.id, content);
					}}
					onKeyDown={handleEditorKeyDown}
				/>
			</div>
		</PageLayout>
	);
}
