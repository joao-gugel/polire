import { TransformationResult } from "@/components/ui/transformation-result/transformation-result";
import { useCorrection } from "@/hooks/use-correction";
import { useI18n } from "@/hooks/use-i18n";

export function Correction() {
	const { t } = useI18n();
	const { state } = useCorrection();

	return (
		<TransformationResult
			activeView="correction"
			title={t("correction.title")}
			originalLabel={t("common.original")}
			resultLabel={t("correction.resultLabel")}
			original={state.original}
			result={state.corrected}
			status={state.status}
			error={state.error}
			hints={state.hints}
		/>
	);
}
