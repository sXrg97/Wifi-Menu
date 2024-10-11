import AnimatedWave from '@/components/Frontend/AnimatedWave';
import AosInit from '@/components/Frontend/AosInit';
import CTA from '@/components/Frontend/CTA';
import HeroSection from '@/components/Frontend/HeroSection';
import PricingSection from '@/components/Frontend/PricingSection';
import Whatsapp from '@/components/Whatsapp';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Meniu Digital QR Gratuit - Wifi Menu - Pentru Afacerea ta",
  description: "Creează un meniu digital gratuit cu Wifi Menu. Ideal pentru restaurante si baruri, meniul QR oferă o experiență modernă pe orice dispozitiv.",
  alternates: {
    canonical: 'https://www.wifi-menu.ro',
  },
}

export default function Home() {

  return (
    <>
      <AosInit />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 max-w-6xl mx-auto">
        <HeroSection />
      </main>
      <CTA />
      <PricingSection />
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Parteneri</h2>
        <div className="flex items-center justify-center gap-20">
          <a href="https://asproject.ro/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/parteneri/asproject-logo.webp" // Replace with the actual path to the logo
              alt="AS Project Logo"
              width={80} // Adjust width as needed
              height={80} // Adjust height as needed
              className="transition duration-300 ease-in-out hover:filter-none filter grayscale"
            />
          </a>
        </div>
      </div>
      <Whatsapp />

      {/* PARTNERS SECTION */}

      <div className={`bg-purple-600`}>
          <AnimatedWave />
          <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8"></section>
      </div>
    </>
  )
}
