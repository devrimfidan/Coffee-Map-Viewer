import { useMemo } from "react";
import CoffeeMap from "@/components/map/MapContainer";
import Sidebar from "@/components/map/Sidebar";
import DetailPanel from "@/components/map/DetailPanel";

export default function MapView() {
  return (
    <div className="flex h-full w-full relative overflow-hidden">
      <Sidebar />
      <div className="flex-1 relative">
        <CoffeeMap />
        <DetailPanel />
      </div>
    </div>
  );
}
