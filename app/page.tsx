'use client'

import AnimatedWave from '@/components/Frontend/AnimatedWave';
import AosInit from '@/components/Frontend/AosInit';
import CTA from '@/components/Frontend/CTA';
import HeroSection from '@/components/Frontend/HeroSection';
import PricingSection from '@/components/Frontend/PricingSection';
import Whatsapp from '@/components/Whatsapp';

export default function Home() {

  return (
    <>
      <AosInit />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 max-w-6xl mx-auto">
        <HeroSection />
      </main>
        <CTA />
        <PricingSection />
        <Whatsapp />

      <div className={`bg-purple-600`}>
          <AnimatedWave />
          <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8"></section>
      </div>
    </>
  )
}
