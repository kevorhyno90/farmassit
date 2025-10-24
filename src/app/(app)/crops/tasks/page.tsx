"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { taskData as sampleTasks, type FarmTask } from "@/lib/data";
import { loadDataRemote, loadData, saveData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";

export default function TasksPage() {
  const [tasks, setTasks] = useState<FarmTask[]>(() => sampleTasks);

  useEffect(() => {
    (async () => {
      try {
        const rt = await loadDataRemote<FarmTask[]>("tasks", sampleTasks);
        if (rt) setTasks(rt);
  } catch {}
    })();

    try {
      const lt = loadData<FarmTask[]>("farmassit.tasks.v1", sampleTasks);
      if (lt) setTasks(lt);
  } catch {}
  }, []);

  useEffect(() => { saveData('farmassit.tasks.v1', tasks, 'tasks'); }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Tasks</h2>
        </div>
        <div className="text-sm text-muted-foreground">Work orders and assignments</div>
      </div>
      <div className="grid gap-4">
        {tasks.map(t => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="text-sm">{t.task}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Due: {t.dueDate} • {t.assignee}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
