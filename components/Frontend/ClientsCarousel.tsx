"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MenuType } from "@/types/types"
import { fetchMenu } from "@/lib/actions/menu.actions"

export default function ClientsCarousel() {
  const [menu, setMenu] = useState<MenuType | null>(null)
  const [loading, setLoading] = useState(true)

  const getMenu = async () => {
    try {
      const menuResponse = await fetchMenu("4T93KbXXCryjYJCUEgom")
      setMenu(menuResponse)
    } catch (err) {
      console.error("Error getting menu:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMenu()
  }, [])

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 md:px-8" data-aos="fade-up">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
        Experimentează meniul interactiv
      </h2>
      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-lg" />
      ) : menu ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full">
              <Image
                src={menu.menuPreviewImage || "/dashboard-cover.webp"}
                alt={`Preview for ${menu.restaurantName}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="p-6 text-center dark:bg-gray-900">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {menu.restaurantName}
              </h3>
              <Link href={`/menu/${menu.slug}`} passHref>
                <Button size="lg">
                  Vezi Meniul
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Nu s-a putut încărca meniul. Vă rugăm să încercați din nou mai târziu.
        </p>
      )}
    </section>
  )
}