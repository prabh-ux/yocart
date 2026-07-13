import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

export const fetchRatings = createAsyncThunk('rating/fetchRatings', async () => {
    const { data } = await axios.get('/api/rating/getRatings')
    return data.ratings
})

export const addRatingAsync = createAsyncThunk('rating/addRatingAsync', async (ratingData) => {
    const { data } = await axios.post('/api/rating/add', ratingData)
    return data.rating
})

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.fulfilled, (state, action) => {
                state.ratings = action.payload
            })
            .addCase(addRatingAsync.fulfilled, (state, action) => {
                state.ratings.push(action.payload)
            })
    }
})

export default ratingSlice.reducer