"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cropData, fieldData, taskData, treatmentData, type Crop, type Field, type FarmTask, type Treatment } from "@/lib/data";
import { loadDataRemote, loadData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, PieChart as PieChartIcon } from "lucide-react";

export default function ReportsPage() {
  const [crops, setCrops] = useState<Crop[]>(() => cropData);
  const [fields, setFields] = useState<Field[]>(() => fieldData);
  const [tasks, setTasks] = useState<FarmTask[]>(() => taskData);
  const [treatments, setTreatments] = useState<Treatment[]>(() => treatmentData);

  useEffect(() => {
    (async () => {
      try {
        const rc = await loadDataRemote("crops", cropData);
        if (rc) setCrops(rc);
        const rf = await loadDataRemote("fields", fieldData);
        if (rf) setFields(rf);
        const rt = await loadDataRemote("tasks", taskData);
        if (rt) setTasks(rt);
        const rtr = await loadDataRemote("treatments", treatmentData);
        if (rtr) setTreatments(rtr);
      } catch (e) {}
    })();

    // Local fallback
    try {
      const lc = loadData("farmassit.crops.v1", cropData);
      if (lc) setCrops(lc);
      const lf = loadData("farmassit.fields.v1", fieldData);
      if (lf) setFields(lf);
      const lt = loadData("farmassit.tasks.v1", taskData);
      if (lt) setTasks(lt);
      const ltr = loadData("farmassit.treatments.v1", treatmentData);
      if (ltr) setTreatments(ltr);
    } catch (e) {}
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const stageBreakdown = crops.reduce((acc, crop) => {
      acc[crop.stage] = (acc[crop.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalArea = fields.reduce((sum, field) => sum + field.areaHa, 0);
    
    const taskStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const treatmentTypes = treatments.reduce((acc, treatment) => {
      acc[treatment.type] = (acc[treatment.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Crop variety distribution
    const varietyCount = crops.reduce((acc, crop) => {
      const key = `${crop.name} - ${crop.variety}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Upcoming harvests (next 30 days)
    const now = new Date();
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingHarvests = crops.filter(crop => {
      const harvestDate = new Date(crop.expectedHarvest);
      return harvestDate >= now && harvestDate <= next30Days;
    });

    return {
      stageBreakdown,
      totalArea,
      taskStatus,
      treatmentTypes,
      varietyCount,
      upcomingHarvests,
    };
  }, [crops, fields, tasks, treatments]);

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalCrops: crops.length,
        totalFields: fields.length,
        totalArea: stats.totalArea,
        activeTasks: tasks.filter(t => t.status !== 'Completed').length,
        totalTreatments: treatments.length,
      },
      stageBreakdown: stats.stageBreakdown,
      varietyDistribution: stats.varietyCount,
      upcomingHarvests: stats.upcomingHarvests.length,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crop-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Reports & Analytics</h2>
        </div>
        <Button onClick={exportReport} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active crop varieties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArea.toFixed(1)} ha</div>
            <p className="text-xs text-muted-foreground mt-1">Under cultivation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status !== 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pending work orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Harvests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingHarvests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Stage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Crop Stage Distribution
          </CardTitle>
          <CardDescription>Current growth stages across all crops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.stageBreakdown).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium">{stage}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-secondary rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(count / crops.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold ml-3">{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variety Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Variety Distribution
          </CardTitle>
          <CardDescription>Breakdown of crop varieties being grown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Object.entries(stats.varietyCount).map(([variety, count]) => (
              <div key={variety} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{variety}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Treatment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Treatment Summary
          </CardTitle>
          <CardDescription>Application types and frequencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(stats.treatmentTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                <span className="text-sm font-medium">{type}</span>
                <span className="text-sm font-bold">{count} applications</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Harvests Detail */}
      {stats.upcomingHarvests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Harvests (Next 30 Days)</CardTitle>
            <CardDescription>Crops scheduled for harvest soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.upcomingHarvests.map((crop) => (
                <div key={crop.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <div className="font-medium">{crop.name} - {crop.variety}</div>
                    <div className="text-xs text-muted-foreground">ID: {crop.id}</div>
                  </div>
                  <div className="text-sm text-right">
                    <div className="font-semibold">{crop.expectedHarvest}</div>
                    <div className="text-xs text-muted-foreground">{crop.stage}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Overview</CardTitle>
          <CardDescription>Current work order status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(stats.taskStatus).map(([status, count]) => (
              <div key={status} className="p-4 border rounded-lg">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
