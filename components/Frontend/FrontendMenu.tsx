"use client";

import { fetchMenu } from "@/lib/actions/menu.actions";
import { MenuType } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import RestaurantInfo from "../Dashboard/RestaurantInfo";
import ShowRestaurant from "./ShowRestaurant";

const FrontendMenu = () => {
    const { id } = useParams();
    const [menu, setMenu] = useState<null | MenuType>(null);

    useEffect(() => {
        const getMenu = async () => {
            try {
                const menu = await fetchMenu(id as string);
                setMenu(menu);
                console.log(menu);
            } catch (err) {
                console.log(err);
            }
        };
        getMenu();
    }, [id]);
    return (
        <>
            {menu ? (
                <div className="mx-auto max-w-full">
                    {id && <ShowRestaurant menu={menu} />}
                </div>
            ) : (
                <div className="mx-auto max-w-7xl p-8">
                    <h1 className="text-5xl text-center">
                        Fetching menu...
                        <Skeleton className="h-12 w-full bg-slate-400" />
                    </h1>
                </div>
            )}
        </>
    );
};

export default FrontendMenu;
