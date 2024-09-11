'use client'

import Image from "next/image"
import { Cabin } from "next/font/google"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, QrCode, Bell, Receipt, Menu, Image as ImageIcon, Tag, Sparkles, Utensils, ShoppingCart, BarChart, CreditCard, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MenuType } from "@/types/types"
import { getRandomMenus } from "@/lib/actions/menu.actions"

const cabin = Cabin({
  subsets: ["latin"],
  style: ["normal", "italic"],
})

export default function HeroSection() {
  const [menus, setMenus] = useState<MenuType[]>([])
  const [loading, setLoading] = useState(true)

  const getMenus = async () => {
    try {
      const menusResponse = await getRandomMenus(3)
      setMenus(menusResponse)
    } catch (err) {
      console.log("Eroare la obținerea meniurilor:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMenus()
  }, [])

  return (
    <>
      <div className="">
        <div className="container mx-auto px-0 py-6 dark:bg-gray-950">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1
                className={`${cabin.className} text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl`}
              >
                <span className="block leading-tight md:leading-3">Wifi Menu</span>
                <span className="block text-3xl text-purple-600 xl:inline">Transformă-ți restaurantul</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Îmbunătățește experiența clienților tăi într-un adevărat festin digital! Creează ușor meniul online al restaurantului tău și generează coduri QR pentru mese.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start flex-wrap gap-5">
                <div className="rounded-md shadow">
                  <Link href="/dashboard">
                    <Button className="w-full flex items-center text-nowrap justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-600 md:py-4 md:text-lg md:px-10">
                      Creează-ți meniul QR
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link href="#how-it-works">
                    <Button variant="outline" className="w-full text-nowrap flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 md:py-4 md:text-lg md:px-10">
                      Află mai multe
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Image
                className="object-cover"
                src="/WifiMenu_Showcase.webp"
                alt="Prezentare Wifi Menu"
                layout="fill"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950">
          <div className="container mx-auto px-0 py-6 md:py-12">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8 dark:text-white">
              Clienții Noștri Satisfăcuți
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {menus.map((menu) => (
                  <Link href={`/menu/${menu.slug}`} key={menu._id} className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="aspect-video mb-4 relative">
                          <Image
                            src={menu.menuPreviewImage || "/dashboard-cover.webp"}
                            alt={`Previzualizare pentru ${menu.restaurantName}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-950">{menu.restaurantName}</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Experimentează meniul digital al {menu.restaurantName}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="how-it-works" className="py-6 md:py-12 dark:bg-gray-950 w-full">
        <div className="max-w-7xl mx-auto px-0">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Cum Funcționează</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Creează Meniul Tău Digital în 3 Pași Simpli
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Transformă meniul restaurantului tău într-o experiență digitală cu Wifi Menu. Este simplu, rapid și eficient.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">1. Creează-ți Meniul</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Introdu ușor articolele din meniu, categoriile, prețurile și descrierile în tabloul nostru de bord intuitiv.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <QrCode className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">2. Generează Coduri QR</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Cu un singur clic, creează coduri QR unice pentru fiecare masă din restaurantul tău.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <Smartphone className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">3. Clienții Scanază & Comandă</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Clienții scanază codul QR cu telefoanele lor pentru a vedea meniul digital și a plasa comenzi.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-0">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Funcționalități</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Tot Ce Ai Nevoie Pentru Un Meniu Digital
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Wifi Menu oferă un set complet de funcționalități pentru a-ți îmbunătăți prezența digitală a restaurantului.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <ImageIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Imagini de Copertă Personalizate</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Adaugă o notă personală meniului tău cu imagini de copertă personalizate care reprezintă brandul tău.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Încarcă imagini de înaltă calitate pentru a evidenția atmosfera restaurantului tău</li>
                        <li>Schimbă ușor imaginile de copertă pentru a reflecta meniurile sezoniere sau evenimentele speciale</li>
                        <li>Optimizare automată a imaginilor pentru încărcare rapidă pe dispozitive mobile</li>
                        <li>Opțiuni de filtre și ajustări pentru a asigura coerența cu identitatea vizuală a brandului</li>
                    </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Categorii și Produse</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Organizează meniul tău cu categorii și adaugă informații detaliate despre produse, inclusiv imagini și descrieri.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Creează și gestionează ușor categorii pentru o navigare intuitivă a meniului</li>
                        <li>Adaugă descrieri detaliate ale produselor pentru a evidenția ingredientele și metodele de preparare</li>
                        <li>Încarcă imagini profesionale pentru fiecare produs pentru a stimula apetitul clienților</li>
                        <li>Opțiune de a adăuga etichete personalizate (ex: &quot;Nou&quot;, &quot;Popular&quot;, &quot;Vegetarian&quot;) pentru produse</li>
                        <li>Funcționalitate de căutare în meniu pentru clienți, facilitând găsirea rapidă a produselor dorite</li>
                    </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <Tag className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Prețuri, Reduceri și Alergeni</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Afișează prețuri, evidențiază reduceri și oferă informații importante despre alergeni pentru fiecare articol.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Actualizează ușor prețurile în timp real, reflectând imediat schimbările în meniul digital</li>
                        <li>Creează și gestionează oferte speciale sau reduceri temporare cu doar câteva clicuri</li>
                        <li>Afișează clar informațiile despre alergeni, ajutând clienții să facă alegeri informate</li>
                        <li>Opțiune de a afișa valori nutriționale pentru fiecare produs</li>
                        <li>Personalizează modul de afișare a prețurilor (ex: cu sau fără TVA, în diferite valute)</li>
                    </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <Bell className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Cheamă Chelnerul & Solicită Nota
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Nou</span>
                    </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Permite clienților să cheme un chelner sau să solicite nota direct de pe dispozitivele lor.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Sistem de notificări instant pentru personal, asigurând un răspuns rapid la solicitările clienților</li>
                        <li>Opțiune pentru clienți de a specifica motivul solicitării (ex: comandă suplimentară, întrebare despre meniu)</li>
                        <li>Generare automată a notei de plată în format digital, cu opțiune de trimitere pe email</li>
                        <li>Integrare cu sistemul de management al restaurantului pentru o gestionare eficientă a solicitărilor</li>
                        <li>Analize detaliate privind timpul de răspuns și satisfacția clienților pentru îmbunătățirea serviciilor</li>
                    </ul>
                    </dd>
                </div>

              <div className="relative">
                <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                    <Utensils className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Personalizare Meniu în Timp Real
                    <span className="ml-2 px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Nou</span>
                    </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Personalizați meniul în timp real în funcție de disponibilitatea ingredientelor și cererea clienților.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                    <li>Actualizare instantanee a disponibilității produselor</li>
                    <li>Evidențierea automată a produselor populare</li>
                    <li>Ajustare dinamică a prețurilor în funcție de cerere</li>
                    <li>Sugestii personalizate pentru clienți bazate pe preferințele anterioare</li>
                    </ul>
                </dd>
                </div>

                <div className="relative">
                    <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-white">
                        <Sparkles className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                        Declarații Nutriționale AI
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full text-nowrap">În curând</span>
                        </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                        <p>În curând, vei putea genera declarații nutriționale cu o singură apăsare de buton, folosind inteligența artificială.</p>
                        <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Aproximarea valorilor nutriționale din descrierea produsului</li>
                        <li>Generare automată de informații precum calorii, proteine, grăsimi, etc.</li>
                        <li>Conformitate cu cerințele ANPC pentru afișarea informațiilor nutriționale</li>
                        </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-white">
                        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                        Comandă Directă de la Masă
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full text-nowrap">În curând</span>
                    </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Clienții pot adăuga produse în coș și trimite comanda direct de pe dispozitivele lor.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Interfață intuitivă de adăugare în coș pentru clienți</li>
                        <li>Trimitere instantanee a comenzii către bucătărie</li>
                        <li>Restaurantul poate vedea în timp real comenzile pentru fiecare masă</li>
                        <li>Reducerea erorilor de comandă și îmbunătățirea eficienței serviciului</li>
                    </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-white">
                        <BarChart className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                        Analiză Avansată și Rapoarte
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full text-nowrap">În curând</span>
                    </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>Viitoare funcționalitate de analiză detaliată pentru a vă ajuta să optimizați meniul și operațiunile restaurantului.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Rapoarte detaliate privind popularitatea produselor</li>
                        <li>Analiza tendințelor de comandă pe perioade de timp</li>
                        <li>Identificarea produselor cu marjă mare și vânzări scăzute</li>
                        <li>Sugestii de optimizare a meniului bazate pe date</li>
                    </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-white">
                        <CreditCard className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 flex items-center dark:text-white">
                        Plată cu Cardul Direct din Aplicație
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full text-nowrap">În curând</span>
                    </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>În curând, clienții vor putea plăti comanda direct din aplicație, fără a mai aștepta nota de plată.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Integrare securizată cu procesatori de plăți de încredere</li>
                        <li>Opțiuni multiple de plată: card de credit/debit, Apple Pay, Google Pay</li>
                        <li>Împărțirea notei de plată între mai mulți clienți</li>
                        <li>Generare automată de chitanțe digitale</li>
                        <li>Sistem de bacșiș digital pentru personal</li>
                    </ul>
                    </dd>
                </div>

                <div className="relative">
                    <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-400 text-white">
                        <Star className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 flex items-center dark:text-white">
                        Recenzii Conectate Direct la Google
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full text-nowrap">În curând</span>
                    </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                    <p>În curând, veți putea îmbunătăți prezența online a restaurantului dumneavoastră prin integrarea directă cu Google Reviews.</p>
                    <ul className="mt-2 list-disc list-inside text-sm">
                        <li>Încurajarea clienților să lase recenzii direct pe Google după experiența lor</li>
                        <li>Afișarea recenziilor pozitive în aplicație pentru a încuraja încrederea clienților</li>
                        <li>Notificări instant pentru recenzii noi, permițând răspunsuri rapide</li>
                        <li>Analize detaliate ale sentimentului recenziilor pentru îmbunătățirea serviciilor</li>
                        <li>Creșterea vizibilității restaurantului în căutările locale pe Google</li>
                    </ul>
                    </dd>
                </div>

            </dl>
          </div>
        </div>
      </div>
    </>
  )
}
