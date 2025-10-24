"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Operation } from "@/lib/data";

export default function OperationEditor({ open, operation, onSave, onClose }: { open: boolean; operation: Operation | null; onSave: (o: Operation) => void; onClose: () => void; }) {
  const [form, setForm] = useState<Operation | null>(operation);

  useEffect(() => setForm(operation ?? { id: `O${Date.now()}`, plantingId: '', type: 'Other', plannedDate: '', applications: [] }), [operation]);

  if (!form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{operation ? 'Edit Operation' : 'Add Operation'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Label>Planting ID</Label>
          <Input value={form.plantingId} onChange={(e) => setForm({ ...form, plantingId: e.target.value })} />
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Operation['type'] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sowing">Sowing</SelectItem>
              <SelectItem value="Irrigation">Irrigation</SelectItem>
              <SelectItem value="Fertilization">Fertilization</SelectItem>
              <SelectItem value="Pest Control">Pest Control</SelectItem>
              <SelectItem value="Harvest">Harvest</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Label>Planned Date</Label>
          <Input type="date" value={form.plannedDate || ''} onChange={(e) => setForm({ ...form, plannedDate: e.target.value })} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
