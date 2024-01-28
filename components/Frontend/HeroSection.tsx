import Image from "next/image";
import AnimatedWave from "./AnimatedWave";
import { Cabin } from "next/font/google";
import { Button } from "../ui/button";
import ClientsCarousel from "./ClientsCarousel";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const cabin = Cabin({
    subsets: ["latin"],
    style: ["normal", "italic"],
});

const HeroSection = () => {
    return (
        <>
            <div
                className={`flex h-[60vh] flex-col-reverse mt-[210px] sm:flex-row items-center justify-between max-w-7xl mx-auto pt-12 pb-6 px-4 sm:px-6 md:px-8 sm:mt-4 sm:mb-10 gap-8 sm:gap-4`}
            >
                <div className="hero-text flex-1">
                    <h1
                        className={`${cabin.className} hero text-7xl font-bold italic uppercase mb-4 sm:mb-8 tracking-tighter`}
                    >
                        Wifi Menu
                    </h1>

                    <p className={`${cabin.className} hero text-xl font-bold italic mb-5 sm:mb-10 text-gray-500 pr-8`}>
                        Transform your customers&apos; experience into a digital feast!
                        <br />
                        Easily create your restaurant&apos;s online menu and generate QR codes for your tables.
                    </p>

                    <Link href="/dashboard">
                        <Button className="bg-purple-600 text-xl hover:bg-purple-700 create-your-menu-cta-btn">
                            Create your QR menu <ArrowRight className="ml-1" />
                        </Button>
                    </Link>
                </div>

                <div className="hero-image flex-1">
                    {/* Add your hero image here */}
                    <Image
                        alt="Wifi Menu Logo"
                        className="w-full h-auto"
                        src={"/WifiMenu_Showcase.webp"}
                        width={1600}
                        height={900}
                    ></Image>
                </div>
            </div>

            <ClientsCarousel />
        </>
    );
};

export default HeroSection;
