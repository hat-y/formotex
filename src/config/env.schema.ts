import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

