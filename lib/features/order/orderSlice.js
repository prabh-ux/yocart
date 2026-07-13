import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
    const { data } = await axios.get('/api/order/getOrders')
    return data.orders
})

export const placeOrderAsync = createAsyncThunk('order/placeOrderAsync', async ({ addressId }) => {
    const { data } = await axios.post('/api/order/place', { addressId })
    return data.order
})

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        list: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.list = action.payload
        })
    }
})

export default orderSlice.reducer