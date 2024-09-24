import { Action, configureStore, Reducer } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import { UserState } from './userTypes'; // Add this import

// Load cart state from localStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('wifimenu_cartState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Load user state from localStorage
const loadUserState = () => {
  try {
    const serializedState = localStorage.getItem('wifimenu_userName');
    if (serializedState === null) {
      return undefined;
    }
    return { name: JSON.parse(serializedState) };
  } catch (err) {
    return undefined;
  }
};


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer as Reducer<UserState, Action>,
  },
  preloadedState: {
    cart: loadCartState(),
    user: loadUserState() as UserState,
  },
});

// Save cart state to localStorage
store.subscribe(() => {
  try {
    const cartState = store.getState().cart;
    localStorage.setItem('wifimenu_cartState', JSON.stringify(cartState));
  } catch {
    // Ignore write errors
  }
});

// Save user name to localStorage
store.subscribe(() => {
  try {
    const userName = store.getState().user.name;
    localStorage.setItem('wifimenu_userName', JSON.stringify(userName));
  } catch {
    // Ignore write errors
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;