"use client"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RootState } from '@/store/store';
import { setUserName } from '@/store/userSlice';
import { incrementQuantity, decrementQuantity, emptyCart } from '@/store/cartSlice';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { sendUserOrder } from '@/lib/actions/menu.actions';
import { useToast } from "@/components/ui/use-toast";

interface CartSidebarProps {
    menuId: string;
    tableNumber: string;
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({menuId, tableNumber, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { name: userName } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !userName) {
      setName('');
    }
  }, [isOpen, userName]);

  const handleSubmitName = () => {
    dispatch(setUserName(name));
    setIsEditing(false);
  };

  const handleEditName = () => {
    setName(userName || '');
    setIsEditing(true);
  };

  const handleEmptyCart = () => {
    dispatch(emptyCart());
  };

  const handleIncrement = (productId: string) => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrement = (productId: string) => {
    dispatch(decrementQuantity(productId));
  };

  const calculateItemPrice = (item: any) => {
    if (item.product.isReduced) {
      if (item.product.isDiscountProcentual) {
        return item.product.price * (1 - item.product.reducedPrice / 100);
      } else {
        return item.product.price - item.product.reducedPrice;
      }
    }
    return item.product.price;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemPrice(item) * item.quantity, 0);
  };

  const handleSendOrder = async () => {
    if (!userName) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Vă rugăm să introduceți numele dvs. înainte de a trimite comanda.",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Coșul dvs. este gol. Adăugați produse înainte de a trimite comanda.",
      });
      return;
    }

    const orderData = items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
    }));

    try {
      const result = await sendUserOrder(menuId, tableNumber, userName, orderData);
      if (result.success) {
        toast({
          variant: "success",
          title: "Succes",
          description: "Comanda a fost trimisă cu succes!",
        });
        dispatch(emptyCart());
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "A apărut o eroare la trimiterea comenzii. Vă rugăm să încercați din nou.",
      });
      console.error("Error sending order:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Coșul tău</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full overflow-hidden">
          {userName && !isEditing ? (
            <>
              <div className="flex justify-between items-center mb-4">
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
              <div className="mt-auto pt-4 border-t">
                <p className="text-lg font-semibold mb-2">Total: {calculateTotal().toFixed(2)} RON</p>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleSendOrder}>Finalizează comanda</Button>
                  <Button variant="destructive" onClick={handleEmptyCart}>Golește coșul</Button>
                </div>
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;