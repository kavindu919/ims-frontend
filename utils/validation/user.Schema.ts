import z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
  role: z.enum(["admin", "staff"]),
});

export const edituserSchema = z.object({
  id: z.coerce.number({ message: "User id requirred" }),

  name: z.string().min(1, "Name is required").max(255),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z
    .string()
    .max(100)
    .nullable()
    .transform((val) => (val === "" ? null : val))
    .refine(
      (val) =>
        val === null ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(val),
      {
        message:
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters",
      },
    ),
  role: z.enum(["admin", "staff"]),

  is_active: z.enum(["true", "false"]).transform((val) => val === "true"),
});
