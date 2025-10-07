import { type RequestHandler, type Request } from 'express';
import { Errors } from '../../shared/error/services-error.js';
import type { Role } from '../../db/entities/user.entity.js';

export const authorizeRoles = (...roles: Role[]): RequestHandler => {
  const handler: RequestHandler = (req: Request, _res, next) => {
    if (!req.user) return next(Errors.unauthorized());
    if (!roles.includes(req.user.role)) return next(Errors.forbidden('Admin only', 'ADMIN_ONLY'));
    next();
  };
  return handler;
};

