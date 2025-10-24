import React from "react";
import AppSidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import BackButton from "@/components/ui/back-button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <AppSidebar />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 px-4 sm:px-6">
          <BackButton />
          <Header />
        </div>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
