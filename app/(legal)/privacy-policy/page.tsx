import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Politica de Confidențialitate - Wifi Menu",
    description: "Citiți politica de confidențialitate a Wifi Menu pentru a înțelege cum colectăm, utilizăm și protejăm informațiile dvs. personale.",
    openGraph: {
        title: "Politica de Confidențialitate - Wifi Menu",
        description: "Citiți politica de confidențialitate a Wifi Menu pentru a înțelege cum colectăm, utilizăm și protejăm informațiile dvs. personale.",
        url: "https://wifi-menu.ro/legal/privacy-policy",
        images: [
            {
                url: "https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png", // Logo URL
                width: 1200,
                height: 630,
                alt: "Logo Wifi Menu"
            }
        ],
    },
};

const PrivacyPolicy = () => {
    return (
        <div className="w-full bg-gray-100 text-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-3xl font-bold mb-6 text-purple-900">Politica de Confidențialitate</h1>
                <div className="space-y-6 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">1. Introducere</h2>
                        <p>
                            La <span className="font-semibold">Wifi Menu</span>, confidențialitatea dvs. este extrem de importantă pentru noi. Această Politică de Confidențialitate explică modul în care colectăm, utilizăm, dezvăluim și protejăm informațiile dvs. personale atunci când utilizați platforma noastră online disponibilă la <a href="https://wifi-menu.ro" className="text-purple-700 hover:underline">www.wifi-menu.ro</a> (&quot;<strong>Site-ul</strong>&quot;).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">2. Informațiile pe care le Colectăm</h2>
                        <p>
                            Colectăm diverse tipuri de informații de la dvs. și despre dvs., inclusiv:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>
                                <strong>Informații personale:</strong> Nume, adresă de email, număr de telefon și alte informații similare.
                            </li>
                            <li>
                                <strong>Informații tehnice:</strong> Adresa IP, tipul de browser, setările dispozitivului și alte date tehnice.
                            </li>
                            <li>
                                <strong>Informații despre utilizare:</strong> Informații despre cum utilizați Serviciul nostru, inclusiv interacțiunile dvs. cu Site-ul.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">3. Cum Utilizăm Informațiile</h2>
                        <p>
                            Utilizăm informațiile colectate pentru a:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>
                                Furniza și îmbunătăți Serviciul nostru.
                            </li>
                            <li>
                                Personaliza experiența utilizatorului.
                            </li>
                            <li>
                                Comunica cu dvs., inclusiv pentru suport și actualizări.
                            </li>
                            <li>
                                Asigura securitatea și integritatea platformei noastre.
                            </li>
                            <li>
                                Respecta obligațiile legale și reglementările aplicabile.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">4. Divulgarea Informațiilor</h2>
                        <p>
                            Nu vindem, închiriem sau dezvăluim informațiile dvs. personale unor terțe părți, cu excepția situațiilor în care:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>
                                Este necesar pentru a furniza Serviciul (de exemplu, furnizori de servicii care lucrează în numele nostru).
                            </li>
                            <li>
                                Este cerut de lege sau ca răspuns la o procedură legală.
                            </li>
                            <li>
                                Este necesar pentru a proteja drepturile, proprietatea sau siguranța Wifi Menu sau a altor persoane.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">5. Securitatea Datelor</h2>
                        <p>
                            Ne angajăm să protejăm informațiile dvs. personale prin măsuri de securitate tehnice și organizaționale adecvate. Cu toate acestea, niciun sistem de transmisie de date pe internet nu poate fi garantat ca fiind complet sigur. Prin urmare, utilizarea Site-ului se face pe propriul dvs. risc.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">6. Drepturile Dvs.</h2>
                        <p>
                            Aveți drepturi specifice în legătură cu datele dvs. personale, inclusiv dreptul de a accesa, corecta, șterge sau restricționa utilizarea datelor dvs. personale. De asemenea, puteți obiecta la prelucrarea datelor dvs. sau puteți solicita portabilitatea acestora. Pentru a exercita aceste drepturi, vă rugăm să ne contactați la <a href="mailto:support@wifi-menu.ro" className="text-purple-700 hover:underline">support@wifi-menu.ro</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">7. Utilizarea Cookie-urilor</h2>
                        <p>
                            Site-ul nostru utilizează cookie-uri și tehnologii similare pentru a colecta informații despre activitatea dvs. pe Site și pentru a îmbunătăți experiența dvs. online. Pentru mai multe detalii despre cum folosim cookie-urile, vă rugăm să consultați <a href="https://wifi-menu.ro/cookie-policy" className="text-purple-700 hover:underline">Politica noastră privind Cookie-urile</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">8. Modificarea Politicii de Confidențialitate</h2>
                        <p>
                            Ne rezervăm dreptul de a modifica această Politică de Confidențialitate în orice moment. Orice modificări vor fi publicate pe această pagină și vor intra în vigoare imediat după publicare. Vă încurajăm să verificați periodic această pagină pentru a rămâne informat cu privire la modul în care protejăm informațiile dvs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">9. Contact</h2>
                        <p>
                            Dacă aveți întrebări sau nelămuriri cu privire la această Politică de Confidențialitate, ne puteți contacta la <a href="mailto:support@wifi-menu.ro" className="text-purple-700 hover:underline">support@wifi-menu.ro</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>

    )
}

export default PrivacyPolicy