import { createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND = process.env.REACT_APP_BACKEND


export const signup = createAsyncThunk(
    'auth/signup',
    async (formData,{rejectWithValue,dispatch})=>{

        try {
            const response = await fetch(`${BACKEND}/signup`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data = await response.json()
            if(!response.ok){
               return rejectWithValue(data) 
            }
            dispatch(sendOtp({email:data.email}))
            return data.email
           
        } catch (error) {
            console.log(error);
            return rejectWithValue({error:'Server error, Try after some time'})
        }

    }
)

export const signin = createAsyncThunk(
    'auth/signin',
    async (formData,{rejectWithValue,dispatch})=>{

        try {
            const response = await fetch(`${BACKEND}/signin`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data = await response.json()
            console.log(data);

            if(!response.ok){
               return rejectWithValue(data) 
            }
            return 
           
        } catch (error) {
            console.log(error);
            return rejectWithValue({error:'Server error, Try after some time'})
        }

    }
)

export const sendOtp = createAsyncThunk(
    'auth/sendotp',
    async (email,{rejectWithValue})=>{
        try {
             const response = await fetch(`${BACKEND}/sendotp`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(email)
            })
            const data = await response.json()
            if(!response.ok){
               return rejectWithValue(data.error) 
            }
            return true
        } catch (err) {
            return rejectWithValue({error:'Server error, Try again later'})
        }
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyotp',
     async (formData,{rejectWithValue,dispatch}) => {
  try {
    const response = await fetch(`${BACKEND}/verifyotp`,{
                method:'POST',
                credentials: 'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data = await response.json()
            if(!response.ok){
               return rejectWithValue(data) 
            }
            return true
        } catch (error) {
            
        }
});