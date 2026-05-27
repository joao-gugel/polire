/// <reference lib="dom" />

import { expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { OptionItem } from "@/components/ui/option-item";

test("selects an item only after actual mouse movement over it", () => {
	const onHover = mock(() => undefined);

	render(
		<OptionItem
			label="Option"
			selected={false}
			layoutId="test-selection"
			leading={<span />}
			onHover={onHover}
			onSelect={() => undefined}
		/>,
	);

	const option = screen.getByRole("button", { name: "Option" });

	fireEvent.mouseEnter(option);
	expect(onHover).not.toHaveBeenCalled();

	fireEvent.mouseMove(option);
	expect(onHover).toHaveBeenCalledTimes(1);
});
