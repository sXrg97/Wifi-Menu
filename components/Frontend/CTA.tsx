"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"
import { SignInButton, useUser } from "@clerk/nextjs"

const CTA = () => {
  const {isSignedIn } = useUser();
  return (
    <div className="bg-purple-600 w-full" data-aos="fade-up" data-aos-duration="1200" >
        <div className="w-full mx-auto text-center p-4 md:p-8 py-6 md:py-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ești gata să treci în digital?</span>
            <span className="block">Începe cu Wifi Menu astăzi.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-purple-200">
            Alătură-te sutelor de restaurante care deja folosesc Wifi Menu pentru a îmbunătăți experiența clienților lor.
          </p>
          {isSignedIn ? 
          <Link href="/dashboard">
            <Button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 sm:w-auto">
              Începe acum
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          : 
          <SignInButton mode="modal">
            <Button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 sm:w-auto">
              Începe acum
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignInButton>
          } 
        </div>
      </div>
  )
}

export default CTA
