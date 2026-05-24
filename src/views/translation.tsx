import { LANGUAGES } from "@/components/translation-target/languages";
import { TransformationResult } from "@/components/ui/transformation-result/transformation-result";
import { useI18n } from "@/hooks/use-i18n";
import { useTranslation } from "@/hooks/use-translation";

export function Translation() {
	const { t } = useI18n();
	const { state } = useTranslation();
	const match = LANGUAGES.find(
		(language) => language.englishName === state.targetLanguage,
	);
	const localizedName = match
		? t(`translationTarget.languages.${match.code}`)
		: state.targetLanguage;
	const title = state.targetLanguage
		? `${t("translationTarget.title")} ${localizedName}`
		: t("translation.title");

	return (
		<TransformationResult
			activeView="translation"
			title={title}
			originalLabel={t("common.original")}
			resultLabel={t("translation.resultLabel")}
			original={state.original}
			result={state.translated}
			status={state.status}
			error={state.error}
		/>
	);
}
