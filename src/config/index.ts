import dotenv from "dotenv";
import { envSchema, type Env } from "./env.schema";

export class Config {
  private static instance: Config | null = null;

  readonly PORT: Env["PORT"];

  private constructor(env: Env) {
    this.PORT = env.PORT;
  }

  static get(): Config {
    if (this.instance) return this.instance;

    dotenv.config();
    const env = envSchema.parse(process.env);
    this.instance = new Config(env);
    return this.instance;
  }
}

