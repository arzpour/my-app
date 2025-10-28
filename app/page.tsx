"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const tabs = [
    {
      id: "profile",
      title: "پروفایل",
      content: (
        <div>
          <h2 className="text-2xl font-semibold mb-2">پروفایل شما</h2>
          <p className="text-gray-600">اطلاعات حساب و تنظیمات شخصی.</p>
        </div>
      ),
    },
    {
      id: "messages",
      title: "پیام‌ها",
      content: (
        <div>
          <h2 className="text-2xl font-semibold mb-2">پیام‌ها</h2>
          <ul className="space-y-3">
            <li className="p-3 bg-white rounded shadow-sm">پیام از علی</li>
            <li className="p-3 bg-white rounded shadow-sm">پیام از سارا</li>
            <li className="p-3 bg-white rounded shadow-sm">اعلان سیستم</li>
          </ul>
        </div>
      ),
    },
    {
      id: "settings",
      title: "تنظیمات",
      content: (
        <div>
          <h2 className="text-2xl font-semibold mb-2">تنظیمات</h2>
          <p className="text-gray-600">مدیریت حساب و حریم خصوصی.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            ویرایش
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex-1 p-8">
        <Tabs
          defaultValue="profile"
          orientation="vertical"
          className="flex flex-col md:flex-row h-full"
          dir="rtl"
        >
          <TabsList
            className="
      flex md:flex-col w-full md:w-46 md:border-l bg-white p-2 md:p-4
      md:ml-auto md:h-46 border-b md:border-b-0
      rounded-none
    "
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="
          text-center md:text-right justify-between flex items-center w-full
          p-3 rounded-lg text-sm
          data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700
        "
              >
                {tab.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 opacity-60 md:block hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex-1 bg-white rounded-2xl p-6 shadow-md md:mr-8 mt-4 md:mt-0"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
