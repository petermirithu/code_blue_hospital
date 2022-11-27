import { createSlice } from "@reduxjs/toolkit";

/**
 * Doctors Slice
 */

export const DoctorsSlice = createSlice({
    name:"doctors",
    initialState:{
        doctors: []
    },
    reducers:{        
        setDoctors:(state, action)=>{                   
            state.doctors=action.payload;                           
        },             
    }
});

export const {setDoctors} = DoctorsSlice.actions;

export default DoctorsSlice.reducer;


