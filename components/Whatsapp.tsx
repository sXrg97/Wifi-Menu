'use client'

import { FloatingWhatsApp } from "react-floating-whatsapp"

const Whatsapp = () => {
  return (
    <FloatingWhatsApp className="text-black dark:text-black" notificationSound={true} notification={true} notificationDelay={1} notificationLoop={1} accountName="Wifi Menu" phoneNumber="40750255504" avatar="/wifi-menu-logo-white-on-purple-bg.png" chatMessage="Buna ziua! Cu ce va putem ajuta?" />
  )
}

export default Whatsapp