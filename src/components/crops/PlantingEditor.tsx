"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Planting } from "@/lib/data";

export default function PlantingEditor({ open, planting, onSave, onClose }: { open: boolean; planting: Planting | null; onSave: (p: Planting) => void; onClose: () => void; }) {
  const [form, setForm] = useState<Planting | null>(planting);

  useEffect(() => setForm(planting ?? { id: `P${Date.now()}`, cropId: '', fieldId: '', sowingDate: '', expectedHarvest: '', areaHa: 0, status: 'Planned', operations: [] }), [planting]);

  if (!form) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{planting ? 'Edit Planting' : 'Add Planting'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Label>Crop ID</Label>
          <Input value={form.cropId} onChange={(e) => setForm({ ...form, cropId: e.target.value })} />
          <Label>Field ID</Label>
          <Input value={form.fieldId} onChange={(e) => setForm({ ...form, fieldId: e.target.value })} />
          <Label>Sowing Date</Label>
          <Input type="date" value={form.sowingDate} onChange={(e) => setForm({ ...form, sowingDate: e.target.value })} />
          <Label>Expected Harvest</Label>
          <Input type="date" value={form.expectedHarvest} onChange={(e) => setForm({ ...form, expectedHarvest: e.target.value })} />
          <Label>Area (ha)</Label>
          <Input type="number" value={String(form.areaHa)} onChange={(e) => setForm({ ...form, areaHa: Number(e.target.value) })} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
