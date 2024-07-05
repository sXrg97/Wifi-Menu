"use client"
import { callWaiter, requestBill } from "@/lib/actions/menu.actions"
import { Button } from "../ui/button"
import { ConciergeBell, Receipt, Trash2 } from "lucide-react"
import { doc } from "firebase/firestore"
import { db } from "@/utils/firebase"
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useToast } from "../ui/use-toast"

const ImportantUpdates = ({menuId}:{menuId: string}) => {

    const { toast } = useToast();

    const [docs, loading, error] = useDocumentData(
        doc(db, 'menus', menuId)
      );

    const waiterOnTheWay = async (tableNumber: number) => {
        try {
            const res = await callWaiter(menuId, tableNumber, false);
            toast({
                variant: "success",
                title: `Succes! 🎉`,
                description: `Call waiter request was resolved!`,
            })
          }
        catch (err) {
            toast({
                variant: "destructive",
                title: `Error! 😢`,
                description: `There was an error calling the waiter`,
            })
            console.log("Error trying to call for waiter", err)
        }
    }

    const billOnTheWay = async (tableNumber: number) => {
        try {
            const res = await requestBill(menuId, tableNumber, false);
            toast({
                variant: "success",
                title: `Succes! 🎉`,
                description: `Request bill request was resolved!`,
            })
          }
        catch (err) {
            toast({
                variant: "destructive",
                title: `Error! 😢`,
                description: `There was an error requesting the bill`,
            })
            console.log("Error trying to request bill", err)
        }
    }

  return (
    <div>
    {docs && docs.tables && docs.tables.map((table: any, i: number) => {
        if (table.callWaiter === true || table.requestBill === true) return (
            <div key={`table_${i}`} className="flex flex-col flex-wrap mb-4 w-full">
                <h3 className="text-xl font-semibold mb-2">Table {table.tableNumber}</h3>
                {table.callWaiter === true && (
                    <div key={`table_called_${i}`} className="px-10 bg-orange-400 mb-4 text-2xl text-white font-bold py-4 rounded-md flex items-center justify-between w-full">
                        <div className="flex gap-2 items-center">
                            <ConciergeBell /> Waiter called at table {table.tableNumber}
                        </div>
                        <Button variant={"destructive"} onClick={() => waiterOnTheWay(table.tableNumber)}><Trash2 /></Button>
                    </div>
                )}
                {table.requestBill === true && (
                    <div key={`table_request_bill_${i}`} className="px-10 bg-blue-400 mb-4 text-2xl text-white font-bold py-4 rounded-md flex items-center justify-between w-full">
                        <div className="flex gap-2 items-center">
                            <Receipt /> Bill requested at table {table.tableNumber}
                        </div>
                        <Button variant={"destructive"} onClick={() => billOnTheWay(table.tableNumber)}><Trash2 /></Button>
                    </div>
                )}
            </div>
        );
    })}
</div>

  )
}

export default ImportantUpdates