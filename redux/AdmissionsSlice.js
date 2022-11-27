import { createSlice } from "@reduxjs/toolkit";

/**
 * Admissions Slice
 */

export const AdmissionsSlice = createSlice({
    name:"admissions",
    initialState:{
        admissions: []
    },
    reducers:{        
        setAdmisisons:(state, action)=>{                   
            state.admissions=action.payload;                           
        },             
    }
});

export const {setAdmisisons} = AdmissionsSlice.actions;

export default AdmissionsSlice.reducer;


