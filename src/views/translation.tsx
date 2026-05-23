import { TransformationResult } from "@/components/transformation-result";
import { useTranslation } from "@/providers/translation";

export function Translation() {
	const { state } = useTranslation();

	return (
		<TransformationResult
			activeView="translation"
			title="Traduzir para inglês"
			originalLabel="Original"
			resultLabel="Tradução"
			original={state.original}
			result={state.translated}
			status={state.status}
			error={state.error}
		/>
	);
}
