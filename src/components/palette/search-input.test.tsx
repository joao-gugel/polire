/// <reference lib="dom" />

import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SearchInput } from "@/components/palette/search-input";

function SearchInputHarness() {
	const [value, setValue] = useState("");
	return (
		<SearchInput
			value={value}
			onChange={setValue}
			placeholder="Escreva ou cole seu texto..."
		/>
	);
}

test("allows the user to enter text in the palette", async () => {
	const user = userEvent.setup();
	render(<SearchInputHarness />);
	const input = screen.getByRole("textbox");

	await user.type(input, "Hello");

	expect(input).toHaveValue("Hello");
});
