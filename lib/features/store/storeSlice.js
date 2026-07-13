import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

export const addProduct = createAsyncThunk('store/addProduct', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/store/product/add', formData)
        return data.product
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || 'Failed to add product')
    }
})

export const fetchStoreProducts = createAsyncThunk('store/fetchStoreProducts', async () => {
    const { data } = await axios.get('/api/store/product/getProducts')
    return data.products
})

export const toggleStock = createAsyncThunk('store/toggleStock', async (productId) => {
    const { data } = await axios.post('/api/store/product/toggleStock', { productId })
    return data.product
})

const storeSlice = createSlice({
    name: 'store',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearStoreProducts: (state) => {
            state.products = []
        }
    },
    extraReducers: (builder) => {
        builder
            // addProduct
            .addCase(addProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.unshift(action.payload)
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // fetchStoreProducts
            .addCase(fetchStoreProducts.fulfilled, (state, action) => {
                state.products = action.payload
            })
            // toggleStock
            .addCase(toggleStock.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p._id === action.payload._id)
                if (index !== -1) state.products[index] = action.payload
            })
    }
})

export const { clearStoreProducts } = storeSlice.actions
export default storeSlice.reducer