import express, { type Express, type Request, type Response } from "express";

export function Server(): Express {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  return app;
}

