import { TransformationResult } from "@/components/ui/transformation-result/transformation-result";
import { useI18n } from "@/hooks/use-i18n";
import { useTranslation } from "@/hooks/use-translation";

export function Translation() {
	const { t } = useI18n();
	const { state } = useTranslation();

	return (
		<TransformationResult
			activeView="translation"
			title={t("translation.title")}
			originalLabel={t("common.original")}
			resultLabel={t("translation.resultLabel")}
			original={state.original}
			result={state.translated}
			status={state.status}
			error={state.error}
		/>
	);
}
