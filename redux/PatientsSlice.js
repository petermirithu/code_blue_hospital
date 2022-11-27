import { createSlice } from "@reduxjs/toolkit";

/**
 * Patients Slice
 */

export const PatientsSlice = createSlice({
    name:"patients",
    initialState:{
        patients: []
    },
    reducers:{        
        setPatients:(state, action)=>{                   
            state.patients=action.payload;                           
        },             
    }
});

export const {setPatients} = PatientsSlice.actions;

export default PatientsSlice.reducer;


