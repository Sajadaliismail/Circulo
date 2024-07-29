import {createSlice} from '@reduxjs/toolkit'

const initialState = {
chats:[]
}

const chatsSlice = createSlice({
    name:'chats',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        
    }
})


export default chatsSlice.reducer