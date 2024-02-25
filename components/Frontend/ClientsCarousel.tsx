import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { MenuType } from "@/types/types";
import { getRandomMenus } from "@/lib/actions/menu.actions";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

const ClientsCarousel = () => {
    const [menus, setMenus] = useState<MenuType[]>([]);
    const [loading, setLoading] = useState(true);

    const getMenus = async () => {
        try {
            const menusResponse = await getRandomMenus(3);
            setMenus(menusResponse);
            // setMenus(menusResponse);
            // console.log(menusResponse)
        } catch (err) {
            console.log("Error getting menus:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMenus();
    }, []);

    return (
        <section className="w-full mx-auto py-6 px-4 sm:px-6 md:px-8 flex flex-col">
            <h3 className="font-medium mb-4 text-xl text-left">Check out some of our clients:</h3>
            {loading ? (
                <Skeleton className="h-60 w-full overflow-hidden" />
            ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                        {menus.map((menu, i) => (
                                <Link className="flex flex-1 h-full w-full" href={`/menu/${menu.slug}`} key={`${menu._id}_${i}`}>
                                    <div className="p-1 w-full">
                                        <Card>
                                            <CardContent className="flex flex-col items-center p-6">
                                                <Image
                                                    src={menu.menuPreviewImage || "/dashboard-cover.webp"}
                                                    alt={`Preview for ${menu.restaurantName}`}
                                                    className="w-full h-40 object-cover mb-4 rounded-md"
                                                    width={1600}
                                                    height={900}
                                                />
                                                <h3 className="text-xl font-semibold">{menu.restaurantName}</h3>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </Link>
                        ))}
                    </div>
            )}
        </section>
    );
};

export default ClientsCarousel;
