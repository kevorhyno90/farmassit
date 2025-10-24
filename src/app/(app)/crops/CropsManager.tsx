"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, PlusCircle, Sprout, Trash2, FileText, List } from "lucide-react";
import { cropData, type Crop, fieldData as sampleFields, type Field, treatmentData as sampleTreatments, type Treatment } from "@/lib/data";
import { loadData, saveData, loadDataRemote } from "@/lib/localStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sections for the top bar
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "fields", label: "Fields" },
  { id: "varieties", label: "Varieties" },
  { id: "plantings", label: "Plantings" },
  { id: "tasks", label: "Tasks" },
  { id: "treatments", label: "Treatments" },
  { id: "reports", label: "Reports" },
];

const STORAGE_KEY = "farmassit.crops.v1";
const STORAGE_FIELDS = "farmassit.fields.v1";
const STORAGE_TREATMENTS = "farmassit.treatments.v1";

function exportCSV(crops: Crop[]) {
  const header = ["id", "name", "variety", "stage", "plantingDate", "expectedHarvest"];
  const rows = [header.join(",")];
  crops.forEach((c) => rows.push([c.id, c.name, c.variety, c.stage, c.plantingDate, c.expectedHarvest].map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")));
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "crops-export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function CropsManager({ initialSection } : { initialSection?: string }) {
  // Use deterministic initial data (matches server-rendered fallback) to avoid hydration
  // mismatches. Local storage / remote data will be loaded after mount.
  const [crops, setCrops] = useState<Crop[]>(() => cropData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [fields, setFields] = useState<Field[]>(() => sampleFields);
  const [treatments, setTreatments] = useState<Treatment[]>(() => sampleTreatments);

  // try remote load on mount
  useEffect(() => {
    (async () => {
      try {
        const remoteCrops = await loadDataRemote<Crop[]>("crops", cropData);
        if (remoteCrops) setCrops(remoteCrops);
        const remoteFields = await loadDataRemote<Field[]>("fields", sampleFields);
        if (remoteFields) setFields(remoteFields);
        const remoteTreat = await loadDataRemote<Treatment[]>("treatments", sampleTreatments);
        if (remoteTreat) setTreatments(remoteTreat);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // After mount: if no remote data, prefer any saved local data (localStorage) to
  // seed client state. We do this in a separate effect to avoid reading localStorage
  // during server render which could cause hydration mismatches.
  useEffect(() => {
    try {
      const localCrops = loadData<Crop[] | null>(STORAGE_KEY, null as any);
      if (localCrops) setCrops(localCrops);
      const localFields = loadData<Field[] | null>(STORAGE_FIELDS, null as any);
      if (localFields) setFields(localFields);
      const localTreat = loadData<Treatment[] | null>(STORAGE_TREATMENTS, null as any);
      if (localTreat) setTreatments(localTreat);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => { saveData(STORAGE_FIELDS, fields, 'fields'); }, [fields]);
  useEffect(() => { saveData(STORAGE_TREATMENTS, treatments, 'treatments'); }, [treatments]);
  useEffect(() => { saveData(STORAGE_KEY, crops, 'crops'); }, [crops]);

  const router = useRouter();

  // If an initialSection prop is provided (route), navigate to that route.
  useEffect(() => {
    if (initialSection) {
      // navigate to the per-section page so it's independent
      router.replace(`/crops/${initialSection}`);
    }
  }, [initialSection, router]);

  // Intersection observer to highlight active section and show dropdown of subsections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete crop? This action cannot be undone.")) return;
    setCrops((s) => s.filter((crop) => crop.id !== id));
  };

  const handleAddField = (f: Field) => {
    setFields((s) => {
      if (s.find(x => x.id === f.id)) return s.map(x => x.id === f.id ? f : x);
      return [...s, f];
    });
  }

  const handleDeleteField = (id: string) => {
    if (!confirm('Delete field? This will unset assigned field on crops.')) return;
    setFields((s) => s.filter(f => f.id !== id));
    setCrops((s) => s.map(c => c.fieldId === id ? { ...c, fieldId: undefined } : c));
  }

  const handleAddTreatment = (t: Treatment, cropId?: string) => {
    setTreatments((s) => {
      if (s.find(x => x.id === t.id)) return s.map(x => x.id === t.id ? t : x);
      return [...s, t];
    });
    if (cropId) {
      setCrops((s) => s.map(c => c.id === cropId ? { ...c, treatments: [...(c.treatments||[]), t] } : c));
    }
  }

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setIsDialogOpen(true);
  };

  // Quick treatment modal
  const [quickTreatmentCrop, setQuickTreatmentCrop] = useState<string | null>(null);
  const [isQuickTreatmentOpen, setIsQuickTreatmentOpen] = useState(false);

  const handleAddNew = () => {
    setEditingCrop(null);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCropData: Crop = {
      id: (formData.get("id") as string) || `C${String(crops.length + 1).padStart(3, "0")}`,
      name: (formData.get("name") as string) || "",
      variety: (formData.get("variety") as string) || "",
      plantingDate: (formData.get("plantingDate") as string) || "",
      stage: (formData.get("stage") as Crop["stage"]) || "Planted",
      expectedHarvest: (formData.get("expectedHarvest") as string) || "",
    };

    setCrops((s) => {
      const exists = s.find((c) => c.id === newCropData.id);
      if (exists) return s.map((c) => (c.id === newCropData.id ? newCropData : c));
      return [...s, newCropData];
    });

    setEditingCrop(null);
    setIsDialogOpen(false);
  };

  const fieldCount = crops.length;
  const stagesCount = useMemo(() => {
    const m = new Map<string, number>();
    crops.forEach((c) => m.set(c.stage, (m.get(c.stage) || 0) + 1));
    return m;
  }, [crops]);

  // Simple Reports
  const reportSummary = useMemo(() => {
    return {
      total: crops.length,
      byStage: Array.from(stagesCount.entries()).map(([stage, count]) => ({ stage, count })),
    };
  }, [crops, stagesCount]);

  // GDD calculation using user-provided base temperature and optional avg daily temp override
  const [baseTemp, setBaseTemp] = useState<number>(10);
  const [avgTempOverride, setAvgTempOverride] = useState<number | null>(null);

  const estimateGDD = (crop: Crop) => {
    try {
      const start = new Date(crop.plantingDate).getTime();
      const end = new Date(crop.expectedHarvest).getTime();
      if (isNaN(start) || isNaN(end) || end <= start) return null;
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      const avgDaily = avgTempOverride ?? 15; // default climatology average
      const dailyGdd = Math.max(0, avgDaily - baseTemp);
      return Math.round(days * dailyGdd);
    } catch (e) {
      return null;
    }
  }

  // Render helpers
  const scrollToSection = (id: string) => {
    // navigate to the independent subsection page
    router.push(`/crops/${id}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Crop Management
            </CardTitle>
            <CardDescription>A toolkit for an agronomist to manage crop cycles and run reports.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1">
              {SECTIONS.map((s) => (
                <Button key={s.id} variant={s.id === activeSection ? "default" : "ghost"} size="sm" onClick={() => scrollToSection(s.id)}>
                  {s.label}
                </Button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="md:hidden">
                  <List className="h-4 w-4 mr-1" /> Sections
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sections</DropdownMenuLabel>
                {SECTIONS.map(s => (
                  <DropdownMenuItem key={s.id} onClick={() => scrollToSection(s.id)}>{s.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="gap-1" onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4" /> Add New Crop
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportCSV(crops)}>
              <FileText className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Sections overview — each section is now an independent page */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Open the independent page for {s.label}.</p>
              <div className="mt-3">
                <Button size="sm" onClick={() => router.push(`/crops/${s.id}`)}>{s.label}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <Input name="id" defaultValue={editingCrop?.id} type="hidden" />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={editingCrop?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variety" className="text-right">Variety</Label>
                <Input id="variety" name="variety" defaultValue={editingCrop?.variety} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldId" className="text-right">Field</Label>
                <Select name="fieldId" defaultValue={editingCrop?.fieldId}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Assign field (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {fields.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name} — {f.areaHa} ha</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stage" className="text-right">Stage</Label>
                <Select name="stage" defaultValue={editingCrop?.stage}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planted">Planted</SelectItem>
                    <SelectItem value="Germination">Germination</SelectItem>
                    <SelectItem value="Vegetative">Vegetative</SelectItem>
                    <SelectItem value="Flowering">Flowering</SelectItem>
                    <SelectItem value="Harvest">Harvest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plantingDate" className="text-right">Planted</Label>
                <Input id="plantingDate" name="plantingDate" type="date" defaultValue={editingCrop?.plantingDate} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expectedHarvest" className="text-right">Harvest</Label>
                <Input id="expectedHarvest" name="expectedHarvest" type="date" defaultValue={editingCrop?.expectedHarvest} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick treatment modal */}
      <Dialog open={isQuickTreatmentOpen} onOpenChange={setIsQuickTreatmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Treatment</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const t: Treatment = { id: `TR${String(treatments.length+1).padStart(3,'0')}`, date: String(fd.get('date')||''), type: (fd.get('type') as any) || 'Other', product: String(fd.get('product')||''), rate: String(fd.get('rate')||''), notes: String(fd.get('notes')||'') }; handleAddTreatment(t, quickTreatmentCrop || undefined); setIsQuickTreatmentOpen(false); setQuickTreatmentCrop(null); }}>
            <div className="grid gap-4 py-4">
              <Input name="date" type="date" required />
              <Select name="type">
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                  <SelectItem value="Pesticide">Pesticide</SelectItem>
                  <SelectItem value="Irrigation">Irrigation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input name="product" placeholder="Product" />
              <Input name="rate" placeholder="Rate" />
              <Input name="notes" placeholder="Notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsQuickTreatmentOpen(false); setQuickTreatmentCrop(null); }}>Cancel</Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
