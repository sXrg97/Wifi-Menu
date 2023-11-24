export type MenuType = {
    _id: string;
    restaurantName: string;
    isLive: boolean;
    menuPreviewImage: string,
    categories: {
      name: string;
      products: {
        name: string;
        price: number;
        description: string;
      }[];
    }[];
  };