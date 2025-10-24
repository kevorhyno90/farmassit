"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cropData, fieldData, taskData, type Crop } from "@/lib/data";
import { loadDataRemote, loadData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Sprout, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

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
      } catch (e) {}
    })();

    // local fallback
    try {
      const lc = loadData("farmassit.crops.v1", cropData);
      if (lc) setCrops(lc);
      const lf = loadData("farmassit.fields.v1", fieldData);
      if (lf) setFields(lf);
    } catch (e) {}
  }, []);

  // Calculate additional statistics
  const stats = useMemo(() => {
    const stageBreakdown = crops.reduce((acc, crop) => {
      acc[crop.stage] = (acc[crop.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalArea = fields.reduce((sum, field) => sum + field.areaHa, 0);
    const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    
    // Health indicator based on task completion rate
    const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    
    return {
      stageBreakdown,
      totalArea,
      activeTasks,
      completedTasks,
      taskCompletionRate,
    };
  }, [crops, fields, tasks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Overview</h2>
        </div>
        <div className="text-sm text-muted-foreground">Summary of crops, fields and tasks</div>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-600" />
              Total Crops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
            <div className="text-xs text-muted-foreground mt-1">varieties being cultivated</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Total Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArea.toFixed(1)} ha</div>
            <div className="text-xs text-muted-foreground mt-1">{fields.length} managed fields</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">pending work orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taskCompletionRate.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">{stats.completedTasks} of {tasks.length} completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Crop Stage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Growth Stages</CardTitle>
          <CardDescription>Distribution of crops by development stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.stageBreakdown).map(([stage, count]) => (
              <div key={stage} className="flex items-center gap-3">
                <Badge variant="outline" className="w-24 justify-center">
                  {stage}
                </Badge>
                <div className="flex-1">
                  <div className="h-8 bg-secondary rounded-md overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center px-3 text-white text-sm font-medium transition-all"
                      style={{
                        width: `${(count / crops.length) * 100}%`,
                      }}
                    >
                      {count > 0 && count}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {((count / crops.length) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Crops */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Crops</CardTitle>
          <CardDescription>Recently planted or updated crop entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {crops.slice(0, 5).map((crop) => (
              <div key={crop.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/50 transition-colors">
                <div>
                  <div className="font-medium">{crop.name} - {crop.variety}</div>
                  <div className="text-xs text-muted-foreground">Planted: {crop.plantingDate}</div>
                </div>
                <Badge>{crop.stage}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
