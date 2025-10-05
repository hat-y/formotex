// Modulos Externos
import { randomBytes } from 'crypto';

// Modulos Internos
import AppDataSource from '../db/data-sources.js';
import { InvitationRepo } from '../db/repositories/typeorm/invitation.repository.js';
import { UserRepo } from '../db/repositories/typeorm/user.repository.js';
import { Errors } from '../shared/error/services-error.js';
import { Argon2Hasher, type Hasher } from '../shared/crypto/hasher.js';
import type { CreateInvitationInput, AcceptInvitationInput } from '../http/dto/invitation.dto.js';
import { Invitation, InvitationStatus } from '../db/entities/invitation.entity.js';
import { Actor, assertAdmin } from './user/helpers/user.helpers.js';

export class InvitationService {
  constructor(private readonly hasher: Hasher = new Argon2Hasher()) { }

  async createInvitation(dto: CreateInvitationInput, actor: Actor) {
    assertAdmin(actor);

    const invitationRepo = new InvitationRepo(AppDataSource.manager);
    const userRepo = new UserRepo(AppDataSource.manager);
    
    const email = dto.email.toLowerCase();

    // Verificar que el usuario no exista ya
    if (await userRepo.findByEmail(email)) {
      throw Errors.conflict('El usuario ya existe', 'USER_EXISTS', { email });
    }

    // Verificar que no haya una invitación pendiente
    const existingInvitation = await invitationRepo.findPendingByEmail(email);
    if (existingInvitation) {
      throw Errors.conflict('Ya existe una invitación pendiente para este email', 'INVITATION_EXISTS', { email });
    }

    // Crear token único
    const token = randomBytes(32).toString('hex');
    
    // Expiración en 7 días
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await invitationRepo.create({
      email,
      role: dto.role,
      token,
      status: InvitationStatus.PENDING,
      invitedBy: actor.id,
      expiresAt,
    });

    // TODO: Aquí podrías enviar un email con el link de invitación
    // await this.emailService.sendInvitation(email, token);

    return invitation;
  }

  async acceptInvitation(dto: AcceptInvitationInput) {
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

    // Verificar que el usuario no exista (por si acaso)
    if (await userRepo.findByEmail(invitation.email)) {
      throw Errors.conflict('El usuario ya existe', 'USER_EXISTS');
    }

    // Crear usuario
    const passwordHash = await this.hasher.hash(dto.password);
    const user = await userRepo.create({
      email: invitation.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: invitation.role, // Usar el rol de la invitación
    });

    // Marcar invitación como aceptada
    await invitationRepo.markAsAccepted(dto.token);

    return user;
  }

  async listInvitations(actor: Actor) {
    assertAdmin(actor);
    
    const invitationRepo = new InvitationRepo(AppDataSource.manager);
    return invitationRepo.list();
  }
}