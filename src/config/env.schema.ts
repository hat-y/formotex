import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_URL: z.string(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  JWT_SECRET: z.string().min(16), // secreto tipo string
  JWT_EXPIRES: z.string().default('24h') // valores como '1h', '24h', '7d'
});

export type Env = z.infer<typeof envSchema>;

