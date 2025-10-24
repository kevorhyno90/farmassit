"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cropData, type Crop } from "@/lib/data";
import { loadDataRemote, loadData } from "@/lib/localStore";
import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sprout, Search, Calendar } from "lucide-react";

export default function VarietiesPage() {
  const [crops, setCrops] = useState<Crop[]>(() => cropData);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const rc = await loadDataRemote("crops", cropData);
        if (rc) setCrops(rc);
      } catch (e) {}
    })();

    try {
      const lc = loadData("farmassit.crops.v1", cropData);
      if (lc) setCrops(lc);
    } catch (e) {}
  }, []);

  // Group by crop name for variety catalog
  const varietyCatalog = useMemo(() => {
    const grouped = crops.reduce((acc, crop) => {
      if (!acc[crop.name]) {
        acc[crop.name] = [];
      }
      acc[crop.name].push(crop);
      return acc;
    }, {} as Record<string, Crop[]>);
    
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [crops]);

  // Filter based on search
  const filteredCatalog = useMemo(() => {
    if (!searchQuery) return varietyCatalog;
    
    return varietyCatalog.filter(([cropName, varieties]) => {
      const nameMatch = cropName.toLowerCase().includes(searchQuery.toLowerCase());
      const varietyMatch = varieties.some(v => 
        v.variety.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return nameMatch || varietyMatch;
    });
  }, [varietyCatalog, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const uniqueCrops = new Set(crops.map(c => c.name));
    const uniqueVarieties = new Set(crops.map(c => `${c.name}-${c.variety}`));
    
    return {
      totalCropTypes: uniqueCrops.size,
      totalVarieties: uniqueVarieties.size,
      totalPlantings: crops.length,
    };
  }, [crops]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h2 className="text-lg font-semibold">Crop Varieties Catalog</h2>
        </div>
        <div className="text-sm text-muted-foreground">Complete variety inventory</div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crop Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCropTypes}</div>
            <p className="text-xs text-muted-foreground mt-1">Different crop species</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Varieties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVarieties}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique variety combinations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Plantings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlantings}</div>
            <p className="text-xs text-muted-foreground mt-1">Current crop instances</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by crop name or variety..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Variety Catalog */}
      <div className="grid gap-4">
        {filteredCatalog.map(([cropName, varieties]) => (
          <Card key={cropName}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <CardTitle className="text-xl">{cropName}</CardTitle>
                <Badge variant="secondary">{varieties.length} {varieties.length === 1 ? 'variety' : 'varieties'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {varieties.map((crop) => (
                  <div key={crop.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-base">{crop.variety}</div>
                        <div className="text-xs text-muted-foreground">ID: {crop.id}</div>
                      </div>
                      <Badge>{crop.stage}</Badge>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Planted: {crop.plantingDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Harvest: {crop.expectedHarvest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCatalog.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No varieties found matching &quot;{searchQuery}&quot;
          </CardContent>
        </Card>
      )}
    </div>
  );
}
