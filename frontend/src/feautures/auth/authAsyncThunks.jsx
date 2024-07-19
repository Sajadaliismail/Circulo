import { createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND = process.env.REACT_APP_BACKEND

export const signup = createAsyncThunk(
    'auth/signup',
    async (formData,{rejectWithValue})=>{
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
            return true
           
        } catch (error) {
            console.log(error);
        }

    }
)