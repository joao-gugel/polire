import { useContext } from "react";
import {
	CorrectionContext,
	type CorrectionContextValue,
} from "@/providers/correction-context";

export function useCorrection(): CorrectionContextValue {
	const context = useContext(CorrectionContext);
	if (!context) {
		throw new Error("useCorrection must be used within a CorrectionProvider.");
	}
	return context;
}
