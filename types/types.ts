export type MenuType = {
    _id: string;
    restaurantName: string;
    isLive: boolean;
    slug: string;
    lifetimeViews?: number;
    menuPreviewImage: string,
    categories: {
      name: string;
      products: ProductType[];
    }[];
    tables: [{tableNumber: number, callWaiter: boolean, requestBill: boolean}]
  };

  export type ProductType = {
    name: string;
    description: string;
    price: number;
    image?: string;
    _id?: string | null;
    isReduced?: boolean;
    reducedPrice?: number;
    isDiscountProcentual?: boolean;
    allergens?: string[];
};