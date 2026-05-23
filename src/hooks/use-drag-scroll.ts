import { useEffect, useRef } from "react";

/** Enables drag-to-scroll for a horizontal list using pointer capture. */
export function useDragScroll<T extends HTMLElement>() {
	const ref = useRef<T | null>(null);
	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		let active = false;
		let startX = 0;
		let startScroll = 0;
		let moved = false;

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			active = true;
			moved = false;
			startX = event.clientX;
			startScroll = element.scrollLeft;
			element.setPointerCapture(event.pointerId);
		};
		const onPointerMove = (event: PointerEvent) => {
			if (!active) return;
			const dx = event.clientX - startX;
			if (Math.abs(dx) > 3) moved = true;
			element.scrollLeft = startScroll - dx;
		};
		const release = (event: PointerEvent) => {
			if (!active) return;
			active = false;
			try {
				element.releasePointerCapture(event.pointerId);
			} catch {
				/* pointer already released */
			}
		};
		const onClickCapture = (event: MouseEvent) => {
			if (!moved) return;
			event.stopPropagation();
			event.preventDefault();
			moved = false;
		};

		element.addEventListener("pointerdown", onPointerDown);
		element.addEventListener("pointermove", onPointerMove);
		element.addEventListener("pointerup", release);
		element.addEventListener("pointercancel", release);
		element.addEventListener("click", onClickCapture, true);
		return () => {
			element.removeEventListener("pointerdown", onPointerDown);
			element.removeEventListener("pointermove", onPointerMove);
			element.removeEventListener("pointerup", release);
			element.removeEventListener("pointercancel", release);
			element.removeEventListener("click", onClickCapture, true);
		};
	}, []);
	return ref;
}
