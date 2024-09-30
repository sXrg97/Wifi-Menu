export type MenuType = {
    _id: string;
    hasFinishedTutorial?:boolean;
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
    subscriptionEndDate?: string;
    paymentStatus?:string;
    stripeSessionId?:string;
  };

  export type ProductType = {
    name: string;
    description: string;
    price: number;
    image?: string | null;
    _id?: string | null;
    isReduced?: boolean;
    reducedPrice?: number;
    isDiscountProcentual?: boolean;
    allergens?: string[];
    nutritionalValues?: string;
  };