"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fieldData as sampleFields, type Field, cropData } from "@/lib/data";
import { loadDataRemote, loadData, saveData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>(() => sampleFields);
  const [crops, setCrops] = useState(() => cropData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const rf = await loadDataRemote<Field[]>("fields", sampleFields);
        if (rf) setFields(rf);
        const rc = await loadDataRemote("crops", cropData);
        if (rc) setCrops(rc);
      } catch (e) {}
    })();

    try {
      const lf = loadData<Field[]>("farmassit.fields.v1", sampleFields);
      if (lf) setFields(lf);
      const lc = loadData("farmassit.crops.v1", cropData);
      if (lc) setCrops(lc);
    } catch (e) {}
  }, []);

  useEffect(() => { saveData('farmassit.fields.v1', fields, 'fields'); }, [fields]);

  const handleAdd = () => {
    setEditingField(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this field? This action cannot be undone.')) return;
    setFields(s => s.filter(f => f.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fieldData: Field = {
      id: (formData.get("id") as string) || `F${String(fields.length + 1).padStart(3, '0')}`,
      name: (formData.get("name") as string) || "",
      areaHa: parseFloat((formData.get("areaHa") as string) || "0"),
      soilType: (formData.get("soilType") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    };

    setFields(s => {
      const exists = s.find(f => f.id === fieldData.id);
      if (exists) return s.map(f => f.id === fieldData.id ? fieldData : f);
      return [...s, fieldData];
    });

    setIsDialogOpen(false);
    setEditingField(null);
  };

  // Calculate statistics
  const totalArea = fields.reduce((sum, field) => sum + field.areaHa, 0);
  const getFieldCrops = (fieldId: string) => crops.filter(c => c.fieldId === fieldId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Fields Management</h2>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Managed locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArea.toFixed(1)} ha</div>
            <p className="text-xs text-muted-foreground mt-1">Under management</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fields.length > 0 ? (totalArea / fields.length).toFixed(1) : '0'} ha
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per field</p>
          </CardContent>
        </Card>
      </div>

      {/* Fields List */}
      <div className="grid gap-4">
        {fields.map(f => {
          const fieldCrops = getFieldCrops(f.id);
          return (
            <Card key={f.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{f.name}</CardTitle>
                      <CardDescription>ID: {f.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(f)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(f.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Area</div>
                    <div className="text-lg font-semibold">{f.areaHa} hectares</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Soil Type</div>
                    <div className="text-lg font-semibold">{f.soilType || '—'}</div>
                  </div>
                </div>
                {f.notes && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-muted-foreground">Notes</div>
                    <p className="text-sm mt-1">{f.notes}</p>
                  </div>
                )}
                <div className="mt-3">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Assigned Crops ({fieldCrops.length})
                  </div>
                  {fieldCrops.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {fieldCrops.map(c => (
                        <Badge key={c.id} variant="secondary">
                          {c.name} - {c.variety}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No crops assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <Input name="id" defaultValue={editingField?.id} type="hidden" />
              <div className="grid gap-2">
                <Label htmlFor="name">Field Name</Label>
                <Input id="name" name="name" defaultValue={editingField?.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="areaHa">Area (hectares)</Label>
                <Input id="areaHa" name="areaHa" type="number" step="0.1" defaultValue={editingField?.areaHa} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Input id="soilType" name="soilType" defaultValue={editingField?.soilType} placeholder="e.g., Loam, Clay, Sandy" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" defaultValue={editingField?.notes} placeholder="Additional information about this field" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
