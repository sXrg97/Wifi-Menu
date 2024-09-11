import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingSection() {
  return (
    <div className="bg-white p-4 md:p-8 py-6 md:py-12 w-full dark:bg-gray-950 max-w-6xl mx-auto">
      <div className="mx-auto max-w-7xl px-0">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-600">Prețuri</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Planuri pentru fiecare restaurant
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Alegeți planul potrivit pentru afacerea dumneavoastră și începeți să transformați experiența clienților dumneavoastră astăzi.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {[
            {
              name: 'Gratis',
              id: 'tier-free',
              href: '#',
              priceMonthly: '0 lei',
              description: 'Perfect pentru a începe și a testa serviciul nostru.',
              features: [
                'Până la 20 de produse în meniu',
                'Generare cod QR pentru 1 masă',
                'Actualizări de meniu săptămânale',
                'Suport prin e-mail de bază',
              ],
            },
            {
              name: 'Basic',
              id: 'tier-basic',
              href: '#',
              priceMonthly: '99 lei',
              description: 'Ideal pentru restaurante mici sau care încep să crească.',
              features: [
                'Până la 50 de produse în meniu',
                'Generare cod QR pentru 5 mese',
                'Actualizări de meniu nelimitate',
                'Suport prin e-mail prioritar',
              ],
            },
            {
              name: 'Pro',
              id: 'tier-pro',
              href: '#',
              priceMonthly: '199 lei',
              description: 'Perfect pentru restaurante în creștere cu nevoi mai complexe.',
              features: [
                'Produse nelimitate în meniu',
                'Generare cod QR pentru 20 de mese',
                'Actualizări de meniu în timp real',
                'Funcția de apelare ospătar',
                'Funcția de solicitare notă de plată',
                'Suport prioritar 24/7',
              ],
            },
          ].map((tier) => (
            <div
              key={tier.id}
              className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                  {tier.name !== 'Gratis' && <span className="text-base text-gray-500">/lună</span>}
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-purple-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                aria-describedby={tier.id}
                className={`mt-8 block w-full dark:bg-purple-200 ${tier.name === 'Gratis' ? 'bg-purple-600 dark:bg-purple-600 hover:bg-purple-700' : ''}`}
              ><Link href={tier.href}>
                {tier.name === 'Gratis' ? 'Începeți gratuit' : `Începeți cu ${tier.name}`}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}