import AppDataSource from '../db/data-sources.js';
import { UserRepo } from '../db/repositories/typeorm/user.repository.js';
import { InvitationRepo } from '../db/repositories/typeorm/invitation.repository.js';
import { Errors } from '../shared/error/services-error.js';
import { signJwt } from '../shared/auth/jwt.js';
import { Argon2Hasher, type Hasher } from '../shared/crypto/hasher.js';
import type { LoginInput, RegisterInput } from '../http/dto/auth.dto.js';
import type { AcceptInvitationInput } from '../http/dto/invitation.dto.js';
import { Role } from '../db/entities/user.entity.js';
import { InvitationStatus } from '../db/entities/invitation.entity.js';


export class AuthService {
  constructor(private readonly hasher: Hasher = new Argon2Hasher()) { }

  async login(dto: LoginInput) {
    const repo = new UserRepo(AppDataSource.manager);
    const email = dto.email.toLowerCase();

    const user = await repo.findByEmail(email);
    if (!user) throw Errors.unauthorized('Credenciales inválidas', 'BAD_CREDENTIALS');

    const ok = await this.hasher.verify(user.passwordHash, dto.password);
    if (!ok) throw Errors.unauthorized('Credenciales inválidas', 'BAD_CREDENTIALS');

    const accessToken = signJwt({
      id: user.id,
      role: user.role,
      email: user.email
    });

    return { accessToken, user };
  }

  async register(dto: RegisterInput) {
    const repo = new UserRepo(AppDataSource.manager);
    const email = dto.email.toLowerCase();
    if (await repo.findByEmail(email)) {
      throw Errors.conflict('El email ya existe', 'EMAIL_TAKEN', { email });
    }

    const passwordHash = await this.hasher.hash(dto.password);
    return repo.create({
      email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.USER,
    });
  }

  async registerWithInvitation(dto: AcceptInvitationInput) {
    const invitationRepo = new InvitationRepo(AppDataSource.manager);
    const userRepo = new UserRepo(AppDataSource.manager);

    const invitation = await invitationRepo.findByToken(dto.token);

    if (!invitation) {
      throw Errors.notFound('Invitación no encontrada', 'INVITATION_NOT_FOUND');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw Errors.badRequest('La invitación ya fue utilizada o expiró', 'INVITATION_INVALID');
    }

    if (invitation.expiresAt < new Date()) {
      await invitationRepo.markAsExpired(dto.token);
      throw Errors.badRequest('La invitación ha expirado', 'INVITATION_EXPIRED');
    }

    if (await userRepo.findByEmail(invitation.email)) {
      throw Errors.conflict('El usuario ya existe', 'USER_EXISTS');
    }

    const passwordHash = await this.hasher.hash(dto.password);
    const user = await userRepo.create({
      email: invitation.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: invitation.role,
    });

    await invitationRepo.markAsAccepted(dto.token);

    return user;
  }
}

