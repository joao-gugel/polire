import { type ReactNode, useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import {
	CorrectionContext,
	type CorrectionState,
} from "@/providers/correction-context";
import type { WritingTone } from "../../electron/modules/ai/types";

const INITIAL_STATE: CorrectionState = {
	original: "",
	corrected: "",
	hints: [],
	tone: "preserve",
	status: "idle",
	error: null,
};

type CorrectionProviderProps = {
	children: ReactNode;
};

export function CorrectionProvider({ children }: CorrectionProviderProps) {
	const { t, locale } = useI18n();
	const [state, setState] = useState<CorrectionState>(INITIAL_STATE);
	const [draft, setDraft] = useState("");

	async function correctText(text: string, tone: WritingTone = "preserve") {
		setState({
			original: text,
			corrected: "",
			hints: [],
			tone,
			status: "loading",
			error: null,
		});
		try {
			const result = await window.api.ai.transform({
				kind: "improve",
				text,
				tone,
				explanationLocale: locale,
			});
			setState({
				original: text,
				corrected: result.text,
				hints: result.hints ?? [],
				tone,
				status: "success",
				error: null,
			});
		} catch {
			setState({
				original: text,
				corrected: "",
				hints: [],
				tone,
				status: "error",
				error: t("correction.error"),
			});
		}
	}

	return (
		<CorrectionContext.Provider value={{ state, draft, setDraft, correctText }}>
			{children}
		</CorrectionContext.Provider>
	);
}
