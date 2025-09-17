import z from "zod";

import { roleSchema } from "../roles";

export const userSchema = z.object({
  role: roleSchema,
});
// name: string
// email: string
// password: string
// createdAt: Date
// updatedAt: Date

export type User = z.infer<typeof userSchema>;
