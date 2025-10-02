import express, { type Express, type Request, type Response } from "express";
import { Config } from "./config";

export function Server(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  return app;
}

export async function start() {
  const cfg = Config.get();
  const app = Server();

  app.listen(cfg.PORT, "0.0.0.0", () => {
    console.log(`HTTP: ${cfg.PORT}`);
  });
}

