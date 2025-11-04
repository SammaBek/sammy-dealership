"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={`flex items-center font-sans py-2 px-1 rounded transition duration-300 ease-in-out cursor-pointer ${
          isActive
            ? "bg-green-300 text-green-900 font-semibold"
            : "text-gray-500 hover:bg-green-200"
        }`}
      >
        <span className="mr-2">{icon}</span>
        <h3>{label}</h3>
      </div>
    </Link>
  );
}
