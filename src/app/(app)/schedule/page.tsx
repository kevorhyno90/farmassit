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
import {
  MoreHorizontal,
  Pencil,
  PlusCircle,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { taskData, type FarmTask } from "@/lib/data";
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
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const [tasks, setTasks] = useState<FarmTask[]>(taskData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FarmTask | null>(null);

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task: FarmTask) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTaskData: FarmTask = {
      id: formData.get("id") as string,
      task: formData.get("task") as string,
      dueDate: formData.get("dueDate") as string,
      status: formData.get("status") as FarmTask["status"],
      assignee: formData.get("assignee") as string,
    };

    if (editingTask) {
      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? newTaskData : t))
      );
    } else {
      newTaskData.id = `T${String(tasks.length + 1).padStart(3, "0")}`;
      setTasks([...tasks, newTaskData]);
    }

    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const statusVariant = (status: FarmTask['status']) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'In Progress': return 'secondary';
        case 'Pending': return 'outline';
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Task Scheduling
            </CardTitle>
            <CardDescription>
              Create and manage a schedule of tasks for the farm.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4" />
            Add New Task
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className={cn(task.status === 'Completed' && 'text-muted-foreground')}>
                  <TableCell className="font-medium">{task.task}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)} className={cn(task.status === 'Completed' && 'bg-green-600/20 border-green-600/50 text-green-800')}>{task.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.dueDate}
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(task.id)}
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
            {editingTask ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <Input name="id" defaultValue={editingTask?.id} type="hidden" />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task" className="text-right">
                Task
              </Label>
              <Input
                id="task"
                name="task"
                defaultValue={editingTask?.task}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue={editingTask?.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={editingTask?.dueDate}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <Input
                id="assignee"
                name="assignee"
                defaultValue={editingTask?.assignee}
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
