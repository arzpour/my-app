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

const items = [
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
  {
    id: "1",
    date: "1403/03/30",
    chassis: "24523",
    price: "777444545",
    transactionType: "دریافت",
    reason: "فروش",
    transactionWay: "سانتا",
    description: "از حساب غلامی...",
  },
];

const TransactionDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-9 items-center mt-3">
        <div className="space-y-1">
          <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
            انتخاب کارت:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="تمام موارد" />
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
              <SelectValue placeholder="تمام موارد" />
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
            روز:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="۰۲" />
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
            ماه:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="همه" />
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
            سال:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="۱۴۰۴" />
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
            نوع تراکنش:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="تمام موارد" />
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
            دلیل تراکنش:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="تمام موارد" />
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
            روش تراکنش:
          </h3>
          <Select>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="تمام موارد" />
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
      </div>
      <div className="grid grid-cols-2 gap-6 items-start mt-7">
        <div>
          <div className="border border-gray-300 p-4 rounded-md relative w-full">
            <p className="text-blue-500 absolute left-2 -top-5 bg-white py-2 px-4">
              واریز به حساب
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">شاسی</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      نوع تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">دلیل</TableHead>
                    <TableHead className="w-12 text-center">
                      روش تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">توضیحات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{item.date}</TableCell>
                      <TableCell className="text-center">
                        {item.chassis}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionType}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.reason}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionWay}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.description}
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
              برداشت از حساب
            </p>
            <div className="max-h-[28rem] overflow-y-auto rounded-md border w-full">
              <Table className="min-w-full table-fixed text-right border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12 text-center">تاریخ</TableHead>
                    <TableHead className="w-12 text-center">شاسی</TableHead>
                    <TableHead className="w-12 text-center">مبلغ</TableHead>
                    <TableHead className="w-12 text-center">
                      نوع تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">دلیل</TableHead>
                    <TableHead className="w-12 text-center">
                      روش تراکنش
                    </TableHead>
                    <TableHead className="w-12 text-center">توضیحات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{item.date}</TableCell>
                      <TableCell className="text-center">
                        {item.chassis}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionType}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.reason}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionWay}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.description}
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
  );
};

export default TransactionDashboard;
