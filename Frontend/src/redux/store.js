
import thunk from 'redux-thunk';
import {configureStore} from "@reduxjs/toolkit";
import loginReducer from "../redux/slices/login";
const store = configureStore({
    reducer : {
        loginState:loginReducer,

    },
    devTools : true,
    middleware : [thunk]
});

export default store;
