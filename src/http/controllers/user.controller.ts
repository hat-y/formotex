import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user/user.service.js';
import { CreateUserSchema, UpdateUserSchema } from '../dto/user.dto.js';
import { Role } from '../../db/entities/user.entity.js';

const service = new UserService();

// DELETE
const ACTOR_ADMIN = { id: 'dev-actor', role: Role.ADMIN };

const toPublicUser = (user: any) => {
  const { passwordHash, ...safe } = user;
  return safe;
};

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await service.list();
    res.json(users.map(toPublicUser));
  } catch (e) {
    next(e);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await service.getById(req.params.id);
    res.json(toPublicUser(user));
  } catch (e) { next(e); }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = CreateUserSchema.parse(req.body);
    const created = await service.create(dto, ACTOR_ADMIN);
    res.status(201).json(toPublicUser(created));
  } catch (e) { next(e); }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = UpdateUserSchema.parse(req.body);
    const updated = await service.update(req.params.id, dto, ACTOR_ADMIN);
    res.json(toPublicUser(updated));
  } catch (e) { next(e); }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await service.remove(req.params.id, ACTOR_ADMIN);
    res.status(204).send();
  } catch (e) { next(e); }
}

