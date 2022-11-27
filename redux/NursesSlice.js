import { createSlice } from "@reduxjs/toolkit";

/**
 * Nurses Slice
 */

export const NursesSlice = createSlice({
    name:"nurses",
    initialState:{
        nurses: []
    },
    reducers:{        
        setNurses:(state, action)=>{                   
            state.nurses=action.payload;                           
        },             
    }
});

export const {setNurses} = NursesSlice.actions;

export default NursesSlice.reducer;


