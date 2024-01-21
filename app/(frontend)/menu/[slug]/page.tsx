import { Metadata } from "next";
import FrontendMenu from "@/components/Frontend/FrontendMenu";

export const metadata: Metadata = {
    title: "Wifi Menu",
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
