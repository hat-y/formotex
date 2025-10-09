import dotenv from 'dotenv';
import { envSchema, type Env } from './env.schema';

export class Config {
  private static instance: Config | null = null;

  readonly PORT: Env['PORT'];
  readonly DB_HOST: Env['DB_HOST'];
  readonly DB_USER: Env['DB_USER'];
  readonly DB_PASSWORD: Env['DB_PASSWORD'];
  readonly DB_NAME: Env['DB_NAME'];
  readonly DB_PORT: Env['DB_PORT'];
  readonly LOG_LEVEL: Env['LOG_LEVEL'];
  readonly JWT_SECRET: Env['JWT_SECRET']
  readonly JWT_EXPIRES: Env['JWT_EXPIRES']

  private constructor(env: Env) {
    this.PORT = env.PORT;
    this.DB_HOST = env.DB_HOST;
    this.DB_USER = env.DB_USER;
    this.DB_PASSWORD = env.DB_PASSWORD;
    this.DB_NAME = env.DB_NAME;
    this.DB_PORT = env.DB_PORT;
    this.LOG_LEVEL = env.LOG_LEVEL;
    this.JWT_EXPIRES = env.JWT_EXPIRES;
    this.JWT_SECRET = env.JWT_SECRET;
  }

  static get(): Config {
    if (this.instance) return this.instance;

    dotenv.config();
    const env = envSchema.parse(process.env);
    this.instance = new Config(env);
    return this.instance;
  }
}

