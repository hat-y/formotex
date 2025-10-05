import { type RequestHandler, type Request } from 'express';
import { verifyJwt } from './jwt.js';
import { Errors } from '../error/services-error.js';
import { Role } from '../../db/entities/user.entity.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

export const authenticateJwt = (): RequestHandler => (req: AuthenticatedRequest, _res, next) => {
  const h = req.headers.authorization;
  
  if (!h?.startsWith('Bearer ')) {
    return next(Errors.unauthorized());
  }

  try {
    const token = h.slice(7);
    const p = verifyJwt(token);
    
    req.user = {
      id: p.sub,
      role: p.role,
      email: p.email
    };

    next();
  } catch (error) {
    next(Errors.unauthorized());
  }
};

