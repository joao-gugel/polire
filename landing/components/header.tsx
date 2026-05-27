import { GithubLogo, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

const GITHUB_URL = "https://github.com/joao-gugel/polire";
const RELEASES_URL = "https://github.com/joao-gugel/polire/releases";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/polire-mark.svg"
            alt="Polire"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="text-lg font-medium text-foreground">Polire</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-zinc-900/5 hover:text-foreground"
          >
            <GithubLogo size={18} weight="fill" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <Link
            href={RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <DownloadSimple size={18} weight="bold" />
            <span>Download</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
