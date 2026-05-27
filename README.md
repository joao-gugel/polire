<p align="center">
  <img src="assets/brand/polire-mark.svg" width="112" alt="Polire logo" />
</p>

<h1 align="center">Polire</h1>

<p align="center">Open-source desktop writing assistant for clearer writing, translation, and quick notes.</p>

<p align="center">
  English |
  <a href="docs/README.pt-BR.md">Português (Brasil)</a> |
  <a href="docs/README.es.md">Español</a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Release: v0.2.0](https://img.shields.io/badge/Release-v0.2.0-2ea44f.svg)](https://github.com/joao-gugel/polire/releases/tag/v0.2.0)
[![Downloads](https://img.shields.io/badge/Download-Windows%20%7C%20Linux-blue.svg)](#download)

Polire is a small desktop app for people who write in a non-native language, or simply want to polish text without breaking their flow. Open it from anywhere with a global shortcut, paste or write text, then correct it, translate it, or save it as a local note.

![Polire demo](assets/demo-gif.gif)

## Download

Polire `v0.2.0` is available for Windows and Linux.

| Platform | Download | Auto-update | Notes |
| -------- | -------- | ----------- | ----- |
| Windows x64 | [Installer `.exe`](https://github.com/joao-gugel/polire/releases/download/v0.2.0/Polire-Setup-0.2.0-x64.exe) | Yes | Starts with Windows after installation; currently unsigned. |
| Linux x64 (AppImage) | [`.AppImage`](https://github.com/joao-gugel/polire/releases) | Yes | Single executable; recommended for receiving updates. |
| Linux x64 (Debian/Ubuntu) | [Package `.deb`](https://github.com/joao-gugel/polire/releases/download/v0.2.0/Polire-0.2.0-amd64.deb) | No (manual) | Updates must be installed manually with a new `.deb`. |

All published versions and release notes are available on the [Releases page](https://github.com/joao-gugel/polire/releases).

### Install on Linux

After downloading the Debian package:

```bash
sudo apt install ./Polire-0.2.0-amd64.deb
```

The Windows build is not code-signed yet, so Windows may show an unknown publisher warning during installation.

## Features

- Improve grammar, spelling, and clarity with a before-and-after result view.
- Change text tone with professional, casual, friendly, concise, persuasive, and playful options.
- Translate text to a selected target language using your chosen AI provider.
- Save quick notes locally and edit them inside the app.
- Bring the palette up from anywhere with `Ctrl+Alt+P`.
- Keep the app out of the way in the system tray.
- Start Polire in the system tray when you sign in to Windows.
- Choose between OpenAI, Anthropic, Google Gemini, and DeepSeek.
- Configure your own API key locally instead of relying on a hosted Polire account.
- Use the interface in English, Portuguese (Brazil), or Spanish.
- Use light and dark themes.

## Local-first AI

The open-source version uses a bring-your-own-key model:

- Your provider choice and API key are configured in the app.
- API keys are encrypted locally using Electron's OS-backed secure storage support.
- AI requests are executed by the desktop app against the provider you selected.
- Polire does not currently run a server that receives your text or stores your notes.

When you use an AI action, the submitted text is sent to the selected AI provider according to that provider's policies.

## Notes

Notes are saved locally as Markdown files with stable IDs. This keeps the local format simple and leaves room for optional synchronization features in a future version.

## Development

### Requirements

- [Bun](https://bun.sh/) `>= 1.3`
- Windows or Linux
- Linux: an X11 session is recommended because global shortcut support on Wayland is limited.

### Run locally

```bash
bun install
bun run dev
```

### Validate a build

```bash
bun run format
bun run test
bun run build
```

`bun run test` executes unit and React component tests with Bun. `bun run build` type-checks and creates renderer and Electron bundles in `dist/` and `dist-electron/`.

### Package locally

```bash
bun run package:linux         # AppImage + .deb in release/
bun run package:win           # NSIS .exe in release/
bun run package:linux:flatpak # .flatpak (requires flatpak + flatpak-builder)
```

Build the Windows installer on Windows; GitHub Actions handles both operating systems for tagged releases.

### Publish a release

The release workflow builds installers and creates a GitHub Release when a version tag is pushed. The tag must match the version in `package.json`.

```bash
git tag v0.2.0
git push origin v0.2.0
```

Update `package.json` to the matching version before creating a new tag. Windows releases are not code-signed yet.

### Auto-update

Polire ships with [`electron-updater`](https://www.electron.build/auto-update) wired to GitHub Releases. At runtime the app checks the release feed once at launch and every four hours, downloads new versions in background, and applies them on quit (a system notification confirms when the update is ready).

Per platform:

- **Windows (NSIS)**: full support. The new installer is downloaded, hash-verified, and applied silently when the app quits. Unsigned installs trigger SmartScreen on first install, but updates afterwards stay quiet.
- **Linux AppImage**: full support. The AppImage replaces itself in-place; the user only needs to relaunch.
- **Linux `.deb`**: no auto-update (limitation of `electron-updater`). Users must download and install new `.deb` releases manually.
- **Linux Flatpak**: not driven by `electron-updater`. Distribute via Flathub; the Flatpak runtime handles updates on the user's machine.

For auto-update to function, each GitHub Release must include the `latest.yml` (Windows) and `latest-linux.yml` (Linux) metadata files alongside the installers. The release workflow handles this automatically; if publishing manually, run `electron-builder --publish always` with `GH_TOKEN` set.

## Default Shortcuts

| Shortcut     | Action                          |
| ------------ | ------------------------------- |
| `Ctrl+Alt+P` | Toggle the palette globally     |
| `Esc`        | Go back, or hide the root palette |
| `Ctrl+Del`   | Delete the selected local note  |

## Roadmap

- Code-sign Windows releases and streamline updates.
- Polish AI configuration and error handling.
- Explore optional paid sync and online storage separately from the local app.

## Stack

Polire is built with Electron, React, TypeScript, Tailwind CSS, Vite, Bun, and the AI SDK.

## Contributing

Bug reports and focused improvements are welcome through GitHub issues and pull requests.

## License

Polire is available under the [MIT License](LICENSE).
