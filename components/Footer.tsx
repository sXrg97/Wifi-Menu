import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <div className="w-full bg-purple-500 text-zinc-800 z-50 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-6xl py-2 lg:py-4">
          <Link href={"/"} className="px-4 text-lg flex items-center gap-2">
            <div className="image-wrapper w-16 h-auto object-contain">
              <Image alt="Wifi Menu Logo" className="w-16 h-auto" src={"wifi-menu-logo.svg"} width={1359} height={873}></Image>
            </div>
             Wifi Menu
          </Link>
        </div>
      </div>
  )
}

export default Footer