"use client";

import { fetchMenuBySlug, increaseMenuViews } from "@/lib/actions/menu.actions";
import { MenuType } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShowRestaurant from "./ShowRestaurant";
import { Loader2 } from "lucide-react";
import Cookies from 'js-cookie';
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const FrontendMenu = ({menuId}:{menuId: string}) => {
    const { slug } = useParams();

	// Use useDocumentData to fetch menu data in real-time using the slug
	const [liveMenu, loading, error] = useDocumentData(doc(db, 'menus', menuId));
    console.log({liveMenu})

    const checkAndIncreaseViews = async (menuId: string) => {
        const lastVisited = Cookies.get(`lastVisited_${menuId}`);

        if (!lastVisited || (Date.now() - parseInt(lastVisited)) > 20 * 60 * 1000) {
            // Set new "lastVisited" cookie
            Cookies.set(`lastVisited_${menuId}`, Date.now().toString());

            // Call increaseMenuViews function
            await increaseMenuViews(menuId);
        }
    };

    useEffect(() => {
        liveMenu && checkAndIncreaseViews(liveMenu._id)
    }, [liveMenu]);
    return (
        <>
            {liveMenu ? (
                <div className="mx-auto max-w-full w-full">
                    <ShowRestaurant menu={liveMenu as MenuType} />
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
