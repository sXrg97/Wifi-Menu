import Link from "next/link"

const Footer = () => {
  return (
    <div className="w-full bg-slate-100 text-zinc-800">
        <div className="mx-auto max-w-6xl py-2 lg:py-4">
          <Link href={"/"} className="px-4 text-lg">eMenu</Link>
        </div>
      </div>
  )
}

export default Footer