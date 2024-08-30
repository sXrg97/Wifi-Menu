import Image from "next/image"

const Blog = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
        <h2 className="text-4xl mb-4">
            Pagina este in curs de constructie
        </h2>

        <Image 
            src="/page-under-construction.svg"
            alt="Pagina in constructie"
            width={500}
            height={500}
        />
    </main>
  )
}

export default Blog