export type MenuType = {
    _id: string;
    restaurantName: string;
    isLive: boolean;
    categories: {
      name: string;
      products: {
        name: string;
        price: number;
        description: string;
      }[];
    }[];
  };