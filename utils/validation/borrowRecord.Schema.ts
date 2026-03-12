import z from "zod";

export const createBorrowRecordSchema = z.object({
  item_id: z.number({ message: "Selact an item" }).min(1, "Selact an item"),
  borrower_name: z.string().min(1, "Borrower name is required").max(255),
  contact: z
    .string()
    .min(1, "Contact is required")
    .regex(
      /^(?:\+94|0)(?:7\d{8}|[1-9]\d{8})$/,
      "Enter a valid Sri Lankan phone number",
    ),
  borrow_date: z.string().min(1, "Borrow date is required"),
  expected_return_date: z.string().min(1, "Expected return date is required"),
  quantity_borrowed: z
    .number({ message: "Quantity is required" })
    .min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});
