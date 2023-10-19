import { Metadata } from "next";
import FrontendMenu from "@/components/Frontend/FrontendMenu";
import { getAuth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
    title: "eMenu - hello",
    description: "Your menu in the digital world",
};

const Menu = () => {
    return (
        <>
            <FrontendMenu />
        </>
    );
};

export default Menu;
