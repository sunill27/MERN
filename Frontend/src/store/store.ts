import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import checkoutSlice from "./checkoutSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    carts: cartSlice,
    orders: checkoutSlice,
  },
});
export default store;

// to extract 'useDispatch' hook
export type AppDispatch = typeof store.dispatch;

// to extract 'useSelector' hook
export type RootState = ReturnType<typeof store.getState>;
