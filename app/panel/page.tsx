import Header from "@/components/header";
import PanelMenu from "@/containers/panelMenu";

const Panel = () => {
  return (
    <div dir="rtl" className="w-full p-4">
      <Header />
      <PanelMenu />
    </div>
  );
};

export default Panel;
