
import { Images } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">

        {/* Website Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold"
        >
          {/* Logo Icon */}
          <span className="rounded-xl bg-blue-600 p-2">
            <Images size={22} />
          </span>

          {/* Brand Name */}
          <span>
            Photo
            <span className="text-blue-400">
              Bhai
            </span>
          </span>
        </a>

        {/* Navbar Right Side */}
        <span className="text-sm text-slate-400">
          Free Image Tools
        </span>

      </nav>
    </header>
  );
}
