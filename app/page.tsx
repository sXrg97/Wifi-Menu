import { connectToDB } from '@/utils/mongoose';
import Link from 'next/link';

export default function Home() {

  connectToDB();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello, please <Link href={'/sign-in'}>Sign in</Link></h1>
    </main>
  )
}
