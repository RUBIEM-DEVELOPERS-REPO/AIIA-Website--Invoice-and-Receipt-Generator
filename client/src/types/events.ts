import { z } from "zod";

export const eventSchema = z.object({
  title: z.string(),
  venue: z.string(),
  duration: z.string(),
  endDate: z.string(),  // Changed from z.date() to z.string() to match API response
  image: z.string(),
  content: z.string(),
  registrationLink: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;