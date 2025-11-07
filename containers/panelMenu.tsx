"use client"
import TabsComponent from "@/components/tabs";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const PanelMenu = () => {
  const { role } = useSelector((state: RootState) => state.cars);
  return (
    <>
      {role === "accountant" && (
          <TabsComponent />
      )}
      {role === "secretary" && <div></div>}
    </>
  );
};

export default PanelMenu;
