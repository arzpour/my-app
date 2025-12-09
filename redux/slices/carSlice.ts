import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  chassisNo: string;
  role: roleType;
  totalVehicleCost: number;
  selectedDealId: string;
}

const initialState: CarState = {
  chassisNo: "",
  role: null,
  totalVehicleCost: 0,
  selectedDealId: "",
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
    setSelectedDealId: (state, action: PayloadAction<string>) => {
      state.selectedDealId = action.payload;
    },
  },
});

export const { setChassisNo, setRole, setTotalVehicleCost, setSelectedDealId } =
  carSlice.actions;
export default carSlice.reducer;
