import { Metadata, ResolvingMetadata } from 'next';
import { fetchMenuBySlug } from '@/lib/actions/menu.actions'; // Adjust the import based on your file structure
import FrontendMenu from '@/components/Frontend/FrontendMenu';

type Props = {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const slug = params.slug;

	// Fetch menu data
	const menu = await fetchMenuBySlug(slug);

	// Optionally access and extend (rather than replace) parent metadata
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: menu ? `${menu.restaurantName} - Wifi Menu` : "Meniu Inexistent - Wifi Menu",
		openGraph: {
			title: menu ? `${menu.restaurantName} - Wifi Menu` : "Meniu Inexistent - Wifi Menu",
			description: menu ? `Descoperă meniul restaurantului ${menu.restaurantName} cu Wifi Menu.` : "Meniul solicitat nu a fost găsit.",
			url: `https://wifi-menu.ro/menu/${slug}`,
			images: [menu.menuPreviewImage ? menu.menuPreviewImage : 'https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png', ...previousImages],
		},
	};
}

export default async function Page({ params, searchParams }: Props) {
    const { slug } = params;
	const menu = await fetchMenuBySlug(slug);


	return (
		<main>
			<FrontendMenu menuId={menu._id} />
		</main>
	);
}