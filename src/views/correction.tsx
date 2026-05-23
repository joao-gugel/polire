import { TransformationResult } from "../components/transformation-result";
import { useCorrection } from "../correction";

export function Correction() {
	const { state } = useCorrection();

	return (
		<TransformationResult
			activeView="correction"
			title="Corrigir texto"
			resultLabel="Corrigido"
			original={state.original}
			result={state.corrected}
			status={state.status}
			error={state.error}
		/>
	);
}
