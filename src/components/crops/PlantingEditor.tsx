"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Planting } from "@/lib/data";

type Props = {
  open: boolean;
  planting: Planting | null;
  onSave: (p: Planting) => void;
  onClose: () => void;
};

export default function PlantingEditor({ open, planting, onSave, onClose }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p: Planting = {
      id: (fd.get("id") as string) || `P${String(Date.now()).slice(-6)}`,
      cropId: (fd.get("cropId") as string) || "",
      fieldId: (fd.get("fieldId") as string) || undefined,
      sowingDate: (fd.get("sowingDate") as string) || undefined,
      expectedHarvest: (fd.get("expectedHarvest") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };
    onSave(p);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => v || onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{planting ? "Edit Planting" : "Add New Planting"}</DialogTitle>
          <DialogDescription>
            {planting ? "Update the details of this planting." : "Enter the details for a new planting."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="id" defaultValue={planting?.id} />
          <div className="grid gap-2">
            <Label htmlFor="cropId">Crop ID <span className="text-destructive">*</span></Label>
            <Input 
              id="cropId" 
              name="cropId" 
              defaultValue={planting?.cropId} 
              placeholder="e.g., C001, Tomato" 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fieldId">Field ID</Label>
            <Input 
              id="fieldId" 
              name="fieldId" 
              defaultValue={planting?.fieldId} 
              placeholder="e.g., F001, North Field" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sowingDate">Sowing Date</Label>
              <Input 
                id="sowingDate" 
                name="sowingDate" 
                type="date" 
                defaultValue={planting?.sowingDate} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expectedHarvest">Expected Harvest</Label>
              <Input 
                id="expectedHarvest" 
                name="expectedHarvest" 
                type="date" 
                defaultValue={planting?.expectedHarvest} 
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              name="notes" 
              defaultValue={planting?.notes} 
              placeholder="Add any additional notes..." 
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Planting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
