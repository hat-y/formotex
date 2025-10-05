// Modulos Externos
import express, { Request, Response, type Express } from 'express';

// Modulos Internos
import { errorHandler } from './http/middlewares/error.js';
import { logger } from './shared/logging/logger.js';
import { httpLogger } from './shared/logging/http-logger.js';
import usersRoutes from './http/routes/user.route.ts'

export function Server(): Express {
  const app = express();
  const log = logger.child({ mod: 'server' });

  app.use(httpLogger);
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response): void => {
    res.json({ ok: true });
  });

  // === Routes === 
  app.use('/api', usersRoutes);

  app.use((_req: Request, res: Response) =>
    res.status(404).json({ error: 'Not found' }));

  app.use(errorHandler);

  log.debug('server ola');
  return app;
}

