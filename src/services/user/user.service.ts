// Modulos Internos
import type { CreateUserInput, UpdateUserInput } from '../../http/dto/user.dto.js';
import { logger } from '../../shared/logging/logger.js';
import { Argon2Hasher, type Hasher } from '../../shared/crypto/hasher.js';
import { Role, User } from '../../db/entities/user.entity.js';
import {
  Actor,
  applyUserPatch,
  assertAdmin,
  ensureUniqueEmail,
  getUserOr404,
  userRepo
} from './helpers/user.helpers.js';

const log = logger.child({ mod: 'UserService' });

export class UserService {
  constructor(
    private readonly hasher: Hasher = new Argon2Hasher()
  ) { }

  /*
   *
   */
  async create(dto: CreateUserInput, actor: Actor): Promise<User> {
    assertAdmin(actor);
    const email = await ensureUniqueEmail(dto.email);
    const passwordHash = await this.hasher.hash(dto.password);

    const user = await userRepo().save({
      email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.USER,
    });

    log.info({ userId: user.id, actorId: actor.id }, 'user.created');
    return user;
  }

  /*
   *
   */
  list(): Promise<User[]> { return userRepo().find(); }

  getById(id: string): Promise<User> { return getUserOr404(id); }

  /*
   *
   */
  async update(id: string, patch: UpdateUserInput, actor: Actor): Promise<User> {
    assertAdmin(actor);
    await getUserOr404(id);

    const updates = applyUserPatch(patch);
    if (updates.email) {
      updates.email = await ensureUniqueEmail(updates.email, id);
    }

    // Only update the fields we care about to avoid TypeORM relation issues
    const updateData: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>> = {};
    if (updates.firstName) updateData.firstName = updates.firstName;
    if (updates.lastName) updateData.lastName = updates.lastName;
    if (updates.email) updateData.email = updates.email;

    await userRepo().update(id, updateData);
    const saved = await userRepo().findOneOrFail({ where: { id } });
    log.info({ userId: saved.id, actorId: actor.id }, 'user.updated');
    return saved;
  }

  /*
   *
   */
  async remove(id: string, actor: Actor): Promise<void> {
    assertAdmin(actor);
    await getUserOr404(id);
    await userRepo().softDelete({ id });
    log.warn({ userId: id, actorId: actor.id }, 'user.deleted');
  }
}

