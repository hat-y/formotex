// Modulos Externos
import express, { Request, Response, type Express } from 'express';

// Modulos Internos
import { errorHandler } from './http/middlewares/error.js';
import { logger } from './shared/logging/logger.js';
import { httpLogger } from './shared/logging/http-logger.js';
import usersRoutes from './http/routes/user.route.js';
import authRoutes from './http/routes/auth.route.js';
import deviceRoutes from './http/routes/device.route.js';
import deviceModelRoutes from './http/routes/device-model.route.js';
import statusLabelRoutes from './http/routes/status-label.route.js';
import deviceAssignmentRoutes from './http/routes/device-assignment.route.js';

export function Server(): Express {
  const app = express();
  const log = logger.child({ mod: 'server' });

  app.use(httpLogger);
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response): void => {
    res.json({ ok: true });
  });

  app.use('/', authRoutes);
  app.use('/api', usersRoutes);
  app.use('/api', deviceRoutes);
  app.use('/api', deviceModelRoutes);
  app.use('/api/status-labels', statusLabelRoutes);
  app.use('/api/assignments', deviceAssignmentRoutes);

  app.use((_req: Request, res: Response) =>
    res.status(404).json({ error: 'Not found' }));

  app.use(errorHandler);

  log.debug('server ola');
  return app;
}

