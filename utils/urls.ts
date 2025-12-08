/**
 * ============================================
 * API URLS - MIGRATION GUIDE
 * ============================================
 *
 * NEW BACKEND API ENDPOINTS TO ADD:
 *
 * DEALS (replaces /cars):
 * - GET /deals - Get all deals
 * - GET /deals/id/:id - Get deal by ID
 * - GET /deals/vin/:vin - Get deal by VIN (replaces byChassisNo)
 * - GET /deals/vehicle/:vehicleId - Get deals by vehicle ID
 * - GET /deals/person/:personId - Get deals by person (seller/buyer/partner)
 * - GET /deals/status/:status - Get deals by status
 * - POST /deals - Create new deal
 * - PUT /deals/id/:id - Update deal
 * - DELETE /deals/id/:id - Delete deal
 *
 * TRANSACTIONS (updated structure):
 * - GET /transactions - Get all transactions
 * - GET /transactions/id/:id - Get transaction by ID
 * - GET /transactions/deal/:dealId - Get transactions by deal ID (replaces byChassisNo)
 * - GET /transactions/person/:personId - Get transactions by person ID
 * - GET /transactions/account/:accountId - Get transactions by business account ID
 * - GET /transactions/type/:type - Get transactions by type
 * - GET /transactions/date-range?startDate=&endDate= - Get transactions by date range
 * - POST /transactions - Create new transaction
 * - PUT /transactions/id/:id - Update transaction
 * - DELETE /transactions/id/:id - Delete transaction
 *
 * CHEQUES (updated structure):
 * - GET /cheques - Get all cheques
 * - GET /cheques/id/:id - Get cheque by ID
 * - GET /cheques/deal/:dealId - Get cheques by deal ID (replaces byChassisNo)
 * - GET /cheques/person/:personId - Get cheques by person ID (payer or payee)
 * - GET /cheques/status/:status - Get cheques by status
 * - GET /cheques/unpaid/deal/:dealId - Get unpaid cheques by deal ID (replaces unpaid by chassisNo)
 * - POST /cheques - Create new cheque
 * - PUT /cheques/id/:id - Update cheque
 * - POST /cheques/id/:id/action - Add action to cheque
 * - DELETE /cheques/id/:id - Delete cheque
 *
 * PEOPLE (replaces /cars/userData, /cars/filterByUser):
 * - GET /people - Get all people
 * - GET /people/id/:id - Get person by ID
 * - GET /people/national-id/:nationalId - Get person by national ID
 * - GET /people/role/:role - Get people by role
 * - GET /people/search/:name - Search people by name
 * - POST /people - Create new person
 * - PUT /people/id/:id - Update person
 * - PUT /people/id/:id/wallet - Update wallet balance
 * - DELETE /people/id/:id - Delete person
 *
 * VEHICLES:
 * - GET /vehicles - Get all vehicles
 * - GET /vehicles/id/:id - Get vehicle by ID
 * - GET /vehicles/vin/:vin - Get vehicle by VIN (replaces chassisNo lookup)
 * - POST /vehicles - Create new vehicle
 * - PUT /vehicles/id/:id - Update vehicle
 * - DELETE /vehicles/id/:id - Delete vehicle
 *
 * BUSINESS ACCOUNTS:
 * - GET /business-accounts - Get all business accounts
 * - GET /business-accounts/active - Get active business accounts
 * - GET /business-accounts/id/:id - Get account by ID
 * - GET /business-accounts/account-number/:accountNumber - Get account by account number
 * - POST /business-accounts - Create new account
 * - PUT /business-accounts/id/:id - Update account
 * - PUT /business-accounts/id/:id/balance - Update balance
 * - DELETE /business-accounts/id/:id - Delete account
 *
 * EXPENSES:
 * - GET /expenses - Get all expenses
 * - GET /expenses/id/:id - Get expense by ID
 * - GET /expenses/category/:category - Get expenses by category
 * - GET /expenses/recipient/:personId - Get expenses by recipient
 * - GET /expenses/date-range?startDate=&endDate= - Get expenses by date range
 * - POST /expenses - Create new expense
 * - PUT /expenses/id/:id - Update expense
 * - DELETE /expenses/id/:id - Delete expense
 *
 * LOANS:
 * - GET /loans - Get all loans
 * - GET /loans/id/:id - Get loan by ID
 * - GET /loans/borrower/:personId - Get loans by borrower
 * - GET /loans/status/:status - Get loans by status
 * - POST /loans - Create new loan
 * - PUT /loans/id/:id - Update loan
 * - PUT /loans/id/:id/installment/:installmentNumber - Update installment
 * - DELETE /loans/id/:id - Delete loan
 *
 * SALARIES:
 * - GET /salaries - Get all salaries
 * - GET /salaries/id/:id - Get salary by ID
 * - GET /salaries/employee/:personId - Get salaries by employee
 * - GET /salaries/period/:year/:month - Get salaries by period
 * - GET /salaries/year/:year - Get salaries by year
 * - POST /salaries - Create new salary record
 * - PUT /salaries/id/:id - Update salary
 * - DELETE /salaries/id/:id - Delete salary
 *
 * SETTINGS (unchanged):
 * - GET /settings - Get all settings
 * - GET /settings/:category - Get setting by category
 * - POST /settings - Create new category
 * - POST /settings/:category/add - Add option to category
 * - DELETE /settings/:category/delete - Delete option from category
 */
export const urls = {
  // Legacy endpoints (kept for backward compatibility during migration)
  // cars: {
  //   list: "/cars",
  //   byChassisNo: (chassisNo: string) => `/cars/${chassisNo}`,
  //   byId: (id: string) => `/cars/id/${id}`,
  //   chassisNo: "/cars/chassisNo",
  //   byNationalId: (nationalId: string) =>
  //     `/transactions/byNationalId/${nationalId}`,
  //   usersData: "/cars/userData",
  //   filterByUser: "/cars/filterByUser",
  // },
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
  // others: {
  //   brokers: "/others/brokers",
  //   transactionFormOptions: "/others/transaction-form-options",
  // },
  login: "/auth/login",
  settings: {
    list: "/settings",
  },
  // New API endpoints
  deals: {
    list: "/deals",
    byId: (id: string) => `/deals/id/${id}`,
    byVin: (vin: string) => `/deals/vin/${vin}`,
    byVehicleId: (vehicleId: string) => `/deals/vehicle/${vehicleId}`,
    byPerson: (personId: string) => `/deals/person/${personId}`,
    byStatus: (status: string) => `/deals/status/${status}`,
    create: "/deals",
    update: (id: string) => `/deals/id/${id}`,
    delete: (id: string) => `/deals/id/${id}`,
  },
  transactionsNew: {
    list: "/transactions",
    byId: (id: string) => `/transactions/id/${id}`,
    byDeal: (dealId: string) => `/transactions/deal/${dealId}`,
    byPerson: (personId: string) => `/transactions/person/${personId}`,
    byAccount: (accountId: string) => `/transactions/account/${accountId}`,
    byType: (type: string) => `/transactions/type/${type}`,
    byDateRange: "/transactions/date-range",
    create: "/transactions",
    update: (id: string) => `/transactions/id/${id}`,
    delete: (id: string) => `/transactions/id/${id}`,
  },
  chequesNew: {
    list: "/cheques",
    byId: (id: string) => `/cheques/id/${id}`,
    byDeal: (dealId: string) => `/cheques/deal/${dealId}`,
    byPerson: (personId: string) => `/cheques/person/${personId}`,
    byStatus: (status: string) => `/cheques/status/${status}`,
    unpaidByDeal: (dealId: string) => `/cheques/unpaid/deal/${dealId}`,
    create: "/cheques",
    update: (id: string) => `/cheques/id/${id}`,
    addAction: (id: string) => `/cheques/id/${id}/action`,
    delete: (id: string) => `/cheques/id/${id}`,
  },
  people: {
    list: "/people",
    byId: (id: string) => `/people/id/${id}`,
    byNationalId: (nationalId: string) => `/people/national-id/${nationalId}`,
    byRole: (role: string) => `/people/role/${role}`,
    search: (name: string) => `/people/search/${name}`,
    create: "/people",
    update: (id: string) => `/people/id/${id}`,
    updateWallet: (id: string) => `/people/id/${id}/wallet`,
    delete: (id: string) => `/people/id/${id}`,
  },
  vehicles: {
    list: "/vehicles",
    byId: (id: string) => `/vehicles/id/${id}`,
    byVin: (vin: string) => `/vehicles/vin/${vin}`,
    create: "/vehicles",
    update: (id: string) => `/vehicles/id/${id}`,
    delete: (id: string) => `/vehicles/id/${id}`,
  },
  businessAccounts: {
    list: "/business-accounts",
    active: "/business-accounts/active",
    byId: (id: string) => `/business-accounts/id/${id}`,
    byAccountNumber: (accountNumber: string) =>
      `/business-accounts/account-number/${accountNumber}`,
    create: "/business-accounts",
    update: (id: string) => `/business-accounts/id/${id}`,
    updateBalance: (id: string) => `/business-accounts/id/${id}/balance`,
    delete: (id: string) => `/business-accounts/id/${id}`,
  },
  expenses: {
    list: "/expenses",
    byId: (id: string) => `/expenses/id/${id}`,
    byCategory: (category: string) => `/expenses/category/${category}`,
    byRecipient: (personId: string) => `/expenses/recipient/${personId}`,
    byDateRange: "/expenses/date-range",
    create: "/expenses",
    update: (id: string) => `/expenses/id/${id}`,
    delete: (id: string) => `/expenses/id/${id}`,
  },
  loans: {
    list: "/loans",
    byId: (id: string) => `/loans/id/${id}`,
    byBorrower: (personId: string) => `/loans/borrower/${personId}`,
    byStatus: (status: string) => `/loans/status/${status}`,
    create: "/loans",
    update: (id: string) => `/loans/id/${id}`,
    updateInstallment: (id: string, installmentNumber: string) =>
      `/loans/id/${id}/installment/${installmentNumber}`,
    delete: (id: string) => `/loans/id/${id}`,
  },
  salaries: {
    list: "/salaries",
    byId: (id: string) => `/salaries/id/${id}`,
    byEmployee: (personId: string) => `/salaries/employee/${personId}`,
    byPeriod: (year: string, month: string) =>
      `/salaries/period/${year}/${month}`,
    byYear: (year: string) => `/salaries/year/${year}`,
    create: "/salaries",
    update: (id: string) => `/salaries/id/${id}`,
    delete: (id: string) => `/salaries/id/${id}`,
  },
};
