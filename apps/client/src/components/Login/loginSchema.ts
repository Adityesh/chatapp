import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;