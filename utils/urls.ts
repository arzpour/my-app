export const urls = {
  cars: {
    list: "/cars",
    byChassisNo: (chassisNo: string) => `/cars/${chassisNo}`,
    chassisNo: "/cars/chassisNo",
  },
  transactions: "/transactions",
  cheques: "/cheques",
};
