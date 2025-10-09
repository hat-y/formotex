import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES: z.string().default('24h')
});

export type Env = z.infer<typeof envSchema>;

