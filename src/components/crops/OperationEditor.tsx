"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{operation ? "Edit Operation" : "Add Operation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input type="hidden" name="id" defaultValue={operation?.id} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plantingId" className="text-right">Planting</Label>
            <Input id="plantingId" name="plantingId" defaultValue={operation?.plantingId} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Input id="type" name="type" defaultValue={operation?.type} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="plannedDate" className="text-right">Planned Date</Label>
            <Input id="plannedDate" name="plannedDate" type="date" defaultValue={operation?.plannedDate} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Input id="notes" name="notes" defaultValue={operation?.notes} className="col-span-3" />
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

