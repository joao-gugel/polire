import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import type { Note } from "../../electron/notes/types";

type NotesContextValue = {
	notes: Note[];
	loadNotes: () => Promise<void>;
	createNote: (content: string) => Promise<Note>;
	updateNote: (id: string, content: string) => Promise<Note>;
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
	const [notes, setNotes] = useState<Note[]>([]);

	const loadNotes = useCallback(async () => {
		setNotes(await window.api.notes.list());
	}, []);

	const createNote = useCallback(async (content: string) => {
		const note = await window.api.notes.create(content);
		setNotes((current) => [note, ...current]);
		return note;
	}, []);

	const updateNote = useCallback(async (id: string, content: string) => {
		const updated = await window.api.notes.update(id, content);
		setNotes((current) =>
			current.map((note) => (note.id === id ? updated : note)),
		);
		return updated;
	}, []);

	return (
		<NotesContext.Provider value={{ notes, loadNotes, createNote, updateNote }}>
			{children}
		</NotesContext.Provider>
	);
}

export function useNotes() {
	const context = useContext(NotesContext);
	if (!context) throw new Error("useNotes must be used within NotesProvider.");
	return context;
}
