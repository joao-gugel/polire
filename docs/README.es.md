<p align="center">
  <img src="../assets/brand/polire-mark.svg" width="112" alt="Logo de Polire" />
</p>

<h1 align="center">Polire</h1>

<p align="center">Asistente de escritura de escritorio y de código abierto para escribir con mayor claridad, traducir textos y guardar notas rápidas.</p>

<p align="center">
  <a href="../README.md">English</a> |
  <a href="README.pt-BR.md">Português (Brasil)</a> |
  Español
</p>

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](../LICENSE)
[![Versión: v0.1.0](https://img.shields.io/badge/Versi%C3%B3n-v0.1.0-2ea44f.svg)](https://github.com/joao-gugel/polire/releases/tag/v0.1.0)
[![Descargas](https://img.shields.io/badge/Descarga-Windows%20%7C%20Linux-blue.svg)](#descarga)

Polire es una pequeña aplicación de escritorio para personas que escriben en un idioma no nativo, o que simplemente quieren mejorar un texto sin interrumpir su flujo de trabajo. Ábrela desde cualquier lugar con un atajo global, pega o escribe un texto y luego corrígelo, tradúcelo o guárdalo como una nota local.

![Demostración de Polire](../assets/demo-gif.gif)

## Descarga

Polire `v0.1.0` está disponible para Windows y Linux.

| Plataforma | Descarga | Actualización automática | Notas |
| ---------- | -------- | ------------------------ | ----- |
| Windows x64 | [Instalador `.exe`](https://github.com/joao-gugel/polire/releases/download/v0.1.0/Polire-Setup-0.1.0-x64.exe) | Sí | Se inicia con Windows después de la instalación; actualmente no está firmado. |
| Linux x64 (AppImage) | [`.AppImage`](https://github.com/joao-gugel/polire/releases) | Sí | Ejecutable único; recomendado para recibir actualizaciones. |
| Linux x64 (Debian/Ubuntu) | [Paquete `.deb`](https://github.com/joao-gugel/polire/releases/download/v0.1.0/Polire-0.1.0-amd64.deb) | No (manual) | Las actualizaciones deben instalarse manualmente con un nuevo `.deb`. |

Todas las versiones publicadas y notas de lanzamiento están disponibles en la [página de Releases](https://github.com/joao-gugel/polire/releases).

### Instalación en Linux

Después de descargar el paquete Debian:

```bash
sudo apt install ./Polire-0.1.0-amd64.deb
```

La versión para Windows aún no está firmada digitalmente, por lo que Windows puede mostrar una advertencia de editor desconocido durante la instalación.

## Funciones

- Mejora la gramática, la ortografía y la claridad con una vista de antes y después.
- Traduce texto al inglés utilizando el proveedor de IA seleccionado.
- Guarda notas rápidas localmente y edítalas dentro de la aplicación.
- Abre la paleta desde cualquier lugar con `Ctrl+Alt+P`.
- Mantén la aplicación discreta en la bandeja del sistema.
- Inicia Polire en la bandeja del sistema al iniciar sesión en Windows.
- Elige entre OpenAI, Anthropic, Google Gemini y DeepSeek.
- Configura tu propia clave de API localmente, sin depender de una cuenta alojada de Polire.
- Usa temas claro y oscuro.

## IA local-first

La versión de código abierto utiliza un modelo en el que aportas tu propia clave:

- El proveedor y la clave de API se configuran en la aplicación.
- Las claves de API se cifran localmente usando el almacenamiento seguro respaldado por el sistema operativo de Electron.
- La aplicación de escritorio ejecuta las solicitudes de IA contra el proveedor seleccionado.
- Actualmente, Polire no opera un servidor que reciba tus textos o almacene tus notas.

Cuando utilizas una acción de IA, el texto enviado se envía al proveedor de IA seleccionado según las políticas de dicho proveedor.

## Notas

Las notas se guardan localmente como archivos Markdown con IDs estables. Esto mantiene simple el formato local y permite considerar funciones opcionales de sincronización en una versión futura.

## Desarrollo

### Requisitos

- [Bun](https://bun.sh/) `>= 1.3`
- Windows o Linux
- Linux: se recomienda una sesión X11 porque la compatibilidad de atajos globales en Wayland es limitada.

### Ejecutar localmente

```bash
bun install
bun run dev
```

### Validar una compilación

```bash
bun run format
bun run test
bun run build
```

`bun run test` ejecuta pruebas unitarias y de componentes React con Bun. `bun run build` comprueba los tipos y crea los bundles del renderer y de Electron en `dist/` y `dist-electron/`.

### Empaquetar localmente

```bash
bun run package:linux         # AppImage + .deb en release/
bun run package:win           # NSIS .exe en release/
bun run package:linux:flatpak # .flatpak (requiere flatpak + flatpak-builder)
```

Genera el instalador de Windows en Windows; GitHub Actions se ocupa de ambos sistemas operativos para las releases etiquetadas.

### Publicar una versión

El workflow de releases genera los instaladores y crea una GitHub Release cuando se sube una etiqueta de versión. La etiqueta debe coincidir con la versión de `package.json`.

```bash
git tag v0.1.1
git push origin v0.1.1
```

Actualiza `package.json` a la versión correspondiente antes de crear una nueva etiqueta. Las versiones de Windows aún no están firmadas digitalmente.

### Actualización automática

Polire incluye [`electron-updater`](https://www.electron.build/auto-update) integrado con GitHub Releases. Durante la ejecución, la aplicación consulta el feed de releases al iniciar y cada cuatro horas, descarga nuevas versiones en segundo plano y las aplica al salir (una notificación del sistema confirma cuándo la actualización está lista).

Por plataforma:

- **Windows (NSIS)**: compatibilidad completa. El nuevo instalador se descarga, se verifica mediante hash y se aplica silenciosamente cuando la aplicación se cierra. Las instalaciones sin firma activan SmartScreen en la primera instalación, pero las actualizaciones posteriores permanecen discretas.
- **Linux AppImage**: compatibilidad completa. El AppImage se reemplaza a sí mismo; el usuario solo necesita volver a abrir la aplicación.
- **Linux `.deb`**: sin actualización automática (limitación de `electron-updater`). Los usuarios deben descargar e instalar manualmente las nuevas versiones `.deb`.
- **Linux Flatpak**: `electron-updater` no lo actualiza. Distribúyelo mediante Flathub; el runtime de Flatpak gestiona las actualizaciones en el equipo del usuario.

Para que la actualización automática funcione, cada GitHub Release debe incluir los archivos de metadatos `latest.yml` (Windows) y `latest-linux.yml` (Linux) junto a los instaladores. El workflow de release lo hace automáticamente; si publicas manualmente, ejecuta `electron-builder --publish always` con `GH_TOKEN` definido.

## Atajos predeterminados

| Atajo       | Acción                                     |
| ----------- | ------------------------------------------ |
| `Ctrl+Alt+P` | Mostrar u ocultar la paleta globalmente   |
| `Esc`       | Volver, u ocultar la paleta principal      |
| `Ctrl+Del`  | Eliminar la nota local seleccionada        |

## Roadmap

- Firmar digitalmente las versiones para Windows y simplificar las actualizaciones.
- Mejorar la configuración de IA y el manejo de errores.
- Explorar sincronización de pago opcional y almacenamiento en línea por separado de la aplicación local.

## Stack

Polire está construido con Electron, React, TypeScript, Tailwind CSS, Vite, Bun y AI SDK.

## Contribuir

Los reportes de errores y las mejoras específicas son bienvenidos mediante issues y pull requests de GitHub.

## Licencia

Polire está disponible bajo la [Licencia MIT](../LICENSE).
