import { AnimatePresence, motion } from "motion/react";
import { Noise } from "@/components/ui/noise";
import { useNav } from "@/hooks/use-nav";
import { CorrectionProvider } from "@/providers/correction";
import { I18nProvider } from "@/providers/i18n";
import { NavProvider } from "@/providers/nav";
import { NotesProvider } from "@/providers/notes";
import { TranslationProvider } from "@/providers/translation";
import type { View } from "@/types";
import { AiSettings } from "@/views/ai-settings";
import { Correction } from "@/views/correction";
import { Notes } from "@/views/notes";
import { Palette } from "@/views/palette";
import { Settings } from "@/views/settings";
import { Translation } from "@/views/translation";
import { TranslationTarget } from "@/views/translation-target";

const isLinux = window.api.platform === "linux";
const isWindows = window.api.platform === "win32";

const SHELL_APPEARANCE = isWindows
	? "windows-shell border border-zinc-900/15 bg-white/42 dark:border-white/15 dark:bg-zinc-950/72"
	: "rounded-xl border border-zinc-900/10 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/90";

const slideVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 90 : -90,
		opacity: 0,
		scale: 0.98,
	}),
	center: { x: 0, opacity: 1, scale: 1 },
	exit: (direction: number) => ({
		x: direction > 0 ? -90 : 90,
		opacity: 0,
		scale: 0.98,
	}),
};

const slideTransition = { duration: 0.28, ease: [0.32, 0.72, 0, 1] } as const;

export default function App() {
	return (
		<I18nProvider>
			<NotesProvider>
				<TranslationProvider>
					<CorrectionProvider>
						<NavProvider initial="palette">
							<Shell />
						</NavProvider>
					</CorrectionProvider>
				</TranslationProvider>
			</NotesProvider>
		</I18nProvider>
	);
}

function Shell() {
	const { current, direction } = useNav();
	return (
		<div
			className={`relative h-full w-full overflow-hidden ${SHELL_APPEARANCE}`}
		>
			{isLinux && <Noise />}
			<AnimatePresence custom={direction} initial={false}>
				<motion.div
					key={current}
					custom={direction}
					variants={slideVariants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={slideTransition}
					className="absolute inset-0 flex flex-col"
				>
					{renderView(current)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

function renderView(view: View) {
	if (view === "palette") return <Palette />;
	if (view === "settings") return <Settings />;
	if (view === "ai-settings") return <AiSettings />;
	if (view === "correction") return <Correction />;
	if (view === "translation-target") return <TranslationTarget />;
	if (view === "translation") return <Translation />;
	if (view === "notes") return <Notes />;
	return null;
}
