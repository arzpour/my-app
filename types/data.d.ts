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
  ChequeSerial: number;
  SayadiID: string;
  ChequeAmount: number;
  ChequeDueDate: string;
  ChequeStatus: string;
  ChequeType: string;
  CirculationStage: string;
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
}
