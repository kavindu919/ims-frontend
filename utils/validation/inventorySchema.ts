import z from "zod";

export const inventorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().min(1, "Code is required"),
  quantity: z.number({ message: "Quantity is required" }).min(0),
  serial_number: z.string().optional(),
  description: z.string().optional(),
  storage_place_id: z
    .number({ message: "Selacet storage place" })
    .min(1, "Selacet storage place"),
  status: z.enum(["in_store", "borrowed", "damaged", "missing"]),
});

export const editinventorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().min(1, "Code is required"),
  serial_number: z.string().optional(),
  description: z.string().optional(),
  storage_place_id: z
    .number({ message: "Selacet storage place" })
    .min(1, "Selacet storage place"),
});

export const adjestInventorySchema = z.object({
  type: z.enum(["increment", "decrement"]),
  amount: z
    .number({ message: "Amount is required" })
    .min(1, "Amount must be at least 1"),
  reason: z.string().optional(),
});
