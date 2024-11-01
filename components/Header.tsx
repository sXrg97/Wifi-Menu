import Link from "next/link";
import { Cabin } from "next/font/google";
import EMenuUserButton from "./Header/EMenuUserButton";
import { ThemeToggler } from "./ui/ThemeToggler";
import Image from "next/image";

const cabin = Cabin({
    subsets: ["latin"],
    style: ["normal", "italic"],
});

const Header = () => {
    return (
        <div className="w-full bg-purple-600 text-zinc-800 z-50 dark:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
                <Link href={"/"} className="text-lg flex items-center gap-2 text-white">
                    <div className="image-wrapper w-16 h-auto object-contain">
                        <Image
                            alt="Wifi Menu Logo"
                            title="Wifi Menu Logo"
                            className="w-16 h-auto"
                            src={"/wifi-menu-logo-white.svg"}
                            width={1359}
                            height={873}
                        ></Image>
                    </div>
                    <span className={`${cabin.className} hidden sm:block uppercase font-bold italic text-2xl`}>
                        Wifi Menu
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggler />

                    <EMenuUserButton />
                </div>
            </div>
        </div>
    );
};

export default Header;
