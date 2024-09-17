'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RestaurantInfo from '@/components/Dashboard/RestaurantInfo'
import { checkUserOrCreate } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import RestaurantSetup from '@/components/Backend/RestaurantSetup'
import { Loader } from 'lucide-react'

const Dashboard = () => {
  const [menuId, setMenuId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const clerkUser = useUser()
  const router = useRouter()

  const createOrGetMenu = async () => {
    if (clerkUser.isSignedIn) {
      try {
        const id = clerkUser.user?.id
        const email = clerkUser.user?.primaryEmailAddress?.emailAddress
        const thisMenuId = await checkUserOrCreate(id, email || "")
        setMenuId(thisMenuId)
      } catch (error) {
        console.error('Error creating or retrieving menu:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {

    createOrGetMenu()
  }, [clerkUser])

  if (loading) {
    return <div className='min-h-[60vh] flex w-full items-center justify-center'><Loader className='animate-spin size-8 text-purple-600' /></div>
  }

  if (!menuId) {
    return <RestaurantSetup createOrGetMenu={createOrGetMenu} />
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        <h1 className='text-4xl font-bold mb-4'>
          Dashboard
        </h1>
        
        <main>
          <RestaurantInfo menuId={menuId} />
        </main>
      </div>
    </main>
  )
}

export default Dashboard