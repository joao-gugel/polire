import { useContext } from "react";
import { NotesContext, type NotesContextValue } from "@/providers/notes";

export function useNotes(): NotesContextValue {
	const context = useContext(NotesContext);
	if (!context) throw new Error("useNotes must be used within NotesProvider.");
	return context;
}
