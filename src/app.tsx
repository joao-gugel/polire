import { useState } from "react";
import { Noise } from "./components/noise";
import type { View } from "./types";
import { Palette } from "./views/palette";
import { Settings } from "./views/settings";

const isLinux = window.api.platform === "linux";

export default function App() {
	const [view, setView] = useState<View>("palette");

	return (
		<div
			className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl ${
				isLinux
					? "border-zinc-900/10 bg-white/95 dark:border-white/10 dark:bg-zinc-900/90"
					: "border-zinc-900/10 bg-white/55 dark:border-white/10 dark:bg-zinc-900/55"
			}`}
		>
			{isLinux && <Noise />}
			{view === "palette" && <Palette onNavigate={setView} />}
			{view === "settings" && <Settings onNavigate={setView} />}
		</div>
	);
}
