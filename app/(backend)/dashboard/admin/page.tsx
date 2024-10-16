import React from 'react'
import AdminDashboard from '@/components/Backend/AdminDashboard'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const Admin = async () => {
    const user = await currentUser()

  if (user?.id !== 'user_2Wfk02ELFF7Mqld8qhdX82UcpJP') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  )
}

export default Admin
