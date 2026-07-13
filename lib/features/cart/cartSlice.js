import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const { data } = await axios.get('/api/cart/getCart')
    return data.cart
})

export const syncCartUpdate = createAsyncThunk('cart/syncCartUpdate', async ({ productId, quantity }) => {
    const { data } = await axios.post('/api/cart/update', { productId, quantity })
    return data.cart
})

export const clearCartAsync = createAsyncThunk('cart/clearCartAsync', async () => {
    const { data } = await axios.post('/api/cart/clear')
    return data.cart
})

const itemsToCartItems = (items = []) => {
    const cartItems = {}
    let total = 0
    items.forEach((item) => {
        const id = item.product?._id || item.product
        cartItems[id] = item.quantity
        total += item.quantity
    })
    return { cartItems, total }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
        syncing: 0,
    },
    reducers: {
        addToCartLocal: (state, action) => {
            const { productId } = action.payload
            state.cartItems[productId] = (state.cartItems[productId] || 0) + 1
            state.total += 1
        },
        removeFromCartLocal: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId] -= 1
                state.total -= 1
                if (state.cartItems[productId] <= 0) {
                    delete state.cartItems[productId]
                }
            }
        },
        deleteItemLocal: (state, action) => {
            const { productId } = action.payload
            const qty = state.cartItems[productId] || 0
            delete state.cartItems[productId]
            state.total -= qty
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                if (state.syncing > 0) return
                const { cartItems, total } = itemsToCartItems(action.payload)
                state.cartItems = cartItems
                state.total = total
            })
            .addCase(syncCartUpdate.pending, (state) => { state.syncing += 1 })
            .addCase(syncCartUpdate.fulfilled, (state, action) => {
                state.syncing = Math.max(0, state.syncing - 1)
                const { cartItems, total } = itemsToCartItems(action.payload)
                state.cartItems = cartItems
                state.total = total
            })
            .addCase(syncCartUpdate.rejected, (state) => { state.syncing = Math.max(0, state.syncing - 1) })
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.cartItems = {}
                state.total = 0
            })
    }
})

export const { addToCartLocal, removeFromCartLocal, deleteItemLocal } = cartSlice.actions
export default cartSlice.reducer