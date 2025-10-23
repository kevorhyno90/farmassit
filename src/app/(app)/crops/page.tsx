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
import { MoreHorizontal, Pencil, PlusCircle, Sprout, Trash2 } from "lucide-react";
import { cropData, type Crop } from "@/lib/data";
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
  DialogTrigger,
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

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>(cropData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const handleDelete = (id: string) => {
    setCrops(crops.filter((crop) => crop.id !== id));
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingCrop(null);
    setIsDialogOpen(true);
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCropData: Crop = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      variety: formData.get("variety") as string,
      plantingDate: formData.get("plantingDate") as string,
      stage: formData.get("stage") as Crop["stage"],
      expectedHarvest: formData.get("expectedHarvest") as string,
    };

    if (editingCrop) {
      setCrops(
        crops.map((c) => (c.id === editingCrop.id ? newCropData : c))
      );
    } else {
        newCropData.id = `C${String(crops.length + 1).padStart(3, '0')}`;
        setCrops([...crops, newCropData]);
    }
    
    setEditingCrop(null);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Crop Management
                </CardTitle>
                <CardDescription>
                    Log and track crop planting, growth, and harvest cycles.
                </CardDescription>
            </div>
             <Button size="sm" className="gap-1" onClick={handleAddNew}>
                <PlusCircle className="h-4 w-4"/>
                Add New Crop
             </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Variety</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="hidden md:table-cell">
                  Planting Date
                </TableHead>
                <TableHead>Expected Harvest</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {crop.variety}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{crop.stage}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {crop.plantingDate}
                  </TableCell>
                  <TableCell>{crop.expectedHarvest}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(crop)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(crop.id)}
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
            {editingCrop ? "Edit Crop" : "Add New Crop"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <Input name="id" defaultValue={editingCrop?.id} type="hidden" />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingCrop?.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variety" className="text-right">
                Variety
              </Label>
              <Input
                id="variety"
                name="variety"
                defaultValue={editingCrop?.variety}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage" className="text-right">
                Stage
              </Label>
              <Select name="stage" defaultValue={editingCrop?.stage}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planted">Planted</SelectItem>
                  <SelectItem value="Germination">Germination</SelectItem>
                  <SelectItem value="Vegetative">Vegetative</SelectItem>
                  <SelectItem value="Flowering">Flowering</SelectItem>
                  <SelectItem value="Harvest">Harvest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plantingDate" className="text-right">
                Planted
              </Label>
              <Input
                id="plantingDate"
                name="plantingDate"
                type="date"
                defaultValue={editingCrop?.plantingDate}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expectedHarvest" className="text-right">
                Harvest
              </Label>
              <Input
                id="expectedHarvest"
                name="expectedHarvest"
                type="date"
                defaultValue={editingCrop?.expectedHarvest}
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
