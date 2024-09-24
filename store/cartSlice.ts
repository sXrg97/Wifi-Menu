import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@/types/types';

interface CartItem {
  product: ProductType;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: ProductType; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.product._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.product._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    emptyCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;