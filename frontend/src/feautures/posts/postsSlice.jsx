import {createSlice} from '@reduxjs/toolkit'

const initialState = {
posts:[]
}

const postSlice = createSlice({
    name:'posts',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        
    }
})


export default postSlice.reducer