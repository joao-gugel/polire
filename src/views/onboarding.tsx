import { KeyIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
	OptionItem,
	OptionItemCaret,
	OptionItemIcon,
} from "@/components/ui/option-item";
import { PageLayout } from "@/components/ui/page-layout";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";

const SELECTION_LAYOUT_ID = "onboarding-selection";

export function Onboarding() {
	const { t } = useI18n();
	const { current, pop, push } = useNav();
	const isActive = current === "onboarding";
	const [selected, setSelected] = useState(0);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });

	const options = [
		{
			id: "local-key",
			label: t("onboarding.options.localKey.label"),
			description: t("onboarding.options.localKey.description"),
			icon: KeyIcon,
			action: () => push("ai-settings"),
		},
	];

	const optionCount = options.length;

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % optionCount);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected((index) => (index - 1 + optionCount) % optionCount);
				return;
			}
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				setConfirmation((value) => ({
					index: selected,
					sequence: value.sequence + 1,
				}));
				push("ai-settings");
				return;
			}
			if (event.key === "Backspace") {
				event.preventDefault();
				pop();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, pop, push, optionCount]);

	return (
		<PageLayout title={t("onboarding.title")}>
			<div className="flex flex-col gap-0.5 px-2 py-3">
				{options.map((option, index) => {
					const isSelected = index === selected;
					return (
						<OptionItem
							key={option.id}
							label={option.label}
							description={option.description}
							selected={isSelected}
							layoutId={SELECTION_LAYOUT_ID}
							confirmationSequence={
								confirmation.index === index ? confirmation.sequence : undefined
							}
							leading={
								<OptionItemIcon icon={option.icon} selected={isSelected} />
							}
							trailing={<OptionItemCaret selected={isSelected} />}
							onHover={() => setSelected(index)}
							onSelect={option.action}
						/>
					);
				})}
			</div>
		</PageLayout>
	);
}
