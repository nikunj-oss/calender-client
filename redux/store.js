import { configureStore } from "@reduxjs/toolkit";
import api from "../src/hooks/api.js"

const store = configureStore({
    reducer:{
        [api.reducerPath]:api.reducer
    },
    middleware:(mid)=>[...mid(),api.middleware]
})

export default store
