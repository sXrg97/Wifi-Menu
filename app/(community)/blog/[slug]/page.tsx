import { getBlogPostBySlug } from '@/lib/actions/blog.actions'
import Image from 'next/image'

export interface Post {
  id: string;
  title: string;
  coverImage?: string;
  content: string;
  // ... other properties
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return <div>Post not found</div> // Or handle the null case as appropriate
  }

  // Ensure post is of type Post
  const typedPost: Post = post as Post;

  return (
    <article className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-4">{typedPost.title}</h1>
      {typedPost.coverImage && (
        <Image
          src={typedPost.coverImage}
          alt={typedPost.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover mb-8 rounded-lg"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: typedPost.content }} />
    </article>
  )
}
