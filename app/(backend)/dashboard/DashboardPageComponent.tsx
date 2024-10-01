'use client'

import { useEffect, useState, useCallback } from 'react'
import RestaurantInfo from '@/components/Dashboard/RestaurantInfo'
import { checkUserOrCreate } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import RestaurantSetup from '@/components/Backend/RestaurantSetup'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const DashboardPageComponent = () => {
    const [menuId, setMenuId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { isLoaded, isSignedIn, user } = useUser()
  
    const createOrGetMenu = useCallback(async () => {
      if (isSignedIn) {
        try {
          const id = user?.id
          const email = user?.primaryEmailAddress?.emailAddress
          const thisMenuId = await checkUserOrCreate(id, email || "")
          setMenuId(thisMenuId)
        } catch (error) {
          console.error('Error creating or retrieving menu:', error)
        } finally {
          setLoading(false)
        }
      }
    }, [isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress]);
  
    useEffect(() => {
      async function fetchData() {
        console.log("checking")
        await createOrGetMenu()
      }
      fetchData()
    }, [isLoaded, isSignedIn, user, createOrGetMenu]) // Added createOrGetMenu to the dependency array
  
    if (loading) {
      return <div className='min-h-[60vh] flex w-full items-center justify-center'><Loader className='animate-spin size-8 text-purple-600' /></div>
    }
  
    if (!menuId) {
      return <RestaurantSetup createOrGetMenu={createOrGetMenu} />
    }
  
    return (
      <main>
        <div className="bg-purple-100 p-4 text-center">
            <p className="text-lg flex flex-col gap-2 items-center">
                <span>Dacă ai nevoie de ajutor cu platforma, nu ezita să urmărești videoclipul nostru!</span>

                <Link href={'/dashboard/tutorial-dashboard'} className='flex-1 w-full'>
                  <Button variant={'default'} className="text-white w-full">
                        Vizionare videoclip
                  </Button>
                </Link>
            </p>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
          <h1 className='text-4xl font-bold mb-4 dashboard-title'>
            Dashboard
          </h1>
          
          <main>
            <RestaurantInfo menuId={menuId} />
          </main>
        </div>
      </main>
    )
  }

export default DashboardPageComponent