import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { app, safeStorage } from "electron";
import type { AiProvider } from "./types";

const SECRETS_FILE = "ai-secrets.json";
const MAX_API_KEY_LENGTH = 4096;

type StoredSecrets = Partial<Record<AiProvider, string>>;

const PROVIDERS: AiProvider[] = ["openai", "anthropic", "google", "deepseek"];

function getSecretsPath() {
	return path.join(app.getPath("userData"), SECRETS_FILE);
}

async function loadStoredSecrets(): Promise<StoredSecrets> {
	try {
		const storedSecrets = JSON.parse(
			await readFile(getSecretsPath(), "utf8"),
		) as unknown;
		if (!storedSecrets || typeof storedSecrets !== "object") return {};
		const validatedSecrets: StoredSecrets = {};
		for (const provider of PROVIDERS) {
			if (!(provider in storedSecrets)) continue;
			const secret = storedSecrets[provider as keyof typeof storedSecrets];
			if (typeof secret !== "string") continue;
			validatedSecrets[provider] = secret;
		}
		return validatedSecrets;
	} catch {
		return {};
	}
}

async function writeStoredSecrets(secrets: StoredSecrets): Promise<void> {
	await writeFile(
		getSecretsPath(),
		JSON.stringify(secrets, null, "\t"),
		"utf8",
	);
}

function requireEncryptionAvailable() {
	if (safeStorage.isEncryptionAvailable()) return;
	throw new Error("Secure credential storage is unavailable.");
}

/** Returns whether an encrypted API key has been saved for a provider. */
export async function hasApiKey(provider: AiProvider): Promise<boolean> {
	const secrets = await loadStoredSecrets();
	return typeof secrets[provider] === "string";
}

/** Encrypts and persists an API key using Electron's OS-backed credential protection. */
export async function saveApiKey(
	provider: AiProvider,
	apiKey: string,
): Promise<void> {
	if (!apiKey.trim()) throw new Error("API key cannot be empty.");
	if (apiKey.length > MAX_API_KEY_LENGTH)
		throw new Error("API key is too long.");
	requireEncryptionAvailable();
	const secrets = await loadStoredSecrets();
	secrets[provider] = safeStorage.encryptString(apiKey).toString("base64");
	await writeStoredSecrets(secrets);
}

/** Decrypts an API key for main-process requests only. */
export async function loadApiKey(provider: AiProvider): Promise<string | null> {
	requireEncryptionAvailable();
	const secrets = await loadStoredSecrets();
	const encryptedApiKey = secrets[provider];
	if (!encryptedApiKey) return null;
	return safeStorage.decryptString(Buffer.from(encryptedApiKey, "base64"));
}

/** Removes an API key saved for one provider. */
export async function removeApiKey(provider: AiProvider): Promise<void> {
	const secrets = await loadStoredSecrets();
	delete secrets[provider];
	await writeStoredSecrets(secrets);
}
