"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadData, saveData } from "@/lib/localStore";
import { plantingData as samplePlantings, type Planting } from "@/lib/data";
import PlantingEditor from "@/components/crops/PlantingEditor";
import SimpleCalendar from "@/components/ui/SimpleCalendar";
import OperationEditor from "@/components/crops/OperationEditor";
import { operationData as sampleOperations, type Operation } from "@/lib/data";

export default function PlantingsPage() {
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [editing, setEditing] = useState<Planting | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [opEditing, setOpEditing] = useState<Operation | null>(null);
  const [opOpen, setOpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/data/plantings');
        if (res.ok) {
          const data = await res.json();
          setPlantings(data);
          return;
        }
      } catch (e) {
        // fallback
      }
      setPlantings(loadData<Planting[]>('farmassit.plantings.v1', samplePlantings));
    })();
    (async () => {
      try {
        const res = await fetch('/api/data/operations');
        if (res.ok) {
          const data = await res.json();
          setOperations(data);
          return;
        }
      } catch (e) {
        // fallback
      }
      setOperations(loadData<Operation[]>('farmassit.operations.v1', sampleOperations));
    })().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { saveData('farmassit.plantings.v1', plantings, 'plantings'); }, [plantings]);
  useEffect(() => { saveData('farmassit.operations.v1', operations, 'operations'); }, [operations]);

  const [query, setQuery] = useState('');

  const filteredPlantings = plantings.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(p.id).toLowerCase().includes(q) ||
      String(p.cropId ?? '').toLowerCase().includes(q) ||
      String(p.fieldId ?? '').toLowerCase().includes(q)
    );
  });

  const handleAdd = () => { setEditing(null); setIsOpen(true); };
  const handleEdit = (p: Planting) => { setEditing(p); setIsOpen(true); };
  const handleSave = (p: Planting) => { setPlantings(s => { const exists = s.find(x => x.id === p.id); if (exists) return s.map(x => x.id === p.id ? p : x); return [...s, p]; }); setIsOpen(false); };

  const handleAddOperation = () => { setOpEditing(null); setOpOpen(true); };
  const handleEditOperation = (o: Operation) => { setOpEditing(o); setOpOpen(true); };

  const handleSaveOperation = (o: Operation) => { setOperations(s => { const exists = s.find(x => x.id === o.id); if (exists) return s.map(x => x.id === o.id ? o : x); return [...s, o]; }); setOpOpen(false); };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crop Plantings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your planting schedules and track field operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd} size="lg">+ Add Planting</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-pulse text-muted-foreground">Loading plantings...</div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Planting Calendar</CardTitle>
                  <CardDescription>
                    Click on any date to view or edit planting details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input 
                      placeholder="🔍 Search plantings by ID, crop, or field..." 
                      value={query} 
                      onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
                      className="max-w-md"
                    />
                  </div>
                  {filteredPlantings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {query ? 'No plantings match your search.' : 'No plantings yet. Add your first planting above!'}
                    </div>
                  ) : (
                    <SimpleCalendar 
                      items={filteredPlantings.map(p => ({ 
                        id: p.id, 
                        date: p.sowingDate || p.expectedHarvest || '', 
                        title: p.cropId 
                      }))} 
                      onClickItem={(id) => { 
                        const p = plantings.find(x => x.id === id); 
                        if (p) handleEdit(p); 
                      }} 
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Planned Operations</CardTitle>
                      <CardDescription className="mt-1">
                        Upcoming field activities
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={handleAddOperation}>+ Add</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {operations.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No operations planned yet
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {operations.map(o => (
                        <li key={o.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                          <div className="flex-1">
                            <div className="font-medium">{o.type}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {o.plannedDate || 'No date set'}
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => handleEditOperation(o)}>
                            Edit
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Plantings</CardTitle>
              <CardDescription>
                Complete list of all crop plantings with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPlantings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {query ? 'No plantings match your search.' : 'No plantings to display.'}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Crop</TableHead>
                        <TableHead className="font-semibold">Field</TableHead>
                        <TableHead className="font-semibold">Sowing Date</TableHead>
                        <TableHead className="font-semibold">Expected Harvest</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlantings.map(p => (
                        <TableRow key={p.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{p.id}</TableCell>
                          <TableCell>{p.cropId || '—'}</TableCell>
                          <TableCell>{p.fieldId || '—'}</TableCell>
                          <TableCell>{p.sowingDate || '—'}</TableCell>
                          <TableCell>{p.expectedHarvest || '—'}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <PlantingEditor open={isOpen} planting={editing} onSave={handleSave} onClose={() => setIsOpen(false)} />
      <OperationEditor open={opOpen} operation={opEditing} onSave={handleSaveOperation} onClose={() => setOpOpen(false)} />
    </div>
  );
}
