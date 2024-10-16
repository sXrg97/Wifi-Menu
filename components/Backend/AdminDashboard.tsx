"use client"

import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase'
import Link from 'next/link'
import Image from 'next/image'

interface UserMenu {
  userId: string
  email: string
  menuId: string
  menuSlug: string
  restaurantName: string
  menuPreviewImage?: string
  lifetimeViews?: number
  productCount: number
}

interface MenuData {
    slug?: string;
    restaurantName?: string;
    menuPreviewImage?: string;
    lifetimeViews?: number
    categories: [{products: []}]
}

const AdminDashboard = () => {
  const [userMenus, setUserMenus] = useState<UserMenu[]>([])
  const [loading, setLoading] = useState(true)
  const [totalMenus, setTotalMenus] = useState(0)

  useEffect(() => {
    const fetchUserMenus = async () => {
      try {
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(usersRef)
        
        const userMenuPromises = usersSnapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data()
          if (userData.menu) {
            const menuDoc = await getDoc(userData.menu)
            const menuData = menuDoc.data() as MenuData
            console.log(menuData)

            let productCount = 0

            menuData?.categories.map(category => {
                category.products.map(product => productCount++)
            })

            console.log(productCount)

            return {
              userId: userDoc.id,
              email: userData.email,
              menuId: userData.menu,
              menuSlug: menuData.slug,
              restaurantName: menuData.restaurantName,
              menuPreviewImage: menuData.menuPreviewImage,
              lifetimeViews: menuData.lifetimeViews,
              productCount: productCount
            }
          }
          return null
        })

        const userMenus = (await Promise.all(userMenuPromises)).filter(Boolean) as UserMenu[]
        setUserMenus(userMenus)
        setTotalMenus(userMenus.length)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user menus:', error)
        setLoading(false)
      }
    }

    fetchUserMenus()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Menus</h2>
      <p className="mb-4">Total Menus: {totalMenus}</p>
      <div className="grid gap-4">
        {userMenus.map((userMenu) => (
          <div key={userMenu.userId} className="border p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              {userMenu.menuPreviewImage && (
                <div className="mr-4 relative h-full aspect-video w-56">
                  <Image
                    src={userMenu.menuPreviewImage}
                    alt={`Cover for ${userMenu.restaurantName}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded aspect-video"
                  />
                </div>
              )}
              <div className='flex flex-col items-start'>
                <p className="font-bold">{userMenu.restaurantName}</p>

                <span>
                    Products: {userMenu.productCount}
                </span>

                <span>Total views: {userMenu.lifetimeViews}</span>
                
                <Link href={`/menu/${userMenu.menuSlug}`} className="text-blue-500 hover:underline">
                  View Menu
                </Link>
              </div>

            </div>


            <div className="text-right">
              <p className="text-gray-600">{userMenu.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
