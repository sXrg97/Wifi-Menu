import DashboardPageComponent from "./DashboardPageComponent";

export const metadata = {
  title: "Panou de Control - Wifi Menu",
  description: "Accesează și gestionează toate funcționalitățile aplicației Wifi Menu din panoul de control. Monitorizează activitatea, gestionează meniurile și optimizează experiența clienților.",
  openGraph: {
    title: "Panou de Control - Wifi Menu",
    description: "Accesează și gestionează toate funcționalitățile aplicației Wifi Menu din panoul de control. Monitorizează activitatea, gestionează meniurile și optimizează experiența clienților.",
    url: "https://wifi-menu.ro/dashboard",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: "https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png",
        width: 1200,
        height: 630,
        alt: "Panou de Control Wifi Menu"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Panou de Control - Wifi Menu",
    description: "Accesează și gestionează toate funcționalitățile aplicației Wifi Menu din panoul de control. Monitorizează activitatea, gestionează meniurile și optimizează experiența clienților.",
    image: "https://wifi-menu.ro/wifi-menu-logo-white-on-purple-bg-og.png"
  }
};

const Dashboard = () => {
  return (
    <DashboardPageComponent />
  )
}

export default Dashboard