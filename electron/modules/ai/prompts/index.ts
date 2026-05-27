import type { TransformPrompt, TransformRequest } from "../types";
import { buildImprovePrompt } from "./improve";
import { buildTranslatePrompt } from "./translate";

/** Builds the model instructions for one supported text transformation. */
export function buildTransformPrompt(
	request: TransformRequest,
): TransformPrompt {
	if (request.kind === "improve") return buildImprovePrompt(request);
	return buildTranslatePrompt(request);
}
