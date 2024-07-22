import {createSlice} from '@reduxjs/toolkit'
import { sendOtp, signup, signin, verifyOtp } from './authAsyncThunks'

const initialState = {
    error:{}
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setError:(state,action)=>{
            state.error = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(signup.pending,(state)=>{
            state.status = 'loading'
        })
        .addCase(signup.fulfilled,(state,action)=>{
            state.error = {}
            state.status = ''
            state.email = action.payload
        })
        .addCase(signup.rejected,(state,action)=>{
            state.error = action.payload
            state.status = ''
        })
        .addCase(signin.pending,(state)=>{
            state.status = 'loading'
        })
        .addCase(signin.fulfilled,(state,action)=>{
            state.error = {}
            state.status = ''
        })
        .addCase(signin.rejected,(state,action)=>{
            state.error = action.payload
            state.status = ''
        })
        .addCase(sendOtp.pending,(state)=>{
            state.status = 'loading'
        })
        .addCase(sendOtp.fulfilled,(state)=>{
            state.status = ''
            state.error = {}
        })
        .addCase(sendOtp.rejected,(state,action)=>{
            state.status = ''
            state.error = action.payload
        })
        .addCase(verifyOtp.pending,(state)=>{
            state.status = 'loading'
        })
        .addCase(verifyOtp.fulfilled,(state)=>{
            state.status = ''
            state.error = {}
        })
        .addCase(verifyOtp.rejected,(state,action)=>{
            state.status = ''
            state.error = action.payload
        })
    }
})

export const { setError} = authSlice.actions
export default authSlice.reducer