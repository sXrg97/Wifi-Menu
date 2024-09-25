import { getBlogPosts } from '@/lib/actions/blog.actions'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from './[slug]/page'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'

export default async function Blog() {
  const posts: any = await getBlogPosts()
  const user = await currentUser()
  const isAuthorized = user?.emailAddresses.some(email => email.emailAddress === 'sergiumarcu97@gmail.com')

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Our Latest <span className="text-purple-600 dark:text-purple-400">Insights</span>
          </h1>
          {isAuthorized && (
            <Link href="/blog/create-blog-post" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Creeaza articol
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {post.coverImage && (
                  <div className="relative h-48 sm:h-64">
                    <Image
                      src={post.coverImage}
                      alt={`Imagine de coperta pentru postarea din blog: ${post.title}`}
                      title={`${post.title} - Coperta pentru blog`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <time dateTime={post.createdAt.toDate().toISOString()}>
                      {post.createdAt.toDate().toLocaleDateString()}
                    </time>
                    <span className="mx-2">•</span>
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}