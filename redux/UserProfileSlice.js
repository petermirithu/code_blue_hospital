import { createSlice } from "@reduxjs/toolkit";
import { setCachedUserProfile } from "../services/GlobalConfig";

/**
 * UserProfile Slice
 */

export const UserProfileSlice = createSlice({
    name:"userProfile",
    initialState:{
        userProfile: null
    },
    reducers:{        
        setUserProfile:(state, action)=>{                   
            state.userProfile=action.payload;               
            setCachedUserProfile(action.payload);                       
        },             
    }
});

export const {setUserProfile} = UserProfileSlice.actions;

export default UserProfileSlice.reducer;


