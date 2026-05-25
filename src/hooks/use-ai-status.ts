import { useContext } from "react";
import {
	AiStatusContext,
	type AiStatusContextValue,
} from "@/providers/ai-status-context";

export function useAiStatus(): AiStatusContextValue {
	const context = useContext(AiStatusContext);
	if (!context) {
		throw new Error("useAiStatus must be used within an AiStatusProvider.");
	}
	return context;
}
