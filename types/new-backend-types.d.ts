/**
 * ============================================
 * NEW BACKEND API TYPES - MIGRATION GUIDE
 * ============================================
 *
 * These are the new TypeScript interfaces matching the new backend structure.
 * Use these types when migrating to the new API endpoints.
 */

import { Types } from "mongoose";

// ============================================
// BUSINESS ACCOUNTS
// ============================================
export interface IBusinessAccounts {
  _id?: Types.ObjectId;
  accountName: string;
  bankName: string;
  branchName: string;
  accountNumber: number;
  iban: string;
  cardNumber: string;
  isActive: boolean;
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CHEQUES (NEW STRUCTURE)
// ============================================
export interface IChequeNew {
  _id: Types.ObjectId;
  chequeNumber: number;
  bankName: string;
  branchName: string;
  vin: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  type: string; // "issued" | "received"
  status: string; // "paid" | "unpaid" | etc.
  sayadiID: string;
  payer: {
    personId: string;
    fullName: string;
    nationalId: string;
  };
  payee: {
    personId: string;
    fullName: string;
    nationalId: string;
  };
  relatedDealId: number;
  relatedTransactionId: number;
  actions: {
    actionType: string;
    actionDate: string;
    actorUserId: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// DEALS (NEW STRUCTURE - REPLACES CARS)
// ============================================
export interface IDeal {
  _id: Types.ObjectId;
  vehicleId: number;
  vehicleSnapshot: {
    vin: string; // This is the ChassisNo/VIN
    model: string;
    productionYear: number;
    plateNumber: string;
  };
  status: string;
  purchaseDate: string;
  purchasePrice: number; // Maps to PurchaseAmount
  saleDate: string;
  salePrice: number; // Maps to SaleAmount
  seller: {
    personId: string;
    fullName: string;
    nationalId: string;
    mobile: string;
  };
  buyer: {
    personId: string;
    fullName: string;
    nationalId: string;
    mobile: string;
  };
  purchaseBroker: {
    personId: string;
    fullName: string;
    commissionPercent: number;
    commissionAmount: number;
  };
  saleBroker: {
    personId: string;
    fullName: string;
    commissionPercent: number;
    commissionAmount: number;
  };
  commissionPercent: number;
  commissionAmount: number;
  directCosts: {
    options: {
      id: string;
      provider: {
        personId: string;
        name: string;
      };
      date: string;
      description: string;
      cost: number;
    }[];
    otherCost: {
      id: string;
      category: string;
      description: string;
      cost: number;
    }[];
  };
  partnerships: {
    partner: {
      personId: string;
      name: string;
      nationalID: string;
      mobile: string;
    };
    investmentAmount: number;
    profitSharePercentage: number;
    payoutAmount: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// EXPENSES
// ============================================
export interface IExpense {
  _id: Types.ObjectId;
  category: string;
  amount: number;
  expenseDate: string;
  description: string;
  recipientPersonId: string;
  transactionId: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// LOANS
// ============================================
export interface ILoan {
  _id: Types.ObjectId;
  borrower: {
    personId: number;
    fullName: string;
    nationalId: number;
  };
  totalAmount: number;
  loanDate: string;
  numberOfInstallments: number;
  installmentAmount: number;
  status: string;
  description: string;
  installments: {
    installmentNumber: number;
    dueDate: string;
    amount: number;
    status: string;
    paymentDate: string;
    relatedSalaryPaymentId: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PEOPLE (NEW STRUCTURE - REPLACES USERS)
// ============================================
export interface IPeople {
  _id: Types.ObjectId;
  fullName: string;
  nationalId: number;
  phoneNumber: number;
  address: string;
  roles: string[];
  brokerDetails: {
    currentRates: {
      purchaseCommissionPercent: string;
      saleCommissionPercent: string;
      lastUpdated: string;
    };
    rateHistory: {
      effectiveDate: string;
      purchaseCommissionPercent: string;
      saleCommissionPercent: string;
    }[];
  };
  employmentDetails: {
    startDate: string;
    contractType: string;
    baseSalary: number;
  };
  wallet: {
    balance: number;
    transactions: {
      amount: number;
      type: string;
      description: string;
      date: string;
    }[];
  };
}

// ============================================
// SALARIES
// ============================================
export interface ISalaries {
  _id: Types.ObjectId;
  employee: {
    personId: number;
    fullName: string;
    nationalId: number;
  };
  paymentDate: string;
  forYear: number;
  forMonth: number;
  baseSalary: number;
  overtimePay: number;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  relatedTransactionId: number;
  deductions: {
    insurance: number;
    tax: number;
    loanInstallments: {
      loanId: number;
      installmentNumber: number;
      amount: number;
    }[];
    otherDeductions: {
      description: string;
      amount: number;
    }[];
  };
  bonuses: {
    amount: number;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TRANSACTIONS (NEW STRUCTURE)
// ============================================
export interface ITransactionNew {
  _id: Types.ObjectId;
  amount: number; // Maps to TransactionAmount
  transactionDate: string; // Maps to TransactionDate
  type: string; // Maps to TransactionType ("پرداخت" | "دریافت" | "افزایش سرمایه" | "برداشت سرمایه")
  reason: string; // Maps to TransactionReason
  paymentMethod: string; // Maps to TransactionMethod
  personId: string; // Maps to CustomerNationalID
  dealId: string; // Maps to ChassisNo (but now it's a deal ID)
  bussinessAccountId: string; // Maps to ShowroomCard
  description: string; // Maps to Notes
  createdAt: string;
  updatedAt: string;
}

// ============================================
// VEHICLES (NEW STRUCTURE)
// ============================================
export interface IVehicle {
  _id: Types.ObjectId;
  vin: string; // This is the ChassisNo
  model: string;
  productionYear: number;
  plateNumber: string;
  color: string;
  dealHistoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// RESPONSE TYPES FOR API ENDPOINTS
// ============================================

// Response for GET /cheques/unpaid/deal/:dealId
export interface IUnpaidChequesResponse {
  cheques: IChequeNew[];
  totals: {
    issuedUnpaid: number;
    receivedUnpaid: number;
  };
}

// Response for GET /deals/person/:personId
export interface IDealsByPersonResponse {
  deals: IDeal[];
  sales: IDeal[];
  purchases: IDeal[];
  partnerships: IDeal[];
}

// Response for GET /cheques/person/:personId
export interface IChequesByPersonResponse {
  cheques: IChequeNew[];
  issued: IChequeNew[];
  received: IChequeNew[];
}
