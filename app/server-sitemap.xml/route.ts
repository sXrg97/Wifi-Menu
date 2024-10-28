import { getAllMenus } from '@/lib/actions/menu.actions'
import { getBlogPosts } from '@/lib/actions/blog.actions'
import { MenuType } from '@/types/types'
import { getServerSideSitemap } from 'next-sitemap'

export async function GET(request: Request) {
  try {
    // Fetch all menus and blog posts
    const [menus, blogPosts] = await Promise.all([getAllMenus(), getBlogPosts()]);

    // Map menus and blog posts to URLs for the sitemap
    const fields = [
      ...menus.map((menu: MenuType) => ({
        loc: `https://wifi-menu.ro/menu/${menu.slug}`,
        lastmod: new Date().toISOString().split('T')[0],
      })),
      ...blogPosts.map((post: any) => ({
        loc: `https://wifi-menu.ro/blog/${post.slug}`,
        lastmod: new Date(post.updatedAt.seconds*1000).toISOString().split('T')[0],
      }))
    ];

    // Return the dynamically generated sitemap
    return getServerSideSitemap(fields);
  } catch (error) {
    console.log("Error generating sitemap: ", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}