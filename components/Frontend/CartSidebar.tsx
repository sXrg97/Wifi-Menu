'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RootState } from '@/store/store'
import { setUserName } from '@/store/userSlice'
import { incrementQuantity, decrementQuantity, emptyCart } from '@/store/cartSlice'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, ClipboardList } from 'lucide-react'
import { sendUserOrder } from '@/lib/actions/menu.actions'
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface CartState { // {{ edit_1 }}
  items: Array<any>; // Adjust the type as necessary
}

interface UserState { // {{ edit_1 }}
    name: string; // Adjust this based on your actual user data structure
}

interface CartSidebarProps {
  menuId: string
  tableNumber: string
  isOpen: boolean
  onClose: () => void
  orders: any[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function CartSidebar({ menuId, tableNumber, isOpen, onClose, orders, activeTab, setActiveTab }: CartSidebarProps) {
  const dispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.cart as CartState) // {{ edit_1 }}
  const { name: userName } = useSelector((state: RootState) => state.user as UserState) // {{ edit_2 }}
  const [name, setName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && !userName) {
      setName('')
    }
  }, [isOpen, userName])

  useEffect(() => {
    const restaurantSlug = menuId; // Assuming menuId is the slug
    const cartData = localStorage.getItem('wifimenu_cartState');

    if (cartData) {
      const parsedData = JSON.parse(cartData);
      if (parsedData.slug !== restaurantSlug) {
        // Clear local storage if the slug does not match
        localStorage.removeItem('wifimenu_cartState');
        dispatch(emptyCart()); // Clear the cart in the Redux store
      } else {
        // Load the cart items if the slug matches
        dispatch({ type: 'cart/loadCart', payload: parsedData.items });
      }
    }
  }, [menuId, dispatch]);

  const handleSubmitName = () => {
    dispatch(setUserName(name))
    setIsEditing(false)
  }

  const handleEditName = () => {
    setName(userName || '')
    setIsEditing(true)
  }

  const handleEmptyCart = () => {
    dispatch(emptyCart())
    localStorage.removeItem('wifimenu_cartState'); // Clear cart from local storage
  }

  const handleIncrement = (productId: string) => {
    dispatch(incrementQuantity(productId))
    saveCartToLocalStorage()
  }

  const handleDecrement = (productId: string) => {
    dispatch(decrementQuantity(productId))
    saveCartToLocalStorage()
  }

  const saveCartToLocalStorage = () => {
    const restaurantSlug = menuId; // Assuming menuId is the slug
    const cartData = {
      items,
      slug: restaurantSlug,
    };
    console.log("setting the cart to:", cartData)
    localStorage.setItem('wifimenu_cartState', JSON.stringify(cartData));
  }

  const calculateItemPrice = (item: any) => {
    if (item.product.isReduced) {
      if (item.product.isDiscountProcentual) {
        return item.product.price * (1 - item.product.reducedPrice / 100)
      } else {
        return item.product.price - item.product.reducedPrice
      }
    }
    return item.product.price
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemPrice(item) * item.quantity, 0)
  }

  const handleSendOrder = async () => {
    if (!userName) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Vă rugăm să introduceți numele dvs. înainte de a trimite comanda.",
      })
      return
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Coșul dvs. este gol. Adăugați produse înainte de a trimite comanda.",
      })
      return
    }

    const orderData = items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: calculateItemPrice(item).toFixed(2)
    }))

    const totalPrice = calculateTotal().toFixed(2)

    try {
      const result = await sendUserOrder(menuId, tableNumber, userName, orderData, totalPrice)
      if (result.success) {
        toast({
          variant: "success",
          title: "Succes",
          description: "Comanda a fost trimisă cu succes!",
        })
        dispatch(emptyCart())
        localStorage.removeItem('wifimenu_cartState'); // Clear cart from local storage
        onClose()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "A apărut o eroare la trimiterea comenzii. Vă rugăm să încercați din nou.",
      })
      console.error("Error sending order:", error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Coșul tău</SheetTitle>
        </SheetHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="cart" className="data-[state=active]:bg-background">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Coș
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-background">
              <ClipboardList className="w-4 h-4 mr-2" />
              Comenzile tale
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-auto px-6">
            {activeTab === 'cart' && (<TabsContent value="cart" className="mt-0 h-full flex flex-col" hidden={activeTab !== 'cart'}>
                {userName && !isEditing ? (
                  <>
                    <div className="flex justify-between items-center my-4">
                      <p className="text-sm">Salut, {userName}!</p>
                      <Button variant="outline" size="sm" onClick={handleEditName}>
                        Editează numele
                      </Button>
                    </div>
                    <div className="flex-grow overflow-auto mb-4">
                      {items.length > 0 ? (
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div key={item.product._id} className="flex items-center space-x-2 border-b pb-2">
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src={item.product.image || "/dashboard-cover.webp"}
                                  alt={item.product.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded"
                                />
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-semibold text-sm">{item.product.name}</h3>
                                <p className="text-xs text-gray-500">
                                  {item.product.isReduced ? (
                                    <>
                                      <span className="text-red-500">{calculateItemPrice(item).toFixed(2)} RON</span>
                                      <span className="line-through ml-1">{item.product.price} RON</span>{' '}
                                    </>
                                  ) : (
                                    `${item.product.price} RON`
                                  )}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDecrement(item.product?._id ?? '')}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleIncrement(item.product?._id ?? '')}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 my-8">Coșul tău este gol.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Vă rugăm să vă introduceți numele:</p>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Numele tău"
                      className="mb-2"
                    />
                    <Button onClick={handleSubmitName} className="w-full">
                      Salvează
                    </Button>
                  </div>
                )}
              </TabsContent>
            )}
            {activeTab === 'orders' && (<TabsContent value="orders" className="mt-0 h-full overflow-auto" hidden={activeTab !== 'orders'}>
              {orders.length > 0 ? (
                <div className="space-y-4 my-4">
                  {orders.map((order, index) => (
                    <div key={index} className="border-b pb-2">
                      <h3 className="font-semibold text-sm">Comanda {index + 1}</h3>
                      <ul className="list-disc list-inside">
                        {order.order.map((item: any, itemIndex: any) => (
                          <li key={itemIndex} className="text-sm">
                            {item.quantity}x {item.name} - {item.price} RON
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm font-bold">Total: {order.totalPrice} RON</p>
                      <p className={`text-sm ${order.status === 'pending' ? "text-blue-500" : order.status === 'cooking' ? "text-yellow-500" : order.status === 'delivered' ? "text-green-500" : ""}`}>Status: {order.status === 'pending' ? "Comanda trimisa" : order.status === 'cooking' ? "Comanda ta este in curs de preparare" : order.status === 'delivered' ? "Comanda ta este gata" : ""}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 my-8">Nu aveți comenzi anterioare.</p>
              )}
            </TabsContent>
            )}
          </div>
        </Tabs>
        <SheetFooter className="px-6 py-4 border-t">
          {activeTab === 'cart' && (
            <>
              <p className="text-lg font-semibold my-2">Total: {calculateTotal().toFixed(2)} RON</p>
              <div className="flex gap-2 w-full">
                <Button className="flex-1" onClick={handleSendOrder}>Finalizează comanda</Button>
                <Button variant="destructive" onClick={handleEmptyCart}>Golește coșul</Button>
              </div>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}