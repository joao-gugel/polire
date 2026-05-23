type SearchInputProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export function SearchInput({
	value,
	onChange,
	placeholder,
}: SearchInputProps) {
	return (
		<input
			// biome-ignore lint/a11y/noAutofocus: palette is keyboard-first; focus must land on the input on open.
			autoFocus
			type="text"
			value={value}
			onChange={(event) => onChange(event.target.value)}
			placeholder={placeholder}
			className="w-full bg-transparent px-5 py-4 text-lg text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
		/>
	);
}
