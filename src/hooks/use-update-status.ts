import { useEffect, useState } from "react";

export function useUpdateStatus(): string | null {
	const [version, setVersion] = useState<string | null>(null);

	useEffect(() => {
		window.api.getUpdateStatus().then(setVersion);
		return window.api.onUpdateAvailable(setVersion);
	}, []);

	return version;
}
