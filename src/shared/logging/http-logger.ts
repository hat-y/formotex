// src/core/logging/http-logger.ts
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import { logger } from './logger';

export const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
  customLogLevel: (_req, res, err) =>
    err ? 'error' : res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
    err: (err) => ({ type: err.name, message: err.message, stack: err.stack }),
  },
  customProps: (req) => (req as any).user ? { userId: (req as any).user.sub, userRole: (req as any).user.role } : {},
});

