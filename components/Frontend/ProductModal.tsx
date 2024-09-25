"use client"

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { ProductType } from "@/types/types";
import { Badge } from "../ui/badge";
import { getAllergenInRomanian, calculateDiscountedPrice } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { addToCart } from '@/store/cartSlice';
import { RootState } from '@/store/store';
import CartSidebar from './CartSidebar';
import { table } from 'console';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType | null;
  menuId: string;
  tableNumber: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, menuId, tableNumber }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    setImageLoaded(false);
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setTimeout(() => setIsCartOpen(true), 100);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] md:max-w-[600px] overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg relative">
            {!imageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full bg-gray-600" />
            )}
            <Image
              src={product.image || "/dashboard-cover.webp"}
              alt={`Imagine cu ${product.name}`}
              title={`${product.name} - Poza de produs`}
              width={400}
              height={400}
              className={`object-cover w-full h-full ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              {product.nutritionalValues && (
                <p className="text-sm text-gray-500 mb-2">{product.nutritionalValues}</p>
              )}
              <div className="mb-2">
                {product.isReduced ? (
                  <div>
                    <span className="font-bold text-red-500">
                      {product.reducedPrice &&
                        `${calculateDiscountedPrice(
                          product.price,
                          product.reducedPrice,
                          product.isDiscountProcentual!
                        )} RON`}
                    </span>
                    <span className="text-sm line-through text-gray-500 ml-2">
                      {product.price} RON
                    </span>
                  </div>
                ) : (
                  <span className="font-bold">
                    {product.price === 0 ? "FREE" : `${product.price} RON`}
                  </span>
                )}
              </div>
              {product.allergens && product.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.allergens.map((allergen, index) => (
                    <Badge key={index} variant="outline">
                      {getAllergenInRomanian(allergen)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleAddToCart}>
              Adaugă în coș
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} menuId={menuId} tableNumber={tableNumber} />
    </>
  );
};

export default ProductModal;