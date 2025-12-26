// "use client";
// import TabsComponent from "@/components/tabs";
// import VehicleList from "@/components/vehicleList";
// import { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";

// const PanelMenu = () => {
//   const { role } = useSelector((state: RootState) => state.cars);
//   return (
//     <>
//       {role === "accountant" && <TabsComponent />}
//       {role === "secretary" && (
//         <div className="mt-8 mx-5">
//           <div className="flex justify-between items-center gap-2">
//           <h4>اطلاعات خودرو</h4>
//           <button className="px-6 py-2 text-white bg-indigo-400 cursor-pointer rounded-md">افزودن مورد جدید</button>
//           </div>

//           <VehicleList />
//         </div>
//       )}
//     </>
//   );
// };

// export default PanelMenu;

"use client";
import FormSelectorModal from "@/components/forms/formSelectorModal";
import TabsComponent from "@/components/tabs";
import VehicleList from "@/components/vehicleList";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const PanelMenu = () => {
  const { role } = useSelector((state: RootState) => state.cars);
  const [formModalOpen, setFormModalOpen] = React.useState(false);

  return (
    <>
      {role === "accountant" && <TabsComponent />}
      {role === "secretary" && (
        <>
          <button
            onClick={() => setFormModalOpen(true)}
            className="text-sm bg-gray-100 cursor-pointer px-6 py-1 rounded-lg text-black transition-colors duration-200 flex items-center gap-2"
          >
            <span>ثبت اطلاعات</span>
          </button>
          <FormSelectorModal
            open={formModalOpen}
            onOpenChange={setFormModalOpen}
          />

          <div className="mt-8 mx-5">
            <VehicleList />
          </div>
        </>
      )}
    </>
  );
};

export default PanelMenu;
