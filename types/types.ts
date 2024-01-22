export type MenuType = {
    _id: string;
    restaurantName: string;
    isLive: boolean;
    slug: string;
    lifetimeViews?: number;
    menuPreviewImage: string,
    categories: {
      name: string;
      products: {
        name: string;
        price: number;
        description: string;
        image?: string;
        _id: string;
      }[];
    }[];
  };