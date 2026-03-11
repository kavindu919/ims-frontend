import z from "zod";

export const storageSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  cupboard_id: z
    .number({ message: "Plase select cupboard" })
    .min(1, "Cupboard is required"),
  description: z.string().optional(),
});
