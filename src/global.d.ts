/** Operating system identifier exposed by the main process via `process.platform`. */
type Platform =
	| "aix"
	| "android"
	| "cygwin"
	| "darwin"
	| "freebsd"
	| "haiku"
	| "linux"
	| "netbsd"
	| "openbsd"
	| "sunos"
	| "win32";

interface Window {
	api: {
		platform: Platform;
	};
}
