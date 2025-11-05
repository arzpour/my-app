export const urls = {
  cars: {
    list: "/cars",
    byChassisNo: (chassisNo: string) => `/cars/${chassisNo}`,
    chassisNo: "/cars/chassisNo",
    byNationalId: (nationalId: string) =>
      `/transactions/byNationalId/${nationalId}`,
    usersData: "/cars/userData",
    filterByUser: "/cars/filterByUser",
  },
  detailsByChassisNo: (chassisNo: string) => `/cars/${chassisNo}/details`,
  transactions: {
    list: "/transactions",
    byChassisNo: (chassisNo: string) => `/transactions/${chassisNo}`,
  },
  cheques: {
    list: "/cheques",
    byChassisNo: (chassisNo: string) => `/cheques/${chassisNo}`,
    unpaid: (chassisNo: string) => `/cheques/unpaid/${chassisNo}`,
  },
  investmentByChassis: (chassisNo: string) =>
    `/transactions/investment/${chassisNo}`,
  others: {
    brokers: "/others/brokers",
    transactionFormOptions: "/others/transaction-form-options",
  },
  login: "/auth/login",
  settings: {
    list: "/settings",
  },
};
