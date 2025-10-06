import AppDataSource from "../../../db/data-sources";
import { Role, User } from "../../../db/entities/user.entity";
import { UpdateUserInput } from "../../../http/dto/user.dto";
import { Errors } from "../../../shared/error/services-error";

export type Actor = { id: string; role: Role };

/*
 *
 */
export const userRepo = () => AppDataSource.getRepository(User);

/*
 *
 */
export const assertAdmin = (actor: Actor) => {
  if (actor.role !== Role.ADMIN) {
    throw Errors.forbidden('Solo Admins', 'ADMIN_ONLY');
  }
};

/*
 *
 */
export const getUserOr404 = async (id: string) => {
  const user = await userRepo().findOne({ where: { id } });
  if (!user) {
    throw Errors.notFound('Usuario no encontrado', 'USER_NOT_FOUND', { id });
  }

  return user;
};

/*
 *
 */
export const normalizeEmail = (raw: string) => raw.toLowerCase();

/*
 *
 */
export const ensureUniqueEmail = async (raw: string, excludeId?: string) => {
  const email = normalizeEmail(raw);
  const exists = await userRepo().findOne({ where: { email } });

  if (exists && exists.id !== excludeId) {
    throw Errors.conflict('El email ya existe', 'EMAIL_TAKEN', { email });
  }

  return email;
};

/*
 *
 */
export const applyUserPatch = (patch: UpdateUserInput): Partial<User> => {
  const u: Partial<User> = {};
  if (patch.firstName) u.firstName = patch.firstName;
  if (patch.lastName) u.lastName = patch.lastName;
  if (patch.email) u.email = patch.email;
  return u;
};

