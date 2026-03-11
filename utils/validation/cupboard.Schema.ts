import { z } from "zod";

export const cupboardSchema = z.object({
  name: z.string().min(1, "Cupboard name is required").max(255),
  location: z.string().optional(),
  description: z.string().optional(),
});
