import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async () => {
    const { data } = await axios.get('/api/address/getAddresses')
    return data.addresses
})

export const addAddressAsync = createAsyncThunk('address/addAddressAsync', async (addressData) => {
    const { data } = await axios.post('/api/address/add', addressData)
    return data.addresses
})

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.list = action.payload
            })
            .addCase(addAddressAsync.fulfilled, (state, action) => {
                state.list = action.payload
            })
    }
})

export default addressSlice.reducer