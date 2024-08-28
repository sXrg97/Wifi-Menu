const RefundPolicy = () => {
    return (
        <div className="w-full bg-gray-100 text-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-3xl font-bold mb-6 text-purple-900">Politica de Restituire</h1>
                <div className="space-y-6 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">1. Introducere</h2>
                        <p>
                            Această Politică de Restituire descrie condițiile în care puteți solicita o restituire pentru serviciile oferite de <a href="https://wifi-menu.ro" className="text-purple-700 hover:underline">Wifi Menu</a> (&quot;<strong>Site-ul</strong>&quot;). Vă rugăm să citiți cu atenție această politică înainte de a solicita o restituire.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">2. Eligibilitatea pentru Restituire</h2>
                        <p>
                            Restituirea poate fi solicitată doar în următoarele cazuri:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Serviciul nu a fost furnizat conform descrierii sau a fost defectuos.</li>
                            <li>Solicitarea de anulare a abonamentului a fost făcută în perioada de grație specificată pe Site.</li>
                        </ul>
                        <p>
                            Pentru a fi eligibil pentru restituire, trebuie să ne contactați în termen de <strong>30 de zile</strong> de la data achiziției.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">3. Procedura de Solicitare a Restituirii</h2>
                        <p>
                            Pentru a solicita o restituire, vă rugăm să urmați acești pași:
                        </p>
                        <ol className="list-decimal list-inside pl-4">
                            <li>Contactați echipa noastră de suport la <a href="mailto:support@wifi-menu.ro" className="text-purple-700 hover:underline">support@wifi-menu.ro</a>, furnizând detalii despre achiziție și motivul solicitării.</li>
                            <li>Echipa noastră va evalua cererea și, dacă este necesar, va solicita informații suplimentare.</li>
                            <li>În cazul în care cererea este aprobată, restituirea va fi procesată în termen de <strong>10 zile lucrătoare</strong>.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">4. Metode de Restituire</h2>
                        <p>
                            Restituirea va fi efectuată prin aceeași metodă de plată utilizată pentru achiziția inițială, cu excepția cazului în care se convine altfel. Timpul necesar pentru ca fondurile să fie disponibile în contul dvs. poate varia în funcție de furnizorul de servicii de plată.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">5. Excepții și Limitări</h2>
                        <p>
                            Anumite servicii sau produse nu sunt eligibile pentru restituire, inclusiv, dar fără a se limita la, următoarele:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Servicii sau produse personalizate.</li>
                            <li>Servicii deja furnizate integral sau în curs de furnizare.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">6. Modificări ale Politicii de Restituire</h2>
                        <p>
                            Ne rezervăm dreptul de a modifica această Politică de Restituire în orice moment. Orice modificare va fi publicată pe această pagină, iar utilizarea continuă a Site-ului constituie acceptarea modificărilor respective. Vă încurajăm să verificați periodic această pagină pentru a fi la curent cu cele mai recente informații despre politica noastră de restituire.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-2 text-purple-800">7. Contact</h2>
                        <p>
                            Dacă aveți întrebări sau nelămuriri cu privire la această Politică de Restituire, vă rugăm să ne contactați la <a href="mailto:support@wifi-menu.ro" className="text-purple-700 hover:underline">support@wifi-menu.ro</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>

    )
}

export default RefundPolicy