"use client"

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RootState } from '@/store/store';
import { setUserName, incrementQuantity, decrementQuantity } from '@/store/cartSlice';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, userName } = useSelector((state: RootState) => state.cart);
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen && !userName) {
      setName('');
    }
  }, [isOpen, userName]);

  const handleSubmitName = () => {
    dispatch(setUserName(name));
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Coșul tău</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full overflow-hidden">
          {userName ? (
            <>
              <p className="mb-4 text-sm">Salut, {userName}!</p>
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
                <Button className="w-full">Finalizează comanda</Button>
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