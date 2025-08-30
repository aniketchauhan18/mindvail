import { instrumentSerif } from "@/lib/fonts";
import { getSession } from "@/lib/session";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import HamburgerMenu from "./hamburger-menu";

export interface NavLinks {
  label: string;
  link: string;
}

const navlinks: NavLinks[] = [
  { label: "About", link: "#" },
  { label: "Assessment", link: "/assessment" },
  { label: "My Progress", link: "#" },
];

export default async function Navbar() {
  return (
    <header className="flex flex-col fixed bg-transparent inset-x-0 top-0 z-30 py-3 px-4 items-center">
      <div className="flex justify-between items-center bg-white rounded-md border p-3 md:p-4 text-neutral-800 w-full max-w-5xl">
        <Link
          href="/"
          className={`${instrumentSerif.className} text-lg md:text-xl`}
        >
          Mindvail
        </Link>
        <nav className="hidden md:flex justify-center items-center gap-3 flex-1">
          <div className="flex text-sm justify-between max-w-sm w-full px-5">
            {navlinks.map((nav) => (
              <Link
                href={nav.link}
                key={nav.label}
                className="hover:text-blue-600 transition-colors duration-200 ease-out"
              >
                <div className="group-hover:text-blue-600">{nav.label}</div>
              </Link>
            ))}
          </div>
        </nav>
        <HamburgerMenu />
      </div>
    </header>
  );
}
