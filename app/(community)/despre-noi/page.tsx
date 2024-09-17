import Image from "next/image"
import { Coffee, Utensils, QrCode, Smartphone, Star } from "lucide-react"

const DespreNoi = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Despre Wifi Menu</h1>
      
      <div className="max-w-4xl text-center mb-12">
        <p className="text-xl mb-4">
          Wifi Menu este soluția inovatoare care transformă experiența de dining, aducând meniurile restaurantelor în era digitală.
        </p>
        <Image 
          src="/WifiMenu_Showcase.webp"
          alt="Wifi Menu în acțiune"
          width={800}
          height={400}
          className="rounded-lg shadow-lg mb-8"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <QrCode className="mr-2 text-purple-600" />
            Meniuri Digitale cu Cod QR
          </h2>
          <p>
            Transformăm meniurile tradiționale în experiențe interactive. Clienții scanează un simplu cod QR pentru a accesa meniul complet al restaurantului pe propriile dispozitive.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Smartphone className="mr-2 text-purple-600" />
            Comandă și Plată Simplificată
          </h2>
          <p>
            Cu Wifi Menu, clienții pot comanda și plăti direct de pe smartphone-urile lor, reducând timpul de așteptare și îmbunătățind eficiența restaurantului.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Utensils className="mr-2 text-purple-600" />
            Gestionare Ușoară a Meniului
          </h2>
          <p>
            Oferim restaurantelor o platformă intuitivă pentru actualizarea rapidă a meniurilor, prețurilor și promoțiilor, asigurând că informațiile sunt mereu la zi.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Star className="mr-2 text-purple-600" />
            Experiență Îmbunătățită pentru Clienți
          </h2>
          <p>
            De la imagini atractive ale produselor la informații detaliate despre alergeni, Wifi Menu oferă clienților toate informațiile necesare pentru o experiență culinară perfectă.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center max-w-2xl">
        <h2 className="text-3xl font-semibold mb-4">Misiunea Noastră</h2>
        <p className="text-lg">
          La Wifi Menu, ne dedicăm să revoluționăm industria restaurantelor prin tehnologie accesibilă. Viziunea noastră este de a crea o conexiune seamless între restaurante și clienții lor, îmbunătățind eficiența operațională și oferind o experiență de dining de neuitat.
        </p>
      </div>

      <div className="mt-12 bg-purple-100 dark:bg-purple-800 p-8 rounded-lg max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
          <Coffee className="mr-2 text-purple-600" />
          Alătură-te Revoluției Digitale în Restaurante
        </h2>
        <p className="mb-4">
          Fie că ești proprietarul unui restaurant sau un pasionat al tehnologiei în industria ospitalității, Wifi Menu este aici pentru a transforma viziunea ta în realitate.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Contactează-ne pentru o Demonstrație
        </a>
      </div>
    </main>
  )
}

export default DespreNoi