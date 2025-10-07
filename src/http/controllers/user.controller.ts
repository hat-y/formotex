import { type RequestHandler, type Request } from 'express';
import { UserService } from '../../services/user/user.service.js';
import { CreateUserSchema, UpdateUserSchema } from '../dto/user.dto.js';
import { Role } from '../../db/entities/user.entity.js';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

const service = new UserService();
export const toPublicUser = (u: any) => {
  if (!u) return null;

  return {
    id: u.id,
    email: u.email,
    role: u.role,
    firstName: u.firstName,
    lastName: u.lastName,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  };
};

export const listUsers: RequestHandler = async (_req, res, next) => {
  try {
    res.json((await service.list()).map(toPublicUser));

  } catch (e) {
    next(e);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try { res.json(toPublicUser(await service.getById(req.params.id))); }
  catch (e) { next(e); }
};

export const createUser: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  try {
    const dto = CreateUserSchema.parse(req.body);
    const created = await service.create(dto, req.user!);
    res.status(201).json(toPublicUser(created));
  } catch (e) { next(e); }
};

export const updateUser: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  try {
    const dto = UpdateUserSchema.parse(req.body);
    const updated = await service.update(req.params.id, dto, req.user!);
    res.json(toPublicUser(updated));
  } catch (e) { next(e); }
};

export const deleteUser: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  try { await service.remove(req.params.id, req.user!); res.status(204).send(); }
  catch (e) { next(e); }
};

