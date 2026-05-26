import {
	BriefcaseIcon,
	CoffeeIcon,
	ConfettiIcon,
	type Icon,
	LightningIcon,
	MegaphoneIcon,
	SmileyIcon,
} from "@phosphor-icons/react";
import type { WritingTone } from "../../../electron/modules/ai/types";

export type ToneOption = {
	id: Exclude<WritingTone, "preserve">;
	icon: Icon;
};

export const TONE_OPTIONS: ToneOption[] = [
	{ id: "professional", icon: BriefcaseIcon },
	{ id: "casual", icon: CoffeeIcon },
	{ id: "friendly", icon: SmileyIcon },
	{ id: "concise", icon: LightningIcon },
	{ id: "persuasive", icon: MegaphoneIcon },
	{ id: "playful", icon: ConfettiIcon },
];
