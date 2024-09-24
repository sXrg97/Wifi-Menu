import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Roxana Neag",
    role: "Manager de Restaurant",
    comment: "Wifi Menu a revoluționat modul în care gestionăm meniul nostru. Clienții adoră să scaneze codul QR și să vadă meniul digital!",
    rating: 5,
    avatar: "/testimonials/avatar-1.jpg"
  },
  {
    name: "Alexandru Graur",
    role: "Proprietar de Cafenea",
    comment: "De când am implementat Wifi Menu, am observat o creștere semnificativă a eficienței și satisfacției clienților. Este un instrument esențial pentru orice restaurant modern.",
    rating: 5,
    avatar: "/testimonials/avatar-2.jpg"
  },
  {
    name: "Elena Brezeanu",
    role: "Șef Bucătar",
    comment: "Actualizarea meniului nostru nu a fost niciodată mai ușoară. Wifi Menu ne-a economisit timp și resurse, permițându-ne să ne concentrăm pe ceea ce contează cu adevărat - mâncarea și experiența clienților.",
    rating: 5,
    avatar: "/testimonials/avatar-3.jpg"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900" data-aos="fade-up">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Ce Spun Clienții Noștri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.comment}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}