import {createSlice} from '@reduxjs/toolkit'

const initialState = {
friends:[]
}

const friendsSlice = createSlice({
    name:'friends',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        
    }
})


export default friendsSlice.reducer