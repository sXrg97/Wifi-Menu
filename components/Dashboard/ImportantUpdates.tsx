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

      console.log(docs);

    const waiterOnTheWay = async (tableNumber: number) => {
        try {
            const res = await callWaiter(menuId, tableNumber, false);

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
        {docs && docs.tables && docs.tables.map((table: any, i: number) => 
            {if (table.callWaiter === true) return <div key={`table_called_${i}`} className="px-10 bg-orange-400 mb-4 text-2xl text-white font-bold py-4 rounded-md flex items-center justify-between w-full"><div className="flex gap-2 items-center"><ConciergeBell /> Waiter called at table {table.tableNumber}</div> <Button variant={"destructive"} onClick={() => waiterOnTheWay(table.tableNumber)}><Trash2 /></Button></div>}
        )}

        {docs && docs.tables && docs.tables.map((table: any, i: number) => 
            {if (table.requestBill === true) return <div key={`table_bill_called_${i}`} className="px-10 bg-green-400 mb-4 text-2xl text-white font-bold py-4 rounded-md flex items-center justify-between w-full"><div className="flex gap-2 items-center"><Receipt /> Bill requested at table {table.tableNumber}</div> <Button variant={"destructive"} onClick={() => billOnTheWay(table.tableNumber)}><Trash2 /></Button></div>}
        )}
    </div>
  )
}

export default ImportantUpdates