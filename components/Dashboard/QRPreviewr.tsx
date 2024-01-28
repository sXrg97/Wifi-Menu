import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { QrCode } from "lucide-react"
import { Button } from "../ui/button"
import {QRCodeSVG} from 'qrcode.react';


const QRPreviewr = ({menuName, slug, tableNumber}: {menuName: string, slug: string, tableNumber: number}) => {
  return (
    <Drawer>
  <DrawerTrigger><Button variant={"outline"}>QR <QrCode className="ml-1" /></Button></DrawerTrigger>
  <DrawerContent>
    <div className="flex flex-col items-center justify-center max-w-[500px] p-4 mx-auto">
        <span className="text-2xl font-bold mb-4">QR for {menuName} - Table {tableNumber}</span>
        <QRCodeSVG size={256} bgColor="#FFFFFF" fgColor="#9333EA" value={`${window.location.origin}/menu/${slug}?table=${tableNumber}`} />
        <span className="text-2xl font-bold mt-4">Scan me</span>
    </div>

    <DrawerFooter>
      <DrawerClose>
        <Button variant="outline">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  )
}

export default QRPreviewr