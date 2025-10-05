"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyUserPatch = exports.ensureUniqueEmail = exports.normalizeEmail = exports.getUserOr404 = exports.assertAdmin = exports.userRepo = void 0;
const data_sources_1 = __importDefault(require("../../../db/data-sources"));
const user_entity_1 = require("../../../db/entities/user.entity");
const user_repository_1 = require("../../../db/repositories/typeorm/user.repository");
const services_error_1 = require("../../../shared/error/services-error");
/*
 *
 */
const userRepo = () => new user_repository_1.UserRepo(data_sources_1.default.manager);
exports.userRepo = userRepo;
/*
 *
 */
const assertAdmin = (actor) => {
    if (actor.role !== user_entity_1.Role.ADMIN) {
        throw services_error_1.Errors.forbidden('Solo Admins', 'ADMIN_ONLY');
    }
};
exports.assertAdmin = assertAdmin;
/*
 *
 */
const getUserOr404 = async (id) => {
    const user = await (0, exports.userRepo)().findById(id);
    if (!user) {
        throw services_error_1.Errors.notFound('Usuario no encontrado', 'USER_NOT_FOUND', { id });
    }
    return user;
};
exports.getUserOr404 = getUserOr404;
/*
 *
 */
const normalizeEmail = (raw) => raw.toLowerCase();
exports.normalizeEmail = normalizeEmail;
/*
 *
 */
const ensureUniqueEmail = async (raw, excludeId) => {
    const email = (0, exports.normalizeEmail)(raw);
    const exists = await (0, exports.userRepo)().findByEmail(email);
    if (exists && exists.id !== excludeId) {
        throw services_error_1.Errors.conflict('El email ya existe', 'EMAIL_TAKEN', { email });
    }
    return email;
};
exports.ensureUniqueEmail = ensureUniqueEmail;
/*
 *
 */
const applyUserPatch = (patch) => {
    const u = {};
    if (patch.firstName)
        u.firstName = patch.firstName;
    if (patch.lastName)
        u.lastName = patch.lastName;
    if (patch.email)
        u.email = patch.email;
    return u;
};
exports.applyUserPatch = applyUserPatch;
