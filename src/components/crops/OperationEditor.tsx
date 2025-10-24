"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Operation } from "@/lib/data";

type Props = {
  open: boolean;
  operation: Operation | null;
  onSave: (o: Operation) => void;
  onClose: () => void;
};

export default function OperationEditor({ open, operation, onSave, onClose }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const o: Operation = {
      id: (fd.get("id") as string) || `O${String(Date.now()).slice(-6)}`,
      plantingId: (fd.get("plantingId") as string) || undefined,
      type: (fd.get("type") as string) || "",
      plannedDate: (fd.get("plannedDate") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };
    onSave(o);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => v || onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{operation ? "Edit Operation" : "Add New Operation"}</DialogTitle>
          <DialogDescription>
            {operation ? "Update the details of this planned operation." : "Schedule a new field operation."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="id" defaultValue={operation?.id} />
          <div className="grid gap-2">
            <Label htmlFor="type">Operation Type <span className="text-destructive">*</span></Label>
            <Input 
              id="type" 
              name="type" 
              defaultValue={operation?.type} 
              placeholder="e.g., Fertilize, Irrigation, Harvest" 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plantingId">Planting ID</Label>
            <Input 
              id="plantingId" 
              name="plantingId" 
              defaultValue={operation?.plantingId} 
              placeholder="e.g., P001" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plannedDate">Planned Date</Label>
            <Input 
              id="plannedDate" 
              name="plannedDate" 
              type="date" 
              defaultValue={operation?.plannedDate} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              name="notes" 
              defaultValue={operation?.notes} 
              placeholder="Add any additional details..." 
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Operation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
