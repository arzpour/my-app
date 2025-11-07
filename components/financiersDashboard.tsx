import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const associatesName = ["امیر غلامی", "امیر غلامی", "امیر غلامی", "امیر غلامی"];

const item = [
  {
    title: "all",
    value: "تمام موارد",
  },
  {
    title: "all",
    value: "تمام موارد",
  },
  {
    title: "all",
    value: "تمام موارد",
  },
];

const items = [
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
];

const items1 = [
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
  {
    date: "1404/03/04",
    chassis: "23232",
    price: "222222234",
    reason: "اصل",
    cart: "فاطمه غیاثی وند",
    description: "بابت هزینه رانندگی",
  },
];

const FinanciersDashboard = () => {
  return (
    <div>
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2">
          <div className="flex gap-3">
            <div className="space-y-1">
              <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
                نام شریک:
              </h3>
              <Select>
                <SelectTrigger className="w-[120px] text-sm">
                  <SelectValue placeholder="66545" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {associatesName.map((item, index) => (
                      <SelectItem key={`${item}-${index}`} value="امیر غلامی">
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
                آیتم:
              </h3>
              <Select>
                <SelectTrigger className="w-[120px] text-sm">
                  <SelectValue placeholder="66545" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {item.map((i, index) => (
                      <SelectItem
                        key={`${i.title}-${index}`}
                        value="امیر غلامی"
                      >
                        {i.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              مجموع سرمایه پرداختی:
            </h3>
            <p className="text-sm text-blue-500 font-bold">334122334</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              مجموع سود دریافتی:
            </h3>
            <p className="text-sm font-medium">334122334</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              مجموع سرمایه برداشتی:
            </h3>
            <p className="text-sm font-medium">334122334</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              مجموع کل دریافتی:
            </h3>
            <p className="text-sm text-red-700 font-bold">334122334</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              درصد/مبلغ سود مشارکت:
            </h3>
            <p className="text-sm font-medium">0</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              مجموع سود مشارکت:
            </h3>
            <p className="text-sm text-blue-500">0</p>
            <div className="border-b px-6"></div>
            <div className="flex items-center gap-6">
              <span className="text-green-600">مجموع=</span>
              <span className="text-green-800 font-bold">34256666</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">مانده از سود:</h3>
            <p className="text-sm text-blue-500 font-bold">0</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-bold">
              مانده از اصل سرمایه:
            </h3>
            <p className="text-sm font-medium">33444444444</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm text-blue-900 font-medium">
              {" "}
              مانده از مجموع سرمایه + سود:
            </h3>
            <p className="text-sm text-red-700 font-bold">334122334</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-start mt-5">
        <div className="border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
            افزایش سرمایه
          </p>
          <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-24 text-center">تاریخ</TableHead>
                  <TableHead className="w-12 text-center">شاسی</TableHead>
                  <TableHead className="w-12 text-center">مبلغ</TableHead>
                  <TableHead className="w-10 text-center">دلیل</TableHead>
                  <TableHead className="w-24 text-center">کارت</TableHead>
                  <TableHead className="w-36 text-center">توضیحات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item, index) => (
                  <TableRow
                    key={`${item.description}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{item.date}</TableCell>
                    <TableCell className="text-center">
                      {item.chassis}
                    </TableCell>
                    <TableCell className="text-center">{item.price}</TableCell>
                    <TableCell className="text-center">{item.reason}</TableCell>
                    <TableCell className="text-center">{item.cart}</TableCell>
                    <TableCell className="text-center">
                      {item.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border border-gray-300 p-4 rounded-md relative w-full">
          <p className="text-red-500 absolute left-2 -top-6 bg-white py-2 px-4 font-bold">
            برداشت سرمایه
          </p>
          <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
            <Table className="min-w-full table-fixed text-right border-collapse">
              <TableHeader className="top-0 sticky">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-12 text-center">ردیف</TableHead>
                  <TableHead className="w-12 text-center">شاسی</TableHead>
                  <TableHead className="w-12 text-center">مدل</TableHead>
                  <TableHead className="w-12 text-center">تاریخ</TableHead>
                  <TableHead className="w-12 text-center">قیمت</TableHead>
                  <TableHead className="w-12 text-center">{""}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items1.map((item, index) => (
                  <TableRow
                    key={`${item.description}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="text-center">{item.date}</TableCell>
                    <TableCell className="text-center">
                      {item.chassis}
                    </TableCell>
                    <TableCell className="text-center">{item.price}</TableCell>
                    <TableCell className="text-center">{item.reason}</TableCell>
                    <TableCell className="text-center">{item.cart}</TableCell>
                    <TableCell className="text-center">
                      {item.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanciersDashboard;
