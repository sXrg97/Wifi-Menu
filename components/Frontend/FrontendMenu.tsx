"use client";

import { fetchMenu, fetchMenuBySlug } from "@/lib/actions/menu.actions";
import { MenuType } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import ShowRestaurant from "./ShowRestaurant";
import { Loader2 } from "lucide-react";

const FrontendMenu = () => {
    const { slug } = useParams();
    const [menu, setMenu] = useState<null | MenuType>(null);

    useEffect(() => {
        const getMenu = async () => {
            try {
                const menu = await fetchMenuBySlug(slug as string);
                setMenu(menu);
                console.log(menu);
            } catch (err) {
                console.log(err);
            }
        };
        getMenu();
    }, [slug]);
    return (
        <>
            {menu ? (
                <div className="mx-auto max-w-full">
                    <ShowRestaurant menu={menu} />
                </div>
            ) : (
                <div className="mx-auto max-w-7xl p-8 flex justify-center">
                        <Loader2 className="animate-spin" height={40} width={40} />
                </div>
            )}
        </>
    );
};

export default FrontendMenu;
