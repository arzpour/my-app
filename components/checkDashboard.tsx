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

const items = [
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
  {
    id: "1",
    shenase: "شناسه صیادی",
    customerName: "محسن تبزر",
    checkSerial: "777444545",
    datebookDate: "1403/03/30",
    price: "777444545",
    empty: "",
  },
];

const check = ["همه", "همه", "همه", "همه"];

const CheckDashboard = () => {
  return (
    <div>
      {/* <div className="overflow-x-auto"> */}
      <div className="grid [grid-template-columns:1fr_1fr_1fr_0.5fr_0.5fr] gap-6 items-start mt-7">
        {/* <div className="flex gap-6 items-start mt-7 w-max"> */}
        <div className="space-y-6">
          {/* <div className="space-y-3"> */}
          <div className="border border-gray-300 p-4 rounded-md relative">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              اطلاعات چک
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px] scrollbar-hide">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  سریال چک:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  شناسه صیادی:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              نوع تاریخ / مبلغ
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px] scrollbar-hide">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  حداکثر مبلغ:
                </h3>
                <input type="text" className="border rounded w-[130px]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  نوع عملیات تاریخ:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="غیر فعال" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 min-w-[140px] w-[340px]">
          <div className="border border-gray-300 p-4 rounded-md relative">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              اطلاعات مشتری/صاحب چک
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  نوع کاربر:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  نام و نام خانوادگی:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">کدملی:</h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>{" "}
          <div className="border border-gray-300 p-4 rounded-md relative">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              بازه زمانی
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  از روز:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  از ماه:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="۰۸" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  از سال:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="۱۴۰۴" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تا روز:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تا ماه:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-purple-700">
                  تا سال:
                </h3>
                <Select>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-gray-300 p-4 rounded-md relative">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              اطلاعات بانک
            </p>

            <div className="flex overflow-auto min-w-[140px] gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">بانک:</h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold mb-2 text-blue-900">شعبه:</h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-md relative">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              وضعیت و عملیات انجام شده
            </p>

            <div className="flex gap-4 overflow-auto min-w-[140px]">
              <div className="space-y-3">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  وضعیت چک:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold mb-2 text-blue-900">
                  نوع عملیات:
                </h3>
                <Select>
                  <SelectTrigger className="w-[130px] text-sm">
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {check.map((item, index) => (
                        <SelectItem key={`${item}-${index}`} value="همه">
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex flex-col w-40">
          <button className="border rounded-lg px-4 py-2 w-32">جستجو</button>
          <button className="border rounded-lg shadow-lg px-4 py-2 w-32">
            حدف تمام فیلترها
          </button>
        </div>
        <div className="space-y-3 border p-4 w-72 rounded">
          <div className="flex items-center justify-between">
            <p>تعداد چک های وصول نشده:</p>
            <span></span>
          </div>
          <div className="flex items-center justify-between">
            <p>تعداد چک های برگشتی:</p>
            <span></span>
          </div>
          <div className="flex items-center justify-between">
            <p>تعداد چک های وارده ماه جاری:</p>
            <span></span>
          </div>
          <div className="flex items-center justify-between">
            <p>تعداد چک های صادره ماه جاری:</p>
            <span></span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 items-start mt-7">
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              چک های صادره
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      نام مشتری
                    </TableHead>
                    <TableHead className="w-12 text-center">سریال چک</TableHead>
                    <TableHead className="w-12 text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">
                        {item.shenase}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.customerName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.checkSerial}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.datebookDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.empty}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-green-400 font-bold mt-3 text-left">346,677,888</p>
        </div>
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-red-500 absolute left-2 -top-5 bg-white py-2 px-4">
              چک های دریافتی
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">
                      شناسه صیادی
                    </TableHead>
                    <TableHead className="w-12 text-center">
                      نام مشتری
                    </TableHead>
                    <TableHead className="w-12 text-center">سریال چک</TableHead>
                    <TableHead className="w-12 text-center">
                      تاریخ سررسید
                    </TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">
                        {item.shenase}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.customerName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.checkSerial}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.datebookDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.empty}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-red-400 font-bold mt-3 text-left">346,677,888</p>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CheckDashboard;
