"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationService = void 0;
// Modulos Externos
const crypto_1 = require("crypto");
// Modulos Internos
const data_sources_js_1 = __importDefault(require("../db/data-sources.js"));
const invitation_repository_js_1 = require("../db/repositories/typeorm/invitation.repository.js");
const user_repository_js_1 = require("../db/repositories/typeorm/user.repository.js");
const services_error_js_1 = require("../shared/error/services-error.js");
const hasher_js_1 = require("../shared/crypto/hasher.js");
const invitation_entity_js_1 = require("../db/entities/invitation.entity.js");
const user_helpers_js_1 = require("./user/helpers/user.helpers.js");
class InvitationService {
    constructor(hasher = new hasher_js_1.Argon2Hasher()) {
        this.hasher = hasher;
    }
    async createInvitation(dto, actor) {
        (0, user_helpers_js_1.assertAdmin)(actor);
        const invitationRepo = new invitation_repository_js_1.InvitationRepo(data_sources_js_1.default.manager);
        const userRepo = new user_repository_js_1.UserRepo(data_sources_js_1.default.manager);
        const email = dto.email.toLowerCase();
        // Verificar que el usuario no exista ya
        if (await userRepo.findByEmail(email)) {
            throw services_error_js_1.Errors.conflict('El usuario ya existe', 'USER_EXISTS', { email });
        }
        // Verificar que no haya una invitación pendiente
        const existingInvitation = await invitationRepo.findPendingByEmail(email);
        if (existingInvitation) {
            throw services_error_js_1.Errors.conflict('Ya existe una invitación pendiente para este email', 'INVITATION_EXISTS', { email });
        }
        // Crear token único
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        // Expiración en 7 días
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invitation = await invitationRepo.create({
            email,
            role: dto.role,
            token,
            status: invitation_entity_js_1.InvitationStatus.PENDING,
            invitedBy: actor.id,
            expiresAt,
        });
        // TODO: Aquí podrías enviar un email con el link de invitación
        // await this.emailService.sendInvitation(email, token);
        return invitation;
    }
    async acceptInvitation(dto) {
        const invitationRepo = new invitation_repository_js_1.InvitationRepo(data_sources_js_1.default.manager);
        const userRepo = new user_repository_js_1.UserRepo(data_sources_js_1.default.manager);
        const invitation = await invitationRepo.findByToken(dto.token);
        if (!invitation) {
            throw services_error_js_1.Errors.notFound('Invitación no encontrada', 'INVITATION_NOT_FOUND');
        }
        if (invitation.status !== invitation_entity_js_1.InvitationStatus.PENDING) {
            throw services_error_js_1.Errors.badRequest('La invitación ya fue utilizada o expiró', 'INVITATION_INVALID');
        }
        if (invitation.expiresAt < new Date()) {
            await invitationRepo.markAsExpired(dto.token);
            throw services_error_js_1.Errors.badRequest('La invitación ha expirado', 'INVITATION_EXPIRED');
        }
        // Verificar que el usuario no exista (por si acaso)
        if (await userRepo.findByEmail(invitation.email)) {
            throw services_error_js_1.Errors.conflict('El usuario ya existe', 'USER_EXISTS');
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
    async listInvitations(actor) {
        (0, user_helpers_js_1.assertAdmin)(actor);
        const invitationRepo = new invitation_repository_js_1.InvitationRepo(data_sources_js_1.default.manager);
        return invitationRepo.list();
    }
}
exports.InvitationService = InvitationService;
