import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const items = [
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
  {
    id: "1",
    date: "1404/01/19",
    price: "3999988",
    nationalCode: "8765367838",
    transactionReason: "خرید",
    paymentWay: "سانتا",
    operator: "",
  },
];

const item2 = [
  {
    id: "",
    date: "",
    price: "",
    associate: "",
    transactionReason: "",
    profit: "",
    way: "",
  },
  {
    id: "",
    date: "",
    price: "",
    associate: "",
    transactionReason: "",
    profit: "",
    way: "",
  },
  {
    id: "",
    date: "",
    price: "",
    associate: "",
    transactionReason: "",
    profit: "",
    way: "",
  },
];

const item3 = [
  {
    id: "",
    customerName: "",
    datebook: "",
    checkStatus: "",
    shenaseSayadi: "",
    serialCheck: "",
    bank: "",
    price: "",
  },
  {
    id: "",
    customerName: "",
    datebook: "",
    checkStatus: "",
    shenaseSayadi: "",
    serialCheck: "",
    bank: "",
    price: "",
  },
  {
    id: "",
    customerName: "",
    datebook: "",
    checkStatus: "",
    shenaseSayadi: "",
    serialCheck: "",
    bank: "",
    price: "",
  },
];

const VehicleDashboard = () => {
  return (
    <>
      <div className="my-5 mb-7">
        <div className="w-full flex justify-center gap-4">
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-red-500 absolute left-2 -top-5 bg-white py-2 px-4">
              پرداخت های شما
            </p>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">کدملی</TableHead>
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">کارگزار</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{item.id}</TableCell>
                      <TableCell className="text-center">{item.date}</TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.nationalCode}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionReason}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.paymentWay}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.operator}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-3 gap-3 item-center mt-3">
              <div>
                <p className="text-xs">مانده مبلغ قابل پرداخت به فروشنده</p>
                <p className="font-bold text-sm">0</p>
              </div>
              <div>
                <p className="text-xs">مجموع پرداختی به فروشنده و کارگزاران</p>
                <p className="text-red-500 text-sm">344430</p>
              </div>
              <div>
                <p className="text-xs">مجموع پرداختی به فروشنده</p>
                <p className="text-red-500 text-sm">3345330</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-green-500 absolute left-2 -top-5 bg-white py-2 px-4">
              دریافت های شما
            </p>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="w-12 text-center">ردیف</TableHead>
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">کدملی</TableHead>
                    <TableHead className="w-12 text-center">
                      دلیل تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      روش پرداخت
                    </TableHead>
                    <TableHead className="w-12 text-center">کارگزار</TableHead>{" "}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="has-data-[state=checked]:bg-muted/50"
                    >
                      <TableCell className="text-center">{item.id}</TableCell>
                      <TableCell className="text-center">{item.date}</TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.nationalCode}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionReason}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.paymentWay}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.operator}
                      </TableCell>{" "}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-2 gap-3 item-center mt-3">
              <div>
                <p className="text-xs">مانده مبلغ قابل پرداخت به خریدار</p>
                <p className="font-bold text-sm">0</p>
              </div>

              <div>
                <p className="text-xs">مجموع دریافتی از خریدار</p>
                <p className="text-green-500 text-sm">3345330</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="w-full flex justify-center gap-4">
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-300 absolute left-2 -top-5 bg-white py-2 px-4">
              افزایش سرمایه
            </p>
            <div className="overflow-hidden rounded-md border w-full">
              <Table
                className="min-w-full table-fixed text-right border-collapse"
                dir="rtl"
              >
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="text-center">ردیف</TableHead>
                    <TableHead className="text-center">تاریخ</TableHead>
                    <TableHead className="text-center">مبلغ</TableHead>
                    <TableHead className="text-center">شریک</TableHead>
                    <TableHead className="text-center">درصد سود</TableHead>
                    <TableHead className="text-center">دلیل تراکنش</TableHead>
                    <TableHead className="text-center">روش</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {item2.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{item.id}</TableCell>
                      <TableCell className="text-center">{item.date}</TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.associate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.profit}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionReason}
                      </TableCell>
                      <TableCell className="text-center">{item.way}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 item-center justify-between mt-3">
              <p className="text-sm">
                در جدول بالا منظور از درصد، درصد مشارکت سرمایه گذار در تامین
                سرمایه است.
              </p>
              <p className="font-bold text-sm">0</p>
            </div>
          </div>

          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-300 absolute left-2 -top-5 bg-white py-2 px-4">
              چک های صادره و وارده
            </p>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-gray-100">
                    <TableHead className="text-center">ردیف</TableHead>
                    <TableHead className="text-center">نام مشتری</TableHead>
                    <TableHead className="text-center">مبلغ</TableHead>
                    <TableHead className="text-center">سررسید</TableHead>
                    <TableHead className="text-center">وضعیت چک</TableHead>
                    <TableHead className="text-center">شناسه صیادی</TableHead>
                    <TableHead className="text-center">سریال چک</TableHead>
                    <TableHead className="text-center">بانک ...</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item3.map((item) => (
                    <TableRow
                      key={item.id}
                      className="has-data-[state=checked]:bg-muted/50"
                    >
                      <TableCell className="text-center">{item.id}</TableCell>
                      <TableCell className="text-center">
                        {item.customerName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.datebook}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.checkStatus}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.shenaseSayadi}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.serialCheck}
                      </TableCell>
                      <TableCell className="text-center">{item.bank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-3 item-center justify-end mt-3">
              <span className="text-xs">مجموع چک های صادره وصول نشده</span>
              <span className="text-xs">مجموع چک های وارده وصول نشده</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDashboard;
