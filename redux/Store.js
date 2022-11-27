import { configureStore } from "@reduxjs/toolkit";
import AdmissionsSlice from "./AdmissionsSlice";
import DoctorsSlice from "./DoctorsSlice";
import NursesSlice from "./NursesSlice";
import PatientsSlice from "./PatientsSlice";
import PharmacistsSlice from "./PharmacistsSlice";
import UserProfileSlice from "./UserProfileSlice";

export default configureStore({
    reducer:{        
        userProfile:UserProfileSlice, 
        patients:PatientsSlice,   
        doctors:DoctorsSlice,   
        pharmacists:PharmacistsSlice,  
        nurses:NursesSlice,     
        admissions:AdmissionsSlice  
    }
})