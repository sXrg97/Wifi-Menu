import { getBlogPostBySlug } from '@/lib/actions/blog.actions'
import Image from 'next/image'
import { Metadata } from 'next';

export interface Post {
  id: string;
  title: string;
  coverImage?: string;
  content: string;
  // ... other properties
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  return {
    title: post ? `${post.title} - Wifi Menu` : "Post not found - Wifi Menu",
    description: post ? `Citiți articolul "${post.title}" pe Wifi Menu` : "Articolul nu a fost găsit.",
    openGraph: {
      title: post ? `${post.title} - Wifi Menu` : "Post not found - Wifi Menu",
      description: post ? `Citiți articolul "${post.title}" pe Wifi Menu` : "Articolul nu a fost găsit.",
      url: `https://wifi-menu.ro/blog/${params.slug}`,
      images: [post?.coverImage || '/default-image.jpg'], // Use a default image if coverImage is not available
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return <div>Post not found</div>; // Handle the null case as appropriate
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
