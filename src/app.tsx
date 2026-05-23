import { AnimatePresence, motion } from "motion/react";
import { Noise } from "./components/noise";
import { CorrectionProvider } from "./correction";
import { NavProvider, useNav } from "./nav";
import type { View } from "./types";
import { AiSettings } from "./views/ai-settings";
import { Correction } from "./views/correction";
import { Palette } from "./views/palette";
import { Settings } from "./views/settings";

const isLinux = window.api.platform === "linux";

const SHELL_BG = isLinux
	? "border-zinc-900/10 bg-white/95 dark:border-white/10 dark:bg-zinc-900/90"
	: "border-zinc-900/10 bg-white/55 dark:border-white/10 dark:bg-zinc-900/55";

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
		<CorrectionProvider>
			<NavProvider initial="palette">
				<Shell />
			</NavProvider>
		</CorrectionProvider>
	);
}

function Shell() {
	const { current, direction } = useNav();
	return (
		<div
			className={`relative h-full w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl ${SHELL_BG}`}
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
	return null;
}
