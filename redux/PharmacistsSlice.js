import { createSlice } from "@reduxjs/toolkit";

/**
 * Pharmacists Slice
 */

export const PharmacistsSlice = createSlice({
    name:"pharmacists",
    initialState:{
        pharmacists: []
    },
    reducers:{        
        setPharmacists:(state, action)=>{                   
            state.pharmacists=action.payload;                           
        },             
    }
});

export const {setPharmacists} = PharmacistsSlice.actions;

export default PharmacistsSlice.reducer;


