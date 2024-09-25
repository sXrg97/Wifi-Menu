'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBlogPost } from '@/lib/actions/blog.actions'
import BlogEditor from '@/components/Backend/BlogEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'

export default function CreateBlogPost() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const router = useRouter()
  const { user } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user?.primaryEmailAddress?.emailAddress !== 'sergiumarcu97@gmail.com') {
      alert('You are not authorized to create blog posts')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('content', content)
    if (coverImage) formData.append('coverImage', coverImage)

    try {
      await createBlogPost(formData)
      router.push('/blog')
    } catch (error) {
      console.error('Error creating blog post:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create New Blog Post</h1>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mb-4"
        required
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="mb-4"
        required
      />
      <Input
        type="file"
        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
        accept="image/*"
        className="mb-4"
      />
      <BlogEditor value={content} onChange={setContent} />
      <Button type="submit" className="mt-4">Create Post</Button>
    </form>
  )
}
