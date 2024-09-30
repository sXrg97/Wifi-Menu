"use client"

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, Send } from "lucide-react";

const Contact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'Wifi Menu - Contact Form',
    honeypot: '', // For spam protection, this field should stay empty
    replyTo: '@', // Email address will be set as replyTo
    accessKey: '9abd2d20-2bd6-4db8-83e0-92828d9a18dd', // Your access key
  });

  const [response, setResponse] = useState({
    type: '',
    message: ''
  });

  const handleChange = (e: any) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.staticforms.xyz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });

      const json = await res.json();

      if (json.success) {
        setResponse({
          type: 'success',
          message: 'Mesajul dvs. a fost trimis cu succes! Vă mulțumim că ne-ați contactat.'
        });
        setContact({
          name: '',
          email: '',
          message: '',
          subject: 'Wifi Menu - Contact Form',
          honeypot: '',
          replyTo: '@',
          accessKey: '9abd2d20-2bd6-4db8-83e0-92828d9a18dd',
        });
      } else {
        setResponse({
          type: 'error',
          message: json.message
        });
      }
    } catch (error) {
      setResponse({
        type: 'error',
        message: 'A apărut o eroare la trimiterea formularului. Vă rugăm să încercați din nou.'
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Contactează Wifi Menu</h1>

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <form className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="name">
                Nume
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Numele dvs."
                name="name"
                value={contact.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="email@exemplu.com"
                name="email"
                value={contact.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="message">
                Mesaj
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                placeholder="Scrieți mesajul dvs. aici"
                name="message"
                value={contact.message}
                onChange={handleChange}
                rows={4}
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                type="submit"
              >
                <Send className="mr-2 h-4 w-4" />
                Trimite Mesaj
              </button>
            </div>
          </form>
          {response.message && (
            <div
              className={`mt-4 p-4 rounded-lg text-white ${response.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
            >
              {response.message}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-semibold mb-4">Informații de Contact</h2>
            <div className="mb-4 flex items-center">
              <Mail className="mr-2 text-purple-600" />
              <p>support@wifi-menu.ro</p>
            </div>
            <div className="mb-4 flex items-center">
              <Phone className="mr-2 text-purple-600" />
              <a href="tel:+40750255504">+40 750 255 504</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center max-w-2xl">
        <h2 className="text-3xl font-semibold mb-4">Suntem Aici pentru Tine</h2>
        <p className="text-lg">
          Fie că ai întrebări despre Wifi Menu, ai nevoie de asistență tehnică sau dorești să programezi o demonstrație, echipa noastră este gata să te ajute. Nu ezita să ne contactezi!
        </p>
      </div>
      
      <div className="mt-12 bg-purple-100 dark:bg-purple-800 p-8 rounded-lg max-w-2xl text-center flex items-center flex-col">
        <h2 className="text-2xl font-semibold mb-4">Alătură-te Revoluției Digitale în Restaurante</h2>
        <p className="mb-4">
          Descoperă cum Wifi Menu poate transforma experiența clienților tăi și eficientiza operațiunile restaurantului tău.
        </p>
        <Image 
          src="/wifi-menu-logo-white-on-purple-bg.png"
          alt="Wifi Menu pe diverse dispozitive"
          title="Wifi Menu pe diverse dispozitive"
          width={600}
          height={300}
          className="rounded-lg max-w-xs"
        />
      </div>
    </main>
  )
}

export default Contact