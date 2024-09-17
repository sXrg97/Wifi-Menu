'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createMenu } from '@/lib/actions/menu.actions'
import { useUser } from '@clerk/nextjs'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { generateSlug } from '@/lib/utils'

export default function RestaurantSetup({createOrGetMenu}: {createOrGetMenu: () => void}) {
  const [restaurantName, setRestaurantName] = useState('')
  const [slug, setSlug] = useState('')
  const [tableCount, setTableCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useUser()

  const handleRestaurantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setRestaurantName(name)
    setSlug(generateSlug(name))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const tables = Array.from({ length: tableCount }, (_, i) => ({
        tableNumber: i + 1,
        callWaiter: false,
        requestBill: false
      }))

      const formData = new FormData()
      formData.append('restaurantName', restaurantName)
      formData.append('slug', slug)
      formData.append('tables', JSON.stringify(tables))
      formData.append('owner', user?.id || '')
      if (coverImage) {
        formData.append('restaurantCoverImage', coverImage)
      }

      const menuId = await createMenu(formData)
      createOrGetMenu();
    } catch (error) {
      console.error('Error creating menu:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-gray-950">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Creeaza meniul tau</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="restaurantName" className="text-gray-700 dark:text-gray-300">Nume restaurant</Label>
              <Input
                id="restaurantName"
                type="text"
                value={restaurantName}
                onChange={handleRestaurantNameChange}
                required
                className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">URL (Slug)</Label>
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="tableCount" className="text-gray-700 dark:text-gray-300">Numar de mese</Label>
              <Input
                id="tableCount"
                type="number"
                min="1"
                value={tableCount}
                onChange={(e) => setTableCount(parseInt(e.target.value))}
                required
                className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="coverImage" className="text-gray-700 dark:text-gray-300">Poza principala a meniului (Optional)</Label>
              <div className="mt-1 flex items-center space-y-4 flex-col">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 text-nowrap w-full"
                >
                  <Upload className="mr-2 h-4 w-4" /> Incarca Imagine
                </Button>
                <input
                  type="file"
                  id="coverImage"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {coverImagePreview && (
                  <div className="relative w-full min-w-full">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      width={192}
                      height={64}
                      className="object-cover rounded aspect-video w-full"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
              {isLoading ? 'Se creeaza...' : 'Creeaza meniu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}