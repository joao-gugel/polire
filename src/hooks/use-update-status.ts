import { useEffect, useState } from "react";

export function useUpdateStatus(): string | null {
	const [version, setVersion] = useState<string | null>(null);

	useEffect(() => {
		window.api.update.getUpdateStatus().then(setVersion);
		return window.api.update.onUpdateAvailable(setVersion);
	}, []);

	return version;
}
