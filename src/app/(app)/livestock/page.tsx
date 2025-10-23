"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Beef, MoreHorizontal, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { livestockData, type Livestock } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LivestockPage() {
  const [livestock, setLivestock] = useState<Livestock[]>(livestockData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Livestock | null>(null);

  const handleDelete = (id: string) => {
    setLivestock(livestock.filter((animal) => animal.id !== id));
  };

  const handleEdit = (animal: Livestock) => {
    setEditingAnimal(animal);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAnimal(null);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAnimalData: Livestock = {
      id: formData.get("id") as string,
      type: formData.get("type") as Livestock["type"],
      tagId: formData.get("tagId") as string,
      lastFed: new Date(formData.get("lastFed") as string).toISOString(),
      healthStatus: formData.get("healthStatus") as Livestock["healthStatus"],
    };

    if (editingAnimal) {
      setLivestock(
        livestock.map((a) => (a.id === editingAnimal.id ? newAnimalData : a))
      );
    } else {
      newAnimalData.id = `L${String(livestock.length + 1).padStart(3, "0")}`;
      setLivestock([...livestock, newAnimalData]);
    }

    setEditingAnimal(null);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Beef className="h-5 w-5" />
              Livestock Tracking
            </CardTitle>
            <CardDescription>
              Maintain records of livestock, including feeding and health.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4" />
            Add New Animal
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Fed</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livestock.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.tagId}</TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        animal.healthStatus === "Healthy"
                          ? "default"
                          : animal.healthStatus === "Sick"
                          ? "destructive"
                          : "secondary"
                      }
                      className={animal.healthStatus === "Healthy" ? "bg-green-600 text-white" : ""}
                    >
                      {animal.healthStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(animal.lastFed).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(animal)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(animal.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingAnimal ? "Edit Animal Record" : "Add New Animal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <Input name="id" defaultValue={editingAnimal?.id} type="hidden" />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tagId" className="text-right">
                Tag ID
              </Label>
              <Input
                id="tagId"
                name="tagId"
                defaultValue={editingAnimal?.tagId}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select name="type" defaultValue={editingAnimal?.type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cattle">Cattle</SelectItem>
                  <SelectItem value="Chicken">Chicken</SelectItem>
                  <SelectItem value="Pig">Pig</SelectItem>
                  <SelectItem value="Sheep">Sheep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="healthStatus" className="text-right">
                Health
              </Label>
              <Select
                name="healthStatus"
                defaultValue={editingAnimal?.healthStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Observation">Observation</SelectItem>
                  <SelectItem value="Sick">Sick</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastFed" className="text-right">
                Last Fed
              </Label>
              <Input
                id="lastFed"
                name="lastFed"
                type="datetime-local"
                defaultValue={
                  editingAnimal?.lastFed
                    ? new Date(editingAnimal.lastFed)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
