import React from 'react'
import ContactPageComponent from './ContactPageComponent'

export const metadata = {
  title: "Contact - Wifi Menu",
  description: "Contactează-ne pentru întrebări, asistență tehnică sau pentru a programa o demonstrație a serviciilor Wifi Menu. Suntem aici să te ajutăm!",
  openGraph: {
    title: "Contact - Wifi Menu",
    description: "Contactează-ne pentru întrebări, asistență tehnică sau pentru a programa o demonstrație a serviciilor Wifi Menu. Suntem aici să te ajutăm!",
    url: "https://wifi-menu.ro/contact",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: "https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png",
        width: 1200,
        height: 630,
        alt: "Contact Wifi Menu"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Wifi Menu",
    description: "Contactează-ne pentru întrebări, asistență tehnică sau pentru a programa o demonstrație a serviciilor Wifi Menu. Suntem aici să te ajutăm!",
    image: "https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png"
  }
};

const Contact = () => {
  return (
    <ContactPageComponent />
  )
}

export default Contact