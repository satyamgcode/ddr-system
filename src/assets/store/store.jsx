import {configureStore} from "@reduxjs/toolkit";
import farmerdetails from "../features/Apihandler";

export const store = configureStore({
    reducer : {
        app : farmerdetails,
    }
})