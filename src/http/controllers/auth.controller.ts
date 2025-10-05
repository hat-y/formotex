import { Request, Response, NextFunction } from 'express';
import { LoginSchema, RegisterSchema } from '../dto/auth.dto.js';
import { AuthService } from '../../services/auth.services.js';
import { toPublicUser } from './user.controller.js';
import { Role } from '../../db/entities/user.entity.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

const auth = new AuthService();

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = LoginSchema.parse(req.body);

    const result = await auth.login(dto);

    res.json({
      accessToken: result.accessToken,
      user: toPublicUser(result.user)
    });

  } catch (e) {
    console.error('Login error:', e);
    next(e);
  }
}

export async function register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const dto = RegisterSchema.parse(req.body);
    const user = await auth.register(dto);
    res.status(201).json(toPublicUser(user));

  } catch (e) {
    next(e);
  }
}

