import { type RequestHandler, type Request } from 'express';
import { verifyJwt } from './jwt.js';
import { Errors } from '../error/services-error.js';

export const authenticateJwt = (): RequestHandler => (req: Request, _res, next) => {
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

