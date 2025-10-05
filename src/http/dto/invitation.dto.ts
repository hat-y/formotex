import { z } from 'zod';
import { Role } from '../../db/entities/user.entity.js';

export const CreateInvitationSchema = z.object({
  email: z.email(),
  role: z.enum(Role),
});
export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;

export const AcceptInvitationSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;
