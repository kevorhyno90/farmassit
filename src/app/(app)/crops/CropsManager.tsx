"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { cropData, type Crop, fieldData as sampleFields, type Field, treatmentData as sampleTreatments, type Treatment, taskData as sampleTasks, type FarmTask } from "@/lib/data";
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
const STORAGE_TASKS = "farmassit.tasks.v1";
const STORAGE_VARIETIES = "farmassit.varieties.v1";

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
  const [crops, setCrops] = useState<Crop[]>(() => loadData<Crop[]>(STORAGE_KEY, cropData));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [fields, setFields] = useState<Field[]>(() => loadData<Field[]>(STORAGE_FIELDS, sampleFields));
  const [treatments, setTreatments] = useState<Treatment[]>(() => loadData<Treatment[]>(STORAGE_TREATMENTS, sampleTreatments));
  const [tasks, setTasks] = useState<FarmTask[]>(() => loadData<FarmTask[]>(STORAGE_TASKS, sampleTasks));

  // derive an initial varieties list from sample data (unique) and persisted override
  const initialVarieties = (() => {
    const uniq = Array.from(new Set(cropData.map((c) => c.variety).filter(Boolean)));
    return uniq.map((v, i) => ({ id: `V${String(i + 1).padStart(3, "0")}`, name: v }));
  })();
  const [varieties, setVarieties] = useState<{ id: string; name: string }[]>(() => loadData(STORAGE_VARIETIES, initialVarieties));

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
      } catch {
        // ignore remote load errors
      }
    })();
  }, []);

  useEffect(() => { saveData(STORAGE_FIELDS, fields, 'fields'); }, [fields]);
  useEffect(() => { saveData(STORAGE_TREATMENTS, treatments, 'treatments'); }, [treatments]);
  useEffect(() => { saveData(STORAGE_TASKS, tasks, 'tasks'); }, [tasks]);
  useEffect(() => { saveData(STORAGE_VARIETIES, varieties, 'varieties'); }, [varieties]);
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

  const handleAddVariety = (name: string) => {
    setVarieties((s) => {
      if (s.find((v) => v.name === name)) return s;
      const id = `V${String(s.length + 1).padStart(3, "0")}`;
      return [...s, { id, name }];
    });
  };

  const handleDeleteVariety = (id: string) => {
    if (!confirm('Delete variety? This will not change existing plantings.')) return;
    setVarieties((s) => s.filter(v => v.id !== id));
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

  const handleAddTask = (t: FarmTask, cropId?: string) => {
    setTasks((s) => {
      if (s.find(x => x.id === t.id)) return s.map(x => x.id === t.id ? t : x);
      return [...s, t];
    });
    if (cropId) {
      setCrops((s) => s.map(c => c.id === cropId ? { ...c, tasks: [...(c.tasks||[]), t] } : c));
    }
  }

  const handleDeleteTask = (id: string) => {
    if (!confirm('Delete task? This will remove it from the tasks list.')) return;
    setTasks((s) => s.filter(t => t.id !== id));
    setCrops((s) => s.map(c => ({ ...c, tasks: (c.tasks || []).filter(t => t.id !== id) })));
  }

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((s) => s.map(t => t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Pending' : t.status === 'Pending' ? 'In Progress' : 'Completed' } : t));
  }

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setIsDialogOpen(true);
  };

  // Quick treatment modal
  const [quickTreatmentCrop, setQuickTreatmentCrop] = useState<string | null>(null);
  const [isQuickTreatmentOpen, setIsQuickTreatmentOpen] = useState(false);
  // Quick assign task modal
  const [quickAssignCrop, setQuickAssignCrop] = useState<string | null>(null);
  const [isQuickAssignOpen, setIsQuickAssignOpen] = useState(false);

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

    // If the variety is new, add it to the catalog
    if (newCropData.variety && !varieties.find(v => v.name === newCropData.variety)) {
      handleAddVariety(newCropData.variety);
    }
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
    } catch {
      return null;
    }
  }

  // Render helpers
  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

      {/* Overview */}
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

      {/* Fields - management */}
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

      {/* Varieties */}
  <section id="varieties" ref={(el) => { sectionRefs.current["varieties"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Varieties</h3>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Catalog of crop varieties. Extend this list and link varieties to plantings. When saving a crop, unknown variety names will be added automatically to this catalog.</p>
            <div className="mt-3 space-y-2">
              {varieties.map(v => (
                <div key={v.id} className="flex items-center justify-between gap-2 border rounded p-2">
                  <div className="font-medium">{v.name}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { const name = prompt('Edit variety', v.name); if (name) setVarieties(s => s.map(x => x.id === v.id ? { ...x, name } : x)); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteVariety(v.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3">
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const name = String(fd.get('name')||'').trim(); if (name) { handleAddVariety(name); (e.currentTarget as HTMLFormElement).reset(); } }} className="grid gap-2">
                <Input name="name" placeholder="Variety name" />
                <Button type="submit">Add Variety</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Plantings table (main editable grid) */}
  <section id="plantings" ref={(el) => { sectionRefs.current["plantings"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Plantings</h3>
        <Card>
          <CardContent>
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
                {crops.map((crop) => (
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
                          <DropdownMenuItem onClick={() => { setQuickAssignCrop(crop.id); setIsQuickAssignOpen(true); }}><List className="mr-2 h-4 w-4" /> Assign Task</DropdownMenuItem>
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

      {/* Tasks placeholder */}
  <section id="tasks" ref={(el) => { sectionRefs.current["tasks"] = el; }} className="space-y-2">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Card>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">Task scheduling and assignment. Create, edit and assign tasks to plantings.</div>
            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-2 border rounded p-2">
                  <div>
                    <div className="font-medium">{t.task}</div>
                    <div className="text-xs text-muted-foreground">Due {t.dueDate} • {t.assignee}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant={t.status === 'Completed' ? 'secondary' : 'outline'}>{t.status}</Badge>
                    <Button size="sm" onClick={() => handleToggleTaskStatus(t.id)}>{t.status === 'Completed' ? 'Reopen' : 'Advance'}</Button>
                    <Button size="sm" onClick={() => { const name = prompt('Edit task title', t.task); if (name) handleAddTask({ ...t, task: name }); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(t.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const t: FarmTask = { id: `T${String(tasks.length+1).padStart(3,'0')}`, task: String(fd.get('task')||''), dueDate: String(fd.get('dueDate')||''), status: (fd.get('status') as FarmTask['status']) || 'Pending', assignee: String(fd.get('assignee')||'') }; handleAddTask(t); (e.currentTarget as HTMLFormElement).reset(); }} className="grid gap-2">
                <Input name="task" placeholder="Task description" required />
                <Input name="dueDate" type="date" />
                <Input name="assignee" placeholder="Assignee" />
                <Select name="status">
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Add Task</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Treatments */}
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
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const t: Treatment = { id: `TR${String(treatments.length+1).padStart(3,'0')}`, date: String(fd.get('date')||''), type: (fd.get('type') as Treatment['type']) || 'Other', product: String(fd.get('product')||''), rate: String(fd.get('rate')||''), notes: String(fd.get('notes')||'') }; handleAddTreatment(t); (e.currentTarget as HTMLFormElement).reset(); }} className="grid gap-2">
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

      {/* Reports */}
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

      {/* Quick assign task modal */}
      <Dialog open={isQuickAssignOpen} onOpenChange={setIsQuickAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const taskId = String(fd.get('taskId')||''); const cropId = quickAssignCrop; if (!taskId || !cropId) return; const t = tasks.find(x => x.id === taskId); if (!t) return; handleAddTask(t, cropId); setIsQuickAssignOpen(false); setQuickAssignCrop(null); }}>
            <div className="grid gap-4 py-4">
              <Select name="taskId">
                <SelectTrigger><SelectValue placeholder="Select task to assign" /></SelectTrigger>
                <SelectContent>
                  {tasks.map(t => (<SelectItem key={t.id} value={t.id}>{t.task} — {t.dueDate}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsQuickAssignOpen(false); setQuickAssignCrop(null); }}>Cancel</Button>
              <Button type="submit">Assign</Button>
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
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const t: Treatment = { id: `TR${String(treatments.length+1).padStart(3,'0')}`, date: String(fd.get('date')||''), type: (fd.get('type') as Treatment['type']) || 'Other', product: String(fd.get('product')||''), rate: String(fd.get('rate')||''), notes: String(fd.get('notes')||'') }; handleAddTreatment(t, quickTreatmentCrop || undefined); setIsQuickTreatmentOpen(false); setQuickTreatmentCrop(null); }}>
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
