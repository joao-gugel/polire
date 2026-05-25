import {
	type KeyboardEvent as ReactKeyboardEvent,
	type RefObject,
	useEffect,
	useRef,
} from "react";

type SearchInputProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

function requestResizeForPaletteInput(extraHeight: number) {
	if (typeof window === "undefined" || !window.api?.resizeForPaletteInput) {
		return;
	}
	void window.api.resizeForPaletteInput(extraHeight);
}

function useWindowResizeForGrowingInput(
	textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea || typeof ResizeObserver === "undefined") return;

		let initialHeight: number | null = null;
		const textareaResizeObserver = new ResizeObserver(() => {
			if (initialHeight === null) {
				initialHeight = textarea.offsetHeight;
				return;
			}
			const extraHeight = Math.max(0, textarea.offsetHeight - initialHeight);
			requestResizeForPaletteInput(extraHeight);
		});

		textareaResizeObserver.observe(textarea);
		return () => {
			textareaResizeObserver.disconnect();
			requestResizeForPaletteInput(0);
		};
	}, [textareaRef]);
}

export function SearchInput({
	value,
	onChange,
	placeholder,
}: SearchInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	useWindowResizeForGrowingInput(textareaRef);

	function handleKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
		if (event.key !== "Enter" || event.shiftKey) return;
		event.preventDefault();
	}

	return (
		<textarea
			ref={textareaRef}
			// biome-ignore lint/a11y/noAutofocus: palette is keyboard-first; focus must land on the input on open.
			autoFocus
			rows={1}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			spellCheck={false}
			className="field-sizing-content block max-h-36 w-full resize-none overflow-y-auto bg-transparent px-5 py-4 text-lg text-zinc-900 leading-7 outline-none placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
		/>
	);
}
