import { DataSource } from "typeorm";
import { Config } from "../config";

let ds: DataSource | null = null;

export function getDS(): DataSource {
  if (ds) return ds;
  ds = new DataSource({
    type: "postgres",
    url: Config.get().DB_URL,
    entities: [],
    logging: false,
    synchronize: true,
  });

  return ds;
}

export async function initDb() {
  const d = getDS();
  console.log(d.isInitialized)
  if (!d.isInitialized) await d.initialize();
}

