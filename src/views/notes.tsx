import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "motion/react";
import {
	type KeyboardEvent as ReactKeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { PageLayout } from "@/components/page-layout";
import { Footer } from "@/components/ui/footer";
import { Kbd } from "@/components/ui/kbd";
import { useNav } from "@/providers/nav";
import { useNotes } from "@/providers/notes";
import type { Note } from "../../electron/notes/types";

const SELECTION_LAYOUT_ID = "notes-selection";
const SAVE_DELAY_MS = 300;

export function Notes() {
	const { current, pop } = useNav();
	const { notes, loadNotes, updateNote, removeNote } = useNotes();
	const isActive = current === "notes";
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected =
		notes.find((note) => note.id === selectedId) ?? notes[0] ?? null;
	const selectedIndex = selected
		? notes.findIndex((note) => note.id === selected.id)
		: -1;
	const [draft, setDraft] = useState("");
	const [removing, setRemoving] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		if (!isActive) return;
		void loadNotes();
	}, [isActive, loadNotes]);

	useEffect(() => {
		if (!selected || selected.id === selectedId) return;
		setSelectedId(selected.id);
	}, [selected, selectedId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset the editor only when selecting a different note
	useEffect(() => {
		setDraft(selected?.content ?? "");
	}, [selected?.id]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: focus follows activation and selection, not note save responses
	useEffect(() => {
		if (!isActive || selectedIndex < 0) return;
		itemRefs.current[selectedIndex]?.focus();
	}, [isActive, selectedId, notes.length]);

	useEffect(() => {
		if (!selected || draft === selected.content) return;
		const timeout = window.setTimeout(() => {
			void updateNote(selected.id, draft);
		}, SAVE_DELAY_MS);
		return () => window.clearTimeout(timeout);
	}, [draft, selected, updateNote]);

	const focusItem = useCallback((index: number) => {
		itemRefs.current[index]?.focus();
	}, []);

	const saveDraft = useCallback(() => {
		if (!selected || draft === selected.content) return;
		void updateNote(selected.id, draft);
	}, [selected, draft, updateNote]);

	const removeSelectedNote = useCallback(async () => {
		if (!selected || removing) return;
		setRemoving(true);
		try {
			await removeNote(selected.id);
		} finally {
			setRemoving(false);
		}
	}, [selected, removing, removeNote]);

	useEffect(() => {
		if (!isActive || !selected) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Delete" || !event.ctrlKey) return;
			event.preventDefault();
			void removeSelectedNote();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, removeSelectedNote]);

	useEffect(() => {
		if (!isActive) return;
		const handleBackspace = (event: KeyboardEvent) => {
			if (event.key !== "Backspace") return;
			if (event.target === textareaRef.current) return;
			event.preventDefault();
			pop();
		};
		window.addEventListener("keydown", handleBackspace);
		return () => window.removeEventListener("keydown", handleBackspace);
	}, [isActive, pop]);

	const selectNote = useCallback(
		(id: string) => {
			saveDraft();
			setSelectedId(id);
		},
		[saveDraft],
	);

	const moveSelection = useCallback(
		(delta: number) => {
			if (selectedIndex < 0 || notes.length === 0) return;
			const nextIndex = (selectedIndex + delta + notes.length) % notes.length;
			selectNote(notes[nextIndex].id);
			focusItem(nextIndex);
		},
		[selectedIndex, notes, selectNote, focusItem],
	);

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
			footer={
				<Footer
					additionalHint={
						selected ? (
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
			}
		>
			<div className="flex h-full w-full">
				<div className="flex w-56 shrink-0 flex-col gap-0.5 overflow-y-auto px-2 py-2">
					<AnimatePresence initial={false}>
						{notes.map((note, index) => (
							<NoteListItem
								key={note.id}
								innerRef={(element) => {
									itemRefs.current[index] = element;
								}}
								note={note}
								selected={note.id === selected?.id}
								tabbable={note.id === selected?.id}
								onSelect={() => selectNote(note.id)}
								onKeyDown={handleItemKeyDown}
							/>
						))}
					</AnimatePresence>
					{notes.length === 0 && (
						<p className="px-3 py-4 text-xs text-zinc-500 dark:text-zinc-400">
							Nenhuma nota salva.
						</p>
					)}
				</div>
				<div className="w-px bg-zinc-900/8 dark:bg-white/10" />
				<section className="flex flex-1 flex-col overflow-hidden">
					{selected ? (
						<>
							<RelativeDate date={new Date(selected.updatedAt)} />
							<textarea
								ref={textareaRef}
								value={draft}
								onChange={(event) => setDraft(event.target.value)}
								onBlur={saveDraft}
								onKeyDown={handleEditorKeyDown}
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
			</div>
		</PageLayout>
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
	const preview = useMemo(() => extractPreview(note.content), [note.content]);
	const date = useRelativeDate(new Date(note.updatedAt));
	return (
		<motion.button
			layout
			ref={innerRef}
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
					{date}
				</p>
			</div>
		</motion.button>
	);
}

function RelativeDate({ date }: { date: Date }) {
	const formatted = useRelativeDate(date);
	return (
		<p className="px-6 pt-4 text-[11px] text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
			{formatted}
		</p>
	);
}

/** Re-renders every 30s so relative timestamps stay accurate while the view is open. */
function useRelativeDate(date: Date) {
	const [, tick] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => tick((value) => value + 1), 30_000);
		return () => clearInterval(interval);
	}, []);
	return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

function extractPreview(content: string): string {
	const firstLine = content.split("\n").find((line) => line.trim().length > 0);
	if (!firstLine) return "";
	return firstLine.replace(/^[-•*\d.)\s]+/, "").trim() || firstLine.trim();
}
