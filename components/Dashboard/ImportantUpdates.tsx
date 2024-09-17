"use client"
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs && docs.tables && docs.tables.map((table: any, i: number) => {
                if (table.callWaiter === true || table.requestBill === true) return (
                    <Card key={`table_${i}`} className="overflow-hidden">
                        <CardHeader className="bg-purple-200 dark:bg-purple-800">
                            <CardTitle className="flex items-center justify-between">
                                <span>Table {table.tableNumber}</span>
                                <div className="flex flex-col gap-2">
                                    {table.callWaiter && (
                                        <Badge variant="destructive">
                                            Waiter Called
                                        </Badge>
                                    )}

                                    {table.requestBill && (
                                        <Badge variant="default">
                                            Bill Requested
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
                                        <span className="font-medium text-black dark:text-white">Waiter called</span>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => waiterOnTheWay(table.tableNumber)}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Dismiss
                                    </Button>
                                </div>
                            )}
                            {table.requestBill === true && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Receipt className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium text-black dark:text-white">Bill requested</span>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => billOnTheWay(table.tableNumber)}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Dismiss
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default ImportantUpdates