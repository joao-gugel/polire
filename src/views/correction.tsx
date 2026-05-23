import { TransformationResult } from "@/components/ui/transformation-result/transformation-result";
import { useCorrection } from "@/hooks/use-correction";

export function Correction() {
	const { state } = useCorrection();

	return (
		<TransformationResult
			activeView="correction"
			title="Corrigir texto"
			originalLabel="Original"
			resultLabel="Corrigido"
			original={state.original}
			result={state.corrected}
			status={state.status}
			error={state.error}
			hints={state.hints}
		/>
	);
}
