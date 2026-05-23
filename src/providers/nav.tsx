/**
 * Navigation stack — a tiny push/pop router for the window's views.
 *
 * Why a stack instead of a single current view: secondary views can themselves
 * push deeper views (settings → shortcut → custom), and back must walk the
 * chain. The `direction` field is exposed so animations know which way to slide.
 */

import { createContext, type ReactNode, useCallback, useState } from "react";
import type { View } from "@/types";

type Direction = 1 | -1;

export type Nav = {
	current: View;
	direction: Direction;
	push: (view: View) => void;
	pop: () => void;
};

export const NavContext = createContext<Nav | null>(null);

type ProviderProps = {
	initial: View;
	children: ReactNode;
};

export function NavProvider({ initial, children }: ProviderProps) {
	const [stack, setStack] = useState<View[]>([initial]);
	const [direction, setDirection] = useState<Direction>(1);

	const push = useCallback((view: View) => {
		setDirection(1);
		setStack((current) => [...current, view]);
	}, []);

	const pop = useCallback(() => {
		setStack((current) => {
			if (current.length <= 1) return current;
			return current.slice(0, -1);
		});
		setDirection(-1);
	}, []);

	const value: Nav = {
		current: stack[stack.length - 1],
		direction,
		push,
		pop,
	};

	return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
