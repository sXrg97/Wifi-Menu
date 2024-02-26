"use client"
import { callWaiter, getTables, requestBill } from "@/lib/actions/menu.actions"
import { MenuType } from "@/types/types"
import { useEffect, useState } from "react"
import io from "socket.io-client"
import { Button } from "../ui/button"
import { ConciergeBell, Receipt, Trash2 } from "lucide-react"

const ImportantUpdates = ({menu}:{menu: MenuType}) => {
    const [tables, setTables] = useState<any>(menu.tables)

    const socket = io("http://localhost:4000")

    const getTablesFunction = async () => {
        try {
            const res = await getTables(menu._id);
            setTables(res);
        } catch (err) {
            console.log("Error getting tables", err)
        }
    }

    const waiterOnTheWay = async (tableNumber: number) => {
        try {
            const res = await callWaiter(menu._id, tableNumber, false);

            if (res) {
                socket.emit("waiter-on-the-way", tableNumber) // maybe can use socket.emit?
            }
          }
        catch (err) {
            console.log("Error trying to call for waiter", err)
        }
    }

    const billOnTheWay = async (tableNumber: number) => {
        try {
            const res = await requestBill(menu._id, tableNumber, false);

            if (res) {
                socket.emit("bill-on-the-way", tableNumber) // maybe can use socket.emit?
            }
          }
        catch (err) {
            console.log("Error trying to request bill", err)
        }
    }

    useEffect(() => {
        console.log("Tables", tables)
        socket.on("connect", () => {
            console.log("connected from dashboard")
        })

        socket.on("call-for-waiter-called", () => {
            getTablesFunction();
            console.log(tables)
        })

        socket.on("request-bill-called", () => {
            getTablesFunction();
            console.log(tables)
        })
        
    }, [])

  return (
    <div>
        {tables && tables.map((table: any, i: number) => 
            {if (table.callWaiter === true) return <div key={`table_called_${i}`} className="px-10 bg-orange-400 mb-4 text-2xl text-white font-bold py-4 rounded-md flex items-center justify-between w-full"><div className="flex gap-2 items-center"><ConciergeBell /> Waiter called at table {table.tableNumber}</div> <Button variant={"destructive"} onClick={() => waiterOnTheWay(table.tableNumber)}><Trash2 /></Button></div>}
        )}

        {tables && tables.map((table: any, i: number) => 
            {if (table.requestBill === true) return <div key={`table_bill_called_${i}`} className="px-10 bg-green-400 mb-4 text-2xl text-white font-bold py-4 rounded-md flex items-center justify-between w-full"><div className="flex gap-2 items-center"><Receipt /> Bill requested at table {table.tableNumber}</div> <Button variant={"destructive"} onClick={() => billOnTheWay(table.tableNumber)}><Trash2 /></Button></div>}
        )}
    </div>
  )
}

export default ImportantUpdates