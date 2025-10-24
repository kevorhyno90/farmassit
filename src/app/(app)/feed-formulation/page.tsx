"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Trash2, PlusCircle, PieChart, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type Ingredient = {
  name: string;
  protein: number;
  fat: number;
  fiber: number;
};

const availableIngredients: Ingredient[] = [
  { name: "Corn", protein: 8, fat: 4, fiber: 2 },
  { name: "Soybean Meal", protein: 48, fat: 1, fiber: 3 },
  { name: "Hay", protein: 12, fat: 2, fiber: 32 },
  { name: "Barley", protein: 11, fat: 2, fiber: 5 },
  { name: "Oats", protein: 13, fat: 5, fiber: 11 },
  { name: "Molasses", protein: 4, fat: 0, fiber: 0 },
];

type FormulationRow = {
  id: number;
  ingredient: string;
  percentage: number;
};

export default function FeedFormulationPage() {
  const [rows, setRows] = useState<FormulationRow[]>([
    { id: 1, ingredient: "Corn", percentage: 50 },
    { id: 2, ingredient: "Soybean Meal", percentage: 20 },
    { id: 3, ingredient: "Hay", percentage: 30 },
  ]);

  const [totalPercentage, setTotalPercentage] = useState(100);

  useEffect(() => {
    const total = rows.reduce((sum, row) => sum + Number(row.percentage || 0), 0);
    setTotalPercentage(total);
  }, [rows]);

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, ingredient: "", percentage: 0 }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (
    id: number,
    field: "ingredient" | "percentage",
    value: string | number
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const nutritionalProfile = useMemo(() => {
    let protein = 0,
      fat = 0,
      fiber = 0;
    rows.forEach((row) => {
      const ing = availableIngredients.find((i) => i.name === row.ingredient);
      if (ing && row.percentage > 0) {
        const proportion = row.percentage / 100;
        protein += ing.protein * proportion;
        fat += ing.fat * proportion;
        fiber += ing.fiber * proportion;
      }
    });
    return { protein, fat, fiber };
  }, [rows]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Feed Formulation System
          </CardTitle>
          <CardDescription>
            Optimize livestock feed by mixing ingredients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="flex gap-2 items-end">
                <div className="grid gap-2 flex-grow">
                  <Label htmlFor={`ingredient-${row.id}`}>Ingredient</Label>
                  <select
                    id={`ingredient-${row.id}`}
                    value={row.ingredient}
                    onChange={(e) =>
                      handleInputChange(row.id, "ingredient", e.target.value)
                    }
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select Ingredient</option>
                    {availableIngredients.map((ing) => (
                      <option key={ing.name} value={ing.name}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2 w-28">
                  <Label htmlFor={`percentage-${row.id}`}>Percentage (%)</Label>
                  <Input
                    id={`percentage-${row.id}`}
                    type="number"
                    value={row.percentage}
                    onChange={(e) =>
                      handleInputChange(
                        row.id,
                        "percentage",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
             <Button variant="outline" size="sm" onClick={addRow}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Ingredient
            </Button>

            {totalPercentage !== 100 && (
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        Total percentage is {totalPercentage}%. It should be exactly 100%.
                    </AlertDescription>
                </Alert>
            )}

          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Nutritional Profile
          </CardTitle>
          <CardDescription>
            Calculated composition of your feed mix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutrient</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Crude Protein</TableCell>
                <TableCell className="text-right">
                  {nutritionalProfile.protein.toFixed(2)} %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Crude Fat</TableCell>
                <TableCell className="text-right">
                  {nutritionalProfile.fat.toFixed(2)} %
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Crude Fiber</TableCell>
                <TableCell className="text-right">
                  {nutritionalProfile.fiber.toFixed(2)} %
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
