import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
