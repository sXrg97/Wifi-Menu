import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { QrCode } from "lucide-react"
import {QRCodeSVG} from 'qrcode.react';


const QRPreviewer = ({menuName, slug, tableNumber}: {menuName: string, slug: string, tableNumber: number}) => {
  return (
    <Drawer>
  <DrawerTrigger><div className="flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">QR <QrCode className="ml-1" /></div></DrawerTrigger> {/*FIXME: */}
  <DrawerContent>
    <div className="flex flex-col items-center justify-center max-w-[500px] p-4 mx-auto">
        <span className="text-2xl font-bold mb-4">QR pentru {menuName} - Masa {tableNumber}</span>
        <QRCodeSVG size={256} bgColor="#FFFFFF" fgColor="#9333EA" value={`${window.location.origin}/menu/${slug}?table=${tableNumber}`} />
        <span className="text-2xl font-bold mt-4">Scanează-mă</span>
    </div>

    <DrawerFooter>
      <DrawerClose>
        <div>Închide</div> {/*FIXME: */}
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default QRPreviewer