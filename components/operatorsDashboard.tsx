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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const operators = [
  "حسین خلیلی",
  "حسین خلیلی",
  "حسین خلیلی",
  "حسین خلیلی",
  "حسین خلیلی",
  "حسین خلیلی",
];

const items = [
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
  {
    id: "1",
    price: "100002844",
    date: "1404/04/30",
    paymentWay: "کارت به کارت",
    cart: "امید ولیزاده",
    etc: "",
  },
];
const TabsTableComponent = () => {
  return (
    <div className="max-h-[28rem] h-[28rem] overflow-y-auto rounded-md border w-full">
      <div className="overflow-x-auto">
        <Table className="min-w-max text-right border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-12 text-center">ردیف</TableHead>
              <TableHead className="w-32 text-center">مبلغ</TableHead>
              <TableHead className="w-32 text-center">تاریخ</TableHead>
              <TableHead className="w-32 text-center">روش پرداخت</TableHead>
              <TableHead className="w-32 text-center">کارت</TableHead>
              <TableHead className="w-32 text-center">...</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={`${item.id}-${index}`}
                className="hover:bg-gray-50"
              >
                <TableCell className="text-center">{item.id}</TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="text-center">{item.date}</TableCell>
                <TableCell className="text-center">{item.paymentWay}</TableCell>
                <TableCell className="text-center">{item.cart}</TableCell>
                <TableCell className="text-center">{item.etc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const tabs = [
  {
    id: "operationTransaction",
    title: "تراکنش های کارگزار",
    content: TabsTableComponent(),
  },
  {
    id: "operatorPerformanceReport",
    title: "جزییات گزارش عملکرد کارگزار",
    content: TabsTableComponent(),
  },
];

const OperatorsDashboard = () => {
  return (
    <div>
      <div className="flex justify-end">
        <span className="p-2 bg-gray-200 rounded-t-lg text-xs">
          1404
        </span>
      </div>
      <div className="border p-4">
        <div className="grid [grid-template-columns:1fr_1fr_1.5fr_1fr_1fr] gap-6 items-start">
          <div className="space-y-1">
            <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
              انتخاب کارگزار:
            </h3>
            <Select>
              <SelectTrigger className="w-[120px] text-sm">
                <SelectValue placeholder="66545" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {operators.map((item, index) => (
                    <SelectItem key={`${item}-${index}`} value="حسین خلیلی">
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-bold">مجموع خرید:</h3>
              <p className="text-sm font-medium">334122334</p>
            </div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-bold">مجموع فروش:</h3>
              <p className="text-sm font-medium">334122334</p>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مجموع سود خ:
                </h3>
                <p className="text-sm font-medium">334122334</p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-bold">
                    مجموع سود ف:
                  </h3>
                  <p className="text-sm font-medium">334122334</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-500">
                `میانگین درصد کارمزد خرید
              </p>
              <p className="text-sm text-purple-500">
                `میانگین درصد کارمزد فروش
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مجموع کارمزد خ:
                </h3>
                <p className="text-sm font-medium">334122334</p>
              </div>
              <div>
                <div className="space-y-1 flex items-center gap-4">
                  <h3 className="text-sm text-blue-900 font-bold">
                    مجموع کارمزد ف:
                  </h3>
                  <p className="text-sm font-medium">334122334</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-green-700">(2)</p>
              <p className="text-xs text-green-700">(120)</p>
            </div>
          </div>
          <div>
            <div className="space-y-1 flex items-center gap-4">
              <h3 className="text-sm text-blue-900 font-bold">
                مجموع کل کارمزد:
              </h3>
              <p className="text-sm font-medium text-purple-600">334122334</p>
            </div>
            <div>
              <div className="space-y-1 flex items-center gap-4">
                <h3 className="text-sm text-blue-900 font-bold">
                  مانده کارمزد:
                </h3>
                <p className="text-sm font-medium text-red-500">334122334</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid [grid-template-columns:2fr_1fr] gap-6 items-start mt-7">
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
              گزارش انفرادی کارگزاران
            </p>
            <div className="grid grid-cols-2 gap-4 items-start mt-5">
              <div>
                <RadioGroup
                  defaultValue="sell"
                  className="flex gap-6 justify-end text-blue-500 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="buy" id="r1" />
                    <label htmlFor="r1" className="text-blue-500">
                      خرید
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="sell" id="r2" />
                    <label htmlFor="r2" className="text-blue-500">
                      فروش
                    </label>
                  </div>
                </RadioGroup>
                <div className="border border-gray-300 p-4 rounded-md relative w-full">
                  <p className="absolute left-2 -top-5 bg-white py-2 px-4 font-bold">
                    گزارش خلاصه عملکرد
                  </p>
                  <div className="max-h-[28rem] overflow-y-auto rounded-md w-full grid grid-cols-2 gap-6 items-start p-4">
                    <div className="space-y-5">
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-orange-500 text-sm">فروردین</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-orange-500 text-sm">اردیبهشت</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-orange-500 text-sm">خرداد</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-orange-500 text-sm">تیر</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-orange-500 text-sm">مرداد</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-orange-500 text-sm">شهریور</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-blue-500 text-sm">مهر</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-blue-500 text-sm">آبان</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-blue-500 text-sm">آذر</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-blue-500 text-sm">دی</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-blue-500 text-sm">بهمن</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                      <div>
                        <div className="flex gap-4 items-start">
                          <p className="text-blue-500 text-sm">اسفند</p>
                          <p className="text-yellow-900 font-medium text-sm">
                            0
                          </p>
                        </div>
                        <p className="font-medium text-sm">0</p>
                      </div>
                    </div>
                  </div>
                    <hr />
                    <h4 className="text-green-700 flex justify-end font-semibold text-base my-2">
                      اطلاعات کل سال
                    </h4>
                  <div className="space-y-3">
                    <div className="flex gap-4 items-start justify-between w-full">
                      <p className="font-medium">مجموع خرید/فروش شما:</p>
                      <p className="font-medium">2344222</p>
                    </div>
                    <div className="flex gap-4 items-start justify-between w-full">
                      <p className="font-medium">تعداد خرید/فروش:</p>
                      <p className="font-medium">11134343</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Tabs
                  defaultValue="operationTransaction"
                  orientation="vertical"
                  className="h-full w-full flex justify-end items-end"
                  dir="rtl"
                >
                  <TabsList>
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="bg-gray-100 cursor-pointer"
                      >
                        {tab.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.id}
                      value={tab.id}
                      className="w-full bg-white rounded-2xl"
                    >
                      {tab.content}
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-blue-700 font-bold">
                    مجموع مبالغ پرداخت شده به کارگزار
                  </p>
                  <p className="text-green-700 font-bold text-sm">4387757733</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              کارگزاران برتر
            </p>
            <RadioGroup
              defaultValue="sell"
              className="flex gap-6 justify-end text-blue-500 mb-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="buy" id="r1" />
                <label htmlFor="r1" className="text-blue-500">
                  خرید
                </label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="sell" id="r2" />
                <label htmlFor="r2" className="text-blue-500">
                  فروش
                </label>
              </div>
            </RadioGroup>
            <div className="border border-gray-300 p-4 rounded-md relative w-full bg-pink-200">
              <p className="text-blue-500 absolute left-2 -top-5 py-2 rounded-md bg-pink-200 px-4">
                لیست ماهانه
              </p>

              <div className="w-full">
                <p className="text-green-600 font-semibold">
                  نمایش لیست سالانه
                </p>
                <div className="grid grid-cols-4 space-y-5 mt-2">
                  <div>
                    <div className="text-sm text-green-600">فروردین</div>
                    <div className="text-sm text-green-600">اردیبهشت</div>
                    <div className="text-sm text-green-600">خرداد</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600">تیر</div>
                    <div className="text-sm text-green-600">مرداد</div>
                    <div className="text-sm text-green-600">شهریور</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600">مهر</div>
                    <div className="text-sm text-green-600">آبان</div>
                    <div className="text-sm text-green-600">آذر</div>
                  </div>
                  <div>
                    <div className="text-sm text-green-600">دی</div>
                    <div className="text-sm text-green-600">بهمن</div>
                    <div className="text-sm text-green-600">اسفند</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorsDashboard;
