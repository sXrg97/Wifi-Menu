'use client'

import { FloatingWhatsApp } from "react-floating-whatsapp"

const Whatsapp = () => {
  return (
    <FloatingWhatsApp  notificationSound={true} notification={true} notificationDelay={1} notificationLoop={1} accountName="Wifi Menu" phoneNumber="0040773784220" avatar="/wifi-menu-logo-white-on-purple-bg.png" chatMessage="Buna ziua! Cu ce va putem ajuta?" />
  )
}

export default Whatsapp