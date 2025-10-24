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
import CropsTopbar from "./CropsTopbar";
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

export default function CropsManager({ initialSection, onlySection } : { initialSection?: string, onlySection?: string }) {
  // Start with empty arrays to avoid SSR/CSR hydration mismatches. We'll load stored data on mount.
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [fields, setFields] = useState<Field[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [varieties, setVarieties] = useState<string[]>([]);
  const [tasks, setTasks] = useState<import('@/lib/data').FarmTask[]>([]);
  type FarmTask = import('@/lib/data').FarmTask;
  // Dialog state for editing varieties
  const [isVarDialogOpen, setIsVarDialogOpen] = useState(false);
  const [varEditing, setVarEditing] = useState<string | null>(null);
  const [varFormValue, setVarFormValue] = useState('');
  // Dialog state for editing tasks
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskEditing, setTaskEditing] = useState<FarmTask | null>(null);
  const [taskForm, setTaskForm] = useState<{ task:string; dueDate:string; status:FarmTask['status']; assignee:string }>({ task: '', dueDate: '', status: 'Pending', assignee: '' });

  // Load stored data on client after mount. Doing this inside useEffect prevents server from rendering
  // data that differs from the client initial render (avoids hydration mismatches).
  useEffect(() => {
    (async () => {
      try {
        // first load from localStorage (fast)
        const localCrops = loadData<Crop[]>(STORAGE_KEY, cropData);
        setCrops(localCrops || cropData);
  const localFields = loadData<Field[]>(STORAGE_FIELDS, sampleFields);
  setFields(localFields || sampleFields);
  const localTreat = loadData<Treatment[]>(STORAGE_TREATMENTS, sampleTreatments);
  setTreatments(localTreat || sampleTreatments);
  const localVar = loadData<string[]>('farmassit.varieties.v1', []);
  setVarieties(localVar || []);
  const localTasks = loadData<import('@/lib/data').FarmTask[]>('farmassit.tasks.v1', []);
  setTasks(localTasks || []);

        // then try server-backed remote data to override if available
        try {
          const remoteCrops = await loadDataRemote<Crop[]>("crops", null as any);
          if (remoteCrops) setCrops(remoteCrops);
          const remoteFields = await loadDataRemote<Field[]>("fields", null as any);
          if (remoteFields) setFields(remoteFields);
          const remoteTreat = await loadDataRemote<Treatment[]>("treatments", null as any);
          if (remoteTreat) setTreatments(remoteTreat);
        } catch (e) {
          // ignore remote failures
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => { saveData(STORAGE_FIELDS, fields, 'fields'); }, [fields]);
  useEffect(() => { saveData(STORAGE_TREATMENTS, treatments, 'treatments'); }, [treatments]);
  useEffect(() => { saveData('farmassit.varieties.v1', varieties, 'varieties'); }, [varieties]);
  useEffect(() => { saveData('farmassit.tasks.v1', tasks, 'tasks'); }, [tasks]);
  useEffect(() => { saveData(STORAGE_KEY, crops, 'crops'); }, [crops]);

  // If an initialSection prop is provided, scroll to it on mount
  useEffect(() => {
    if (initialSection) {
      // slight delay to allow refs to be attached
      setTimeout(() => {
        const el = sectionRefs.current[initialSection];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(initialSection);
      }, 150);
    }
  }, [initialSection]);

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
  // selection state for the crop form field select (so we can programmatically set it)
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [isAddFieldDialogOpenInline, setIsAddFieldDialogOpenInline] = useState(false);
  const [newFieldForm, setNewFieldForm] = useState<{ name: string; areaHa: number; soilType: string }>({ name: '', areaHa: 0, soilType: '' });

  const handleAddNew = () => {
    setEditingCrop(null);
    setSelectedFieldId(undefined);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  // prefer controlled selectedFieldId when present (inline add may update it), otherwise read from form
  const rawField = selectedFieldId ?? (formData.get("fieldId") as string | null);
  const fieldId = rawField === "__UNASSIGNED__" ? undefined : (rawField || undefined);

    const newCropData: Crop = {
      id: (formData.get("id") as string) || `C${String(crops.length + 1).padStart(3, "0")}`,
      name: (formData.get("name") as string) || "",
      variety: (formData.get("variety") as string) || "",
      fieldId: fieldId,
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

  // UI filters for plantings
  const [plantingSearch, setPlantingSearch] = useState<string>('');
  const [plantingFieldFilter, setPlantingFieldFilter] = useState<string | undefined>(undefined);
  const [plantingStageFilter, setPlantingStageFilter] = useState<string | undefined>(undefined);

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

  const filteredCrops = useMemo(() => {
    return crops.filter(c => {
      if (plantingSearch) {
        const s = plantingSearch.toLowerCase();
        if (!(`${c.name} ${c.variety}`.toLowerCase().includes(s))) return false;
      }
      if (plantingFieldFilter && plantingFieldFilter !== '__ALL__') {
        if ((c.fieldId || '__UNASSIGNED__') !== plantingFieldFilter) return false;
      }
      if (plantingStageFilter && plantingStageFilter !== '__ALL__') {
        if (c.stage !== plantingStageFilter) return false;
      }
      return true;
    });
  }, [crops, plantingSearch, plantingFieldFilter, plantingStageFilter]);

  // Render helpers
  const router = useRouter();

  // navigate to a section route so the page opens that section (server route passes initialSection)
  const navigateToSection = (id: string) => {
    // push the app route /crops/<section>
    router.push(`/crops/${id}`);
  };

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4">
      <CropsTopbar active={activeSection} />
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" className="gap-1" onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4" /> Add New Crop
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportCSV(crops)}>
          <FileText className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

    {/* Overview */}
    {(!onlySection || onlySection === 'overview') && (
  <section id="overview" ref={(el) => { sectionRefs.current["overview"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total crops</div>
              <div className="text-2xl font-bold">{reportSummary.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Fields (sample)</div>
              <div className="text-2xl font-bold">{fieldCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Stages</div>
              <div className="flex gap-2 mt-2">
                {reportSummary.byStage.map(s => (
                  <Badge key={s.stage} variant="outline">{s.stage} ({s.count})</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
  </section>
  )}

  {/* Fields - management */}
  {(!onlySection || onlySection === 'fields') && (
  <section id="fields" ref={(el) => { sectionRefs.current["fields"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Fields on the farm</div>
              <div className="space-y-2">
                {fields.map(f => (
                  <div key={f.id} className="flex items-center justify-between gap-2 border rounded p-2">
                    <div>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.areaHa} ha — {f.soilType}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { const name = prompt('Field name', f.name); if (name) handleAddField({...f, name}); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteField(f.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Add new field</div>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); handleAddField({ id: `F${String(fields.length+1).padStart(3,'0')}`, name: String(fd.get('name')||''), areaHa: Number(fd.get('areaHa')||0), soilType: String(fd.get('soilType')||'') }); (e.currentTarget as HTMLFormElement).reset(); }} className="grid gap-2">
                <Input name="name" placeholder="Field name" required />
                <Input name="areaHa" type="number" placeholder="Area (ha)" required />
                <Input name="soilType" placeholder="Soil type" />
                <Button type="submit">Add Field</Button>
              </form>
            </CardContent>
          </Card>
        </div>
  </section>
  )}

      {/* Varieties */}
      {(!onlySection || onlySection === 'varieties') && (
  <section id="varieties" ref={(el) => { sectionRefs.current["varieties"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Varieties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Catalog of crop varieties</div>
              <div className="space-y-2">
                {varieties.map(v => (
                  <div key={v} className="flex items-center justify-between gap-2 border rounded p-2">
                    <div className="font-medium">{v}</div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { setVarEditing(v); setVarFormValue(v); setIsVarDialogOpen(true); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => { if (confirm('Delete variety?')) setVarieties(s => s.filter(x => x !== v)); }}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Add new variety</div>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const name = String(fd.get('name')||'').trim(); if (name) setVarieties(s => [...s, name]); (e.currentTarget as HTMLFormElement).reset(); }} className="grid gap-2">
                <Input name="name" placeholder="Variety name" required />
                <Button type="submit">Add Variety</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      )}

      {/* Plantings table (main editable grid) */}
  {(!onlySection || onlySection === 'plantings') && (
  <section id="plantings" ref={(el) => { sectionRefs.current["plantings"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Plantings</h3>
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Search plantings" value={plantingSearch} onChange={(e) => setPlantingSearch(e.target.value)} />
                <Select onValueChange={(v) => setPlantingFieldFilter(v === '__ALL__' ? undefined : v)}>
                  <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">All fields</SelectItem>
                    <SelectItem value="__UNASSIGNED__">Unassigned</SelectItem>
                    {fields.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => setPlantingStageFilter(v === '__ALL__' ? undefined : v)}>
                  <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">All stages</SelectItem>
                    <SelectItem value="Planted">Planted</SelectItem>
                    <SelectItem value="Germination">Germination</SelectItem>
                    <SelectItem value="Vegetative">Vegetative</SelectItem>
                    <SelectItem value="Flowering">Flowering</SelectItem>
                    <SelectItem value="Harvest">Harvest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => { setPlantingSearch(''); setPlantingFieldFilter(undefined); setPlantingStageFilter(undefined); }}>Clear</Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Variety</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="hidden md:table-cell">Planted</TableHead>
                  <TableHead>Harvest</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{crop.variety}</TableCell>
                    <TableCell><Badge variant="outline">{crop.stage}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell">{crop.plantingDate}</TableCell>
                    <TableCell>{crop.expectedHarvest}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(crop)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setQuickTreatmentCrop(crop.id); setIsQuickTreatmentOpen(true); }}><Sprout className="mr-2 h-4 w-4" /> Add Treatment</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(crop.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
      )}

    {/* Tasks placeholder */}
    {(!onlySection || onlySection === 'tasks') && (
  <section id="tasks" ref={(el) => { sectionRefs.current["tasks"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Tasks</div>
              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between gap-2 border rounded p-2">
                    <div>
                      <div className="font-medium">{t.task}</div>
                      <div className="text-xs text-muted-foreground">Due {t.dueDate} • {t.status} • {t.assignee}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { setTaskEditing(t); setTaskForm({ task: t.task, dueDate: t.dueDate, status: t.status, assignee: t.assignee }); setIsTaskDialogOpen(true); }}>Edit</Button>
                      <Button size="sm" onClick={() => { setTasks(s => s.map(x => x.id === t.id ? { ...x, status: x.status === 'Pending' ? 'In Progress' : x.status === 'In Progress' ? 'Completed' : 'Pending' } : x)); }}>{t.status === 'Completed' ? 'Reopen' : 'Advance'}</Button>
                      <Button size="sm" variant="destructive" onClick={() => { if (confirm('Delete task?')) setTasks(s => s.filter(x => x.id !== t.id)); }}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Add new task</div>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const t = { id: `T${String(tasks.length+1).padStart(3,'0')}`, task: String(fd.get('task')||''), dueDate: String(fd.get('dueDate')||''), status: (fd.get('status') as any) || 'Pending', assignee: String(fd.get('assignee')||'') }; setTasks(s => [...s, t]); (e.currentTarget as HTMLFormElement).reset(); }} className="grid gap-2">
                <Input name="task" placeholder="Task name" required />
                <Input name="dueDate" type="date" />
                <Select name="status">
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="assignee" placeholder="Assignee" />
                <Button type="submit">Add Task</Button>
              </form>
            </CardContent>
          </Card>
        </div>
  </section>
  )}

      {/* Treatments */}
      {(!onlySection || onlySection === 'treatments') && (
      <section id="treatments" ref={(el) => { sectionRefs.current["treatments"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Treatments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Treatments (global)</div>
              <div className="space-y-2">
                {treatments.map(t => (
                  <div key={t.id} className="flex items-center justify-between gap-2 border rounded p-2">
                    <div>
                      <div className="font-medium">{t.type} — {t.product}</div>
                      <div className="text-xs text-muted-foreground">{t.date} • {t.rate}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { const notes = prompt('Notes', t.notes||''); if (notes !== null) { handleAddTreatment({ ...t, notes }); } }}>Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="mb-2 text-sm text-muted-foreground">Add new treatment</div>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const t: Treatment = { id: `TR${String(treatments.length+1).padStart(3,'0')}`, date: String(fd.get('date')||''), type: (fd.get('type') as any) || 'Other', product: String(fd.get('product')||''), rate: String(fd.get('rate')||''), notes: String(fd.get('notes')||'') }; handleAddTreatment(t); (e.currentTarget as HTMLFormElement).reset(); }} className="grid gap-2">
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
                <Button type="submit">Add Treatment</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      )}

      {/* Reports */}
      {(!onlySection || onlySection === 'reports') && (
      <section id="reports" ref={(el) => { sectionRefs.current["reports"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Reports</h3>
        <Card>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Simple summary</div>
              <div className="flex gap-3">
                <div className="p-3 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">Total plantings</div>
                  <div className="font-bold text-lg">{reportSummary.total}</div>
                </div>
                {reportSummary.byStage.map(s => (
                  <div key={s.stage} className="p-3 bg-muted rounded">
                    <div className="text-xs text-muted-foreground">{s.stage}</div>
                    <div className="font-bold">{s.count}</div>
                  </div>
                ))}
              </div>
              <div className="pt-3">
                <div className="text-sm text-muted-foreground">Estimated GDD (placeholder)</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {crops.map(c => (
                    <div key={c.id} className="p-2 border rounded">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">Est. GDD: {estimateGDD(c) ?? '—'}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Field: {fields.find(f => f.id === c.fieldId)?.name ?? '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3">
                <Button variant="outline" size="sm" onClick={() => exportCSV(crops)}>Export CSV</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      )}

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
                <Select name="fieldId" defaultValue={editingCrop?.fieldId ?? "__UNASSIGNED__"} onValueChange={(v) => {
                    if (v === '__ADD_FIELD__') {
                      setIsAddFieldDialogOpenInline(true);
                    } else if (v === '__UNASSIGNED__') {
                      setSelectedFieldId(undefined);
                    } else {
                      setSelectedFieldId(v);
                    }
                  }}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Assign field (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__UNASSIGNED__">Unassigned</SelectItem>
                    {fields.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name} — {f.areaHa} ha</SelectItem>
                    ))}
                    <SelectItem value="__ADD_FIELD__">+ Add new field...</SelectItem>
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
      {/* Variety edit dialog */}
      <Dialog open={isVarDialogOpen} onOpenChange={setIsVarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Variety</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); if (varEditing) { setVarieties(s => s.map(x => x === varEditing ? varFormValue : x)); } setVarEditing(null); setVarFormValue(''); setIsVarDialogOpen(false); }}>
            <div className="grid gap-4 py-2">
              <Input value={varFormValue} onChange={(e) => setVarFormValue(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsVarDialogOpen(false); setVarEditing(null); setVarFormValue(''); }}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task edit dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); if (taskEditing) { setTasks(s => s.map(x => x.id === taskEditing.id ? { ...x, ...taskForm } : x)); } setTaskEditing(null); setTaskForm({ task: '', dueDate: '', status: 'Pending', assignee: '' }); setIsTaskDialogOpen(false); }}>
            <div className="grid gap-2 py-2">
              <Label>Task</Label>
              <Input value={taskForm.task} onChange={(e) => setTaskForm(old => ({ ...old, task: e.target.value }))} />
              <Label>Due date</Label>
              <Input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm(old => ({ ...old, dueDate: e.target.value }))} />
              <Label>Status</Label>
              <Select value={taskForm.status} onValueChange={(v)=> setTaskForm(old => ({ ...old, status: v as FarmTask['status'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Label>Assignee</Label>
              <Input value={taskForm.assignee} onChange={(e) => setTaskForm(old => ({ ...old, assignee: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsTaskDialogOpen(false); setTaskEditing(null); setTaskForm({ task: '', dueDate: '', status: 'Pending', assignee: '' }); }}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Inline Add Field dialog (opened from Field select) */}
      <Dialog open={isAddFieldDialogOpenInline} onOpenChange={setIsAddFieldDialogOpenInline}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); const id = `F${String(fields.length+1).padStart(3,'0')}`; const f = { id, name: newFieldForm.name || `Field ${id}`, areaHa: Number(newFieldForm.areaHa)||0, soilType: newFieldForm.soilType }; setFields(s => [...s, f]); setSelectedFieldId(id); setNewFieldForm({ name: '', areaHa: 0, soilType: '' }); setIsAddFieldDialogOpenInline(false); }}>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={newFieldForm.name} onChange={(e) => setNewFieldForm(old => ({ ...old, name: e.target.value }))} />
              <Label>Area (ha)</Label>
              <Input type="number" value={String(newFieldForm.areaHa)} onChange={(e) => setNewFieldForm(old => ({ ...old, areaHa: Number(e.target.value) }))} />
              <Label>Soil type</Label>
              <Input value={newFieldForm.soilType} onChange={(e) => setNewFieldForm(old => ({ ...old, soilType: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddFieldDialogOpenInline(false)}>Cancel</Button>
              <Button type="submit">Add Field</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
