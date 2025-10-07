import { Role } from '../db/entities/user.entity.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role; email: string };
    }
  }
}

