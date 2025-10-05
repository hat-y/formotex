"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_sources_js_1 = __importDefault(require("../db/data-sources.js"));
const user_repository_js_1 = require("../db/repositories/typeorm/user.repository.js");
const invitation_repository_js_1 = require("../db/repositories/typeorm/invitation.repository.js");
const services_error_js_1 = require("../shared/error/services-error.js");
const jwt_js_1 = require("../shared/auth/jwt.js");
const hasher_js_1 = require("../shared/crypto/hasher.js");
const user_entity_js_1 = require("../db/entities/user.entity.js");
const invitation_entity_js_1 = require("../db/entities/invitation.entity.js");
class AuthService {
    constructor(hasher = new hasher_js_1.Argon2Hasher()) {
        this.hasher = hasher;
    }
    async login(dto) {
        const repo = new user_repository_js_1.UserRepo(data_sources_js_1.default.manager);
        const email = dto.email.toLowerCase();
        const user = await repo.findByEmail(email);
        if (!user)
            throw services_error_js_1.Errors.unauthorized('Credenciales inválidas', 'BAD_CREDENTIALS');
        const ok = await this.hasher.verify(user.passwordHash, dto.password);
        if (!ok)
            throw services_error_js_1.Errors.unauthorized('Credenciales inválidas', 'BAD_CREDENTIALS');
        const accessToken = (0, jwt_js_1.signJwt)({
            id: user.id,
            role: user.role,
            email: user.email
        });
        return { accessToken, user };
    }
    // Registro público (solo rol USER)
    async register(dto) {
        const repo = new user_repository_js_1.UserRepo(data_sources_js_1.default.manager);
        const email = dto.email.toLowerCase();
        if (await repo.findByEmail(email)) {
            throw services_error_js_1.Errors.conflict('El email ya existe', 'EMAIL_TAKEN', { email });
        }
        const passwordHash = await this.hasher.hash(dto.password);
        return repo.create({
            email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: user_entity_js_1.Role.USER, // Los nuevos usuarios son USER por defecto
        });
    }
    // Registro mediante invitación (cualquier rol)
    async registerWithInvitation(dto) {
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
        // Crear usuario con el rol de la invitación
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
}
exports.AuthService = AuthService;
