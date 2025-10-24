"use server";

import { analyzeWeatherConditions } from "@/ai/flows/analyze-weather-conditions";
import { z } from "zod";

export const weatherAnalysisSchema = z.object({
  task: z.string().min(3, { message: "Task must be at least 3 characters long." }),
  currentWeather: z.string().min(10, { message: "Current weather description is too short." }),
  historicalWeather: z.string().min(10, { message: "Historical weather description is too short." }),
});

export type WeatherAnalysisState = {
  suitabilityAnalysis?: string;
  recommendations?: string;
  // zod fieldErrors are a map of field name to array of messages; allow either string or that shape
  error?: string | Record<string, string[] | undefined>;
};

export async function getWeatherAnalysis(
  prevState: WeatherAnalysisState,
  formData: FormData
): Promise<WeatherAnalysisState> {
  const validatedFields = weatherAnalysisSchema.safeParse({
    task: formData.get("task"),
    currentWeather: formData.get("currentWeather"),
    historicalWeather: formData.get("historicalWeather"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzeWeatherConditions(validatedFields.data);
    return result;
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to get weather analysis. Please try again.",
    };
  }
}
