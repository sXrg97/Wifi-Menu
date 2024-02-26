"use client"

import React, { useEffect } from 'react';
import Image from 'next/image';
import { MenuType } from '@/types/types';
import { Skeleton } from '../ui/skeleton';
import ProductBox from '../Backend/ProductBox';
import { generateSlug } from '@/lib/utils';
import { Button } from '../ui/button';
import { useSearchParams } from 'next/navigation';
import { callWaiter, requestBill } from '@/lib/actions/menu.actions';
import { io } from 'socket.io-client';
import { useToast } from '../ui/use-toast';
import { ConciergeBell, User } from 'lucide-react';

const ShowRestaurant = ({ menu }: { menu: MenuType }) => {
  const searchParams = useSearchParams();

  const socket = io("http://localhost:4000")
  const { toast } = useToast();


  useEffect(() => {
      socket.on("connect", () => {
          console.log("connected from client showrestaurant")
      })

      socket.on("waiter-on-the-way-notification", (data) => {
        if (data === Number(searchParams.get('table'))) {
          toast({
              variant: "success",
              title: `Success! 🎉`,
              description: `The waiter is coming to your table!`,
          })
        }
      })

      socket.on("bill-on-the-way-notification", (data) => {
        if (data === Number(searchParams.get('table'))) {
          toast({
              variant: "success",
              title: `Success! 🎉`,
              description: `The bill is on it's way!`,
          })
        }
      })
  }, [])


  const handleCallWaiter = async () => {
    const tableNumber = Number(searchParams.get('table'));
    
    if (!tableNumber) return;

    console.log('Call for waiter initialised');

    try {
      const res = await callWaiter(menu._id, tableNumber, true)
      if (res) {
        socket.emit("call-for-waiter")
      }

    } catch (err) {
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
        socket.emit("request-bill")
      }

    } catch (err) {
      console.log("Error trying to call for waiter", err)
    }
  }

  return (
    <div>
      <div className="w-full h-96 overflow-hidden shadow-lg relative mb-4">
        {menu ? (
          <Image
            className="bg-black w-full object-cover h-full"
            alt="Restaurant Cover Image"
            src={`${menu?.menuPreviewImage ? menu.menuPreviewImage : '/dashboard-cover.webp'}`}
            width={1600}
            height={1200}
          />
        ) : (
          <Skeleton className="w-full h-full bg-black" />
        )}

      </div>

      <div className='flex max-w-7xl flex-col p-8 mx-auto'>

      <h1 className='text-center text-4xl mb-8 font-bold'>{menu.restaurantName} - Table {Number(searchParams.get('table'))} </h1>

      <div className="flex max-w-7xl gap-4 mb-8">
        <Button variant={'secondary'} className='call-for-waiter  p-2 rounded-sm flex items-center justify-center w-fit' onClick={handleCallWaiter}><User /> Call for waiter</Button>
        <Button className='call-for-waiter  p-2 rounded-sm flex items-center justify-center' onClick={handleRequestBill}><ConciergeBell /> Request bill</Button>
      </div>
      
      <ul className='flex gap-6 mb-8 overflow-scroll no-scrollbar'>
        {menu &&
          menu.categories.map((category, i) => (
            <li key={`category_${i}`}>
              <a className='text-gray-500 hover:text-gray-600 transition-colors text-nowrap' href={`#${generateSlug(category.name)}`}>{category.name}</a>
            </li>
          ))}
      </ul>

      {menu &&
                menu.categories.map((category, i) => (
                    <div className='mb-8' key={`category_${i}`} id={generateSlug(category.name)}>
                        <h3 className="categoryName font-bold text-2xl mb-2">{category.name}</h3>

                        <div className={`category-${category.name}-wrapper  mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}>
                            {category.products.map((product, j) => (
                                <ProductBox key={`${product.name}_${j}`} product={product} admin={false} />
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default ShowRestaurant;
