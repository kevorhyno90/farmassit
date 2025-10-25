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
  error?: string;
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
    const flat = validatedFields.error.flatten().fieldErrors;
    const msg = Object.values(flat).flat().filter(Boolean).join("; ");
    // return a structured error state for the caller
    return {
      error: msg || "Invalid input",
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
