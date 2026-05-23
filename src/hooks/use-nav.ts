import { useContext } from "react";
import { type Nav, NavContext } from "@/providers/nav";

/** Consumes the navigation stack from the nearest `NavProvider`. */
export function useNav(): Nav {
	const context = useContext(NavContext);
	if (!context) throw new Error("useNav must be used within a NavProvider.");
	return context;
}
