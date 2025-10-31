import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  chassisNo: string;
}

const initialState: CarState = { chassisNo: "" };

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setChassisNo: (state, action: PayloadAction<string>) => {
      state.chassisNo = action.payload;
    },
  },
});

export const { setChassisNo } = carSlice.actions;
export default carSlice.reducer;
