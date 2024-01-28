"use client"

import AnimatedWave from '@/components/Frontend/AnimatedWave';
import HeroSection from '@/components/Frontend/HeroSection';
import { connectToDB } from '@/utils/mongoose';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {

  const clerkUser = useUser();
  console.log('clerkUser', clerkUser);

  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HeroSection />

       
       
    </main>
      <div className={`bg-purple-600`}>
          <AnimatedWave />
          <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8"></section>
      </div>
    </>
  )
}
