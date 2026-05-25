import { type ReactNode, useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import {
	CorrectionContext,
	type CorrectionState,
} from "@/providers/correction-context";

const INITIAL_STATE: CorrectionState = {
	original: "",
	corrected: "",
	hints: [],
	status: "idle",
	error: null,
};

type CorrectionProviderProps = {
	children: ReactNode;
};

export function CorrectionProvider({ children }: CorrectionProviderProps) {
	const { t } = useI18n();
	const [state, setState] = useState<CorrectionState>(INITIAL_STATE);

	async function correctText(text: string) {
		setState({
			original: text,
			corrected: "",
			hints: [],
			status: "loading",
			error: null,
		});
		try {
			const result = await window.api.ai.transform({
				kind: "improve",
				text,
				tone: "preserve",
			});
			setState({
				original: text,
				corrected: result.text,
				hints: result.hints ?? [],
				status: "success",
				error: null,
			});
		} catch {
			setState({
				original: text,
				corrected: "",
				hints: [],
				status: "error",
				error: t("correction.error"),
			});
		}
	}

	return (
		<CorrectionContext.Provider value={{ state, correctText }}>
			{children}
		</CorrectionContext.Provider>
	);
}
