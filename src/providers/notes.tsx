import { createContext, type ReactNode, useState } from "react";
import type { Note } from "../../electron/notes/types";

export type NotesContextValue = {
	notes: Note[];
	loadNotes: () => Promise<void>;
	createNote: (content: string) => Promise<Note>;
	updateNote: (id: string, content: string) => Promise<Note>;
	removeNote: (id: string) => Promise<void>;
};

export const NotesContext = createContext<NotesContextValue | null>(null);

type NotesProviderProps = {
	children: ReactNode;
};

export function NotesProvider({ children }: NotesProviderProps) {
	const [notes, setNotes] = useState<Note[]>([]);

	async function loadNotes() {
		setNotes(await window.api.notes.list());
	}

	async function createNote(content: string) {
		const note = await window.api.notes.create(content);
		setNotes((current) => [note, ...current]);
		return note;
	}

	async function updateNote(id: string, content: string) {
		const updated = await window.api.notes.update(id, content);
		setNotes((current) =>
			current.map((note) => (note.id === id ? updated : note)),
		);
		return updated;
	}

	async function removeNote(id: string) {
		await window.api.notes.remove(id);
		setNotes((current) => current.filter((note) => note.id !== id));
	}

	return (
		<NotesContext.Provider
			value={{ notes, loadNotes, createNote, updateNote, removeNote }}
		>
			{children}
		</NotesContext.Provider>
	);
}
