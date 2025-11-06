export const urls = {
  cars: {
    list: "/api/cars",
    byChassisNo: (chassisNo: string) => `/api/cars/${chassisNo}`,
    chassisNo: "/api/cars/chassisNo",
    byNationalId: (nationalId: string) =>
      `/api/transactions/byNationalId/${nationalId}`,
    usersData: "/api/cars/userData",
    filterByUser: "/api/cars/filterByUser",
  },
  detailsByChassisNo: (chassisNo: string) => `/api/cars/${chassisNo}/details`,
  transactions: {
    list: "/api/transactions",
    byChassisNo: (chassisNo: string) => `/api/transactions/${chassisNo}`,
  },
  cheques: {
    list: "/api/cheques",
    byChassisNo: (chassisNo: string) => `/api/cheques/${chassisNo}`,
    unpaid: (chassisNo: string) => `/api/cheques/unpaid/${chassisNo}`,
  },
  investmentByChassis: (chassisNo: string) =>
    `/api/transactions/investment/${chassisNo}`,
  others: {
    brokers: "/api/others/brokers",
    transactionFormOptions: "/api/others/transaction-form-options",
  },
  login: "/api/auth/login",
  settings: {
    list: "/api/settings",
  },
};
