"use client"

import { connectToDB } from '@/utils/mongoose';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {

  const clerkUser = useUser();
  console.log('clerkUser', clerkUser);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
       {clerkUser.isSignedIn ? <h1>hello, {clerkUser.user.fullName}</h1> : <h1>hello, please <Link href={'/sign-in'}>Sign in</Link></h1>}
       
    </main>
  )
}
