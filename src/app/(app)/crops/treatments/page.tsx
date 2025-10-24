"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { treatmentData as sampleTreatments, type Treatment } from "@/lib/data";
import { loadDataRemote, loadData, saveData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>(() => sampleTreatments);

  useEffect(() => {
    (async () => {
      try {
        const rt = await loadDataRemote<Treatment[]>("treatments", sampleTreatments);
        if (rt) setTreatments(rt);
  } catch {}
    })();

    try {
      const lt = loadData<Treatment[]>("farmassit.treatments.v1", sampleTreatments);
      if (lt) setTreatments(lt);
  } catch {}
  }, []);

  useEffect(() => { saveData('farmassit.treatments.v1', treatments, 'treatments'); }, [treatments]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Treatments</h2>
        </div>
        <div className="text-sm text-muted-foreground">Records of applications and treatments</div>
      </div>
      <div className="grid gap-4">
        {treatments.map(t => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="text-sm">{t.type} — {t.product}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">{t.date} • {t.rate}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
