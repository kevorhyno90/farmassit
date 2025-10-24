"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cropData } from "@/lib/data";
import BackButton from "@/components/ui/back-button";

export default function VarietiesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Varieties</h2>
        </div>
        <div className="text-sm text-muted-foreground">Crop variety catalog</div>
      </div>
      <div className="grid gap-4">
        {cropData.map(c => (
          <Card key={c.id}>
            <CardContent>
              <div className="font-medium">{c.name} — {c.variety}</div>
              <div className="text-xs text-muted-foreground">Stage: {c.stage}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
