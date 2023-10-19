import Footer from "@/components/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "eMenu",
    description: "Your menu in the digital world",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} min-h-screen flex flex-col`}>
                    <Header />
                        <main className="flex-1">{children}</main>
                        <Toaster />
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}