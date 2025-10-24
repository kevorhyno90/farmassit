"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CloudSun,
  Sparkles,
  Lightbulb,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";
import { getWeatherAnalysis } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Analyze Conditions
        </>
      )}
    </Button>
  );
}

export default function WeatherPage() {
  const initialState: { suitabilityAnalysis?: string; recommendations?: string; error?: string } = {};
  const [state, dispatch] = useFormState(getWeatherAnalysis, initialState);
  const { pending } = useFormStatus();

  const farmTasks = [
    "Planting",
    "Harvesting",
    "Spraying Pesticides",
    "Irrigation",
    "Tilling",
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <form action={dispatch}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5" />
                Weather Insights Tool
              </CardTitle>
              <CardDescription>
                Use AI to determine if weather is suitable for a specific task.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task">Farm Task</Label>
                <Select name="task" required>
                  <SelectTrigger id="task">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmTasks.map((task) => (
                      <SelectItem key={task} value={task}>
                        {task}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentWeather">Current Weather</Label>
                <Textarea
                  id="currentWeather"
                  name="currentWeather"
                  placeholder="e.g., 25°C, 60% humidity, 15 km/h wind from SW, clear skies."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="historicalWeather">Historical Weather</Label>
                <Textarea
                  id="historicalWeather"
                  name="historicalWeather"
                  placeholder="e.g., Usually dry this time of year, but last year had a late frost."
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <SubmitButton />
               {state?.error && (
                <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4"/>
                    {typeof state.error === 'string' ? state.error : "Please check your inputs."}
                </p>
                )}
            </CardFooter>
          </Card>
        </form>
      </div>
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Suitability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : state?.suitabilityAnalysis ? (
              <p className="text-sm text-muted-foreground">{state.suitabilityAnalysis}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                AI analysis will appear here once you submit the conditions.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            ) : state?.recommendations ? (
              <p className="text-sm text-muted-foreground">{state.recommendations}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                AI recommendations will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
