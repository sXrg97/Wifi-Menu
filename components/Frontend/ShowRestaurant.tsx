"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MenuType } from '@/types/types';
import { Skeleton } from '../ui/skeleton';
import ProductBox from '../Backend/ProductBox';
import { generateSlug } from '@/lib/utils';
import { Button } from '../ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { callWaiter, requestBill } from '@/lib/actions/menu.actions';
import { useToast } from '../ui/use-toast';
import { ConciergeBell, Receipt, User } from 'lucide-react';
import AdSenseAd from '../GoogleAds/AdSenseAd';

const ShowRestaurant = ({ menu }: { menu: MenuType }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let currentProductRendering = 0;

  const { toast } = useToast();


  useEffect(() => {
    const tableNumber = searchParams.get('table');

    if (!tableNumber) {
      console.log('No table number found, redirecting to table 1');
      router.push('?table=1');
    }
  }, [searchParams, router]);

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
          description: `Waiter called!`,
        })
      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: `Error! 😢`,
        description: `There was an error calling the waiter`,
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
          description: `Bill requested!`,
        })
      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: `Error! 😢`,
        description: `There was an error requesting the bill`,
      })

      console.log("Error trying to call for waiter", err)
    }
  }

  return (
    <div>
      <div className="w-full h-96 overflow-hidden shadow-lg relative mb-4 ">
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

        <h1 className='text-center text-4xl mb-8 font-bold'>{menu.restaurantName} {searchParams.get('table') && `- Table ${(searchParams.get('table'))}`} </h1>

        {searchParams.get('table') &&
          <div className="flex max-w-7xl gap-4 mb-8 flex-wrap">
            <Button className='call-for-waiter  p-2 rounded-sm flex items-center justify-center w-fit' onClick={handleCallWaiter}><ConciergeBell className='mr-2' /> Call for waiter</Button>
            <Button className='call-for-waiter  p-2 rounded-sm flex items-center justify-center' onClick={handleRequestBill}><Receipt className='mr-2' /> Request bill</Button>
          </div>
        }

        <ul className='flex gap-6 mb-8 overflow-scroll no-scrollbar sticky top-0 py-4 bg-white dark:bg-gray-950 z-50'>
          {menu &&
            menu.categories.map((category, i) => (
              <li key={`category_${i}`}>
                <a className='dark:text-white dark:hover:text-gray-100  text-gray-500 hover:text-gray-600 transition-colors text-nowrap uppercase font-semibold' href={`#${generateSlug(category.name)}`}>{category.name}</a>
              </li>
            ))}
        </ul>

        {menu &&
          menu.categories.map((category, i) => (
            <div className='mb-8' key={`category_${i}`} id={generateSlug(category.name)}>
              <h3 className="categoryName font-bold text-2xl mb-2">{category.name}</h3>

              <div className={`category-${category.name}-wrapper mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
  {category.products.map((product, j) => {
    currentProductRendering++;
    return (
    <React.Fragment key={`${product.name}_${j}`}>
      <div className={`product-box-wrapper ${j}`}>
        <ProductBox product={product} admin={false} />
      </div>

      {currentProductRendering % 5 === 0 && (
        <div className="ad-wrapper col-span-1">
          <AdSenseAd />
        </div>
      )}

      
    </React.Fragment>
  )})}
</div>

            </div>
          )
          )}
      </div>
    </div>
  );
};

export default ShowRestaurant;
