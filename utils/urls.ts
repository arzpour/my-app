export const urls = {
  cars: {
    list: "/cars",
    byChassisNo: (chassisNo: string) => `/cars/${chassisNo}`,
    chassisNo: "/cars/chassisNo",
  },
  transactions: {
    list: "/transactions",
    byChassisNo: (chassisNo: string) => `/transactions/${chassisNo}`,
  },
  cheques: {
    list: "/cheques",
    byChassisNo: (chassisNo: string) => `/cheques/${chassisNo}`,
    unpaid: (chassisNo: string) => `/unpaid/${chassisNo}`,
  },
  detailsByChassisNo: (chassisNo: string) => `/cars/${chassisNo}/details`,
  investmentByChassis: (chassisNo: string) => `/investment/${chassisNo}`,
  operatorPercent: "/brokers"
};
