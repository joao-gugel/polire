import {
	CheckCircleIcon,
	EyeIcon,
	EyeSlashIcon,
	PaperPlaneRightIcon,
	SpinnerIcon,
} from "@phosphor-icons/react";
import type { RefObject } from "react";

type ApiKeyInputProps = {
	hasSavedKey: boolean;
	value: string;
	selected: boolean;
	visible: boolean;
	saving: boolean;
	inputRef: RefObject<HTMLInputElement | null>;
	onChange: (value: string) => void;
	onFocus: () => void;
	onToggleVisibility: () => void;
	onSave: () => void;
};

export function ApiKeyInput({
	hasSavedKey,
	value,
	selected,
	visible,
	saving,
	inputRef,
	onChange,
	onFocus,
	onToggleVisibility,
	onSave,
}: ApiKeyInputProps) {
	return (
		<div className="relative px-2">
			<input
				ref={inputRef}
				type={visible ? "text" : "password"}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				onFocus={onFocus}
				placeholder={
					hasSavedKey
						? "•••••••• (cole uma nova e aperte enter)"
						: "Cole sua chave e aperte enter"
				}
				className={`h-11 w-full rounded-xl pr-16 pl-12 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400 border ${
					selected
						? "border-zinc-900/8 dark:border-white/15"
						: "border-zinc-900/5 dark:border-white/10"
				}`}
			/>
			<button
				type="button"
				onClick={onToggleVisibility}
				className="-translate-y-1/2 absolute top-1/2 left-4.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-600 outline-none transition-colors hover:bg-zinc-900/5 hover:text-zinc-900 focus:outline-none focus-visible:outline-none dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50"
			>
				{visible ? (
					<EyeSlashIcon size={16} weight="regular" />
				) : (
					<EyeIcon size={16} weight="regular" />
				)}
			</button>
			<div className="-translate-y-1/2 absolute top-1/2 right-4.5 flex items-center gap-1">
				{!saving && !value && hasSavedKey && (
					<CheckCircleIcon
						size={16}
						weight="fill"
						className="text-emerald-600 dark:text-emerald-400"
					/>
				)}
				<button
					type="button"
					onClick={onSave}
					disabled={!value.trim() || saving}
					className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 outline-none transition-colors enabled:cursor-pointer enabled:hover:bg-zinc-900/5 enabled:hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:outline-none dark:text-zinc-400 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-zinc-50"
				>
					{saving ? (
						<SpinnerIcon size={16} weight="bold" className="animate-spin" />
					) : (
						<PaperPlaneRightIcon size={16} weight="bold" />
					)}
				</button>
			</div>
		</div>
	);
}
