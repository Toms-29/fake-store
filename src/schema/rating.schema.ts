import { z } from "zod"

export const RateSchema = z.object({ rating: z.number().min(1).max(5) })