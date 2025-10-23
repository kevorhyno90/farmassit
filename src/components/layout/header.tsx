"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AppSidebar from "./sidebar";
import React from "react";

export function Header() {
  const pathname = usePathname();
  const breadcrumbs = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const items = parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const isLast = index === parts.length - 1;
      const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
      return { href, name, isLast };
    });
    return [{ href: "/dashboard", name: "Home", isLast: parts.length === 0 }, ...items];
  }, [pathname]);


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
