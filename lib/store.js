import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'
import userReducer from './features/user/authSlice'
import orderReducer from './features/order/orderSlice'
import storeReducer from './features/store/storeSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            address: addressReducer,
            rating: ratingReducer,
            user: userReducer,
            order: orderReducer,
            store: storeReducer,
        },
    })
}