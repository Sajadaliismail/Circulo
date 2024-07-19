import {createSlice} from '@reduxjs/toolkit'
import { signup } from './authAsyncThunks'

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
            state.email = action.payload
        })
        .addCase(signup.rejected,(state,action)=>{
            state.error = action.payload
        })
    }
})

export const { setError} = authSlice.actions
export default authSlice.reducer