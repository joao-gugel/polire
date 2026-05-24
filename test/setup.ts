import { afterEach, expect } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import * as matchers from "@testing-library/jest-dom/matchers";

GlobalRegistrator.register();
expect.extend(matchers);

const { cleanup } = await import("@testing-library/react");

afterEach(() => {
	cleanup();
	document.body.innerHTML = "";
});
