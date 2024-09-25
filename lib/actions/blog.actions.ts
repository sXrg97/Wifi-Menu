import { db } from '@/utils/firebase'
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/utils/firebase'

export async function getBlogPosts(limitCount = 10) {
  const postsRef = collection(db, 'blog_posts')
  const q = query(postsRef, where('published', '==', true), orderBy('createdAt', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getBlogPostBySlug(slug: string) {
  const postsRef = collection(db, 'blog_posts')
  const q = query(postsRef, where('slug', '==', slug), where('published', '==', true), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
}

export async function createBlogPost(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const coverImage = formData.get('coverImage') as File

  let coverImageUrl = ''
  if (coverImage) {
    const storageRef = ref(storage, `blog_covers/${Date.now()}_${coverImage.name}`)
    const snapshot = await uploadBytes(storageRef, coverImage)
    coverImageUrl = await getDownloadURL(snapshot.ref)
  }

  const slug = title.toLowerCase()
    .replace(/[ăâ]/g, 'a')
    .replace(/[îí]/g, 'i')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const postData = {
    title,
    description,
    content,
    coverImage: coverImageUrl,
    slug,
    published: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'blog_posts'), postData)
  return docRef.id
}
