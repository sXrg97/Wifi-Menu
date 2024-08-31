import { getAllMenus } from '@/lib/actions/menu.actions'
import { MenuType } from '@/types/types';
import { getServerSideSitemap } from 'next-sitemap'

export async function GET(request: Request) {
  try {
    // Fetch all menus
    const menus = await getAllMenus();

    // Map each menu to a URL for the sitemap
    const fields = menus.map((menu: MenuType) => ({
      loc: `https://wifi-menu.ro/menu/${menu._id}`, // Dynamic URL for each menu
      lastmod: new Date().toISOString(), // Last modified date (customize as needed)
      // Optionally, you can also add `changefreq` and `priority` here
    }));

    // Return the dynamically generated sitemap
    return getServerSideSitemap(fields);
  } catch (error) {
    console.log("Error generating sitemap: ", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
