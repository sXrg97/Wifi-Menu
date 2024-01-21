import Link from "next/link";
import EMenuUserButton from "./Header/EMenuUserButton";
import { ThemeToggler } from "./ui/ThemeToggler";
import Image from "next/image";

const Header = () => {
    return (
      <div className="w-full bg-purple-500 text-zinc-800 z-50 dark:bg-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={"/"} className="px-4 text-lg flex items-center gap-2 text-white">
            <div className="image-wrapper w-16 h-auto object-contain">
              <Image alt="Wifi Menu Logo" className="w-16 h-auto" src={"wifi-menu-logo.svg"} width={1359} height={873}></Image>
            </div>
             Wifi Menu
          </Link>

          <div className="flex items-center gap-4">

          <ThemeToggler />

          <EMenuUserButton />
          </div>
        </div>
      </div>
    )
};

export default Header;
