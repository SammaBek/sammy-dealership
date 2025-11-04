import DashboardNav from "@/components/dashboardNav";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full overflow-hidden">
      <main className="flex-1 overflow-y-auto p-1 sm:p-2 ">{children}</main>
    </div>
  );
}
