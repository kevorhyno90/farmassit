"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/data/plantings');
        if (res.ok) {
          const data = await res.json();
          setPlantings(data);
          return;
        }
      } catch {
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
      } catch {
        // fallback
      }
      setOperations(loadData<Operation[]>('farmassit.operations.v1', sampleOperations));
    })();
  }, []);

  useEffect(() => { saveData('farmassit.plantings.v1', plantings, 'plantings'); }, [plantings]);
  useEffect(() => { saveData('farmassit.operations.v1', operations, 'operations'); }, [operations]);

  const handleAdd = () => { setEditing(null); setIsOpen(true); };
  const handleEdit = (p: Planting) => { setEditing(p); setIsOpen(true); };
  const handleSave = (p: Planting) => { setPlantings(s => { const exists = s.find(x => x.id === p.id); if (exists) return s.map(x => x.id === p.id ? p : x); return [...s, p]; }); setIsOpen(false); };

  const handleAddOperation = () => { setOpEditing(null); setOpOpen(true); };
  const handleEditOperation = (o: Operation) => { setOpEditing(o); setOpOpen(true); };

  const handleSaveOperation = (o: Operation) => { setOperations(s => { const exists = s.find(x => x.id === o.id); if (exists) return s.map(x => x.id === o.id ? o : x); return [...s, o]; }); setOpOpen(false); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plantings</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd}>Add Planting</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <SimpleCalendar items={plantings.map(p => ({ id: p.id, date: p.sowingDate || p.expectedHarvest || '', title: p.cropId }))} onClickItem={(id) => { const p = plantings.find(x => x.id === id); if (p) handleEdit(p); }} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Planned Operations</h3>
            <Button size="sm" onClick={handleAddOperation}>Add</Button>
          </div>
          <Card>
            <CardContent>
              <ul className="space-y-2">
                {operations.map(o => (
                  <li key={o.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{o.type}</div>
                      <div className="text-xs text-muted-foreground">{o.plannedDate}</div>
                    </div>
                    <div>
                      <Button size="sm" onClick={() => handleEditOperation(o)}>Edit</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Sowing</TableHead>
                <TableHead>Harvest</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plantings.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.cropId}</TableCell>
                  <TableCell>{p.fieldId}</TableCell>
                  <TableCell>{p.sowingDate}</TableCell>
                  <TableCell>{p.expectedHarvest}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleEdit(p)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PlantingEditor open={isOpen} planting={editing} onSave={handleSave} onClose={() => setIsOpen(false)} />
      <OperationEditor open={opOpen} operation={opEditing} onSave={handleSaveOperation} onClose={() => setOpOpen(false)} />
    </div>
  );
}
