import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  CalendarCheck,
  Sprout,
  Warehouse,
  Beef,
} from "lucide-react";
import { cropData, livestockData, inventoryData, taskData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const lowStockItems = inventoryData.filter(
    (item) => item.quantity < item.lowStockThreshold
  );
  const upcomingTasks = taskData
    .filter((task) => task.status !== "Completed")
    .slice(0, 3);

  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cropData.length}</div>
            <p className="text-xs text-muted-foreground">
              varieties being cultivated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Livestock Count
            </CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livestockData.length}</div>
            <p className="text-xs text-muted-foreground">
              animals on record
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Status
            </CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryData.length}</div>
            <p className="text-xs text-muted-foreground">
              total items tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Tasks
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskData.filter((t) => t.status !== "Completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              tasks currently pending
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              A quick look at your next important jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <ul className="space-y-4">
                {upcomingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {task.dueDate} &bull; Assignee: {task.assignee}
                      </p>
                    </div>
                    <Badge variant={task.status === 'In Progress' ? 'default' : 'secondary'}>{task.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming tasks. Time to relax!
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              Items in your inventory that are running low.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <ul className="space-y-4">
                {lowStockItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Type: {item.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-destructive">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (Threshold: {item.lowStockThreshold})
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Inventory levels look good.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
