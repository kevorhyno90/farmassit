'use server';

/**
 * @fileOverview Summarizes weather reports to highlight key information relevant to farm activities.
 *
 * - getWeatherReportSummary - A function that summarizes weather reports.
 * - WeatherReportSummaryInput - The input type for the getWeatherReportSummary function.
 * - WeatherReportSummaryOutput - The return type for the getWeatherReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherReportSummaryInputSchema = z.object({
  weatherReport: z
    .string()
    .describe('The detailed weather report to be summarized.'),
  farmActivities: z
    .string()
    .describe(
      'The farm activities planned for the day, to help focus the summary.'
    ),
});
export type WeatherReportSummaryInput = z.infer<
  typeof WeatherReportSummaryInputSchema
>;

const WeatherReportSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the weather report, highlighting key information relevant to the farm activities.'
    ),
});
export type WeatherReportSummaryOutput = z.infer<
  typeof WeatherReportSummaryOutputSchema
>;

export async function getWeatherReportSummary(
  input: WeatherReportSummaryInput
): Promise<WeatherReportSummaryOutput> {
  return getWeatherReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherReportSummaryPrompt',
  input: {schema: WeatherReportSummaryInputSchema},
  output: {schema: WeatherReportSummaryOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing weather reports for farm management.

  Summarize the following weather report, focusing on key information relevant to the farm activities planned for the day.  Highlight temperature, precipitation, and wind speed, and any other weather phenomena which might impact the planned farm activities.

  Weather Report:
  {{weatherReport}}

  Farm Activities:
  {{farmActivities}}
  `,
});

const getWeatherReportSummaryFlow = ai.defineFlow(
  {
    name: 'getWeatherReportSummaryFlow',
    inputSchema: WeatherReportSummaryInputSchema,
    outputSchema: WeatherReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
