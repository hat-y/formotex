import { ErrorRequestHandler } from 'express';
import { Errors, isServiceError, ServiceError } from '../../shared/error/services-error';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const e: ServiceError = isServiceError(err) ? err : Errors.internal();
  const expose = e.status < 500;
  const log = (req as any).log ?? console;
  const meta = { code: e.code, meta: e.meta, cause: e.cause };

  if (e.status >= 500) log.error(meta, e.message);
  else log.warn(meta, e.message);

  res.status(e.status).json(expose ? { error: e.message, code: e.code } : { error: 'Internal error' });
};

