'use server';

/**
 * @fileOverview An AI agent for analyzing weather conditions for farm tasks.
 *
 * - analyzeWeatherConditions - A function that analyzes weather conditions.
 * - AnalyzeWeatherConditionsInput - The input type for the analyzeWeatherConditions function.
 * - AnalyzeWeatherConditionsOutput - The return type for the analyzeWeatherConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWeatherConditionsInputSchema = z.object({
  task: z.string().describe('The specific farm task to analyze weather conditions for (e.g., planting, harvesting, spraying pesticides).'),
  currentWeather: z.string().describe('The current weather conditions (e.g., temperature, humidity, wind speed, precipitation).'),
  historicalWeather: z.string().describe('Historical weather data for the same period in previous years.'),
});
export type AnalyzeWeatherConditionsInput = z.infer<typeof AnalyzeWeatherConditionsInputSchema>;

const AnalyzeWeatherConditionsOutputSchema = z.object({
  suitabilityAnalysis: z.string().describe('An analysis of the weather conditions and their suitability for the specified farm task.'),
  recommendations: z.string().describe('Recommendations based on the weather analysis (e.g., postpone task, proceed with caution).'),
});
export type AnalyzeWeatherConditionsOutput = z.infer<typeof AnalyzeWeatherConditionsOutputSchema>;

export async function analyzeWeatherConditions(input: AnalyzeWeatherConditionsInput): Promise<AnalyzeWeatherConditionsOutput> {
  return analyzeWeatherConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWeatherConditionsPrompt',
  input: {schema: AnalyzeWeatherConditionsInputSchema},
  output: {schema: AnalyzeWeatherConditionsOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the provided weather conditions and determine their suitability for the specified farm task. Provide clear and actionable recommendations.

Task: {{{task}}}
Current Weather Conditions: {{{currentWeather}}}
Historical Weather Data: {{{historicalWeather}}}

Suitability Analysis:
Recommendations: `,
});

const analyzeWeatherConditionsFlow = ai.defineFlow(
  {
    name: 'analyzeWeatherConditionsFlow',
    inputSchema: AnalyzeWeatherConditionsInputSchema,
    outputSchema: AnalyzeWeatherConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
