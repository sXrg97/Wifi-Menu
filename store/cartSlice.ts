import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@/types/types';

interface CartItem {
  product: ProductType;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  userName: string | null;
}

const initialState: CartState = {
  items: [],
  userName: null,
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
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
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
    // Add other cart-related actions here
  },
});

export const { addToCart, setUserName, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;