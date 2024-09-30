"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import html2canvas from "html2canvas"; // Import html2canvas
import { Button } from "../ui/button";
import { DialogTitle } from "../ui/dialog";

const QRPreviewer = ({
  menuName,
  slug,
  tableNumber,
}: {
  menuName: string;
  slug: string;
  tableNumber?: number;
}) => {
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            if (tableNumber) {
              a.download = `${menuName}-masa-${tableNumber}QR.png`;
            } else {
              a.download = `${menuName}-QR.png`;
            }
            document.body.appendChild(a); // Append to body to make it work in Firefox
            a.click();
            document.body.removeChild(a); // Clean up
            URL.revokeObjectURL(url); // Free up memory
          }
        }, "image/png");
      });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          QR <QrCode className="ml-1" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DialogTitle>
          {tableNumber ? (
              <span className="text-2xl font-bold mb-4 text-center w-full block">
                QR pentru {menuName} - Masa {tableNumber}
              </span>
            ) : (
              <span className="text-2xl font-bold mb-4 text-center w-full block">
                QR pentru {menuName}
              </span>
            )}
        </DialogTitle>
        <div className="flex flex-col items-center justify-center max-w-[500px] p-4 mx-auto">
          <div ref={qrCodeRef}>
            <QRCodeSVG
              marginSize={5}
              size={256}
              bgColor="#FFFFFF"
              fgColor="#9333EA"
              value={`${window.location.origin}/menu/${slug}${tableNumber ? `?table=${tableNumber}` : ""
                }`}
            />
          </div>
          <span className="text-2xl font-bold mt-4">
            Scanează-mă sau{" "}
            <Button
              variant={"outline"}
              onClick={handleDownload}
            >
              <Download className="mr-1" /> Descarcă
            </Button>
          </span>
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button>Închide</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default QRPreviewer;
