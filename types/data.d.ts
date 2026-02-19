interface IChildren {
  children: React.ReactNode | JSX.Element | JSX.Element[];
}

interface ICarRes {
  _id: string;
  RowNo: number;
  CarModel: string;
  SaleAmount: number;
  productionYear?: string;
  vin?: string;
  PurchaseAmount: number;
  LicensePlate: string;
  ChassisNo: string;
  SellerName: string;
  BuyerName: string;
  SaleDate: string;
  PurchaseDate: string;
  SellerMobile: number;
  BuyerMobile: number;
  PurchaseBroker: string;
  SaleBroker: string;
  Secretary: string;
  DocumentsCopy: string[];
  SellerNationalID: number;
  BuyerNationalID: number;
  status?: string;
}

interface IChequeRes {
  _id: string;
  CarChassisNo: number;
  CustomerName: string;
  CustomerNationalID: string;
  AccountHolderName: string;
  AccountHolderNationalID: string;
  ChequeSeries: string;
  ChequeSerial: number;
  SayadiID: string;
  ChequeAmount: number;
  ChequeDueDate: string;
  ChequeRegisterDate: string;
  LastActionDate: string;
  LastAction: string;
  ChequeStatus: string;
  ChequeType: string;
  ChequeNotes: string;
  CirculationStage: string;
  Bank: string;
  Branch: string;
  PrevChequeNo: number;
  ShowroomAccountCard: string;
}

interface ITransactionRes {
  _id: string;
  ChassisNo: string;
  TransactionType: string;
  TransactionReason: string;
  TransactionMethod: string;
  ShowroomCard: string;
  CustomerNationalID: string;
  TransactionAmount: number;
  TransactionDate: string;
  Notes: string;
  BankDocument: string;
  Partner: string;
  Broker: number;
  status?: string;
}

interface IDetailsByChassis {
  car: ICarRes;
  cheques: IChequeRes[];
  transactions: ITransactionRes[];
}

interface IInvestmentRes {
  status: number;
  data: ITransactionRes[];
}

interface IUnpaidCheque {
  status: number;
  data: {
    cheques: IChequeRes[];
    totals: {
      issuedUnpaid: number;
      receivedUnpaid: number;
    };
  };
}

interface IOperatorPercent {
  data: { name: string; buyPercent: number; sellPercent: number }[];
}

interface IUserWithStatus extends ICarRes {
  name: string;
  nationalId?: string | number;
  status: "خریدار" | "فروشنده" | "خریدار / فروشنده";
}

interface IUniqeUsersData {
  name: string;
  nationalId: string;
  roles: string[];
}

interface ICarDataByNationalIdOrName {
  purchases: ICarRes[];
  sales: ICarRes[];
}

interface PlateState {
  leftDigits: number | null;
  centerAlphabet: string | null;
  centerDigits: number | null;
  ir: number | null;
}

interface PlateData {
  leftDigits: number;
  centerAlphabet: string | null;
  centerDigits: number;
  ir: number;
}

interface IUpdateWalletReq {
  amount: number;
  type: string;
  description: string | undefined;
}
