interface IChildren {
  children: React.ReactNode | JSX.Element | JSX.Element[];
}

interface ICarRes {
  _id: string;
  RowNo: number;
  CarModel: string;
  SaleAmount: number;
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
  DocumentsCopy: string;
  SellerNationalID: number;
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
