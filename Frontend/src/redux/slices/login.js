import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    username:"",
    authFlag: false,
} ;
const loginSlice = createSlice({
    initialState,
    name :"loginReducer",
    reducers:{
        setUsername : (state,action) => {
            state["username"]= action.payload
        },
        setAuthFlag : (state,action) => {
            state["authFlag"] = action.payload
        }
    }
});

export const {setUsername,setAuthFlag}=loginSlice.actions;
export default loginSlice.reducer;

