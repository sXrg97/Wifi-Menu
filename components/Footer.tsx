import Link from "next/link"

const Footer = () => {
  return (
    <div className="w-full bg-purple-500 text-zinc-800 z-50 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-6xl py-2 lg:py-4">
          <Link href={"/"} className="px-4 text-lg">eMenu</Link>
        </div>
      </div>
  )
}

export default Footer