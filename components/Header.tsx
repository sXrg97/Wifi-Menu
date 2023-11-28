import Link from "next/link";
import EMenuUserButton from "./Header/EMenuUserButton";
import { ThemeToggler } from "./ui/ThemeToggler";

const Header = () => {
    return (
      <div className="w-full bg-purple-500 text-zinc-800 z-50 dark:bg-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={"/"} className="px-4 text-lg">eMenu</Link>
          <div className="flex items-center gap-4">
          <ThemeToggler />
          <EMenuUserButton />
          </div>
        </div>
      </div>
    )
};

export default Header;
