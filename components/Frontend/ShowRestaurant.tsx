"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MenuType, ProductType } from '@/types/types';
import { Skeleton } from '../ui/skeleton';
import ProductBox from '../Backend/ProductBox';
import { generateSlug } from '@/lib/utils';
import { Button } from '../ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { callWaiter, requestBill } from '@/lib/actions/menu.actions';
import { useToast } from '../ui/use-toast';
import { ConciergeBell, Receipt, User, ShoppingCart } from 'lucide-react';
import AdSenseAd from '../GoogleAds/AdSenseAd';
import ProductModal from './ProductModal';
import CartSidebar from './CartSidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ShowRestaurant = ({ menu }: { menu: MenuType }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let currentProductRendering = 0;
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { name: userName } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('cart'); // State for active tab

  const openModal = (product: ProductType) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSelectedProduct(null);
  };

  const tableNumber = searchParams.get('table');

  const handleCallWaiter = async () => {
    const tableNumber = Number(searchParams.get('table'));

    if (!tableNumber) return;

    console.log('Call for waiter initialised');

    try {
      const res = await callWaiter(menu._id, tableNumber, true)
      if (res) {
        toast({
          variant: "success",
          title: `Succes! 🎉`,
          description: `Ospătarul a fost chemat!`,
        })
      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: `Eroare! 😢`,
        description: `A apărut o eroare la chemarea ospătarului`,
      })
      console.log("Error trying to call for waiter", err)
    }
  }

  const handleRequestBill = async () => {
    const tableNumber = Number(searchParams.get('table'));

    if (!tableNumber) return;

    console.log('Request bill initialised');

    try {
      const res = await requestBill(menu._id, tableNumber, true)
      if (res) {
        toast({
          variant: "success",
          title: `Succes! 🎉`,
          description: `Nota a fost solicitată!`,
        })
      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: `Eroare! 😢`,
        description: `A apărut o eroare la solicitarea notei`,
      })

      console.log("Error trying to call for waiter", err)
    }
  }

  const handleAddToCartActiveState = () => {
    if (activeTab === 'orders') {
      setActiveTab('cart'); // Switch to cart tab
    }
    setIsCartOpen(true); // Open the cart sidebar
  };

  const orders = menu.tables.flatMap(table => 
    table.orders?.filter((order: { user: string, table: number }) => 
      order.user === userName && table.tableNumber === Number(tableNumber)
    ) || []
  ); // Extract orders from menu data filtered by userName and tableNumber
  console.log({orders})

  return (
  <>
    {menu && menu.menuPreviewImage &&
      <div className="w-full h-96 overflow-hidden shadow-lg relative mb-4 ">
          <Image
            className="bg-black w-full object-cover h-full"
            alt={`Poza de coperta pentru ${menu.restaurantName}`}
            title={`${menu.restaurantName} cover image`}
            src={`${menu?.menuPreviewImage ? menu.menuPreviewImage : '/dashboard-cover.webp'}`}
            width={1600}
            height={1200}
          />
      </div>
    }
    
    <div className="container mx-auto px-4 py-8">

      <div className='flex max-w-7xl flex-col py-8 px-2 md:px-8 mx-auto'>

        <h1 className='text-center text-4xl mb-8 font-bold'>{menu.restaurantName} {searchParams.get('table') && `- Masa ${(searchParams.get('table'))}`} </h1>

        {searchParams.get('table') &&
          <div className="flex max-w-7xl gap-4 mb-8 flex-wrap">
            <Button className='call-for-waiter  p-2 rounded-sm flex items-center justify-center w-fit' onClick={handleCallWaiter}><ConciergeBell className='mr-2' /> Cheamă ospătarul</Button>
            <Button className='request-bill  p-2 rounded-sm flex items-center justify-center' onClick={handleRequestBill}><Receipt className='mr-2' /> Cere nota</Button>
          </div>
        }

        <ul className='flex gap-6 mb-8 overflow-scroll no-scrollbar sticky top-0 py-4 bg-white dark:bg-gray-950 z-50'>
          {menu &&
            menu.categories.map((category, i) => (
              // Check if the category has products before rendering the link
              category.products.length > 0 && (
                <li key={`category_${i}`}>
                  <a className='dark:text-white dark:hover:text-gray-100 text-gray-500 hover:text-gray-600 transition-colors text-nowrap uppercase font-semibold' href={`#${generateSlug(category.name)}`}>
                    {category.name}
                  </a>
                </li>
              )
            ))}
        </ul>

        {menu &&
          menu.categories.map((category, i) => (
            // Check if the category has products before rendering
            category.products.length > 0 && (
              <div className='mb-8' key={`category_${i}`} id={generateSlug(category.name)}>
                <h3 className="categoryName font-bold text-2xl mb-2">{category.name}</h3>

                <div className={`category-${category.name}-wrapper mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
                  {category.products.map((product, j) => {
                    currentProductRendering++;
                    return (
                      <React.Fragment key={`${product.name}_${j}`}>
                        <div className={`product-box-wrapper ${j}`}>
                          <ProductBox product={product} admin={false} openModal={openModal}/>
                        </div>

                        {currentProductRendering % 5 === 0 && (new Date() > new Date(menu.subscriptionEndDate!) || !menu.subscriptionEndDate) && (
                          <div className="ad-wrapper col-span-1">
                            <AdSenseAd />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )
          ))}
      </div>
      {menu.orderFromMenu && menu.subscriptionEndDate && new Date() <= new Date(menu.subscriptionEndDate) &&
        <ProductModal
            isOpen={isModalOpen}
            setIsCartOpen={setIsCartOpen}
            onClose={closeModal}
            product={selectedProduct}
            menuId={menu._id}
            tableNumber={searchParams.get('table')!}
            orderFromMenu={menu.orderFromMenu}
            subscriptionEndDate={menu.subscriptionEndDate}
            handleAddToCartActiveState={handleAddToCartActiveState}
        />
      }

      {menu.orderFromMenu && menu.subscriptionEndDate && new Date() <= new Date(menu.subscriptionEndDate) && tableNumber && 
      <CartSidebar 
          menuId={menu._id} 
          tableNumber={tableNumber} 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          orders={orders} 
          activeTab={activeTab} // Pass activeTab to CartSidebar
          setActiveTab={setActiveTab} // Pass setActiveTab to CartSidebar
      />}

      {menu.orderFromMenu && menu.subscriptionEndDate && new Date() <= new Date(menu.subscriptionEndDate) && tableNumber && 
        <Button
          className="fixed size-16 bottom-8 right-8 rounded-full p-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-200 transition-all duration-200"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-6 w-6 text-white dark:text-black" />
        </Button>
      }
      {/* TODO: De activat cand terminam func. de comanda la masa  */}
    </div>
    </>
  );
};

export default ShowRestaurant;