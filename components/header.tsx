import { getAllCars } from "@/apis/api-requests";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chassis = ["66545", "66545"];

const Header = () => {
  const handleSelectChassis = async (chassisNo: string) => {
    const res = await getAllCars();
    console.log("🚀 ~ handleSelectChassis ~ res:", res);
    // const data = await res.json();
    // setSelectedCar(data);
  };

  return (
    <div className="border border-b-2 border-gray-300 rounded flex flex-col gap-2 p-4 pb-2.5 relative">
      <div className="grid grid-cols-9 gap-3 items-start justify-start">
        <div className="space-y-1">
          <h3 className="text-var(--title) text-sm font-bold mb-2 text-blue-900">
            شاسی:
          </h3>
          <Select onValueChange={(value) => handleSelectChassis(value)}>
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="66545" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {chassis.map((item) => (
                  <SelectItem key={item} value="apple">
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">مدل وسیله نقلیه</h3>
          <h4 className="text-sm">پژو 207 بانا اتو</h4>
          <span className="text-xs text-green-600">ایران 54</span>
        </div>
        <div>
          <h3 className="text-sm text-blue-900 font-bold">
            {":مبلغ فروش(خرید شما)"}
          </h3>
          <h4 className="text-sm">2222222222222</h4>
          <span className="text-sm text-blue-500">1404/33/30</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            {":مبلغ خرید(فروش شما)"}
          </h3>
          <h4 className="text-sm">2222222222222</h4>
          <span className="text-sm text-blue-500">1404/33/30</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">سود:</h3>
          <p className="text-sm text-green-700">
            ناخالص
            <strong className="underline text-black">130000000</strong>
          </p>
          <p className="text-sm text-green-700">
            خالص
            <strong className="underline text-black">222222222</strong>
          </p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار خرید: <span className="text-green-700">0/ %</span>
          </h3>
          <p className="text-sm">بهادر شامل</p>
          <p className="text-sm text-green-700 font-bold">0</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            کارگزار فروش: <span className="text-green-700">33/ %</span>
          </h3>
          <p className="text-sm">بهادر شامل</p>
          <p className="text-sm text-green-700 font-bold">33332444,5555,2</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            فروشنده: <span>33/ %</span>
          </h3>
          <p className="text-sm">یوسف دینی پروژه/شامل</p>
          <p className="text-sm text-orange-500">44256655</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-blue-900 font-bold">
            خریدار: <span>33/ %</span>
          </h3>
          <p className="text-sm">یوسف دینی پروژه/شامل</p>
          <p className="text-sm text-orange-500">44256655</p>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-4 gap-8 items-start justify-start">
        <div className="flex justify-between items-center">
          <p className="text-sm">وضعیت خودرو:</p>
          <p className="px-7 bg-green-400 text-red-900 rounded py-1 text-sm">
            فروخته شد
          </p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-sm text-blue-800">سایر هزینه ها:</p>
          <p className="text-sm text-purple-700">هزینه وسیله</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-sm text-blue-800">مجموع هزینه ها:</p>
          <p className="text-sm text-orange-800">32,333,322</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p className="text-blue-800">وضعیت تسویه حساب:</p>
          <p className="px-7 bg-green-400 rounded py-1 text-sm">تسویه کامل</p>
        </div>
      </div>
      <p className="absolute left-2 -top-6 bg-white py-2 px-4 font-bold">
        اطلاعات خودرو
      </p>
    </div>
  );
};

export default Header;
