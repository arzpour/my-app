import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PlateState = {
  leftDigits: null,
  centerAlphabet: null,
  centerDigits: null,
  ir: null,
};

const plateSlice = createSlice({
  name: "plate",
  initialState,
  reducers: {
    setLeftDigits(state, action: PayloadAction<number | null>) {
      state.leftDigits = action.payload;
    },
    setCenterAlphabet(state, action: PayloadAction<string | null>) {
      state.centerAlphabet = action.payload;
    },
    setCenterDigits(state, action: PayloadAction<number | null>) {
      state.centerDigits = action.payload;
    },
    setIr(state, action: PayloadAction<number | null>) {
      state.ir = action.payload;
    },
    resetPlateState(state) {
      state.leftDigits = null;
      state.centerAlphabet = null;
      state.centerDigits = null;
      state.ir = null;
    },
    setPlateData(state, action: PayloadAction<PlateData>) {
      state.leftDigits = action.payload.leftDigits;
      state.centerAlphabet = action.payload.centerAlphabet;
      state.centerDigits = action.payload.centerDigits;
      state.ir = action.payload.ir;
    },
  },
});

export const {
  setLeftDigits,
  setCenterAlphabet,
  setCenterDigits,
  setIr,
  resetPlateState,
  setPlateData,
} = plateSlice.actions;

export default plateSlice.reducer;
