"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Beef,
  Warehouse,
  CloudSun,
  CalendarDays,
  Calculator,
  FileText,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/crops", icon: Sprout, label: "Crop Management" },
  { href: "/livestock", icon: Beef, label: "Livestock Tracking" },
  { href: "/inventory", icon: Warehouse, label: "Resource Inventory" },
  { href: "/schedule", icon: CalendarDays, label: "Task Scheduling" },
  { href: "/weather", icon: CloudSun, label: "Weather Insights" },
  { href: "/feed-formulation", icon: Calculator, label: "Feed Formulation" },
  { href: "/reports", icon: FileText, label: "Reporting" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="">FarmAssist</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === href && "bg-muted text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
