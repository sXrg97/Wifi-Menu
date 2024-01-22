"use client"

import FrontendMenu from "@/components/Frontend/FrontendMenu";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { fetchMenuBySlug, increaseMenuViews } from "@/lib/actions/menu.actions";
import { useParams } from "next/navigation";

const Menu = () => {
    const checkAndIncreaseViews = async (menuId: string) => {
        const lastVisited = Cookies.get(`lastVisited_${menuId}`);

        if (!lastVisited || (Date.now() - parseInt(lastVisited)) > 20 * 60 * 1000) {
            // Set new "lastVisited" cookie
            Cookies.set(`lastVisited_${menuId}`, Date.now().toString());

            // Call increaseMenuViews function
            await increaseMenuViews(menuId);
        }
    };

    // Call the function on component mount
    const { slug } = useParams();

    useEffect(() => {
        let menuId;
        const getMenuId = async () => {
            try {
                const menu = await fetchMenuBySlug(slug as string);
                menuId = menu._id;
                checkAndIncreaseViews(menuId);
            } catch (err) {
                console.log(err);
            }
        };
        getMenuId();
        console.log("menuid", menuId)

    }, [slug]);

    return (
        <>
            <FrontendMenu />
        </>
    );
};

export default Menu;