import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	mock,
	setSystemTime,
	test,
} from "bun:test";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const USER_DATA_PATH = path.join(tmpdir(), "polire-notes-store-tests");
const NOTES_PATH = path.join(USER_DATA_PATH, "notes");

mock.module("electron", () => ({
	app: { getPath: () => USER_DATA_PATH },
}));

const { createNote, listNotes, removeNote, updateNote } = await import(
	"./store"
);

describe("notes store", () => {
	beforeEach(async () => {
		await rm(USER_DATA_PATH, { recursive: true, force: true });
		await mkdir(USER_DATA_PATH, { recursive: true });
	});

	afterEach(async () => {
		setSystemTime();
		await rm(USER_DATA_PATH, { recursive: true, force: true });
	});

	afterAll(() => {
		mock.restore();
	});

	test("creates a note as Markdown and lists it again", async () => {
		setSystemTime(new Date("2026-05-24T10:00:00.000Z"));

		const created = await createNote("Minha primeira nota");
		const serialized = await readFile(
			path.join(NOTES_PATH, `${created.id}.md`),
			"utf8",
		);

		expect(created.id).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
		expect(created.createdAt).toBe("2026-05-24T10:00:00.000Z");
		expect(created.updatedAt).toBe(created.createdAt);
		expect(serialized).toContain("Minha primeira nota");
		expect(await listNotes()).toEqual([created]);
	});

	test("updates content while preserving note identity and creation date", async () => {
		setSystemTime(new Date("2026-05-24T10:00:00.000Z"));
		const created = await createNote("Texto inicial");

		setSystemTime(new Date("2026-05-24T11:00:00.000Z"));
		const updated = await updateNote(created.id, "Texto atualizado");

		expect(updated.id).toBe(created.id);
		expect(updated.content).toBe("Texto atualizado");
		expect(updated.createdAt).toBe(created.createdAt);
		expect(updated.updatedAt).toBe("2026-05-24T11:00:00.000Z");
		expect(await listNotes()).toEqual([updated]);
	});

	test("removes the persisted note file", async () => {
		const created = await createNote("Para apagar");

		await removeNote(created.id);

		expect(await listNotes()).toEqual([]);
		expect(await readdir(NOTES_PATH)).toEqual([]);
	});

	test("lists the most recently updated note first", async () => {
		setSystemTime(new Date("2026-05-24T10:00:00.000Z"));
		const first = await createNote("Primeira");
		setSystemTime(new Date("2026-05-24T11:00:00.000Z"));
		const second = await createNote("Segunda");
		setSystemTime(new Date("2026-05-24T12:00:00.000Z"));
		await updateNote(first.id, "Primeira atualizada");

		const listed = await listNotes();

		expect(listed.map((note) => note.id)).toEqual([first.id, second.id]);
	});

	test("ignores invalid Markdown files without losing valid notes", async () => {
		const valid = await createNote("Nota valida");
		await writeFile(
			path.join(NOTES_PATH, "invalid.md"),
			"not frontmatter",
			"utf8",
		);

		expect(await listNotes()).toEqual([valid]);
	});

	test("fails when updating a note that does not exist", async () => {
		await expect(updateNote("missing", "Texto")).rejects.toThrow();
	});
});
