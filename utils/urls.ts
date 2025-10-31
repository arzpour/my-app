export const urls = {
  cars: {
    list: "/cars",
    byChassisNo: (chassisNo: string) => `/car/${chassisNo}`,
  },
  transactions: "/transactions",
  cheques: "/cheques",
};
