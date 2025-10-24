"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{planting ? "Edit Planting" : "Add Planting"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input type="hidden" name="id" defaultValue={planting?.id} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cropId" className="text-right">Crop ID</Label>
            <Input id="cropId" name="cropId" defaultValue={planting?.cropId} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldId" className="text-right">Field</Label>
            <Input id="fieldId" name="fieldId" defaultValue={planting?.fieldId} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sowingDate" className="text-right">Sowing</Label>
            <Input id="sowingDate" name="sowingDate" type="date" defaultValue={planting?.sowingDate} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expectedHarvest" className="text-right">Harvest</Label>
            <Input id="expectedHarvest" name="expectedHarvest" type="date" defaultValue={planting?.expectedHarvest} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Input id="notes" name="notes" defaultValue={planting?.notes} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

