"use client"

import React from 'react';
import Image from 'next/image';
import { MenuType } from '@/types/types';
import { Skeleton } from '../ui/skeleton';
import ProductBox from '../Backend/ProductBox';
import { generateSlug } from '@/lib/utils';
import { Button } from '../ui/button';
import { useSearchParams } from 'next/navigation';
import { callWaiter } from '@/lib/actions/menu.actions';

const ShowRestaurant = ({ menu }: { menu: MenuType }) => {
  const searchParams = useSearchParams();

  const handleCallWaiter = async () => {
    const tableNumber = Number(searchParams.get('table'));
    
    if (!tableNumber) return;

    console.log('Call for waiter initialised');

    try {
      callWaiter(menu._id, tableNumber, true)
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
        
        {/* {menu && (
          <div className="absolute top-0 left-0 text-white flex items-center justify-between w-full px-4 py-3">
            <span className="text-2xl">{menu.restaurantName}</span>
          </div>
        )} */}
      </div>

      <div className="flex items-center">
        {/* {menu && (
          <>
            <span className="flex-1 mb-2 italic text-xl text-muted-foreground p-2 mr-4 rounded-sm">
              {menu.restaurantName}
            </span>
          </>
        )} */}
      </div>

      {/* <div>User Actions:</div> */}
      {/* Remove the editable and upload functionality */}
      {/* Display categories and products */}
      <div className='flex max-w-7xl flex-col p-8 mx-auto'>

      <h1 className='text-center text-4xl mb-8 font-bold'>{menu.restaurantName}</h1>

      <div className="flex max-w-7xl flex-col p-8 mx-auto">
        <Button className='call-for-waiter bg-green-500 text-white p-2 rounded-sm flex flex-1 items-center justify-center hover:bg-green-600 transition-colors' onClick={handleCallWaiter}>Call for waiter</Button>
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
