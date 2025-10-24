"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "fields", label: "Fields" },
  { id: "varieties", label: "Varieties" },
  { id: "plantings", label: "Plantings" },
  { id: "tasks", label: "Tasks" },
  { id: "treatments", label: "Treatments" },
  { id: "reports", label: "Reports" },
];

export default function CropsTopbar({ active }: { active?: string }) {
  const router = useRouter();

  const navigate = (id: string) => {
    router.push(`/crops/${id}`);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2">
          {SECTIONS.map((s) => (
            <Button key={s.id} variant={s.id === active ? "default" : "ghost"} size="sm" onClick={() => navigate(s.id)}>
              {s.label}
            </Button>
          ))}
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <List className="h-4 w-4 mr-1" /> Sections
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sections</DropdownMenuLabel>
              {SECTIONS.map((s) => (
                <DropdownMenuItem key={s.id} onClick={() => navigate(s.id)}>{s.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => router.push('/crops/plantings')}>Add New Crop</Button>
        </div>
      </div>
    </div>
  );
}
