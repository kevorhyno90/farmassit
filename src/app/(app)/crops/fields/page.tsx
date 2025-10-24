"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fieldData as sampleFields, type Field } from "@/lib/data";
import { loadDataRemote, loadData, saveData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>(() => sampleFields);

  useEffect(() => {
    (async () => {
      try {
        const rf = await loadDataRemote<Field[]>("fields", sampleFields);
        if (rf) setFields(rf);
  } catch {}
    })();

    try {
      const lf = loadData<Field[]>("farmassit.fields.v1", sampleFields);
      if (lf) setFields(lf);
  } catch {}
  }, []);

  useEffect(() => { saveData('farmassit.fields.v1', fields, 'fields'); }, [fields]);

  const handleAdd = () => {
    const id = `F${String(fields.length + 1).padStart(3, '0')}`;
    setFields(s => [...s, { id, name: `Field ${id}`, areaHa: 1 }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Fields</h2>
        </div>
        <div>
          <Button onClick={handleAdd}>Add Field</Button>
        </div>
      </div>
      <div className="grid gap-4">
        {fields.map(f => (
          <Card key={f.id}>
            <CardContent>
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.areaHa} ha • {f.soilType ?? '—'}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
