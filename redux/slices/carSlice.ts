import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  chassisNo: string;
  role: roleType;
}

const initialState: CarState = { chassisNo: "", role: null };

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setChassisNo: (state, action: PayloadAction<string>) => {
      state.chassisNo = action.payload;
    },
    setRole: (state, action: PayloadAction<roleType>) => {
      state.role = action.payload;
    },
  },
});

export const { setChassisNo, setRole } = carSlice.actions;
export default carSlice.reducer;
