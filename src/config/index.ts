// src/config/config.ts
import dotenv from 'dotenv';
import { envSchema, type Env } from './env.schema';

export class Config {
  private static instance: Config | null = null;

  readonly PORT: Env['PORT'];
  readonly DB_URL: Env['DB_URL'];
  readonly LOG_LEVEL: Env['LOG_LEVEL'];

  private constructor(env: Env) {
    this.PORT = env.PORT;
    this.DB_URL = env.DB_URL;
    this.LOG_LEVEL = env.LOG_LEVEL;
  }

  static get(): Config {
    if (this.instance) return this.instance;

    dotenv.config();
    const env = envSchema.parse(process.env);
    this.instance = new Config(env);
    return this.instance;
  }
}

