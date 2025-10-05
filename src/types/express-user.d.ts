import { Role } from '../db/entities/user.entity.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; role: Role; email: string };
  }
}

