// components/LayoutShell.tsx
"use client";

import { usePathname } from "next/navigation";
import DashboardNav from "@/components/dashboardNav";
import ClientNav from "@/components/ClientNav";
import ToggleComponent from "./ToggleComponent";
import ToggleComponentClient from "./ToggleComponentClient";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-1">
      {![
        "/user/signin",
        "/user/signup",
        "/client/signin",
        "/client/signup",
      ].includes(pathname || "") &&
        (pathname?.startsWith("/dashboard") ? (
          <ToggleComponent />
        ) : (
          <ToggleComponentClient />
        ))}
      <main className="flex-1 flex overflow-hidden  mt-10 sm:mt-0">
        {children}
      </main>
    </div>
  );
}
