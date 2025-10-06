import { z } from 'zod';
import { CreateUserSchema } from './user.dto.js';

// Login
export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = CreateUserSchema;

export type RegisterInput = z.infer<typeof RegisterSchema>;

