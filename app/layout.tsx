import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Meniu Digital Gratuit - Meniu QR Interactiv pentru Restaurante - Wifi Menu",
    description: "Transformă experiența clienților tăi cu un meniu digital interactiv gratuit. Wifi Menu îți oferă un meniu QR ușor de utilizat, accesibil pe orice dispozitiv mobil, ideal pentru restaurante moderne",
    icons: {
        icon: "/wifi-menu-logo-white.svg"
    },
    verification: {
        google: "sK5u7EouznxBlha4srXeaBD5uzLl1f4je_bI1C3uu1k"
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                    <body className={`${inter.className} min-h-screen flex flex-col scroll-smooth dark:bg-gray-950 dark:text-white`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    >
                            <Header />
                            <main className="flex flex-col flex-1">{children}</main>
                            <SpeedInsights />
                            <Toaster />
                            <Footer />
                </ThemeProvider>
                <Analytics/>
                </body>
            </html>
        </ClerkProvider>
    );
}
