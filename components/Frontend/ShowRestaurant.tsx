import React from 'react';
import Image from 'next/image';
import { MenuType } from '@/types/types';
import Link from "next/link";
import { Skeleton } from '../ui/skeleton';

const ShowRestaurant = ({ menu }: { menu: MenuType }) => {
  return (
    <div>
      <div className="w-full h-96 overflow-hidden shadow-lg relative mb-4">
        {menu ? (
          <Image
            className="bg-black w-full"
            alt="Restaurant Cover Image"
            src={`${menu?.menuPreviewImage ? menu.menuPreviewImage : '/dashboard-cover.webp'}`}
            width={1600}
            height={1200}
          />
        ) : (
          <Skeleton className="w-full h-full bg-black" />
        )}

        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>
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
        {menu &&
            menu.categories.map((category, i) => (
            <div key={`category_${i}`} className={`category-${category.name}-wrapper mb-4`}>
                <h3 className="categoryName font-bold text-2xl mb-2 pb-1 border-b-2">{category.name}</h3>
                {category.products.map((product) => (
                <div className="mb-4" key={product.name}>
                    <span className="text-lg font-semibold block text-gray-800">{product.name}</span>
                    <span className="text-base font-normal block text-gray-600">{product.description}</span>
                    <span className="text-base font-normal block text-red-500">{product.price} RON</span>
                </div>
                ))}
            </div>
            ))}
        </div>
    </div>
  );
};

export default ShowRestaurant;
