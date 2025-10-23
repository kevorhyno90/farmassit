"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cropData, livestockData } from "@/lib/data";

const reports = [
  { value: "crop-yield", label: "Crop Yield Report" },
  { value: "livestock-health", label: "Livestock Health Summary" },
  { value: "inventory-status", label: "Inventory Status Report" },
];

const CropReport = () => {
    const data = cropData.map(c => ({ name: c.name, yield: Math.floor(Math.random() * (150 - 50 + 1)) + 50 }));
    return (
        <Card>
            <CardHeader>
                <CardTitle>Crop Yield Report</CardTitle>
                <CardDescription>Estimated yield per crop in bushels/acre.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="yield" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={() => window.print()}><Download className="mr-2 h-4 w-4"/> Download Report</Button>
            </CardFooter>
        </Card>
    )
}

const LivestockReport = () => {
    const healthStatusCounts = livestockData.reduce((acc, animal) => {
        acc[animal.healthStatus] = (acc[animal.healthStatus] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(healthStatusCounts).map(([name, value]) => ({ name, value }));
    return (
         <Card>
            <CardHeader>
                <CardTitle>Livestock Health Summary</CardTitle>
                <CardDescription>Breakdown of livestock health status.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill="hsl(var(--primary))" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={() => window.print()}><Download className="mr-2 h-4 w-4"/> Download Report</Button>
            </CardFooter>
        </Card>
    )
}

const InventoryReport = () => (
    <Card>
        <CardHeader>
            <CardTitle>Inventory Status Report</CardTitle>
            <CardDescription>This report is currently under development.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Check back soon for inventory analytics.</p>
        </CardContent>
         <CardFooter className="justify-end">
            <Button disabled><Download className="mr-2 h-4 w-4"/> Download Report</Button>
        </CardFooter>
    </Card>
)

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(reports[0].value);

  const renderReport = () => {
    switch (selectedReport) {
      case "crop-yield":
        return <CropReport />;
      case "livestock-health":
        return <LivestockReport />;
      case "inventory-status":
        return <InventoryReport />;
      default:
        return (
          <p className="text-muted-foreground">
            Please select a report to view.
          </p>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reporting
          </CardTitle>
          <CardDescription>
            View and download reports from various farm activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Select a report" />
              </SelectTrigger>
              <SelectContent>
                {reports.map((report) => (
                  <SelectItem key={report.value} value={report.value}>
                    {report.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div>{renderReport()}</div>
    </div>
  );
}
