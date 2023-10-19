import Link from "next/link";
import EMenuUserButton from "./Header/EMenuUserButton";

const Header = () => {
    return (
      <div className="w-full bg-slate-100 text-zinc-800 z-50">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href={"/"} className="px-4 text-lg">eMenu</Link>
          <EMenuUserButton />
        </div>
      </div>
    )
};

export default Header;
