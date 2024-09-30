"use client"

import React from 'react'
import { callWaiter, requestBill } from "@/lib/actions/menu.actions"
import { Button } from "../ui/button"
import { ConciergeBell, Receipt, X } from "lucide-react"
import { doc } from "firebase/firestore"
import { db } from "@/utils/firebase"
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useToast } from "../ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
                description: `Solicitarea a fost rezolvata!`,
            })
        }
        catch (err) {
            toast({
                variant: "destructive",
                title: `Eroare! 😢`,
                description: `A apărut o eroare la chemarea ospătarului`,
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
                description: `Solicitarea notei a fost rezolvată!`,
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs && docs.tables && docs.tables.map((table: any, i: number) => (
                <React.Fragment key={`table_${i}`}>
                    {(table.callWaiter === true || table.requestBill === true || (table.orders && table.orders.length > 0)) && (
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-purple-200 dark:bg-purple-800">
                                <CardTitle className="flex items-center justify-between">
                                    <span>Masa {table.tableNumber}</span>
                                    <div className="flex flex-col gap-2">
                                        {table.callWaiter && (
                                            <Badge variant="destructive">
                                                Chelner solicitat
                                            </Badge>
                                        )}
                                        {table.requestBill && (
                                            <Badge variant="default">
                                                Notă cerută
                                            </Badge>
                                        )}
                                        {table.orders && table.orders.length > 0 && (
                                            <Badge variant="secondary">
                                                Comenzi noi: {table.orders.length}
                                            </Badge>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 dark:bg-purple-950">
                                {table.callWaiter === true && (
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <ConciergeBell className="h-5 w-5 text-orange-500" />
                                            <span className="font-medium text-black dark:text-white">Chelner solicitat</span>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => waiterOnTheWay(table.tableNumber)}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Închide
                                        </Button>
                                    </div>
                                )}
                                {table.requestBill === true && (
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Receipt className="h-5 w-5 text-blue-500" />
                                            <span className="font-medium text-black dark:text-white">Notă cerută</span>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => billOnTheWay(table.tableNumber)}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Închide
                                        </Button>
                                    </div>
                                )}
                                {table.orders && table.orders.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-lg mb-2">Comenzi noi:</h4>
                                        {table.orders.map((order: any, orderIndex: number) => (
                                            <div key={orderIndex} className="bg-white dark:bg-gray-800 p-3 rounded-md mb-3 shadow-sm">
                                                <p className="font-medium mb-2">Client: {order.user}</p>
                                                <ul className="list-disc list-inside">
                                                    {order.order.map((item: any, itemIndex: number) => (
                                                        <li key={itemIndex} className="text-sm">
                                                            {item.quantity}x {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default ImportantUpdates