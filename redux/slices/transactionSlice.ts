import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PurchaseBrokerType = {
  totalCommissionPurchase: number;
  totalCommissionPurchasePercent: number;
};
type SaleBrokerType = {
  totalCommissionSale: number;
  totalCommissionSalePercent: number;
};

export type peopleStatus = "بستانکار" | "بدهکار" | "تسویه شده" | "-";

interface IPeopleStatus {
  firstParty: peopleStatus;
  secondParty: peopleStatus;
}
interface TransactionSliceState {
  transactionCreated: string;
  optionUpdated: string;
  vehicleUpdated: string;
  purchaseBroker: PurchaseBrokerType;
  saleBroker: SaleBrokerType;
  peopleStatus: IPeopleStatus;
  netProfit: number;
}

const initialState: TransactionSliceState = {
  transactionCreated: "",
  optionUpdated: "",
  vehicleUpdated: "",
  purchaseBroker: {
    totalCommissionPurchase: 0,
    totalCommissionPurchasePercent: 0,
  },
  saleBroker: {
    totalCommissionSale: 0,
    totalCommissionSalePercent: 0,
  },
  peopleStatus: {
    firstParty: "-",
    secondParty: "-",
  },
  netProfit: 0,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionCreated: (state, action: PayloadAction<string>) => {
      if (state.transactionCreated !== action.payload) {
        state.transactionCreated = action.payload;
      }
    },
    setOptionUpdated: (state, action: PayloadAction<string>) => {
      if (state.optionUpdated !== action.payload) {
        state.optionUpdated = action.payload;
      }
    },
    setVehicleUpdated: (state, action: PayloadAction<string>) => {
      if (state.vehicleUpdated !== action.payload) {
        state.vehicleUpdated = action.payload;
      }
    },
    setTotalCommissionPurchase: (
      state,
      action: PayloadAction<PurchaseBrokerType>,
    ) => {
      state.purchaseBroker = action.payload;
    },
    setTotalCommissionSale: (state, action: PayloadAction<SaleBrokerType>) => {
      state.saleBroker = action.payload;
    },
    setPeopleStatus: (state, action: PayloadAction<IPeopleStatus>) => {
      state.peopleStatus = action.payload;
    },
    setNetProfit: (state, action: PayloadAction<number>) => {
      state.netProfit = action.payload;
    },
  },
});

export const {
  setTransactionCreated,
  setOptionUpdated,
  setVehicleUpdated,
  setTotalCommissionPurchase,
  setTotalCommissionSale,
  setPeopleStatus,
  setNetProfit,
} = transactionSlice.actions;
export default transactionSlice.reducer;
