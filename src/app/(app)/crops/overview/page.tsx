"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cropData, fieldData, taskData } from "@/lib/data";
import { loadDataRemote, loadData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";

export default function OverviewPage() {
  const [crops, setCrops] = useState(() => cropData);
  const [fields, setFields] = useState(() => fieldData);
  const [tasks, setTasks] = useState(() => taskData);

  useEffect(() => {
    (async () => {
      try {
        const rc = await loadDataRemote("crops", cropData);
        if (rc) setCrops(rc);
        const rf = await loadDataRemote("fields", fieldData);
        if (rf) setFields(rf);
        const rt = await loadDataRemote("tasks", taskData);
        if (rt) setTasks(rt);
  } catch {}
    })();

    // local fallback
    try {
      const lc = loadData("farmassit.crops.v1", cropData);
      if (lc) setCrops(lc);
      const lf = loadData("farmassit.fields.v1", fieldData);
      if (lf) setFields(lf);
  } catch {}
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Overview</h2>
        </div>
        <div className="text-sm text-muted-foreground">Summary of crops, fields and tasks</div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
            <div className="text-sm text-muted-foreground">varieties being cultivated</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.length}</div>
            <div className="text-sm text-muted-foreground">managed fields</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status !== 'Completed').length}</div>
            <div className="text-sm text-muted-foreground">tasks pending</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
