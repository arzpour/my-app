import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  chassisNo: string;
  role: roleType;
  totalVehicleCost: number;
}

const initialState: CarState = {
  chassisNo: "",
  role: null,
  totalVehicleCost: 0,
};

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
    setTotalVehicleCost: (state, action: PayloadAction<number>) => {
      state.totalVehicleCost = action.payload;
    },
  },
});

export const { setChassisNo, setRole , setTotalVehicleCost} = carSlice.actions;
export default carSlice.reducer;
