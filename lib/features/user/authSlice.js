import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.withCredentials = true

export const signupUser = createAsyncThunk(
    'user/signupUser',
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/user/signup', { name, email, password })

            if (!data.success) {
                return rejectWithValue(data.msg)
            }

            return { name: data.name, msg: data.msg }
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || 'Signup failed')
        }
    }
)

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/user/login', { email, password })

            if (!data.success) {
                return rejectWithValue(data.msg)
            }

            return { name: data.name, msg: data.msg }
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || 'Login failed')
        }
    }
)

export const verifyUser = createAsyncThunk(
    'user/verifyUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/user/verify')

            if (!data.success) {
                return rejectWithValue(data.msg)
            }

            return { name: data.user.name, role: data.user.role }
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || 'Verification failed')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async () => {
        try {
            await axios.post('/api/user/logout')
        } catch {
            // ignore, still log out client-side
        }
        return true
    }
)

const authSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        role: '',
        isLoggedIn: false,
        loading: false,
        checkingAuth: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false
                state.name = action.payload.name
                state.isLoggedIn = true
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.name = action.payload.name
                state.isLoggedIn = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(verifyUser.pending, (state) => {
                state.checkingAuth = true
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.checkingAuth = false
                state.name = action.payload.name
                state.role = action.payload.role
                state.isLoggedIn = true
            })
            .addCase(verifyUser.rejected, (state) => {
                state.checkingAuth = false
                state.name = ''
                state.role = ''
                state.isLoggedIn = false
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.name = ''
                state.role = ''
                state.isLoggedIn = false
            })
    }
})

export default authSlice.reducer