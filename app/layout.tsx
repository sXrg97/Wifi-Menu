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
import GoogleAdsense from "@/components/GoogleAds/GoogleAdsense";
import GoogleTagManager from "@/components/GoogleAds/GoogleTag";
import GoogleAnalyticsTag from "@/components/GoogleAds/GoogleAnalyticsTag";
import { Providers } from "@/components/Providers";
import { roRO } from '@clerk/localizations'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Meniu Digital QR Gratuit - Wifi Menu - Pentru Afacerea ta",
    description: "Creează un meniu digital gratuit cu Wifi Menu. Ideal pentru restaurante si baruri, meniul QR oferă o experiență modernă pe orice dispozitiv.",
    icons: {
        icon: "/wifi-menu-logo-white.svg"
    },
    verification: {
        google: "sK5u7EouznxBlha4srXeaBD5uzLl1f4je_bI1C3uu1k"
    },
    openGraph: {
        title: "Meniu Digital QR Gratuit - Wifi Menu - Pentru Afacerea ta",
        description: "Creează un meniu digital gratuit cu Wifi Menu. Ideal pentru restaurante si baruri, meniul QR oferă o experiență modernă pe orice dispozitiv.",
        url: "https://wifi-menu.ro",
        images: [
            {
                url: "https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png",
                width: 1400,
                height: 1400,
                alt: "Wifi Menu"
            }
        ],
        type: "website",
        locale: "ro_RO"
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider localization={roRO}>
                <html lang="ro" suppressHydrationWarning>
                    <head>
                        <GoogleTagManager googleTagManagerId={"GTM-KMKX6JNX"} />
                    </head>
                    <body className={`${inter.className} min-h-screen flex flex-col scroll-smooth dark:bg-gray-950 dark:text-white`}>
                        <GoogleAnalyticsTag />
                        {/* Google Tag Manager (noscript) */}
                        <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${"GTM-KMKX6JNX"}`}
                            height="0"
                            width="0"
                            style={{
                            display: 'none',
                            visibility: 'hidden'
                            } as React.CSSProperties}
                        />
                        </noscript>
                        {/* End Google Tag Manager (noscript) */}

                    <Providers>
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
                    </Providers>
                    <Analytics/>
                    <GoogleAdsense pId="5014917614845643" />
                    </body>
                </html>
        </ClerkProvider>
    );
}
