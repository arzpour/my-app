export const urls = {
  cars: {
    list: "/cars",
    byChassisNo: (chassisNo: string) => `/cars/${chassisNo}`,
    byId: (id: string) => `/cars/id/${id}`,
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
    create: "/transactions",
  },
  cheques: {
    list: "/cheques",
    byChassisNo: (chassisNo: string) => `/cheques/${chassisNo}`,
    unpaid: (chassisNo: string) => `/cheques/unpaid/${chassisNo}`,
    create: "/cheques",
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
